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
    { name: 'Bob', age: 25, status: 'Active', pets: [
      { type: 'cat', name: 'Whiskers' },
      { type: 'cat', name: 'Fluffy' },
    ] },
    { name: 'Charlie', age: 35, status: 'Inactive', pets: [
      { type: 'dog', name: 'Rover' },
    ] },
    { name: 'Dave', age: 40, status: 'Active' },
    { name: 'Eve', age: 45, status: 'Active' },
  ]);
});

afterAll(async () => {
  await client.close();
  await mongoServer.stop();
});

describe('mongo - unwind & replace root', () => {
  it('should unwind an array field', async () => {
    const result = await users.aggregate([
      { $unwind: '$pets' },
    ]).toArray();

    expect(result).toEqual(expect.arrayContaining([
      expect.objectContaining({ name: 'Bob', pets: { type: 'cat', name: 'Whiskers' } }),
      expect.objectContaining({ name: 'Bob', pets: { type: 'cat', name: 'Fluffy' } }),
      expect.objectContaining({ name: 'Charlie', pets: { type: 'dog', name: 'Rover' } }),
    ]));
  });

  it('should replace the root document with a subdocument and include additional fields', async () => {
    const result = await users.aggregate([
      { $unwind: '$pets' },
      { $replaceRoot: { newRoot: { $mergeObjects: ['$pets', { owner: '$name' }] } } },
    ]).toArray();

    expect(result).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: 'cat', name: 'Whiskers', owner: 'Bob' }),
      expect.objectContaining({ type: 'cat', name: 'Fluffy', owner: 'Bob' }),
      expect.objectContaining({ type: 'dog', name: 'Rover', owner: 'Charlie' }),
    ]));
  });
});
