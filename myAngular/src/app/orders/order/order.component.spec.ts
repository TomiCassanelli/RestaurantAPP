import { TestBed, ComponentFixture, fakeAsync } from '@angular/core/testing';
import { OrderComponent } from './order.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { OrderService } from './order.service';

describe('OrderComponent', () => {
  let component: OrderComponent;
  let fixture: ComponentFixture<OrderComponent>;
  let toastrService: jasmine.SpyObj<ToastrService>;
  let router: jasmine.SpyObj<Router>;
  let orderService: jasmine.SpyObj<OrderService>;

  // Plantilla de datos base para 'formData'
  const baseOrderData = {
    OrderID: 0,
    OrderNo: '123456',
    CustomerID: 0,
    PMethod: '',
    GTotal: 0,
    OrderItems: [],
  };

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', [ 'error', 'warning', 'success', ]);

    const orderServiceSpy = jasmine.createSpyObj('OrderService', ['saveOrUpdateOrder', ]);

    const activatedRouteMock = {
        snapshot: { paramMap: { get: jasmine.createSpy('get').and.returnValue(null) } }
      };

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, OrderComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock }, // Usamos el mock de ActivatedRoute
        { provide: ToastrService, useValue: toastrSpy },
        { provide: Router, useValue: routerSpy },
        { provide: OrderService, useValue: orderServiceSpy },
      ],
    });

    fixture = TestBed.createComponent(OrderComponent);
    component = fixture.componentInstance;
    toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    orderService = TestBed.inject(OrderService) as jasmine.SpyObj<OrderService>;
    
    // Establecer los datos base para formData antes de cada prueba
    component.service.formData = { ...baseOrderData };
    component.service.orderItems = [];
    component.service.selectedItems = [];
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should not have any items when opening the new component', () => {
    // Falla si todos tienen datos validos
    component.ngOnInit();

    expect(component.service.selectedItems.length).toBe(0);
    expect(component.service.orderItems.length).toBe(0);
    expect(component.service.formData.CustomerID).toBe(0);
    expect(component.service.formData.PMethod).toBe('');
    expect(component.service.formData.GTotal).toBe(0);

  });

  it('should show warning if customer is not selected', () => {
    // Falla si este componente tiene un ID > 0
    component.service.formData.CustomerID = 0;
    component.onSubmit({ valid: true } as any);
    expect(toastrService.warning).toHaveBeenCalledWith('Please select a customer.', 'Restaurent App.' );
  });

  it('should show warning if payment method is missing', () => {
    // Falla si este componente está lleno
    component.service.formData.PMethod = '';
    component.onSubmit({ valid: true } as any);
    expect(toastrService.warning).toHaveBeenCalledWith('Please select a payment method.','Restaurent App.');
  });

  it('should show warning if items is missing', () => {
    // Falla si este componente está lleno
    component.service.orderItems = [];
    component.onSubmit({ valid: true } as any);
    expect(toastrService.warning).toHaveBeenCalledWith('Please add at least one item to the order.','Restaurent App.');
  });

  it('should display total = 0 if no items are in the order', () => {
    // Falla si el total es distinto de cero
    component.updateGrandTotal();
    expect(component.service.formData.GTotal).toBe(0);
  });

  it('should update total after adding an item', () => {
    // Falla si no coincide cantidad*precio
    component.service.orderItems = [{ OrderItemID: 1, OrderID: 0, ItemID: 1, Quantity: 2 }];
    component.service.selectedItems = [{ ItemID: 1, Name: 'Item1', Price: 50 }];
    component.updateGrandTotal();

    expect(component.service.formData.GTotal).toBe(100.0);
  });

  it('should update total and show success after deleting an item', () => {
    // Falla si no coincide cantidad*precio
    component.service.orderItems = [{ OrderItemID: 1, OrderID: 0, ItemID: 1, Quantity: 2 }];
    component.service.selectedItems = [{ ItemID: 1, Name: 'Item1', Price: 50 }];
    component.onDeleteOrderItem(1, 0);
    component.updateGrandTotal();

    expect(component.service.formData.GTotal).toBe(0);
    expect(toastrService.success).toHaveBeenCalledWith('Item removed successfully', 'Restaurent App');
  });

  it('should generate a valid order number', () => {
    // Falla si matcheo con otro numero
    component.resetForm();
    expect(component.service.formData.OrderNo).toMatch(/^\d{6}$/); // Verificar que sea un número de 6 dígitos
  });

  it('should show success if form is ok', fakeAsync(() => {
    // Falla si este componente queda vacio
    const oi = [{ OrderItemID: 1, OrderID: 0, ItemID: 1, Quantity: 2 }];
    component.service.orderItems = oi;
    
    component.service.formData = {
      OrderID: 0,
      OrderNo: '123456',
      CustomerID: 1,
      PMethod: 'Cash',
      GTotal: 100,
      OrderItems: oi
    };

    orderService.saveOrUpdateOrder.and.returnValue(of({ success: true }));
    component.onSubmit({ valid: true } as any);

    expect(toastrService.success).toHaveBeenCalledWith('Submitted Successfully','Restaurent App.');
    expect(router.navigate).toHaveBeenCalledWith(['/orders']);
  }));


});
