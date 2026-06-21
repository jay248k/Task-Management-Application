import { pool } from "../config/db.js";

export const getTasks = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM tasks ORDER BY id DESC"
        );

        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createTask = async (req, res) => {
    try {
        const { title, description, completed } = req.body;
        const result = await pool.query(
            `INSERT INTO tasks(title,description,completed)
             VALUES($1,$2,$3)
             RETURNING *`,
            [title, description, completed]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, completed } = req.body;

        const result = await pool.query(
            `UPDATE tasks
             SET title=$1,
                 description=$2,
                 completed=$3
             WHERE id=$4
             RETURNING *`,
            [title, description, completed, id]
        );

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query(
            "DELETE FROM tasks WHERE id=$1",
            [id]
        );

        res.status(200).json({
            message: "Task deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};