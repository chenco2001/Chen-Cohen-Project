import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartProduct } from '../../models/cart';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent {
  qtyOptions = Array.from({ length: 10 }, (_, i) => i + 1);

  constructor(
    public cartService: CartService,
    private router: Router
  ) {}

  get isLoggedIn(): boolean {
    return !!this.cartService.getUser();
  }

  goToLogin(): void {
    this.router.navigate(['/profile/login']);
  }

  plus(item: CartProduct): void {
    this.cartService.increase(item.product.id);
  }

  minus(item: CartProduct): void {
    this.cartService.decrease(item.product.id);
  }

  remove(item: CartProduct): void {
    this.cartService.removeFromCart(item.product.id);
  }

  setQty(item: CartProduct, qty: string | number): void {
    const target = Number(qty);
    if (!Number.isFinite(target) || target < 1) return;
    this.cartService.setQty(item.product.id, target);
  }

  clearCart(): void {
    this.cartService.clear();
  }

  pay(): void {
    if (!this.isLoggedIn) {
      this.goToLogin();
      return;
    }
    this.cartService.pay();
  }

  lineTotal(item: CartProduct): number {
    return (Number(item.product.price) || 0) * (Number(item.qty) || 0);
  }
}