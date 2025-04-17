import {AfterViewInit, Component, forwardRef, inject, OnInit, ViewChild} from '@angular/core';
import {OpenedBuyOrderService} from "../services/opened-buy-order.service";
import {InfiniteScrollCustomEvent, IonicModule} from "@ionic/angular";
import {ApiResponse} from "../interfaces/api-response.interface";
import {IOpenedBuyOrder} from "../interfaces/order-opened.interface";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatSort, MatSortModule, Sort} from "@angular/material/sort";
import {StatusOc} from "../enums/status-oc";
import {FormatStringPipe} from "../shared/pipes/string-format.pipe";
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {MatFormField, MatHint, MatInputModule, MatLabel} from "@angular/material/input";
import {MatIcon} from "@angular/material/icon";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {filter, from} from "rxjs";
import {MatButtonModule} from "@angular/material/button";
import {CustomValidators} from "../shared/validators/custom-validators";
import {NgForOf, NgIf} from "@angular/common";
import {PcNumberSplitPipe} from "../shared/pipes/pc-number-split.pipe";

@Component({
  selector: 'app-order-buy-opened',
  templateUrl: './order-buy-opened.page.html',
  styleUrls: ['./order-buy-opened.page.scss'],
  imports: [
    IonicModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    FormatStringPipe,
    PcNumberSplitPipe,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatIcon,
    MatButtonModule,
    NgIf,
    NgForOf,

  ],
  standalone: true
})
export class OrderBuyOpenedPage implements OnInit, AfterViewInit  {

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  openedBuyOrders = inject(OpenedBuyOrderService);
  showMobile: boolean = false;
  openedOrders: IOpenedBuyOrder[] = [];
  displayedColumns: string[] = ['pc_number', 'cod', 'dt_solicitation', 'dt_delivery', 'buy_order_value', 'supplier', 'description', 'status'];
  dataSource = new MatTableDataSource<IOpenedBuyOrder>();
  pcNumbersList: string[] = [];
  selectedPC = ''
  pc_number: any;
  listPcs: IOpenedBuyOrder[] = [];

  private _liveAnnouncer = inject(LiveAnnouncer);
  private originalListData = new MatTableDataSource<IOpenedBuyOrder>();
  constructor() {
    this.openedBuyOrders.subjectIsNative.subscribe(isNative => {
      this.showMobile = isNative;
    });
    this.pc_number = new FormControl((this.showMobile ? null : ''),(this.showMobile ? [CustomValidators.isNumber()] : undefined));
  }

  ngOnInit() {
    let enumKeys = '';
    this.getOpenedBuyOrders(enumKeys);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.createSelectList(this.dataSource.data);
    }, 5000);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getOpenedBuyOrders(enumKeys:any){

    this.openedBuyOrders.getOpenedBuyOrders().subscribe((response: ApiResponse<IOpenedBuyOrder[]>) => {
      this.openedOrders = response.data;
      this.openedOrders.forEach(order => {
        switch (order.status) {
          case "0":
            enumKeys = Object.keys(StatusOc)[0].toLowerCase();
            order.status = StatusOc.OPENED;
            order['classStatus'] = `status-${enumKeys}`
            break
          case "1":
            enumKeys = Object.keys(StatusOc)[1].toLowerCase();
            order.status = StatusOc.UNDELIVERED;
            order['classStatus'] = `status-${enumKeys}`
            break;
          case "2":
            enumKeys = Object.keys(StatusOc)[2].toLowerCase();
            order.status = StatusOc.DELIVERED;
            order['classStatus'] = `status-${enumKeys}`
            break;
          default:
            break;
        }
      })
      this.dataSource.data = this.openedOrders;
      this.listPcs = this.openedOrders;
    });
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  filterByPcNumber(pcNumber: number | string) {

    let newDataSource: IOpenedBuyOrder[] = [];
    const pcString = this.showMobile ? `PC${pcNumber}` : pcNumber;
    if(pcString){
      this.originalListData.data = this.dataSource.data;
      const source = from(this.dataSource.data);
      const filterSource = source.pipe(filter(oc => oc.pc_number === pcString));

      filterSource.subscribe(filter => {
        if (filter) {
          newDataSource.push(filter);
        }
      });
      this.dataSource.data = newDataSource;
      this.dataSource.paginator = this.paginator;
    }else{
      this.dataSource.data = this.originalListData.data;
      this.dataSource.paginator = this.paginator;
    }
  }

  onIonInfinite(event: InfiniteScrollCustomEvent) {
    setTimeout(() => {
      event.target.complete();
    }, 500);
  }

  createSelectList(list:IOpenedBuyOrder[]){
    list?.forEach((item) => {
      if(!this.pcNumbersList.includes(item.pc_number)){
        this.pcNumbersList.push(item?.pc_number);
      }
    });
  }
  handleChange(event: CustomEvent) {
    this.filterByPcNumberIonic(event.detail.value);
  }

  filterByPcNumberIonic(pcNumber: string) {
    let newDataSource: IOpenedBuyOrder[] = [];
    if(pcNumber){
      const source = from(this.listPcs);
      const filterSource = source.pipe(filter(oc => oc.pc_number === pcNumber));
      filterSource.subscribe(filter => {
        if (filter) {
          newDataSource.push(filter);
        }
      });
      this.dataSource.data = newDataSource;
    }else{
      this.dataSource.data = this.listPcs;
    }
  }

  handleRefresh(event: CustomEvent) {
    setTimeout(() => {
      this.selectedPC = '';
      this.getOpenedBuyOrders('');
      this.filterByPcNumberIonic('');
      (event.target as HTMLIonRefresherElement).complete();
    }, 2000);
  }
}
