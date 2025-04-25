import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProgressCircleService {
  showLoader$ = new Subject<boolean>();
  constructor() { }
}
