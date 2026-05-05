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

  users = await db.createCollection('users', {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['name', 'age', 'status'],
        properties: {
          name: { bsonType: 'string' },
          age: { bsonType: 'number' },
          status: { bsonType: 'string' },
          pets: {
            bsonType: 'array',
            items: {
              bsonType: 'object',
              required: ['type', 'name'],
              properties: {
                type: { bsonType: 'string' },
                name: { bsonType: 'string' }
              }
            }
          }
        }
      }
    }
  });
});

afterAll(async () => {
  await client.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  await users.deleteMany({});
});

describe('mongo - schema validation', () => {
  it('should insert a valid document', async () => {
    const user = { name: 'Alice', age: 30, status: 'Active' };
    const result = await users.insertOne(user);

    expect(result.acknowledged).toBe(true);
    expect(result.insertedId).toBeDefined();
  });

  it('should reject an invalid document', async () => {
    const user = { name: 'Bob', age: 'twenty-five', status: 'Active' };

    await expect(users.insertOne(user)).rejects.toThrow();
  });

  it('when inserting many documents, should stop on the first invalid one', async () => {
    const userObjects = [
      { name: 'Charlie', age: 35, status: 'Inactive' },
      { name: 'Dave', age: 'forty', status: 'Active' }, // Invalid
      { name: 'Eve', age: 45, status: 'Active' },
    ];

    await expect(users.insertMany(userObjects)).rejects.toThrow();

    const results = await users.find({}).toArray();

    expect(results).toHaveLength(1);
  });
});
