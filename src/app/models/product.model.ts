export type Brand =
  | 'apple'
  | 'sony'
  | 'samsung'
  | 'microsoft'
  | 'google'
  | 'beats'
  | 'meta'; 

export type Category =
  | 'phone'
  | 'laptop'
  | 'tablet'
  | 'watch'
  | 'headphones'
  | 'accessory'
  | 'console';

export class Product {
  constructor(
    public id: number,
    public brand: Brand,
    public name: string,
    public price: number,
    public image: string,
    public category: Category,
    public summary: string,
    public rating: number
  ) {}
}//product.model.ts