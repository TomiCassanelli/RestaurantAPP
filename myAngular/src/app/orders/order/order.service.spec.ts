import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OrderService } from './order.service';
import { environment } from '../../../environments/environment';
import { Order } from './order.model';
import { OrderItem } from '../order-items/order-item.model';
import { Item } from '../../items/item.model';

describe('OrderService', () => {
  let service: OrderService;
  let httpMock: HttpTestingController;

  // Mock global de la orden
  const mockOrder: Order = {
    OrderID: 1,
    OrderNo: '123456',
    CustomerID: 1,
    PMethod: 'Cash',
    GTotal: 100,
    OrderItems: []
  };
  
  const mockOrderItems: OrderItem[] = [
    { OrderItemID: 1, OrderID: 0, ItemID: 1, Quantity: 2 }
  ];
  
  const mockSelectedItems: Item[] = [
    { ItemID: 1, Name: 'Pizza', Price: 50 },
    { ItemID: 2, Name: 'Pasta', Price: 30 }
  ];

  // Configuración inicial
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],  // Importar el módulo de pruebas HTTP
      providers: [OrderService]  // Proveer el servicio que estamos testeando
    });
    service = TestBed.inject(OrderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();  // Asegura que no queden solicitudes pendientes
  });

  it('should send a POST order and return success', () => {
    const body = {
      ...mockOrder,
      OrderItems: mockOrderItems
    };
  
    service.saveOrUpdateOrder().subscribe((response) => {
      expect(response).toEqual({ success: true }); 
    });
  
    const req = httpMock.expectOne(`${environment.apiURL}/Order`);
    expect(req.request.method).toBe('POST');  // Verifica que sea un POST
    req.flush({ success: true });
  });
  

  it('should GET order list and return success', () => {
    service.getOrderList().then((orders) => {
      expect(orders).toEqual(mockOrder);  // Compara la respuesta con el mock
    });
  
    const req = httpMock.expectOne(`${environment.apiURL}/Order`);
    expect(req.request.method).toBe('GET');  // Verifica que sea una solicitud GET
    req.flush(mockOrder);
  });

  it('should GET order by ID and return success', () => {
    const orderId = 1;
  
    service.getOrderByID(orderId).then((order) => {
      expect(order).toEqual(mockOrder);
    });
  
    const req = httpMock.expectOne(`${environment.apiURL}/Order/${orderId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockOrder);
  });
  
  it('should DELETE an order by ID and return success', () => {
    const orderId = 1;
  
    service.deleteOrder(orderId).then((response) => {
      expect(response).toEqual({ success: true });
    });
  
    const req = httpMock.expectOne(`${environment.apiURL}/Order/${orderId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ success: true });
  });

});
