import { OrderItem } from "./order-item.model";

export class Order {
  OrderID: number;
  OrderNo: string;
  CustomerID: number;
  PMethod: string;
  GTotal: number;
  DeletedOrderItemIDs: string;
  OrderItems: OrderItem[];
}
