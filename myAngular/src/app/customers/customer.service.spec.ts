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
    // Falla si el flush es empty o si se espera otros valores en el servicio
    const emptyCustomers = []
    const mockCustomers = [
      { CustomerID: 1, Name: 'John Doe' },
      { CustomerID: 2, Name: 'Jane Smith' }
    ];

    service.getCustomerList().subscribe(customers => {
      expect(customers.length).toBe(2);
      expect(customers[0].Name).toBe('John Doe');
      expect(customers[1].Name).toBe('Jane Smith');
    });

    const req = httpMock.expectOne(`${environment.apiURL}/Customer`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCustomers);
  });
});
