import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from './order.model';
import { OrderItem } from '../order-items/order-item.model';
import { environment } from '../../../environments/environment';
import { Item } from '../../items/item.model';

@Injectable({
  providedIn: 'root'
})

export class OrderService {
  formData: Order;
  orderItems: OrderItem[];
  selectedItems: Item[] = [];

  constructor(private http: HttpClient) { }

  saveOrUpdateOrder() {
    var body = {
      ...this.formData,
      OrderItems: this.orderItems
    };
    return this.http.post(environment.apiURL + '/Order', body);
  }

  getOrderList() {
    return this.http.get(environment.apiURL + '/Order').toPromise();
  }

  getOrderByID(id:number):any {
    return this.http.get(environment.apiURL + '/Order/'+id).toPromise();
  }

  deleteOrder(id:number) {
    return this.http.delete(environment.apiURL + '/Order/'+id).toPromise();
  }

}
