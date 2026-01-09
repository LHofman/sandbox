import readline from 'readline';
import Task from './Task';
import TaskList from './TaskList';
import Description from './Description';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const getInput = (query: string): Promise<string> =>
  new Promise((resolve) => {
    rl.question(query, (answer) => resolve(answer));
  });

function encodeHTML(str: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return str.replace(/[&<>"]/g, (m: string) => map[m] ?? '');
}

export async function main() {
  const description = await getInput('Enter task description: ');
  // 4.3.4 Checking the data syntax
  const encodedDescription = encodeHTML(description);
  const task = new Task(new Description(encodedDescription));
  const taskList = new TaskList();
  taskList.addTask(task);
  console.log(`Task "${task.description.text}" added successfully!`);
  rl.close();
}
