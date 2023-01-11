import { Pool } from "pg";
import { User } from "./shared/models";

const pool = new Pool({
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT)
});

export const getUsers = (request, response) => {
    pool.query(`
        SELECT *
        FROM users
        ORDER BY wins - loses DESC
    `, (error, results) => {
        if (error) {
            console.error(error);
            return;
        }
        response.status(200).json(results.rows)
    });
}

export const createUser = (request, response) => {
    const { username } = request.body;
    pool.query(`
        INSERT INTO users (username)
        VALUES ($1)
        ON CONFLICT (username) DO UPDATE
            SET username = EXCLUDED.username
        RETURNING *;
    `, [username], (error, results) => {
        if (error) {
            console.error(error);
            return;
        }
        response.status(200).json(results.rows[0])
    });
}

export enum PlayerResult {
    Win,
    Lose
}

export const updateScore = async (result: PlayerResult, username: string) => {
    pool.query(`
        UPDATE users
        SET ${result === PlayerResult.Win ? "wins = wins + 1" : "loses = loses + 1"}
        WHERE username = $1;
    `, [username], (error, results) => {
        if (error) {
            console.error(error);
        }
    });
}