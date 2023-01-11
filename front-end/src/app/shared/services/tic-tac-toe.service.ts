import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Socket, io } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { ClientToServerEvents, ServerToClientEvents } from 'src/app/shared/messages';
import { User } from '../models';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TicTacToeService {

  socket: Socket<ServerToClientEvents, ClientToServerEvents>;

  constructor(private http: HttpClient, private router: Router) {
    const URL = "http://localhost:3000"
    this.socket = io(URL, { autoConnect: false });
    this.socket.on("match_found", gameId => {
      router.navigateByUrl(`/game/${gameId}`);
    })
  }

  logIn(username: string): Observable<User> {
    return this.http.post<User>("/api/users", { username }).pipe(
      tap(x => sessionStorage.setItem("username", username))
    )
  }

  getUsername(): string {
    return sessionStorage.getItem("username")!;
  }

  getLeaderboard(): Observable<User[]> {
    return this.http.get<User[]>("/api/leaderboard");
  }

  socketConnect(username: string) {
    this.socket.auth = { username };
    this.socket.connect();
  }

  joinQueue(callback: () => void) {
    this.socket.emit("join_queue", callback);
  }

  leaveQueue(callback: () => void) {
    this.socket.emit("leave_queue", callback);
  }
}
