import { GameServer, GameSocket } from "./models/socket";
import { v4 as uuid } from 'uuid';
import { Square, Winner } from "./shared/models";
import { PlayerResult, updateScore } from "./db_connection";

export class Game {
    private player_o: GameSocket;
    private player_x: GameSocket;
    id: string;
    private board: Square[];
    private xIsNext: boolean;
    private isPlayerOConnected: boolean;
    private isPlayerXConnected: boolean;
    private io: GameServer;


    constructor(player_a: GameSocket, player_b: GameSocket, io: GameServer) {
        this.io = io;
        const coinFlipResult = Math.floor(Math.random() * 2) === 0;
        [this.player_o, this.player_x] = coinFlipResult ? [player_a, player_b] : [player_b, player_a];
        this.id = uuid();
        this.board = Array(9).fill(null);
        this.xIsNext = false;
        this.isPlayerOConnected = false;
        this.isPlayerXConnected = false;
        this.player_o.once("join_game", callback => {
            this.isPlayerOConnected = true;
            this.player_o.join(this.id);
            if (this.isPlayerOConnected && this.isPlayerXConnected) {
                this.player_o.once("move", this.makeMove);
            }
            console.log(`${this.player_o.data.username} joined the game room and will play as O.`);
            callback("O");
        });
        this.player_x.once("join_game", callback => {
            this.isPlayerXConnected = true;
            this.player_x.join(this.id);
            if (this.isPlayerOConnected && this.isPlayerXConnected) {
                this.player_o.once("move", this.makeMove);
            }
            console.log(`${this.player_x.data.username} joined the game room and will play as X.`);
            callback("X");
        })
    }

    get playerSquare(): Square {
        return this.xIsNext ? "X" : "O";
    }

    getPlayer = (squareSymbol: "X" | "O"): GameSocket => {
        return squareSymbol === "X" ? this.player_x : this.player_o;
    }

    makeMove = (id: number) => {
        const currentPlayer = this.getPlayer(this.playerSquare);

        if (this.board[id]) {
            currentPlayer.once("move", this.makeMove);
        }
        
        this.board.splice(id, 1, this.playerSquare);
        
        this.xIsNext = !this.xIsNext;
        const nextPlayer = this.getPlayer(this.playerSquare);

        const winner = this.calculateWinner();
        if (winner) {
            this.io.to(this.id).emit("winner_announcement", winner);
            if (winner !== "Tie") {
                if (winner === "X") {
                    updateScore(PlayerResult.Win, this.player_x.data.username);
                    updateScore(PlayerResult.Lose, this.player_o.data.username);
                } else {
                    updateScore(PlayerResult.Lose, this.player_x.data.username);
                    updateScore(PlayerResult.Win, this.player_o.data.username);
                }
            }

        } else {
            nextPlayer.once("move", this.makeMove);
        }

        this.io.to(this.id).emit("update_board", this.board);
    }

    calculateWinner = (): Winner => {
        const lines = [
          [0, 1, 2],
          [3, 4, 5],
          [6, 7, 8],
          [0, 3, 6],
          [1, 4, 7],
          [2, 5, 8],
          [0, 4, 8],
          [2, 4, 6]
        ];
        
        for (const [a, b, c] of lines) {
          if (
            this.board[a] &&
            this.board[a] === this.board[b] &&
            this.board[a] === this.board[c]
          ) {
            return this.board[a];
          }
        }
        
        if (this.board.every(x => x !== null)) {
            return "Tie";
        }

        return null;
      }
}