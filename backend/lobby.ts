import { Game } from "./game";
import { GameServer, GameSocket } from "./models/socket";

let queue: GameSocket[] = [];

export const setupQueue = (io: GameServer) => {
    io.on("connect", socket => {
        socket.on("disconnect", () => {
            queue = queue.filter(x => x.id !== socket.id);
        });

        socket.on("join_queue", callback => {
            if (!queue.some(x => x.id === socket.id)) {
                queue.push(socket);
                console.log(`${socket.data.username} entered the queue.`);
            }

            if (queue.length > 1) {
                const player_a = queue.pop();
                const player_b = queue.pop();
                const game = new Game(player_a, player_b, io);
                console.log(`${player_a.data.username} will play against ${player_b.data.username}!`);
                player_a.emit("match_found", game.id);
                player_b.emit("match_found", game.id);
            }
            callback();
        })

        socket.on("leave_queue", callback => {
            queue = queue.filter(x => x.id !== socket.id);
            console.log(`${socket.data.username} left the queue.`);
            callback();
        })
    })
}