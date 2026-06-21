import express from "express";
import { createTask, deleteTask, getTasks, updateTask } from "../controller/task.controller.js";


const taskRouter = express.Router();

taskRouter.get("/", getTasks);

taskRouter.post("/", createTask);

taskRouter.put("/:id", updateTask);

taskRouter.delete("/:id", deleteTask);

export default taskRouter;