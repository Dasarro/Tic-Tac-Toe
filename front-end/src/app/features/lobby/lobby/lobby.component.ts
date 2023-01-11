import { Component, OnInit } from '@angular/core';
import { TicTacToeService } from 'src/app/shared/services/tic-tac-toe.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {

  inQueue: boolean = false;

  constructor(private ticTacToeService: TicTacToeService) { }

  public onJoinQueue(): void {
    this.ticTacToeService.joinQueue(() => {this.inQueue = true});
  }

  public onLeaveQueue(): void {
    this.ticTacToeService.leaveQueue(() => {this.inQueue = false});
  }

  ngOnInit(): void {
    this.ticTacToeService.socketConnect(this.ticTacToeService.getUsername());
  }

}
