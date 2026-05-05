import { MongoClient, Db, Collection } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;
let client: MongoClient;
let db: Db;

let users: Collection;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  client = await MongoClient.connect(mongoServer.getUri());
  db = client.db('testdb');

  users = db.collection('users');
  await users.insertMany([
    { name: 'Alice', age: 30, status: 'Active' },
    { name: 'Bob', age: 25, status: 'Active', pets: [{ type: 'cat', name: 'Whiskers' }] },
    { name: 'Charlie', age: 35, status: 'Inactive' },
    { name: 'Dave', age: 40, status: 'Active' },
    { name: 'Eve', age: 45, status: 'Active' },
  ]);
});

afterAll(async () => {
  await client.close();
  await mongoServer.stop();
});

describe('mongo - basic aggregations', () => {
  it('should group users by status', async () => {
    const result = await users.aggregate([
      {
        $group: { _id: '$status', count: { $sum: 1 } }
      }
    ]).toArray();

    expect(result).toEqual(expect.arrayContaining([
      expect.objectContaining({ _id: 'Active', count: 4 }),
      expect.objectContaining({ _id: 'Inactive', count: 1 })
    ]));
  });

  it('should limit the number of results', async () => {
    const result = await users.aggregate([
      { $limit: 1 },
      { $skip: 0 },
    ]).toArray();

    expect(result).toEqual(expect.arrayContaining([
      expect.objectContaining({ name: 'Alice', age: 30 }),
    ]));
  });

  // project: 0 is same as $unset
  it('should select specific fields', async () => {
    const result = await users.aggregate([
      { $project: { name: 1, _id: 0 } }
    ]).toArray();

    expect(result).toEqual([
      { name: 'Alice' },
      { name: 'Bob' },
      { name: 'Charlie' },
      { name: 'Dave' },
      { name: 'Eve' },
    ]);
  });

  it('should sort users by age', async () => {
    const result = await users.aggregate([
      { $sort: { age: -1 } }
    ]).toArray();

    expect(result).toEqual([
      expect.objectContaining({ name: 'Eve', age: 45 }),
      expect.objectContaining({ name: 'Dave', age: 40 }),
      expect.objectContaining({ name: 'Charlie', age: 35 }),
      expect.objectContaining({ name: 'Alice', age: 30 }),
      expect.objectContaining({ name: 'Bob', age: 25 }),
    ]);
  });

  it('should filter users by status', async () => {
    const result = await users.aggregate([
      { $match: { status: 'Active' } }
    ]).toArray();

    expect(result).toEqual(expect.arrayContaining([
      expect.objectContaining({ name: 'Alice', status: 'Active' }),
      expect.objectContaining({ name: 'Bob', status: 'Active' }),
      expect.objectContaining({ name: 'Dave', status: 'Active' }),
      expect.objectContaining({ name: 'Eve', status: 'Active' }),
    ]));
  });

  // Same as $set
  it('should add a new field with $addFields', async () => {
    const result = await users.aggregate([
      { $addFields: { isAdult: { $gte: ['$age', 18] } } }
    ]).toArray();

    expect(result).toEqual(expect.arrayContaining([
      expect.objectContaining({ name: 'Alice', age: 30, isAdult: true }),
      expect.objectContaining({ name: 'Bob', age: 25, isAdult: true }),
      expect.objectContaining({ name: 'Charlie', age: 35, isAdult: true }),
      expect.objectContaining({ name: 'Dave', age: 40, isAdult: true }),
      expect.objectContaining({ name: 'Eve', age: 45, isAdult: true }),
    ]));
  });

  it('should count the total number of users', async () => {
    const result = await users.aggregate([
      { $count: 'totalUsers' }
    ]).toArray();

    expect(result).toEqual([
      { totalUsers: 5 }
    ]);
  });

  // Left Join
  it('should lookup related documents', async () => {
    const orders = db.collection('orders');
    await orders.insertMany([
      { user: 'Alice', product: 'Notebook' },
      { user: 'Bob', product: 'Book' },
      { user: 'Bob', product: 'Pen' },
    ]);

    const result = await users.aggregate([
      {
        $lookup: {
          from: 'orders',
          localField: 'name',
          foreignField: 'user',
          as: 'orders'
        }
      }
    ]).toArray();

    expect(result).toEqual(expect.arrayContaining([
      expect.objectContaining({ name: 'Alice', orders: [
        expect.objectContaining({ product: 'Notebook' })
      ] }),
      expect.objectContaining({ name: 'Bob', orders: [
        expect.objectContaining({ product: 'Book' }),
        expect.objectContaining({ product: 'Pen' })
      ] }),
      expect.objectContaining({ name: 'Charlie', orders: [] }),
      expect.objectContaining({ name: 'Dave', orders: [] }),
      expect.objectContaining({ name: 'Eve', orders: [] }),
    ]));
  });

  it('should save the aggregation result to a new collection', async () => {
    await users.aggregate([
      {
        $group: { _id: '$status', count: { $sum: 1 } }
      },
      {
        $out: 'statusCounts'
      }
    ]).toArray();

    const statusCounts = db.collection('statusCounts');
    const result = await statusCounts.find({}).toArray();

    expect(result).toEqual(expect.arrayContaining([
      expect.objectContaining({ _id: 'Active', count: 4 }),
      expect.objectContaining({ _id: 'Inactive', count: 1 })
    ]));
  });

  it('should perform multiple stages in the aggregation pipeline', async () => {
    const result = await users.aggregate([
      { $match: { status: 'Active' } },
      { $group: { _id: '$status', averageAge: { $avg: '$age' } } },
      { $project: { _id: 0, status: '$_id', averageAge: 1 } }
    ]).toArray();

    expect(result).toEqual([
      { status: 'Active', averageAge: 35 }
    ]);
  });
});
