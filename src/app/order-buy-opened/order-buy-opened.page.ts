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
import {BehaviorSubject, filter, from} from "rxjs";
import {MatButtonModule} from "@angular/material/button";
import {CustomValidators} from "../shared/validators/custom-validators";
import {NgForOf, NgIf} from "@angular/common";
import {PcNumberSplitPipe} from "../shared/pipes/pc-number-split.pipe";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {ProgressCircleService} from "../services/progress-circle.service";

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
    MatProgressBarModule,

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
  dataSourceSubject = new BehaviorSubject<IOpenedBuyOrder[]>([]);
  dataSource = new MatTableDataSource<IOpenedBuyOrder>();
  pcNumbersList: string[] = [];
  selectedPC = ''
  listPcs: IOpenedBuyOrder[] = [];
  showStatusBar: boolean = false;
  public buffer = 0.06;
  public progress = 0;

  formPC = new FormGroup({
    pc_number: new FormControl((this.showMobile ? null : ''),(this.showMobile ? [CustomValidators.isNumber()] : undefined)),
  })


  loaderService = inject(ProgressCircleService);
  showTable :any;

  private _liveAnnouncer = inject(LiveAnnouncer);
  private originalListData = new MatTableDataSource<IOpenedBuyOrder>();
  constructor() {
    this.openedBuyOrders.subjectIsNative.subscribe(isNative => {
      this.showMobile = isNative;
    });
  }

  ngOnInit() {
    let enumKeys = '';

    if(this.showMobile){
      setInterval(() => {
        this.buffer += 0.06;
        this.progress += 0.06;
        this.getOpenedBuyOrders(enumKeys);
      }, 1500);
    }else{
      this.getOpenedBuyOrders(enumKeys);
    }
  }

  ngAfterViewInit() {
    this.dataSourceSubject.subscribe(data => {
      this.configureDataSource(data);
    });

    setTimeout(() => {
      this.createSelectList(this.dataSource.data);
    }, 5000);
  }

  getOpenedBuyOrders(enumKeys:any){
    this.openedBuyOrders.getOpenedBuyOrders().subscribe(
      (response: ApiResponse<IOpenedBuyOrder[]>) => {

        this.loaderService.showLoader$.next(true);
        this.openedOrders = response.data;

        this.openedOrders.forEach(order => {
          this.formatStatus(order);
        })

        this.dataSourceSubject.next(this.openedOrders);
        this.listPcs = this.openedOrders;
        this.originalListData.data = this.dataSource.data;

      },
      (err) => {
        console.log(err);
      },
      () => {
        if(this.listPcs.length > 0){
          this.loaderService.showLoader$.next(false);
          this.showTable = true;
        }else{
          this.showTable = false;
        }
        this.filterByPcNumber();
      }
    );
  }

  configureDataSource(data: IOpenedBuyOrder[]) {
    this.dataSource.data = data;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  formatStatus(order:IOpenedBuyOrder){
    order.status = order.status.split(";")[0];
    let enumKeys = '';
    switch (order.status ) {
      case "0":
        enumKeys = Object.keys(StatusOc)[0].toLowerCase();
        order.status  = StatusOc.OPENED;
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
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
    this.filterByPcNumber();
  }

  filterByPcNumber() {
    let pcNumber = this.formPC.get('pc_number')?.getRawValue();
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
      this.configureDataSource(newDataSource)
    }else{
      this.configureDataSource(this.originalListData.data)
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
