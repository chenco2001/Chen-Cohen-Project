import { TestBed } from '@angular/core/testing';

import { ProductsTsService } from './products.ts.service';

describe('ProductsTsService', () => {
  let service: ProductsTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductsTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
