import {Component, inject, Input, OnInit} from '@angular/core';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {ProgressCircleService} from "../../services/progress-circle.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-progress-circle',
  templateUrl: './progress-circle.component.html',
  styleUrls: ['./progress-circle.component.scss'],
  imports: [
    MatProgressSpinnerModule,
    NgIf
  ]
})
export class ProgressCircleComponent {

  @Input() showProgress:any;

  constructor() {

  }

}
