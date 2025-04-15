import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterModule} from "@angular/router";
import {IonicModule} from "@ionic/angular";
import { Capacitor } from '@capacitor/core';
import {OpenedBuyOrderService} from "./services/opened-buy-order.service";
import {NgClass, NgIf} from "@angular/common";
import {HeaderComponent} from "./shared/header/header.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonicModule, RouterModule, NgIf, HeaderComponent, NgClass],
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
