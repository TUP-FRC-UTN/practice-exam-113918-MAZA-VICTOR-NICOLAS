import { Product } from "./products";

  
  export class Order {
    id: string;
    customerName: string;
    email: string;
    products: Product[];
    total: number;
    orderCode: string;
    timestamp: string;
  
    constructor(
      id: string,
      customerName: string,
      email: string,
      products: Product[],
      total: number,
      orderCode: string,
      timestamp: string
    ) {
      this.id = id;
      this.customerName = customerName;
      this.email = email;
      this.products = products;
      this.total = total;
      this.orderCode = orderCode;
      this.timestamp = timestamp;
    }
  }
  