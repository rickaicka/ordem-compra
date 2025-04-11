import {IOpenedBuyOrder} from "../interfaces/order-opened.interface";

export class OpenedBuyOrder implements IOpenedBuyOrder {
  buy_order_value: any;
  cod: any;
  description: any;
  dt_delivery: any;
  dt_solicitation: any;
  pc_number: any;
  supplier: any;
  status: any;

  constructor(data: IOpenedBuyOrder) {
    Object.assign(this, data);
  }

}
