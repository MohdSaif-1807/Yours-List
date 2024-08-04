import express from 'express';
import { addNewTask, addTodoCategory, deleteItem, editGetSpecificItems, getAllItems, getSpecificCategoryItems, getTodoCategory, updateItems } from '../Controllers/ToDoOperation.js';
import { IsAuthenticated } from '../Middlewares/IsAuthenticated.js';

export const TodoRoutes = express.Router();

TodoRoutes.post('/add-new-task', IsAuthenticated, addNewTask);
TodoRoutes.post('/add-new-category', IsAuthenticated, addTodoCategory);
TodoRoutes.put('/update-details/:id', IsAuthenticated, updateItems);
TodoRoutes.delete('/delete-item/:id', IsAuthenticated, deleteItem);
TodoRoutes.get('/get-todo-items', IsAuthenticated, getAllItems);
TodoRoutes.get(`/get-specific-item/:id`, IsAuthenticated, editGetSpecificItems);
TodoRoutes.get('/get-all-task', IsAuthenticated, getTodoCategory);
TodoRoutes.get('/get-categories-tasks', IsAuthenticated, getSpecificCategoryItems);


