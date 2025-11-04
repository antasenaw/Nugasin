import express from "express";
import { userTasks } from "../model.js";

const routes = express.Router();

routes.get('/', (req, res) => {
  res.status(200).json('hello world');
});

routes.post('/', async (req, res) => {
  const { authObj, taskArray } = await req.body;
  const { usn, pw } = await authObj;

  const newTasks = await new userTasks({
    user: usn,
    password: pw,
    tasks: taskArray
  });

  await newTasks.save();

  res.status(200).json(`Your tasks have been exported succesfully!`);
});

export default routes;