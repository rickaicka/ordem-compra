import {AfterViewInit, Component, forwardRef, HostListener, inject, OnInit, ViewChild} from '@angular/core';
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
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {BehaviorSubject, filter, from} from "rxjs";
import {MatButtonModule} from "@angular/material/button";
import {CustomValidators} from "../shared/validators/custom-validators";
import {JsonPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {PcNumberSplitPipe} from "../shared/pipes/pc-number-split.pipe";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {ProgressCircleService} from "../services/progress-circle.service";
import {IsMiniPipe} from "../shared/pipes/is-mini";

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
    MatButtonModule,
    NgIf,
    NgForOf,
    MatProgressBarModule,
    MatIconModule,
    IsMiniPipe,
    NgClass
  ],
  standalone: true
})
export class OrderBuyOpenedPage implements OnInit, AfterViewInit  {

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  width = window.innerWidth;
  height = window.innerHeight;

  get screen() {
    return { width: this.width, height: this.height };
  }
  @HostListener('window:resize')
  onResize() {
    console.log('Nova resolução:', window.innerWidth, 'x', window.innerHeight);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }
  private readonly minResBase = 360;
  isMini= false;

  openedBuyOrders = inject(OpenedBuyOrderService);
  showMobile: boolean = false;
  openedOrders: IOpenedBuyOrder[] = [];
  displayedColumns: string[] = ['pc_number', 'cod', 'dt_solicitation', 'dt_delivery', 'buy_order_value', 'supplier', 'description', 'status'];
  dataSourceSubject = new BehaviorSubject<IOpenedBuyOrder[]>([]);
  dataSource = new MatTableDataSource<IOpenedBuyOrder>();
  pcNumbersList: string[] = [];
  dateList: string[] = [];
  selectedPC = ''
  selectedDate = ''
  selectedOC: string = ''
  listPcs: IOpenedBuyOrder[] = [];
  showStatusBar: boolean = false;
  typeFilter: string = '';
  baseDtSource: IOpenedBuyOrder[] = [];

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
      setInterval(()=>{
        this.getOpenedBuyOrders(enumKeys);
        this.isMini = this.width <= this.minResBase;
      },1500)
    }else{
      this.getOpenedBuyOrders(enumKeys);
    }
  }

  ngAfterViewInit() {
    this.dataSourceSubject.subscribe(data => {
      this.configureDataSource(data);
    });
    console.log(this.typeFilter)
  }

  getOpenedBuyOrders(enumKeys:any){
    this.openedBuyOrders.getOpenedBuyOrders().subscribe(
      (response: ApiResponse<IOpenedBuyOrder[]>) => {

        this.loaderService.showLoader$.next(true);
        this.openedOrders = response.data;
        this.selectedOC = this.openedOrders[0].cod;

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
    this.createSelectList(this.dataSource.data);
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
      if(!this.dateList.includes(item.dt_delivery)){
        this.dateList.push(item?.dt_delivery);
      }
    });
  }

  handleChange(event: CustomEvent) {
    if(this.typeFilter === 'type_date'){
      this.filterByDateDeliveryIonic(event.detail.value);
    }else{
      this.filterByPcNumberIonic(event.detail.value);
    }
  }
  handleChangeType(event:CustomEvent){
    this.typeFilter = event?.detail.value;
    this.openedOrders = this.originalListData.data;
    this.selectedDate = '';
    this.selectedOC = '';
    this.selectedPC = '';
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

    this.openedOrders = this.dataSource.data;
  }

  filterByDateDeliveryIonic(dtDelivery: string) {
    let newDataSource: IOpenedBuyOrder[] = [];
    if(dtDelivery){
      const source = from(this.listPcs);
      const filterSource = source.pipe(filter(oc => oc.dt_delivery === dtDelivery));
      filterSource.subscribe(filter => {
        if (filter) {
          newDataSource.push(filter);
        }
      });
      this.dataSource.data = newDataSource;
    }else{
      this.dataSource.data = this.listPcs;
    }

    this.openedOrders = this.dataSource.data;
  }

  handleRefresh(event: CustomEvent) {
    setTimeout(() => {
      this.selectedPC = '';
      this.getOpenedBuyOrders('');
      this.filterByPcNumberIonic('');
      (event.target as HTMLIonRefresherElement).complete();
    }, 2000);
  }

  searchBuyOrder(oc_number: string) {
    console.log(oc_number);
  }

  selectedOrder(order: IOpenedBuyOrder) {
    this.selectedOC = order.cod;
  }
}
