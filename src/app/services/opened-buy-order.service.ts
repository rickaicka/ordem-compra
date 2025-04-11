import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from "rxjs";
import {environment} from "../../environments/environment";
import {ApiResponse} from "../interfaces/api-response.interface";
import {IOpenedBuyOrder} from "../interfaces/order-opened.interface";

@Injectable({
  providedIn: 'root'
})
export class OpenedBuyOrderService {
  subjectIsNative = new Subject<boolean>();
  env = environment

  constructor(private httpClient: HttpClient) { }

  getOpenedBuyOrders(): Observable<ApiResponse<IOpenedBuyOrder[]>> {
    return this.httpClient.get<ApiResponse<IOpenedBuyOrder[]>>(`${this.env.API_URL}/opened-buy-order`);
  }
}
