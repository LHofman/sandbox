import readline from 'readline';
import Task from './Task';
import TaskList from './TaskList';
import Description from './Description';
import Link, { isLink } from './Link';

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
  addTask();
  // printTasks(getPreFilledTaskList());

  rl.close();
};

async function addTask() {
  const input = await getInput('Enter task description: ');
  // 4.3.4 Checking the data syntax
  const encodedInput = encodeHTML(input);
  
  let description: Description | undefined;
  let link: Link | undefined;
  
  if (isLink(input)) {
    link = new Link(encodedInput);
  } else {
    description = new Description(encodedInput);
  }

  const task = new Task(description, link);
  const taskList = new TaskList();
  taskList.addTask(task);

  printTasks(taskList);
}

function printTasks(taskList: TaskList) {
  console.log('\nToDo List:');
  console.log('-----------');
  taskList.getTasks().forEach(task => {
    console.log('- ' + (task.description ?? task.link)?.text);
  });
  console.log('');
}

function getPreFilledTaskList(): TaskList {
  return new TaskList([
    new Task(new Description('Make ToDo List')),
    new Task(undefined, new Link('https://google.com')),
    new Task(undefined, new Link('https://%20google.com')),
  ]);
}