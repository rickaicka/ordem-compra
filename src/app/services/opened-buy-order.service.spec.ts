import { TestBed } from '@angular/core/testing';

import { OpenedBuyOrderService } from './opened-buy-order.service';

describe('OpenedBuyOrderService', () => {
  let service: OpenedBuyOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenedBuyOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
