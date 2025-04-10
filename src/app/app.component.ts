import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterModule} from "@angular/router";
import {IonicModule} from "@ionic/angular";
import { Capacitor } from '@capacitor/core';
import {OpenedBuyOrderService} from "./opened-buy-order.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonicModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{

  isNative = Capacitor.isNativePlatform();

  constructor(private router: Router, private subjectService: OpenedBuyOrderService) {
  }

  ngOnInit() {
    this.router.navigate(['']).then(r => this.subjectService.subjectIsNative.next(this.isNative));
  }
}
