import { Component, OnInit } from '@angular/core';
import { OrderService } from './order/order.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class OrdersComponent implements OnInit {
  orderList;

  constructor(
    private service: OrderService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.refreshList();
  }

  refreshList() {
    this.service.getOrderList().then((res) => (this.orderList = res));
  }

  openForEdit(orderID: number) {
    this.router.navigate(['/order/edit/' + orderID]);
  }

  onOrderDelete(id: number) {
    this.service.deleteOrder(id).then((res) => {
      this.refreshList();
      this.toastr.success('Deleted Successfully', 'Restaurent App.');
    });
  }
}
