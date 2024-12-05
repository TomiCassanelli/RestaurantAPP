import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ItemService } from './item.service';
import { environment } from '../../environments/environment';
import { Item } from './item.model';

describe('ItemService', () => {
  let service: ItemService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ItemService]
    });

    service = TestBed.inject(ItemService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();  // Verifica que no haya solicitudes HTTP pendientes
  });

  it('should retrieve the item list', () => {
    // Falla si el flush es otra lista, o si el servicio espera otros valores
    const emptyItems: Item[] = [];
    const mockItems: Item[] = [
      { ItemID: 1, Name: 'Item 1', Price: 100 },
      { ItemID: 2, Name: 'Item 2', Price: 200 }
    ];

    service.getItemList().subscribe(items => {
      expect(items.length).toBe(2);
      expect(items[0].Name).toBe('Item 1');
      expect(items[1].Price).toBe(200);
    });

    const req = httpMock.expectOne(`${environment.apiURL}/Item`);
    expect(req.request.method).toBe('GET');
    req.flush(mockItems);
  });
});
