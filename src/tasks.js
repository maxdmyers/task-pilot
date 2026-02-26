const { loadTasks, saveTasks } = require('./storage');

function addTask(description, priority = 'medium', dueDate = null) {
  const tasks = loadTasks();
  const id = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;

  const task = {
    id,
    description,
    priority,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  if (dueDate) {
    task.dueDate = dueDate;
  }

  tasks.push(task);
  saveTasks(tasks);
  return task;
}

function isOverdue(task) {
  if (!task.dueDate || task.completed) return false;
  const today = new Date().toISOString().slice(0, 10);
  return task.dueDate < today;
}

function listTasks(filterPriority, { overdue } = {}) {
  let tasks = loadTasks();
  if (filterPriority) {
    tasks = tasks.filter(t => t.priority === filterPriority);
  }
  if (overdue) {
    tasks = tasks.filter(t => isOverdue(t));
  }
  return tasks;
}

function completeTask(id) {
  const tasks = loadTasks();
  const task = tasks.find(t => t.id === id);
  if (!task) {
    return null;
  }
  task.completed = true;
  saveTasks(tasks);
  return task;
}

function deleteTask(id) {
  const tasks = loadTasks();
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) {
    return null;
  }
  const [removed] = tasks.splice(index, 1);
  saveTasks(tasks);
  return removed;
}

module.exports = { addTask, listTasks, completeTask, deleteTask, isOverdue };
