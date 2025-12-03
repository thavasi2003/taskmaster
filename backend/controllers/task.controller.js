import db from '../config/db.js';

export const getAllTasks = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM tasks ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getEmployeeTasks = async (req, res) => {
  const { code } = req.params;
  
  if (req.user.role !== 'admin' && req.user.employee_code !== code) {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const [rows] = await db.query('SELECT * FROM tasks WHERE employee_code = ? ORDER BY created_at DESC', [code]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createTask = async (req, res) => {
  const { 
    employee_code, 
    employee_name, 
    name, 
    task_description, 
    assigned_date, 
    key_tasks, 
    dependency, 
    estimated_effort_hours, 
    status, 
    start_date, 
    completion_date, 
    blockers 
  } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO tasks (
        employee_code, employee_name, name, task_description, assigned_date, 
        key_tasks, dependency, estimated_effort_hours, status, start_date, completion_date, blockers
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        employee_code, employee_name, name, task_description, assigned_date, 
        key_tasks, dependency, estimated_effort_hours, status || 'Pending', start_date, completion_date, blockers
      ]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  try {
    await db.query('UPDATE tasks SET status = ? WHERE id = ?', [status, id]);
    res.json({ message: 'Task updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM tasks WHERE id = ?', [id]);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};