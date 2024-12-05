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
    const dummyItems: Item[] = [
      { ItemID: 1, Name: 'Item 1', Price: 100 },
      { ItemID: 2, Name: 'Item 2', Price: 200 }
    ];

    // Usamos .subscribe() en lugar de .then()
    service.getItemList().subscribe(items => {
      expect(items.length).toBe(2);  // Verifica que el número de items es correcto
      expect(items[0].Name).toBe('Item 1');
      expect(items[1].Price).toBe(200);
    });

    // Simulamos la respuesta HTTP con datos mockeados
    const req = httpMock.expectOne(`${environment.apiURL}/Item`);
    
    // Verificamos que la solicitud fue un GET
    expect(req.request.method).toBe('GET');

    // Responderemos con los datos de prueba
    req.flush(dummyItems);
  });
});
