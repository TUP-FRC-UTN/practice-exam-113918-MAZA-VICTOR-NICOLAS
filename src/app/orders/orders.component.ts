import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Order } from '../models/order';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {


  orders: Order[] = [];
  allOrders: Order[] = [];
  search: string = '';

  constructor(private productservice: ProductService) { }

  ngOnInit(): void {
    this.productservice.getAllOrders().subscribe(
      (next) => {
        this.orders = next
        this.allOrders = next;
      },
      (error) => {
        console.log(error)
      }
    )

  }

  filterTable(event: Event) {
    const target = event.target as HTMLInputElement;
    const filterValue = target.value?.toLowerCase() || '';
    this.orders = this.allOrders.filter(order =>
      order.customerName.toLowerCase().includes(filterValue) ||
      order.email.toLowerCase().includes(filterValue)
    );
  }
}
