import { CustomerService } from "../../customers/customer.service";
import { OrderService } from "./order.service";
import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { OrderItemsComponent } from "../order-items/order-items.component";
import { Customer } from "../../customers/customer.model";
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from "@angular/router";
import { Item } from "../../items/item.model";
import { FormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';

@Component({
  selector: "app-order",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./order.component.html",
})
export class OrderComponent implements OnInit {
  customerList: Customer[];
  isValid: boolean = true;

  constructor(
    public service: OrderService,
    private dialog: MatDialog,
    private customerService: CustomerService,
    private toastr: ToastrService,
    private router: Router,
    private currentRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    const orderID = this.currentRoute.snapshot.paramMap.get("id");
    if (orderID == null) {
      this.resetForm();
    } else {
      this.service.getOrderByID(parseInt(orderID)).then((res) => {
        this.service.formData = res.order;
        this.service.orderItems = res.orderDetails.map((x) => ({
          OrderItemID: x.OrderItemID,
          OrderID: x.OrderID,
          ItemID: x.ItemID,
          Quantity: x.Quantity,
        }));
        this.service.selectedItems = res.orderDetails.map((x) => ({
          ItemID: x.ItemID,
          Name: x.ItemName,
          Price: x.Price,
        }));
      });

    }
    this.customerService
      .getCustomerList()
      .subscribe((res) => (this.customerList = res as Customer[]));
  }
  
  ngOnDestroy() {
    this.service.selectedItems = [];
    this.service.orderItems = [];
  }

  resetForm(form?: NgForm) {
    if (form != null) {
      form.resetForm();
    }
    this.service.formData = {
      OrderID: 0,
      OrderNo: Math.floor(100000 + Math.random() * 900000).toString(),
      CustomerID: 0,
      PMethod: "",
      GTotal: 0,
      OrderItems: [],
    };
    this.service.orderItems = [];
  }

  AddOrEditOrderItem(orderItemIndex: number, OrderID: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = "50%";
    dialogConfig.data = { orderItemIndex, OrderID };
    this.dialog
      .open(OrderItemsComponent, dialogConfig)
      .afterClosed()
      .subscribe((res) => {
        this.updateGrandTotal();
      });
  }

  onDeleteOrderItem(orderItemID: number, i: number) {
    const deletedItem = this.service.orderItems.splice(i, 1)[0];
  
    this.service.selectedItems = this.service.selectedItems.filter(
      (item) => item.ItemID !== deletedItem.ItemID
    );
  
    this.updateGrandTotal();

    this.toastr.success('Item removed successfully', 'Restaurent App');
  }
    
  updateGrandTotal() {
    const GTotal = this.service.orderItems.reduce((prev, curr) => {
      const selectedItem = this.service.selectedItems.find(
        (x) => x.ItemID === curr.ItemID
      );
      return prev + curr.Quantity * selectedItem.Price;
    }, 0);
    this.service.formData.GTotal = parseFloat(GTotal.toFixed(2));
  }

  getItemQuantity(item: Item) {
    const orderItem = this.service.orderItems.find(
      (x) => x.ItemID === item.ItemID
    );
    if (orderItem) {
      return orderItem.Quantity;
    }
    return 0;
  }
  
  getItemTotal(item: Item) {
    const quantity = this.getItemQuantity(item);
    return item.Price * (quantity as number);
  }

  validateForm() {
    this.isValid = true;
  
    // Verificar si el cliente está seleccionado
    if (this.service.formData.CustomerID === 0) {
      this.isValid = false;
      this.toastr.warning('Please select a customer.', 'Restaurent App.');
    }
  
    // Verificar si el tipo de pago está seleccionado
    if (!this.service.formData.PMethod) {
      this.isValid = false;
      this.toastr.warning('Please select a payment method.', 'Restaurent App.');
    }
  
    // Verificar si hay items en el pedido
    if (this.service.orderItems.length === 0) {
      this.isValid = false;
      this.toastr.warning('Please add at least one item to the order.', 'Restaurent App.');
    }

    return this.isValid;
  }

  onSubmit(form: NgForm) {
    if (this.validateForm()) {
      this.service.saveOrUpdateOrder().subscribe((res) => {
        this.resetForm();
        this.toastr.success("Submitted Successfully", "Restaurent App.");
        this.router.navigate(["/orders"]);
      });
    }
  }
}
