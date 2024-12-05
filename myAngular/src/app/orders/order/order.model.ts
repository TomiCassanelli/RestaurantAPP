import { OrderItem } from "../order-items/order-item.model";

export class Order {
  OrderID: number;
  OrderNo: string;
  CustomerID: number;
  PMethod: string;
  GTotal: number;
  OrderItems: OrderItem[];
}
