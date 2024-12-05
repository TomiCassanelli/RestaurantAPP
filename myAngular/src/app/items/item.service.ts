import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';  // Importa Observable
import { environment } from '../../environments/environment';
import { Item } from './item.model';  // Asegúrate de importar el modelo Item

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  constructor(private http: HttpClient) { }

  // Cambiamos la promesa por un Observable
  getItemList(): Observable<Item[]> {  // Usamos Observable<Item[]>
    return this.http.get<Item[]>(`${environment.apiURL}/Item`);
  }
}
