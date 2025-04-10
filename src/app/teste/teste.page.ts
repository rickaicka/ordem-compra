import {Component, inject, OnInit} from '@angular/core';
import {SharedModule} from "../shared/shared.module";
import {OpenedBuyOrderService} from "../opened-buy-order.service";
import {IonButton, IonicModule} from "@ionic/angular";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-teste',
  templateUrl: './teste.page.html',
  styleUrls: ['./teste.page.scss'],
  imports: [IonicModule, NgIf],
  standalone: true
})
export class TestePage implements OnInit {

  openedBuyOrders = inject(OpenedBuyOrderService);
  showMobile: boolean = false;
  constructor() {
    this.openedBuyOrders.subjectIsNative.subscribe(isNative => {
      this.showMobile = isNative
    })
  }

  ngOnInit() {
    this.openedBuyOrders.getOpenedBuyOrders().subscribe(openedBuyOrders => {
      console.log(openedBuyOrders);
    })
  }

}
