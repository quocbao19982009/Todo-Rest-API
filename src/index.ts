import express, { Response, Request } from "express";
import cors from "cors";
import env from "dotenv";

import pool from "./db";
import { type } from "os";

const app = express();
env.config();

app.use(cors());
app.use(express.json());

// Routes

// healtcheck

interface customResquest extends Request {
  params: any;
}

app.get("/health", (req, res) => {
  res.status(200).send("Server running!");
});

// Create a todo

console.log(pool);

app.post("/todos", async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO todo (description) VALUES ($1) RETURNING *",
      [description]
    );

    res.json(newTodo.rows);
  } catch (error: any) {
    console.error(error.message);
  }
});

// get all todos

app.get("/todos", async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * from todo");
    res.json(allTodos.rows);
  } catch (error) {
    console.error(error);
  }
});

// get a todo

app.get("/todos/:id", async (req: Request, res: Response) => {
  try {
    const todoId = req.params.id;

    const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [
      todoId,
    ]);
    res.json(todo.rows);
  } catch (error) {
    console.error(error);
  }
});

// update a todo

app.put("/todos/:id", async (req, res) => {
  try {
    const todoId = req.params.id;

    const { description } = req.body;

    const updateTodo = await pool.query(
      "UPDATE todo SET description = $1 WHERE todo_id = $2 RETURNING *",
      [description, todoId]
    );

    res.json(updateTodo);
  } catch (error) {
    console.error(error);
  }
});

// Delete a todo

app.delete("/todos/:id", async (req, res) => {
  try {
    const todoId = req.params.id;

    const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [
      todoId,
    ]);

    res.json(deleteTodo);
  } catch (error) {
    console.error(error);
  }
});

app.listen(5000, () => {
  console.log("Server listening on port 3000");
  console.log(process.env.PASSWORD);
});
