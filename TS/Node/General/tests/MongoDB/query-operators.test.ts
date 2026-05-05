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

describe('mongo - query operators', () => {
  describe('comparison operators', () => {
    it('should find documents with field equal to', async () => {
      const results = await users.find({ status: 'Active' }).toArray();

      expect(results).toEqual(expect.arrayContaining([
        expect.objectContaining({ name: 'Alice', status: 'Active' }),
        expect.objectContaining({ name: 'Bob', status: 'Active' }),
        expect.objectContaining({ name: 'Dave', status: 'Active' }),
        expect.objectContaining({ name: 'Eve', status: 'Active' }),
      ]));
    });

    it('should find documents with field not equal to', async () => {
      const results = await users.find({ status: { $ne: 'Active' } }).toArray();

      expect(results).toEqual(expect.arrayContaining([
        expect.objectContaining({ name: 'Charlie', status: 'Inactive' }),
      ]));
    });

    it('should find documents with field in list', async () => {
      const results = await users.find({ name: { $in: ['Alice', 'Charlie'] } }).toArray();

      expect(results).toEqual(expect.arrayContaining([
        expect.objectContaining({ name: 'Alice' }),
        expect.objectContaining({ name: 'Charlie' }),
      ]));
    });

    it('should find documents with field greater than', async () => {
      const results = await users.find({ age: { $gt: 40 } }).toArray();

      expect(results).toEqual(expect.arrayContaining([
        expect.objectContaining({ name: 'Eve', age: 45 }),
      ]));

      const results2 = await users.find({ age: { $gte: 40 } }).toArray();

      expect(results2).toEqual(expect.arrayContaining([
        expect.objectContaining({ name: 'Dave', age: 40 }),
        expect.objectContaining({ name: 'Eve', age: 45 }),
      ]));
    });

    it('should find documents with field less than', async () => {
      const results = await users.find({ age: { $lt: 30 } }).toArray();

      expect(results).toEqual(expect.arrayContaining([
        expect.objectContaining({ name: 'Bob', age: 25 }),
      ]));

      const results2 = await users.find({ age: { $lte: 30 } }).toArray();

      expect(results2).toEqual(expect.arrayContaining([
        expect.objectContaining({ name: 'Alice', age: 30 }),
        expect.objectContaining({ name: 'Bob', age: 25 }),
      ]));
    });
  });

  describe('logical operators', () => {
    it('should find documents with logical AND', async () => {
      const results = await users.find({ $and: [{ status: 'Active' }, { age: { $gt: 30 } }] }).toArray();

      expect(results).toEqual(expect.arrayContaining([
        expect.objectContaining({ name: 'Dave', status: 'Active', age: 40 }),
        expect.objectContaining({ name: 'Eve', status: 'Active', age: 45 }),
      ]));
    });

    it('should find documents with logical OR', async () => {
      const results = await users.find({ $or: [{ status: 'Inactive' }, { age: { $lt: 30 } }] }).toArray();

      expect(results).toEqual(expect.arrayContaining([
        expect.objectContaining({ name: 'Bob', status: 'Active', age: 25 }),
        expect.objectContaining({ name: 'Charlie', status: 'Inactive', age: 35 }),
      ]));
    });

    it('should find documents with logical NOR', async () => {
      const results = await users.find({ $nor: [{ status: 'Inactive' }, { age: { $lt: 30 } }] }).toArray();

      expect(results).toEqual(expect.arrayContaining([
        expect.objectContaining({ name: 'Alice', status: 'Active', age: 30 }),
        expect.objectContaining({ name: 'Dave', status: 'Active', age: 40 }),
        expect.objectContaining({ name: 'Eve', status: 'Active', age: 45 }),
      ]));
    });

    it('should find documents with logical NOT', async () => {
      const results = await users.find({ age: { $not: { $gt: 30 } } }).toArray();

      expect(results).toEqual(expect.arrayContaining([
        expect.objectContaining({ name: 'Alice', age: 30 }),
        expect.objectContaining({ name: 'Bob', age: 25 }),
      ]));
    });
  });

  describe('evaluation operators', () => {
    it('should find documents with field exists', async () => {
      const results = await users.find({ pets: { $exists: true } }).toArray();

      expect(results).toEqual(expect.arrayContaining([
        expect.objectContaining({ name: 'Bob', pets: [{ type: 'cat', name: 'Whiskers' }] }),
      ]));
    });

    it('should find documents via regex', async () => {
      const results = await users.find({ name: { $regex: '^A' } }).toArray();

      expect(results).toEqual(expect.arrayContaining([
        expect.objectContaining({ name: 'Alice' }),
      ]));
    });

    it('should find documents with text search', async () => {
      // Note: text search requires a text index to be created on the collection
      await users.createIndex({ name: 'text', status: 'text' });

      const results = await users.find({ $text: { $search: 'Active' } }).toArray();

      expect(results).toEqual(expect.arrayContaining([
        expect.objectContaining({ name: 'Alice', status: 'Active' }),
        expect.objectContaining({ name: 'Bob', status: 'Active' }),
        expect.objectContaining({ name: 'Dave', status: 'Active' }),
        expect.objectContaining({ name: 'Eve', status: 'Active' }),
      ]));
    });

    it('should find documents using where', async () => {
      const results = await users.find({ $where: 'this.age > 30 && this.status === "Active"' }).toArray();

      expect(results).toEqual(expect.arrayContaining([
        expect.objectContaining({ name: 'Dave', age: 40, status: 'Active' }),
        expect.objectContaining({ name: 'Eve', age: 45, status: 'Active' }),
      ]));
    });
  });
});
