import { Square, Winner } from "./models";

export interface ServerToClientEvents {
    match_found: (gameId: string) => void;
    winner_announcement: (winner: Winner) => void;
    update_board: (board: Square[]) => void;
}

export interface ClientToServerEvents {
    join_queue: (callback: () => void) => void;
    join_game: (callback: (player: "X" | "O") => void) => void;
    leave_queue: (callback: () => void) => void;
    move: (index: number) => void;
}