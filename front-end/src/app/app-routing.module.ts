import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LobbyComponent } from './features/lobby/lobby/lobby.component';
import { LoginGuard } from './features/login/login.guard';
import { LoginComponent } from './features/login/login/login.component';
import { ScoreboardComponent } from './features/scoreboard/scoreboard/scoreboard.component';
import { BoardComponent } from './features/tic-tac-toe/board/board.component';


const routes: Routes = [
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "lobby",
    component: LobbyComponent,
    canActivate: [
      LoginGuard
    ]
  },
  {
    path: "leaderboard",
    component: ScoreboardComponent,
    canActivate: [
      LoginGuard
    ]
  },
  {
    path: "game/:id",
    component: BoardComponent,
    canActivate: [
      LoginGuard
    ]
  },
  {
    path: "**",
    redirectTo: "login",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
