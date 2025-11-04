import express from "express";
import { userTasks } from "../model.js";

const routes = express.Router();

routes.post('/import', async (req, res) => {
  const { usn, pw } = req.body;

  try {
    const tasks = await userTasks.findOne({ user: usn });

    if (!tasks) {
      return res.status(404).json({ message: "Username not found." });
    }
    if (tasks.password !== pw) {
      return res.status(401).json({ message: "Password incorrect." });
    }
    res.status(200).json(tasks.tasks);
  } catch (error) {
    console.error("Import error:", error);
    res.status(500).json({ message: "Server error during import." });
  }
});

routes.post('/export', async (req, res) => {
  const { authCred, taskArray } = req.body; 
  const { usn, pw } = authCred;

  try {
    let tasks = await userTasks.findOne({ user: usn });
    if (!tasks) {
      tasks = new userTasks({
        user: usn,
        password: pw, 
        tasks: taskArray
      });
      await tasks.save();
      return res.status(201).json({ message: `Hi there ${tasks.user}, Welcome! Your tasks exported successfully.` });
    } else {
      if (tasks.password !== pw) {
          return res.status(401).json({ message: "Password incorrect. Cannot update data." });
      }
      tasks.tasks = taskArray;
      await tasks.save();
      return res.status(200).json({ message: `Your tasks exported successfully, ${tasks.user}.` });
    }
  } catch (error) {
    console.error("Export error:", error);
    res.status(500).json({ message: "Server error during export.", error: error.message });
  }
});

export default routes;