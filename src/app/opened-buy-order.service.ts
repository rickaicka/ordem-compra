import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subject} from "rxjs";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class OpenedBuyOrderService {
  subjectIsNative = new Subject<boolean>();
  env = environment

  constructor(private httpClient: HttpClient) { }

  getOpenedBuyOrders() {
    return this.httpClient.get(`${this.env.API_URL}/opened-buy-order`);
  }
}
