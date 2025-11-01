import express from "express";
import { getTask, addTask, editTask, deleteTask } from "../controller/taskController.js";

const routes = express.Router();

routes.get('/', getTask);
routes.post('/', addTask);
routes.put('/:id', editTask);
routes.delete('/:id', deleteTask);

export default routes;