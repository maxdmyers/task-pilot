const fs = require('fs');
const { loadTasks, saveTasks, DATA_FILE } = require('../src/storage');

const SAMPLE = [
  {
    id: 1,
    description: 'Sample task',
    priority: 'medium',
    completed: false,
    createdAt: '2026-02-20T10:00:00.000Z',
  },
];

beforeEach(() => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(SAMPLE, null, 2), 'utf-8');
});

afterAll(() => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(SAMPLE, null, 2), 'utf-8');
});

describe('loadTasks', () => {
  test('reads tasks from JSON file', () => {
    const tasks = loadTasks();
    expect(tasks).toHaveLength(1);
    expect(tasks[0].description).toBe('Sample task');
  });

  test('returns empty array when file is missing', () => {
    fs.unlinkSync(DATA_FILE);
    const tasks = loadTasks();
    expect(tasks).toEqual([]);
  });
});

describe('saveTasks', () => {
  test('writes tasks to JSON file', () => {
    const tasks = [
      { id: 1, description: 'Updated', priority: 'high', completed: true, createdAt: '2026-02-20T10:00:00.000Z' },
    ];
    saveTasks(tasks);
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    expect(parsed[0].description).toBe('Updated');
    expect(parsed[0].priority).toBe('high');
  });

  test('normalizes missing priority to medium', () => {
    const tasks = [
      { id: 1, description: 'No priority', completed: false, createdAt: '2026-02-20T10:00:00.000Z' },
    ];
    saveTasks(tasks);
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    expect(parsed[0].priority).toBe('medium');
  });
});
