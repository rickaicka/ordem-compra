import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
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
