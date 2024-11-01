import { Routes } from '@angular/router';
import { CreateOrderComponent } from './create-order/create-order.component';
import { OrdersComponent } from './orders/orders.component';

export const routes: Routes = [
    {
        path: 'orders', component: OrdersComponent
    },
    {
        path: 'create-order', component: CreateOrderComponent
    },
    {
        path: '**', component: CreateOrderComponent
    }
];
