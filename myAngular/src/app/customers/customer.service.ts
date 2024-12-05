import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Customer } from './customer.model';  // Importamos el modelo de cliente
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http : HttpClient) { }

  getCustomerList(): Observable<Customer[]> {  // Usamos el tipo Customer[]
    return this.http.get<Customer[]>(`${environment.apiURL}/Customer`);
  }

}
