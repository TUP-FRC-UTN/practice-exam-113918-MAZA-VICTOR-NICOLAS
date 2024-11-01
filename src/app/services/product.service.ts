import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/products';
import { Observable } from 'rxjs';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { 
  }

  apiurl:string = 'http://localhost:3000/products';


  getAllproducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiurl)
  }
  getByMail(value: string): Observable<Order[]> {
    return this.http.get<Order[]>(`http://localhost:3000/orders?email=${value}`)
  }

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(`http://localhost:3000/orders`, order);
  }

  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`http://localhost:3000/orders`)
  }
}
