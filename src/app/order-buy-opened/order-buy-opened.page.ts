import {AfterViewInit, Component, inject, OnInit, ViewChild} from '@angular/core';
import {OpenedBuyOrderService} from "../services/opened-buy-order.service";
import {IonicModule} from "@ionic/angular";
import {ApiResponse} from "../interfaces/api-response.interface";
import {IOpenedBuyOrder} from "../interfaces/order-opened.interface";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatSortModule} from "@angular/material/sort";
import {IonCol, IonGrid, IonRow} from "@ionic/angular/standalone";
import {StatusOc} from "../enums/status-oc";

@Component({
  selector: 'app-order-buy-opened',
  templateUrl: './order-buy-opened.page.html',
  styleUrls: ['./order-buy-opened.page.scss'],
  imports: [IonicModule, MatTableModule, MatPaginatorModule, MatSortModule, IonCol, IonGrid, IonRow],
  standalone: true
})
export class OrderBuyOpenedPage implements OnInit, AfterViewInit  {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  openedBuyOrders = inject(OpenedBuyOrderService);
  showMobile: boolean = false;
  openedOrders: IOpenedBuyOrder[] = [];
  displayedColumns: string[] = ['pc_number', 'cod', 'dt_solicitation', 'dt_delivery', 'buy_order_value', 'supplier', 'description', 'status'];
  dataSource = new MatTableDataSource<IOpenedBuyOrder>();

  constructor() {
    this.openedBuyOrders.subjectIsNative.subscribe(isNative => {
      this.showMobile = isNative
    })
  }

  ngOnInit() {
    this.openedBuyOrders.getOpenedBuyOrders().subscribe((response: ApiResponse<IOpenedBuyOrder[]>) => {
      console.log(response);
      this.openedOrders = response.data;
      this.openedOrders.forEach(order => {
        order.status = StatusOc.OPENED
      })
      this.dataSource.data = this.openedOrders;
    })
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

}
