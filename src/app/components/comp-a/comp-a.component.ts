import { Component, OnInit } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { FocusDirective } from '../../directives/focus.directive';

@Component({
  selector: 'app-comp-a',
  templateUrl: './comp-a.component.html',
  styleUrls: ['./comp-a.component.scss']
})
export class CompAComponent {
  public output = 'Box A';
}
