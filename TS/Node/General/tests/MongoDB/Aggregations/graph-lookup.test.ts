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
    { name: 'Alice', age: 30, status: 'Active', employees: ['Bob', 'Charlie', 'Dave'] },
    { name: 'Bob', age: 25, status: 'Active', pets: [{ type: 'cat', name: 'Whiskers' }] },
    { name: 'Charlie', age: 35, status: 'Inactive' },
    { name: 'Dave', age: 40, status: 'Active', employees: ['Eve'] },
    { name: 'Eve', age: 45, status: 'Active' },
  ]);
});

afterAll(async () => {
  await client.close();
  await mongoServer.stop();
});

describe('mongo - graph lookup', () => {
  it('should perform a graph lookup to find employees', async () => {
    const result = await users.aggregate([
      {
        $match: { name: 'Alice' }
      },
      {
        $graphLookup: {
          from: 'users',
          startWith: '$employees',
          connectFromField: 'employees',
          connectToField: 'name',
          as: 'employeeDetails',
          maxDepth: 7,
          restrictSearchWithMatch: { status: 'Active' },
        }
      }
    ]).toArray();

    expect(result).toEqual(expect.arrayContaining([
      expect.objectContaining({
        name: 'Alice',
        employeeDetails: expect.arrayContaining([
          expect.objectContaining({ name: 'Bob' }),
          expect.objectContaining({ name: 'Dave' }),
          // Eve is an employee of Dave, so should be included in the results
          expect.objectContaining({ name: 'Eve' }),
        ])
      })
    ]));
  });
});
