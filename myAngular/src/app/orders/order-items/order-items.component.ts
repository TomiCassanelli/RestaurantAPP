import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { emptyOrderItem, OrderItem } from './order-item.model';
import { ItemService } from '../../items/item.service';
import { emptyItem, Item } from '../../items/item.model';
import { NgForm } from '@angular/forms';
import { OrderService } from '../order/order.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr'; // Importar ToastrService

@Component({
  selector: 'app-order-items',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule],
  templateUrl: './order-items.component.html',
})
export class OrderItemsComponent implements OnInit, OnDestroy {
  formData: OrderItem;
  itemList: Item[];
  selectedItem: Item = emptyItem;
  isValid: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<OrderItemsComponent>,
    private itemService: ItemService,
    private orderSevice: OrderService,
    private toastr: ToastrService // Inyectar ToastrService
  ) {}

  ngOnInit() {
    this.itemService.getItemList().subscribe((res) => {
      this.itemList = res as Item[];
      if (this.data.orderItemIndex == null) {
        this.formData = { ...emptyOrderItem };
      } else {
        const orderItem = this.orderSevice.orderItems[this.data.orderItemIndex];
        this.formData = { ...orderItem };
        this.selectedItem = this.itemList.find(
          (x) => x.ItemID === orderItem.ItemID
        );
      }
    });
  }

  ngOnDestroy() {
    this.selectedItem = emptyItem;
  }

  onItemSelected(ctrl) {
    if (ctrl.selectedIndex == 0) {
      this.selectedItem = null;
    } else {
      this.selectedItem = this.itemList[ctrl.selectedIndex - 1];
    }
  }

  onSubmit(form: NgForm) {
    if (this.validateForm(form.value)) {
      const orderItem: OrderItem = {
        OrderID: form.value.OrderID,
        OrderItemID: form.value.OrderItemID,
        Quantity: form.value.Quantity,
        ItemID: this.selectedItem.ItemID,
      };
      if (this.data.orderItemIndex == null) {
        this.orderSevice.orderItems.push(orderItem);
        this.orderSevice.selectedItems.push(this.selectedItem);
      } else {
        this.orderSevice.orderItems[this.data.orderItemIndex] = orderItem;
        this.orderSevice.selectedItems[this.data.orderItemIndex] =
          this.selectedItem;
      }
      this.dialogRef.close();
      this.toastr.success('Order item saved successfully!', 'Success');
    } else {
      if (this.formData.ItemID === 0) {
        this.toastr.warning('Please select an item.', 'Warning');
      }
      if (this.formData.Quantity === 0) {
        this.toastr.warning('Please enter a valid quantity.', 'Warning');
      }
    }
  }

  validateForm(formData: OrderItem) {
    this.isValid = true;
    if (formData.ItemID == 0) this.isValid = false;
    if (formData.Quantity == 0) this.isValid = false;
    return this.isValid;
  }

  get totalPrice() {
    return this.selectedItem
      ? this.selectedItem.Price * this.formData.Quantity
      : 0;
  }
}
