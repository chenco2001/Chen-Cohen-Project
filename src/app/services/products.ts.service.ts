import { Injectable } from '@angular/core';

export type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
};

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private products: Product[] = [
    { id: 1, name: 'iPhone 16 Pro', price: 4999, image: 'assets/iphone16pro.png' },
    { id: 2, name: 'iPhone 16', price: 3999, image: 'assets/iphone16.png' },
    { id: 3, name: 'AirPods Pro', price: 999, image: 'assets/airpodspro.png' },
    { id: 4, name: 'MagSafe Charger', price: 199, image: 'assets/magsafe.png' },
    { id: 5, name: 'USB-C Cable', price: 79, image: 'assets/cable.png' },
  ];

  getProducts(): Product[] {
    return this.products;
  }

  getTopPicks(count: number = 3): Product[] {
    return this.products.slice(0, count);
  }
}