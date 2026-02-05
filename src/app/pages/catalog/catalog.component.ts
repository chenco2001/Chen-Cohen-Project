import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Product, Brand, Category } from '../../models/product.model';
import { PRODUCTS } from '../../models/data';

export type BrandFilter = Brand | 'all';
export type CategoryFilter = Category | 'all';

@Component({
  selector: 'app-catalog',
  standalone: false,
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css'],
})
export class CatalogComponent implements OnInit {
  selectedBrand: BrandFilter = 'all';
  selectedCategory: CategoryFilter = 'all';

  products: Product[] = PRODUCTS;
  filteredProducts: Product[] = [];

  filterLabel = 'All products';

  constructor(public cartService: CartService) {}

  ngOnInit(): void {
    this.applyFilter();
  }

  add(p: Product): void {
    this.cartService.addToCart(p);
  }

  selectBrand(brand: BrandFilter): void {
    this.selectedBrand = brand;
    this.applyFilter();
  }

  selectCategory(category: CategoryFilter): void {
    this.selectedCategory = category;
    this.applyFilter();
  }


  addToCart(p: Product): void {
    this.cartService.addToCart(p); 
 }

  private applyFilter(): void {
    this.filteredProducts = this.products.filter(
      (p) =>
        (this.selectedBrand === 'all' || p.brand === this.selectedBrand) &&
        (this.selectedCategory === 'all' || p.category === this.selectedCategory)
    );

    this.updateFilterLabel();
  }

  private updateFilterLabel(): void {
    const brand =
      this.selectedBrand === 'all' ? '' : this.capitalize(this.selectedBrand);

    const category =
      this.selectedCategory === 'all' ? '' : this.capitalize(this.selectedCategory);

    if (!brand && !category) {
      this.filterLabel = 'All products';
    } else if (brand && !category) {
      this.filterLabel = `${brand} products`;
    } else if (!brand && category) {
      this.filterLabel = `All ${category}`;
    } else {
      this.filterLabel = `${brand} · ${category}`;
    }
  }

  private capitalize(value: string): string {
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}