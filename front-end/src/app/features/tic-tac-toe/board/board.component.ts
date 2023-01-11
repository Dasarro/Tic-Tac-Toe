import { Component, OnInit } from '@angular/core';
import { Square, Winner } from 'src/app/shared/models';
import { TicTacToeService } from '../../../shared/services/tic-tac-toe.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  board: Square[];
  winner: Winner;
  player: Square;

  constructor(public ticTacToeService: TicTacToeService) { }

  ngOnInit(): void {
    this.board = Array(9).fill(null);
    this.ticTacToeService.socket.emit("join_game", player => {
      this.player = player;
    });
    this.ticTacToeService.socket.on("update_board", board => {
      this.board = board;
    });
    this.ticTacToeService.socket.on("winner_announcement", winner => {
      this.winner = winner;
    })
  }

  makeMove(id: number) {
    if (this.board[id]) return;
    this.ticTacToeService.socket.emit("move", id);
  }

}
