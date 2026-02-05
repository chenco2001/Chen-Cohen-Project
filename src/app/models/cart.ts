import { Product } from './product.model';
import { User } from '../services/users.service';

export class CartProduct {
  constructor(
    public product: Product,
    public qty: number = 1
  ) {}
}

export class Cart {
  constructor(
    public user: User | null = null,
    public items: CartProduct[] = [],
    public paid: boolean = false,
    public total: number = 0
  ) {}
}