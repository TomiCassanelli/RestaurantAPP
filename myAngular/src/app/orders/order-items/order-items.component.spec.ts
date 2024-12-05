import { TestBed, ComponentFixture } from '@angular/core/testing';
import { OrderItemsComponent } from './order-items.component';
import { FormsModule, NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from '../order/order.service';
import { ItemService } from '../../items/item.service';
import { of } from 'rxjs';
import { Item } from '../../items/item.model';
import { OrderItem } from './order-item.model';

describe('OrderItemsComponent', () => {
  let component: OrderItemsComponent;
  let fixture: ComponentFixture<OrderItemsComponent>;
  let toastrService: jasmine.SpyObj<ToastrService>;
  let orderService: jasmine.SpyObj<OrderService>;
  let itemService: jasmine.SpyObj<ItemService>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<OrderItemsComponent>>;

  const mockItems: Item[] = [
    { ItemID: 1, Name: 'Pizza', Price: 50 },
    { ItemID: 2, Name: 'Pasta', Price: 30 },
  ];

  const baseOrderItemData: OrderItem = {
    OrderID: 0,
    OrderItemID: 0,
    ItemID: 0,
    Quantity: 0,
  };

  beforeEach(() => {
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['error', 'warning', 'success']);
    const orderServiceSpy = jasmine.createSpyObj('OrderService', ['saveOrUpdateOrder'], {
      orderItems: [],
      selectedItems: [],
    });
    const itemServiceSpy = jasmine.createSpyObj('ItemService', ['getItemList']);
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    itemServiceSpy.getItemList.and.returnValue(of(mockItems));
    orderServiceSpy.saveOrUpdateOrder.and.returnValue(of({ success: true }));

    TestBed.configureTestingModule({
      imports: [FormsModule, OrderItemsComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: { orderItemIndex: null } },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: ToastrService, useValue: toastrSpy },
        { provide: OrderService, useValue: orderServiceSpy },
        { provide: ItemService, useValue: itemServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderItemsComponent);
    component = fixture.componentInstance;
    toastrService = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
    orderService = TestBed.inject(OrderService) as jasmine.SpyObj<OrderService>;
    itemService = TestBed.inject(ItemService) as jasmine.SpyObj<ItemService>;
    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<OrderItemsComponent>>;

    component.formData = { ...baseOrderItemData };
    component.itemList = mockItems;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize a new order', () => {
    // Falla si alguno es distinto de 0 o ''
    expect(component.formData.ItemID).toBe(0);
    expect(component.formData.Quantity).toBe(0);
    expect(component.selectedItem.Price).toBe(0);
    expect(component.selectedItem.Name).toBe('');
    expect(component.totalPrice).toBe(0);
  });

  it('should update totalPrice when selecting a quantity', () => {
    // Falla si el total no es lo esperado
    component.onItemSelected({ selectedIndex: 2 });
    component.formData.Quantity = 3;
    expect(component.totalPrice).toBe(90);
  });

  it('should submit the form when all fields are valid', () => {
    // Falla si Quantity o ItemID o ambas son = 0
    component.formData = {
      OrderID: 0,
      OrderItemID: 0,
      Quantity: 2,
      ItemID: 1,
    };

    const form: NgForm = { valid: true, value: component.formData } as any;

    component.onSubmit(form);
    expect(toastrService.success).toHaveBeenCalledWith('Order item saved successfully!', 'Restaurent App.');
  });

  it('should not submit the form when ItemID or Quantity is 0', () => {
    // Falla si Quantity o ItemID o ambas son > 0
    component.formData = {
      OrderID: 0,
      OrderItemID: 0,
      Quantity: 0,
      ItemID: 0,
    };

    const form: NgForm = { valid: true, value: component.formData } as any;

    component.onSubmit(form);
    expect(toastrService.warning).toHaveBeenCalledWith('Please select an item.', 'Restaurent App.');
    expect(toastrService.warning).toHaveBeenCalledWith('Please enter a valid quantity.', 'Restaurent App.');
  });
});
