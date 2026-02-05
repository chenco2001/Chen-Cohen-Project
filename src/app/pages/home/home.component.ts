import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { PRODUCTS } from '../../models/data';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  products: Product[] = PRODUCTS;
  topPicks: Product[] = [];

  constructor(
    public cartService: CartService,
    private router: Router   
  ) {}

  ngOnInit(): void {
    this.topPicks = this.getRandomProducts(this.products, 3);
  }

  add(p: Product): void {
    this.cartService.addToCart(p);
  }

  view(p: Product): void {
    this.router.navigate(['/product', p.id]);
  }

  // ⭐ helpers
  starParts(rating: number) {
    const r = Math.max(0, Math.min(5, Number(rating) || 0));
    const full = Math.floor(r);
    const half = (r - full) >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);
    return { full, half, empty };
  }

  range(n: number): number[] {
    return Array.from({ length: Math.max(0, n) }, (_, i) => i);
  }

  private getRandomProducts(arr: Product[], count: number): Product[] {
    return [...arr].sort(() => Math.random() - 0.5).slice(0, count);
  }
}