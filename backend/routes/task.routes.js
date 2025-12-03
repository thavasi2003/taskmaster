import express from 'express';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';
import { getAllTasks, getEmployeeTasks, createTask, updateTask, deleteTask } from '../controllers/task.controller.js';

const router = express.Router();

router.get('/', verifyAdmin, getAllTasks);
router.post('/', verifyAdmin, createTask);
router.delete('/:id', verifyAdmin, deleteTask);

router.get('/:code', verifyToken, getEmployeeTasks); 
router.put('/:id', verifyToken, updateTask);

export default router;