import { Component, OnInit } from '@angular/core';
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: []
})
export class HeaderComponent  implements OnInit {

  user:any = {
    name:''
  }

  constructor() { }

  ngOnInit() {
    this.user = {
      name:'Ricardo Salim',
    }
  }

}
