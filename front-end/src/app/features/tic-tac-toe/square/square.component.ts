import { Component, Input } from '@angular/core';
import { Square } from 'src/app/shared/models';

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.scss']
})
export class SquareComponent {
  @Input() value: Square;
}
