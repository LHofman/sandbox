import { MongoClient, Db, Collection } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';

interface User {
  name: string;
  age: number;
  status: string;
  pets: { type: string; name: string }[];
  injuries: string[];
  hobbies: string[];
  todos: string[];
}

let mongoServer: MongoMemoryServer;
let client: MongoClient;
let db: Db;

let users: Collection<User>;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  client = await MongoClient.connect(mongoServer.getUri());
  db = client.db('testdb');

  users = db.collection<User>('users');
});

afterAll(async () => {
  await client.close();
  await mongoServer.stop();
});

describe('mongo - update operators', () => {
  beforeEach(async () => {
    await users.deleteMany({});
    await users.insertMany([
      {
        name: 'Bob',
        age: 25,
        status: 'Active',
        pets: [{ type: 'cat', name: 'Whiskers' }],
        injuries: ['sprained ankle'],
        hobbies: ['hiking', 'cooking'],
        todos: ['buy groceries', 'call mom'],
      },
    ]);
  });

  it('should update fields with update operators', async () => {
    await users.updateOne({ name: 'Bob' }, {
      $set: { name: 'Robert' },
      $unset: { injuries: '' },
      $inc: { age: 1 },
      $currentDate: { lastModified: true },
      $rename: { status: 'accountStatus' },
    });

    const result = await users.findOne({ name: 'Robert' });

    expect(result).toMatchObject({
      name: 'Robert',
      age: 26,
      accountStatus: 'Active',
      pets: [{ type: 'cat', name: 'Whiskers' }],
      lastModified: expect.any(Date),
    });
  });

  it('should update array fields with update operators', async () => {
    await users.updateOne({ name: 'Bob' }, {
      $push: { pets: { type: 'cat', name: 'Fluffy' } },
      $addToSet: { injuries: 'broken arm' },
      $pull: { hobbies: 'cooking' },
      $pop: { todos: -1 },
    });

    const result = await users.findOne({ name: 'Bob' });

    expect(result).toMatchObject({
      pets: [{ type: 'cat', name: 'Whiskers' }, { type: 'cat', name: 'Fluffy' }],
      injuries: ['sprained ankle', 'broken arm'],
      hobbies: ['hiking'],
      todos: ['call mom'],
    });
  });
});
