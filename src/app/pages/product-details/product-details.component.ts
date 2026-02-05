import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../models/product.model';
import { PRODUCTS } from '../../models/data';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-details',
  standalone: false,
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public cartService: CartService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.product = Number.isFinite(id)
        ? (PRODUCTS.find(p => p.id === id) ?? null)
        : null;
    });
  }

  addToCart(): void {
    if (!this.product) return;
    this.cartService.addToCart(this.product);
  }

  backToCatalog(): void {
    this.router.navigate(['/catalog']);
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  prettyCategory(c: string): string {
    const map: Record<string, string> = {
      phone: 'Phone',
      laptop: 'Laptop',
      tablet: 'Tablet',
      watch: 'Watch',
      headphones: 'Headphones',
      console: 'Console',
      accessory: 'Accessory',
    };
    return map[c] ?? c;
  }
}