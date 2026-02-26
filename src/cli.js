const { addTask, listTasks, completeTask, deleteTask, isOverdue } = require('./tasks');
const { formatTaskList, formatSuccess, formatError } = require('./utils/format');

const args = process.argv.slice(2);
const command = args[0];

function getFlag(name) {
  const idx = args.indexOf(`--${name}`);
  if (idx !== -1 && idx + 1 < args.length) {
    return args[idx + 1];
  }
  return null;
}

function hasFlag(name) {
  return args.includes(`--${name}`);
}

function run() {
  switch (command) {
    case 'add': {
      const desc = args[1];
      if (!desc) {
        console.log(formatError('Usage: add "description" [--priority high|medium|low] [--due YYYY-MM-DD]'));
        process.exit(1);
      }
      const priority = getFlag('priority') || 'medium';
      const dueDate = getFlag('due') || null;
      const task = addTask(desc, priority, dueDate);
      console.log(formatSuccess(`Added task #${task.id}: ${task.description}`));
      break;
    }

    case 'list': {
      const priority = getFlag('priority');
      const overdue = hasFlag('overdue');
      const tasks = listTasks(priority, { overdue });
      console.log(formatTaskList(tasks, { isOverdueFn: isOverdue }));
      break;
    }

    case 'complete': {
      const id = parseInt(args[1], 10);
      if (isNaN(id)) {
        console.log(formatError('Usage: complete <id>'));
        process.exit(1);
      }
      const task = completeTask(id);
      if (!task) {
        console.log(formatError(`Task #${id} not found.`));
        process.exit(1);
      }
      console.log(formatSuccess(`Completed task #${id}: ${task.description}`));
      break;
    }

    case 'delete': {
      const id = parseInt(args[1], 10);
      if (isNaN(id)) {
        console.log(formatError('Usage: delete <id>'));
        process.exit(1);
      }
      const task = deleteTask(id);
      if (!task) {
        console.log(formatError(`Task #${id} not found.`));
        process.exit(1);
      }
      console.log(formatSuccess(`Deleted task #${id}: ${task.description}`));
      break;
    }

    default:
      console.log('task-pilot — local task manager\n');
      console.log('Commands:');
      console.log('  add "description" [--priority high|medium|low] [--due YYYY-MM-DD]');
      console.log('  list [--priority high|medium|low] [--overdue]');
      console.log('  complete <id>');
      console.log('  delete <id>');
      process.exit(0);
  }
}

run();
