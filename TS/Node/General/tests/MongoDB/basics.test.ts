import { MongoClient, Db, Collection } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;
let client: MongoClient;
let db: Db;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  client = await MongoClient.connect(mongoServer.getUri());
  db = client.db('testdb');
});

afterAll(async () => {
  await client.close();
  await mongoServer.stop();
});

describe('mongo - basics', () => {
  let users: Collection;

  beforeEach(async () => {
    users = db.collection('users');
    await users.deleteMany({});
  });

  it('should insert and find a document', async () => {
    const user = { name: 'Alice', age: 30 };
    await users.insertOne(user);

    const result = await users.findOne({ name: 'Alice' });

    expect(result).toMatchObject({
      name: 'Alice',
      age: 30,
    });
  });

  it('should insert multiple documents and find them', async () => {
    const userObjects = [
      { name: 'Bob', age: 25 },
      { name: 'Charlie', age: 35 },
    ];
    await users.insertMany(userObjects);

    const results = await users.find({}).toArray();

    expect(results).toEqual(expect.arrayContaining([
      expect.objectContaining({ name: 'Bob', age: 25 }),
      expect.objectContaining({ name: 'Charlie', age: 35 }),
    ]));
  });

  it('should update a document', async () => {
    const user = { name: 'Dave', age: 40 };
    await users.insertOne(user);

    await users.updateOne({ name: 'Dave' }, { $set: { age: 41 } });

    const result = await users.findOne({ name: 'Dave' });

    expect(result).toMatchObject({
      name: 'Dave',
      age: 41,
    });
  });

  it('should update or insert a document', async () => {
    await users.updateOne({ name: 'Eve' }, { $set: { age: 43 } }, { upsert: true });

    const result = await users.findOne({ name: 'Eve' });

    expect(result).toMatchObject({
      name: 'Eve',
      age: 43,
    });
  });

  it('should delete a document', async () => {
    const user = { name: 'Frank', age: 50 };
    await users.insertOne(user);

    await users.deleteOne({ name: 'Frank' });

    const result = await users.findOne({ name: 'Frank' });

    expect(result).toBeNull();
  });
});
