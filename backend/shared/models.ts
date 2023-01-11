export interface User {
    username: string;
    wins: number;
    loses: number;
}

export type Square = "X" | "O" | null;

export type Winner = "X" | "O" | "Tie" | null;