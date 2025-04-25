import { TestBed } from '@angular/core/testing';

import { ProgressCircleService } from './progress-circle.service';

describe('ProgressCircleService', () => {
  let service: ProgressCircleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgressCircleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
