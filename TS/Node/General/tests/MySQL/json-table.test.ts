import { createDB } from 'mysql-memory-server';
import mysql from 'mysql2/promise';

let db: any;
let connection: mysql.Connection;

beforeAll(async () => {
  db = await createDB();

  connection = await mysql.createConnection({
    host: '127.0.0.1',
    port: db.port,
    user: db.username,
    password: '',
    database: db.dbName,
    multipleStatements: true,
  });

  await connection.query(`
    CREATE TABLE users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      json_data JSON
    );

    CREATE TABLE orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      item_ids VARCHAR(100)
    );

    CREATE TABLE order_items (
      id INT PRIMARY KEY
    );
  `);

  await connection.query(`
    INSERT INTO users (json_data) VALUES
      ('{"name": "Alice", "age": 30}'),
      ('{"name": "Bob", "age": 25}');

    INSERT INTO orders (item_ids) VALUES
      ('1, 2, 3, 4'),
      ('1, 2, 5'),
      ('1, 3, 7');

    INSERT INTO order_items (id) VALUES
      (1), (3), (5), (7);
  `);
}, 30000);

afterAll(async () => {
  await connection.end();
  await db.stop();
});

describe('mysql - json table', () => {
  it('should query raw JSON object', async () => {
    const [rows] = await connection.execute(`
      SELECT *
      FROM JSON_TABLE(
        '{ "name": "John", "age": 29, "job": { "title": "Developer" } }',
        '$' COLUMNS (
          name VARCHAR(50) PATH '$.name',
          age INT PATH '$.age',
          jobTitle VARCHAR(50) PATH '$.job.title',
          country VARCHAR(50) PATH '$.country' DEFAULT '"Belgium"' ON EMPTY,
          city VARCHAR(50) PATH '$.city' NULL ON EMPTY,
          hasPets TINYINT EXISTS PATH '$.pets'
        )
      ) AS person;
    `);

    expect(rows).toEqual([
      { name: 'John', age: 29, country: 'Belgium', city: null, hasPets: 0, jobTitle: 'Developer' },
    ]);
  });

  it('should query raw JSON array', async () => {
    const [rows] = await connection.execute(`
      SELECT *
      FROM JSON_TABLE(
        '[{ "name": "John", "age": 29 }, { "name": "Jane", "age": 32 }]',
        '$[*]' COLUMNS (
          rowId FOR ORDINALITY,
          name VARCHAR(50) PATH '$.name'
        )
      ) AS person;
    `);

    expect(rows).toEqual([
      { name: 'John', rowId: 1 },
      { name: 'Jane', rowId: 2 },
    ]);
  });

  it('should flatten nested arrays', async () => {
    const [rows] = await connection.execute(`
      SELECT *
      FROM JSON_TABLE(
        '[{ "name": "John", "pets": ["dog", "cat"] }, { "name": "Jane", "pets": ["hamster"] }]',
        '$[*]' COLUMNS (
          rowId FOR ORDINALITY,
          name VARCHAR(50) PATH '$.name',
          NESTED PATH '$.pets[*]' COLUMNS (
            petName VARCHAR(50) PATH '$'
          )
        )
      ) AS person;
    `);

    expect(rows).toEqual([
      { name: 'John', rowId: 1, petName: 'dog' },
      { name: 'John', rowId: 1, petName: 'cat' },
      { name: 'Jane', rowId: 2, petName: 'hamster' },
    ]);
  });

  it('should find last 2 elements in array', async () => {
    const [rows] = await connection.execute(`
      SELECT *
      FROM JSON_TABLE(
        '{ "name": "John", "jobs": ["Developer", "Designer", "Manager"] }',
        '$.jobs[last-1 to last]' COLUMNS (job VARCHAR(50) PATH '$')
      ) AS person;
    `);

    expect(rows).toEqual([
      { job: "Designer" },
      { job: "Manager" }
    ]);
  });

  it('should get values from dynamic properties', async () => {
    const [rows] = await connection.execute(`
      SELECT *
      FROM JSON_TABLE(
        '{ "January": 100, "February": 150, "March": 200 }',
        '$.*' COLUMNS (value INT PATH '$')
      ) AS person;
    `);

    let plainRows = (rows as any[]).map(row => ({ ...row }));
    plainRows.sort((a: { value: number }, b: { value: number }) => a.value - b.value);

    expect(plainRows).toEqual([
      { value: 100 },
      { value: 150 },
      { value: 200 }
    ]);
  });

  it('should query json data from a table', async () => {
    const [rows] = await connection.execute(`
      SELECT name, age
      FROM users,
        JSON_TABLE(
          json_data,
          '$' COLUMNS (
            name VARCHAR(50) PATH '$.name',
            age INT PATH '$.age'
          )
        ) AS person
    `);

    expect(rows).toEqual([
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 },
    ]);
  });

  it('should use json data in conditions', async () => {
    const [rows] = await connection.execute(`
      SELECT COUNT(*) AS count
      FROM users
        JOIN JSON_TABLE(
          json_data,
          '$' COLUMNS (
            age INT PATH '$.age'
          )
        ) AS person
      WHERE person.age > 27
    `);

    expect(rows).toEqual([
      { count: 1 },
    ]);
  });

  it('should find missing ids from string list', async () => {
    const [rows] = await connection.execute(`
      SELECT orders.id as orderId, items.item_id as missingItemId
      FROM orders
        JOIN JSON_TABLE(
          CONCAT('[', item_ids, ']'),
          '$[*]' COLUMNS (item_id INT PATH '$')
        ) AS items
        LEFT JOIN order_items ON items.item_id = order_items.id
      WHERE order_items.id IS NULL AND orders.item_ids != ''
    `);

    expect(rows).toEqual([
      { orderId: 1, missingItemId: 2 },
      { orderId: 1, missingItemId: 4 },
      { orderId: 2, missingItemId: 2 },
    ]);
  });
});