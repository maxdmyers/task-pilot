const PRIORITY_COLORS = {
  high: '\x1b[31m',
  medium: '\x1b[33m',
  low: '\x1b[36m',
};
const RESET = '\x1b[0m';
const RED = '\x1b[31m';
const DIM = '\x1b[2m';
const CHECK = '\u2713';
const DASH = '\u2013';

function formatTask(task, { isOverdue } = {}) {
  const overdueTag = isOverdue ? `${RED}[OVERDUE]${RESET} ` : '';
  const status = task.completed ? CHECK : DASH;
  const color = PRIORITY_COLORS[task.priority] || '';
  const desc = task.completed
    ? `\x1b[9m${task.description}${RESET}`
    : task.description;
  const due = task.dueDate ? `  ${DIM}due: ${task.dueDate}${RESET}` : '';
  return `  ${overdueTag}${status} [${task.id}] ${color}${task.priority}${RESET}  ${desc}${due}`;
}

function formatTaskList(tasks, { isOverdueFn } = {}) {
  if (tasks.length === 0) {
    return 'No tasks found.';
  }
  const lines = tasks.map(t => formatTask(t, { isOverdue: isOverdueFn ? isOverdueFn(t) : false }));
  return lines.join('\n');
}

function formatSuccess(message) {
  return `\x1b[32m${message}${RESET}`;
}

function formatError(message) {
  return `\x1b[31m${message}${RESET}`;
}

module.exports = { formatTask, formatTaskList, formatSuccess, formatError };
