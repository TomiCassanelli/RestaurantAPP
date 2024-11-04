export class OrderItem {
  OrderItemID: number;
  OrderID: number;
  ItemID: number;
  Quantity: number;
}

export const emptyOrderItem = {
  OrderID: 0,
  OrderItemID: 0,
  ItemID: 0,
  Quantity: 0,
};
