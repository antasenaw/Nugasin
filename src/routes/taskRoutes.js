import express from "express";
import { userTasks } from "../model.js";

const routes = express.Router();

routes.post('/import', async (req, res) => {
  const { usn, pw } = await req.body;

  let task = await userTasks.findOne({ user: usn });
  
  res.status(200).json(task.tasks);
});

routes.post('/export', async (req, res) => {
  const { authObj, taskArray } = await req.body;
  const { usn, pw } = await authObj;

  const newTasks = await new userTasks({
    user: usn,
    password: pw,
    tasks: taskArray
  }).save();

  res.status(200).json(`Your tasks have been exported succesfully!`);
});

export default routes;