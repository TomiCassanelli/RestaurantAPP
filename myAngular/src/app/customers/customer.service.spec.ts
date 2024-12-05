import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CustomerService } from './customer.service';
import { environment } from '../../environments/environment';

describe('CustomerService', () => {
  let service: CustomerService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CustomerService]
    });

    service = TestBed.inject(CustomerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve the customer list', () => {
    const dummyCustomers = [
      { CustomerID: 1, Name: 'John Doe' },
      { CustomerID: 2, Name: 'Jane Smith' }
    ];

    service.getCustomerList().subscribe(customers => {
      expect(customers.length).toBe(2);  // Verifica que haya dos clientes
      expect(customers[0].Name).toBe('John Doe');
      expect(customers[1].Name).toBe('Jane Smith');
    });

    // Aquí simulamos la respuesta HTTP con los datos mockeados
    const req = httpMock.expectOne(`${environment.apiURL}/Customer`);
    
    // Verifica que la solicitud fue a la URL correcta
    expect(req.request.method).toBe('GET');

    // Simulamos la respuesta del servidor
    req.flush(dummyCustomers);
  });
});
