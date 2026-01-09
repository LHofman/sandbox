import readline from 'readline';
import { main } from '../../src/SecureByDesign/main';

let getTaskDescription = (): string => 'Test task description';

jest.mock('readline', () => ({
  createInterface: jest.fn().mockReturnValue({
    question: (query: string, callback: (answer: string) => void) => {
      callback(getTaskDescription());
    },
    close: () => {}
  } as unknown as readline.Interface),
}));

console.log = jest.fn();
const consoleLogMock = <jest.Mock<typeof console.log>>console.log;

beforeEach(() => {
  getTaskDescription = (): string => 'Test task description';
  consoleLogMock.mockClear();
});

describe('Secure By Design', () => {
  it('should log a created task', async () => {
    await main();
    expect(consoleLogMock.mock.calls[0][0]).toBe('Task "Test task description" added successfully!');
  });

  it('should escape HTML in task description', async () => {
    getTaskDescription = (): string => '<script>alert("XSS")</script>';

    await main();
    expect(consoleLogMock.mock.calls[0][0]).toBe('Task "&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;" added successfully!');
  });
});
