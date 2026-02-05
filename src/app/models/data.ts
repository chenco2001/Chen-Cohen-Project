import { Product } from './product.model';

export const PRODUCTS: Product[] = [

  // ===== Apple =====
  new Product(1, 'apple', 'iPhone 17 Pro', 1199, 'assets/catalog/iphone17.jpg', 'phone',
    'Pro performance with advanced camera system.', 4.8),

  new Product(2, 'apple', 'iPhone 16', 999, 'assets/catalog/iphone16.jpg', 'phone',
    'Powerful A-series chip with stunning display.', 4.6),

  new Product(3, 'apple', 'MacBook Pro 14"', 1999, 'assets/catalog/macbook-pro.jpg', 'laptop',
    'Extreme performance for professionals.', 4.9),

  new Product(4, 'apple', 'MacBook Air M3', 1299, 'assets/catalog/macbook-air.jpg', 'laptop',
    'Lightweight design with all-day battery life.', 5),

  new Product(5, 'apple', 'iPad Pro', 1099, 'assets/catalog/ipad-pro.jpg', 'tablet',
    'The ultimate iPad experience with M-series power.', 4.8),

  new Product(6, 'apple', 'Apple Watch Series 9', 399, 'assets/catalog/apple-watch.jpg', 'watch',
    'Advanced health insights and fitness tracking.', 3.6),

  new Product(7, 'apple', 'AirPods Pro (2nd Gen)', 249, 'assets/catalog/airpods-pro.jpg', 'headphones',
    'Active Noise Cancellation with immersive sound.', 4.7),

  new Product(8, 'apple', 'AirTag', 29, 'assets/catalog/airtag.jpg', 'accessory',
    'Keep track of your belongings with ease.', 4.5),

  new Product(9, 'apple', 'MagSafe Charger', 39, 'assets/catalog/magsafe.jpg', 'accessory',
    'Fast wireless charging with magnetic alignment.', 4.4),

  new Product(10, 'apple', 'USB-C to USB-C Cable', 19, 'assets/catalog/usb-c-cable.jpg', 'accessory',
    'Durable cable for fast charging and data transfer.', 4.2),

  // ===== Sony =====
  new Product(21, 'sony', 'PlayStation 5', 499, 'assets/catalog/ps5.jpg', 'console',
    'Next-gen gaming with ultra-fast SSD.', 4.9),

  new Product(22, 'sony', 'DualSense Controller', 69, 'assets/catalog/dualsense.jpg', 'accessory',
    'Haptic feedback for immersive gameplay.', 4.8),

  new Product(23, 'sony', 'PS Vita', 299, 'assets/catalog/psvita.jpg', 'console',
    'Portable gaming with console-quality experience.', 4.4),

  // ===== Beats by Dr. Dre =====
  new Product(31, 'beats', 'Beats Studio Pro', 349, 'assets/catalog/beats-studio-pro.jpg', 'headphones',
    'Premium over-ear headphones with powerful sound.', 4.6),

  new Product(32, 'beats', 'Beats Solo 4', 199, 'assets/catalog/beats-solo4.jpg', 'headphones',
    'On-ear design with bold, dynamic audio.', 4.4),

  new Product(33, 'beats', 'Beats Fit Pro', 249, 'assets/catalog/beats-fit-pro.jpg', 'headphones',
    'Secure fit earbuds built for active lifestyle.', 4.5),

  // ===== Samsung =====
  new Product(41, 'samsung', 'Galaxy S24 Ultra', 1299, 'assets/catalog/galaxy-s24.jpg', 'phone',
    'Flagship Android phone with pro-grade camera.', 4.7),

  new Product(42, 'samsung', 'Galaxy Buds 2 Pro', 229, 'assets/catalog/galaxy-buds2.jpg', 'headphones',
    'High-fidelity sound with intelligent ANC.', 4.5),

  // ===== Microsoft =====
  new Product(51, 'microsoft', 'Xbox Series X', 499, 'assets/catalog/xbox-series-x.jpg', 'console',
    'Most powerful Xbox ever built.', 4.8),

  new Product(52, 'microsoft', 'Surface Laptop 5', 1099, 'assets/catalog/surface-laptop.jpg', 'laptop',
    'Elegant design with premium performance.', 4.4),

  // ===== Google (NEW) =====
  new Product(61, 'google', 'Pixel 9 Pro', 1099, 'assets/catalog/pixel-9-pro.jpg', 'phone',
    'Pure Android experience with advanced AI camera features.', 4.6),

  new Product(62, 'google', 'Pixel Buds Pro 2', 249, 'assets/catalog/pixel-buds-pro-2.jpg', 'headphones',
    'Premium earbuds with smart noise cancellation and Google Assistant.', 4.4),

  // ===== Apple (NEW) =====
  new Product(63, 'apple', 'Apple TV 4K (3rd Gen)', 179, 'assets/catalog/apple-tv-4k.jpg', 'accessory',
    'High-performance streaming box with A-series chip for smooth 4K playback.', 4.7),

  // ===== Microsoft (NEW) =====
  new Product(64, 'microsoft', 'Surface Pro 10', 1299, 'assets/catalog/surface-pro-10.jpg', 'tablet',
    'Versatile 2-in-1 device for productivity and creativity.', 4.5),

  // ===== Meta (NEW) — Ray-Ban Meta Smart Glasses =====
  new Product(65, 'meta', 'Ray-Ban Meta Smart Glasses', 299, 'assets/catalog/rayban-meta.jpg', 'accessory',
    'Smart glasses with built-in camera, speakers, and hands-free features.', 4.3),
];