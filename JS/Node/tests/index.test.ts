import { run } from '../src/app';


it('logs Hello World!', () => {
  console.log = jest.fn();

  run();

  expect(console.log.mock.calls[0][0]).toBe('Hello World!');
});
