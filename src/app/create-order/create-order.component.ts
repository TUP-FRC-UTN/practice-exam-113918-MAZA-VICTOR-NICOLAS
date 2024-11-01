import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { catchError, map, min, Observable, of } from 'rxjs';
import { Product } from '../models/products';
import { ProductService } from '../services/product.service';
import { ValidatorMaximo } from '../validators/validarmaximo';
import { ProductoUnicoValidator } from '../validators/producto-unico.validator';
import { Order } from '../models/order';

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-order.component.html',
  styleUrl: './create-order.component.css'
})
export class CreateOrderComponent implements OnInit {

  constructor(private productservice: ProductService) { }

  products: Product[] = [];
  selectedProduct!: Product;

  productoseleccionado = new FormControl();
  formPedido: FormGroup = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email], [ this.moreThanThreeValidador()]),
    productos: new FormArray([], [
      ProductoUnicoValidator.validarProductosUnicos()
    ])
  })


  ngOnInit(): void {
    this.productservice.getAllproducts().subscribe(
      (next) => this.products = next,
      (error) => console.log(error)
    )
  }
  get productos() {

    return this.formPedido.controls['productos'] as FormArray;
  }

  agregarProductos() {
    this.selectedProduct = this.productoseleccionado.value
    console.log(this.selectedProduct)
    const producto = new FormGroup({
      name: new FormControl(this.selectedProduct.name, Validators.required),
      cantidad: new FormControl(1, [Validators.required, Validators.min(1), ValidatorMaximo.validarMaximo()]),
      price: new FormControl(this.selectedProduct.price),
      stock: new FormControl(this.selectedProduct.stock)
    })
    this.productos.push(producto)
  }

  eliminarProducto(id: number) {
    this.productos.removeAt(id);
  }



  mailUnicoValidador(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      console.log('validador', control.value);
      return this.productservice.getByMail(control.value).pipe(
        map(data => {
          return data.length > 0 ? { mailexiste: true } : null;
        }),
        catchError(() => {
          alert("error en la api");
          return of({ apiCaida: true });
        })
      );
    };
  }
  moreThanThreeValidador(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.productservice.getByMail(control.value).pipe(
        map((orders: any[]) => {
          const now = new Date();
          const last24HoursOrders = orders.filter(order => {
            const orderDate = new Date(order.timestamp);
            const timeDifference = now.getTime() - orderDate.getTime();
            return timeDifference <= 24 * 60 * 60 * 1000; // 24 horas en milisegundos
          });
          return last24HoursOrders.length > 3 ? { morethanthree: true } : null;
        }),
        catchError(() => {
          alert("Error en la API");
          return of({ apiCaida: true });
        })
      );
    };
  }










  sendForm() {
    if (this.formPedido.invalid) {
      console.log("Formulario inválido");
      return;
    }

    const order: Order = {
      id: '',
      customerName: this.formPedido.get('nombre')?.value,
      email: this.formPedido.get('email')?.value,
      products: this.productos.value,
      total: this.calcularTotal(),
      orderCode: this.generarCodigoOrden(),
      timestamp: new Date().toISOString()
    };
    this.productservice.createOrder(order).subscribe(
      response => {
        console.log('Pedido creado:', response);
        alert('Pedido creado exitosamente');
      },
      error => {
        console.error('Error al crear el pedido:', error);
        alert('Hubo un error al crear el pedido');
      }
    );
  }

  calcularTotal(): number {
    // Calculamos el total sin descuento
    let total = this.productos.controls.reduce((total, control) => {
      return total + (control.get('price')?.value * control.get('cantidad')?.value);
    }, 0);
  
    if (total > 1000) {
      total = total * 0.9; 
    }
  
    return total;
  }
  

  generarCodigoOrden(): string {
    const nombre = this.formPedido.get('nombre')?.value || '';
    const email = this.formPedido.get('email')?.value || '';
    const timestamp = Date.now(); 
  
    const primeraLetraNombre = nombre.charAt(0).toUpperCase();
  
    const ultimosCuatroEmail = email.slice(-4);
  
    const codigo = `${primeraLetraNombre}${ultimosCuatroEmail}${timestamp}`;
  
    return codigo;
  }
  

}
