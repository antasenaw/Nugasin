import express from "express";

const routes = express.Router();

routes.get('/', (req, res) => {
  res.status(200).json('hello world');
});
routes.post('/', (req, res) => {
  const body = req.body;
  res.status(200).json('Your tasks have been exported succesfully!');
});

export default routes;