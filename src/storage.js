const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DATA_FILE = path.join(DATA_DIR, 'tasks.json');

function loadTasks() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return [];
    }
    throw err;
  }
}

function saveTasks(tasks) {
  // Ensure consistent formatting and field normalization
  const normalized = tasks.map(task => {
    const entry = { ...task };
    entry.priority = entry.priority || 'medium';
    entry.description = entry.description.slice(0, 200);
    entry.completed = Boolean(entry.completed);
    if (!entry.dueDate) {
      delete entry.dueDate;
    }
    return entry;
  });

  const json = JSON.stringify(normalized, null, 2);
  fs.writeFileSync(DATA_FILE, json, 'utf-8');
}

module.exports = { loadTasks, saveTasks, DATA_FILE };
