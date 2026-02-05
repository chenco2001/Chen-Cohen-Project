import { Injectable } from '@angular/core';
import { Cart, CartProduct } from '../models/cart';
import { Product } from '../models/product.model';
import { User } from './users.service';

type CartStorageShape = {
  user: User | null;
  paid: boolean;
  items: { product: Product; qty: number }[];
};

@Injectable({ providedIn: 'root' })
export class CartService {
  private storageKey = 'cart_v2';
  private cart: Cart = new Cart();

  constructor() {
    this.loadCart();
    this.recalcTotal();
  }

  /* Storage */

  private saveCart(): void {
    const data: CartStorageShape = {
      user: this.cart.user,
      paid: this.cart.paid,
      items: this.cart.items.map(i => ({ product: i.product, qty: i.qty })),
    };
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  private loadCart(): void {
    const raw = localStorage.getItem(this.storageKey);
    if (!raw) {
      this.cart = new Cart();
      return;
    }

    try {
      const parsed = JSON.parse(raw) as CartStorageShape;
      const items = (parsed.items || []).map(x => new CartProduct(x.product, x.qty));
      this.cart = new Cart(parsed.user ?? null, items, !!parsed.paid, 0);
    } catch {
      this.cart = new Cart();
    }
  }

  /* Helpers */

  private recalcTotal(): void {
    let sum = 0;
    for (const i of this.cart.items) {
      sum += (Number(i.product.price) || 0) * (Number(i.qty) || 0);
    }
    this.cart.total = sum;
  }

  private ensureActiveCart(): void {
    if (this.cart.paid) this.cart.paid = false;
  }

  /* Read API */

  getCart(): CartProduct[] {
    return this.cart.items;
  }

  total(): number {
    return this.cart.total;
  }

  getUser(): User | null {
    return this.cart.user;
  }

  /* User */

  updateUser(user: User | null): void {
    this.cart.user = user;
    this.saveCart();
  }

  /* Cart Actions */

  addToCart(product: Product): void {
    this.ensureActiveCart();

    const hit = this.cart.items.find(i => i.product.id === product.id);
    if (hit) hit.qty++;
    else this.cart.items.push(new CartProduct(product, 1));

    this.recalcTotal();
    this.saveCart();
  }

  removeFromCart(productOrId: Product | number): void {
    const id = typeof productOrId === 'number' ? productOrId : productOrId.id;

    this.cart.items = this.cart.items.filter(i => i.product.id !== id);
    this.recalcTotal();
    this.saveCart();
  }

  increase(productId: number): void {
    this.ensureActiveCart();

    const hit = this.cart.items.find(i => i.product.id === productId);
    if (!hit) return;

    hit.qty++;
    this.recalcTotal();
    this.saveCart();
  }

  decrease(productId: number): void {
    this.ensureActiveCart();

    const idx = this.cart.items.findIndex(i => i.product.id === productId);
    if (idx === -1) return;

    const item = this.cart.items[idx];
    if (item.qty > 1) item.qty--;
    else this.cart.items.splice(idx, 1);

    this.recalcTotal();
    this.saveCart();
  }

  setQty(productId: number, qty: number): void {
    this.ensureActiveCart();

    const hit = this.cart.items.find(i => i.product.id === productId);
    if (!hit) return;

    const q = Math.max(1, Math.floor(Number(qty) || 1));
    hit.qty = q;

    this.recalcTotal();
    this.saveCart();
  }

  /* Checkout */

  pay(): void {
    this.cart.paid = true;
    this.cart.items = [];
    this.recalcTotal();
    this.saveCart();
  }

  clear(): void {
    this.cart.items = [];
    this.cart.paid = false;
    this.recalcTotal();
    this.saveCart();
  }

  
}