import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/models';
import { TicTacToeService } from 'src/app/shared/services/tic-tac-toe.service';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.component.html',
  styleUrls: ['./scoreboard.component.scss']
})
export class ScoreboardComponent implements OnInit {

  users$: Observable<User[]>;

  constructor(private ticTacToeService: TicTacToeService) { }

  ngOnInit(): void {
    this.users$ = this.ticTacToeService.getLeaderboard();
  }

}
