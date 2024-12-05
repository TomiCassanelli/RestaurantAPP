import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { OrdersComponent } from './orders.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { OrderService } from '../orders/order/order.service';
import { of } from 'rxjs';

describe('OrdersComponent', () => {
  let component: OrdersComponent;
  let fixture: ComponentFixture<OrdersComponent>;
  let toastrService: jasmine.SpyObj<ToastrService>;
  let router: jasmine.SpyObj<Router>;
  let orderService: jasmine.SpyObj<OrderService>;

  const mockOrderList = [
    {
      OrderID: 1,
      OrderNo: '000001',
      CustomerID: 1,
      PMethod: 'Cash',
      GTotal: 150.00,
      OrderItems: [
        { OrderItemID: 1, OrderID: 1, ItemID: 101, Quantity: 2 },
        { OrderItemID: 2, OrderID: 1, ItemID: 102, Quantity: 1 }
      ],
    },
    {
      OrderID: 2,
      OrderNo: 'ORD123457',
      CustomerID: 20,
      PMethod: 'Credit Card',
      GTotal: 200.00,
      OrderItems: [
        { OrderItemID: 3, OrderID: 2, ItemID: 103, Quantity: 3 },
        { OrderItemID: 4, OrderID: 2, ItemID: 104, Quantity: 2 }
      ],
    },
    {
      OrderID: 3,
      OrderNo: 'ORD123458',
      CustomerID: 30,
      PMethod: 'Cash',
      GTotal: 120.00,
      OrderItems: [
        { OrderItemID: 5, OrderID: 3, ItemID: 105, Quantity: 1 },
        { OrderItemID: 6, OrderID: 3, ItemID: 106, Quantity: 1 }
      ],
    }
  ];
  

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['success']);
    const orderServiceSpy = jasmine.createSpyObj('OrderService', ['getOrderList', 'deleteOrder']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, OrdersComponent],
      providers: [
        { provide: ToastrService, useValue: toastrSpy },
        { provide: Router, useValue: routerSpy },
        { provide: OrderService, useValue: orderServiceSpy },
      ],
    });

    fixture = TestBed.createComponent(OrdersComponent);
    component = fixture.componentInstance;
    toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    orderService = TestBed.inject(OrderService) as jasmine.SpyObj<OrderService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load order list on init', fakeAsync(() => {
    // Falla si las listas son distintas, o sea, si getOrderList no se resuelve
    orderService.getOrderList.and.returnValue(Promise.resolve(mockOrderList));
    component.ngOnInit();
    tick();
    expect(component.orderList).toEqual(mockOrderList);
  }));

  it('should navigate to /order/id when touched an order', () => {
    // Falla si orderID es distinto del que se espera, o sea, se "dirige" a otro lado
    const orderID = 1;
    component.openForEdit(orderID);
    expect(router.navigate).toHaveBeenCalledWith(['/order/edit/1']);
  });

  it('should show success if delete is confirmed', fakeAsync(() => {
    // Falla si el servicio no se llama, .not. anes de toHaveBeenCalledWith
    const orderID = 1;
    orderService.getOrderList.and.returnValue(Promise.resolve(mockOrderList));
    orderService.deleteOrder.and.returnValue(Promise.resolve({}));

    component.onOrderDelete(orderID);
    tick();

    expect(orderService.deleteOrder).toHaveBeenCalledWith(orderID);
    expect(toastrService.success).toHaveBeenCalledWith('Deleted Successfully', 'Restaurent App.');
  }));

});
