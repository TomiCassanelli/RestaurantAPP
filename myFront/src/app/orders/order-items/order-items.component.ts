import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { emptyOrderItem, OrderItem } from "src/app/shared/order-item.model";
import { ItemService } from "src/app/shared/item.service";
import { emptyItem, Item } from "src/app/shared/item.model";
import { NgForm } from "@angular/forms";
import { OrderService } from "src/app/shared/order.service";
import { OrderComponent } from "../order/order.component";

@Component({
  selector: "app-order-items",
  templateUrl: "./order-items.component.html",
  styles: [],
})
export class OrderItemsComponent implements OnInit {
  formData: OrderItem;
  itemList: Item[];
  selectedItem: Item = emptyItem;
  isValid: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<OrderItemsComponent>,
    private itemService: ItemService,
    private orderSevice: OrderService
  ) {}

  ngOnInit() {
    this.itemService.getItemList().then((res) => {
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
    }
  }

  validateForm(formData: OrderItem) {
    this.isValid = true;
    if (formData.ItemID == 0) this.isValid = false;
    else if (formData.Quantity == 0) this.isValid = false;
    return this.isValid;
  }
}
