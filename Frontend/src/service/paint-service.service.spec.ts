import { TestBed } from '@angular/core/testing';

import { PaintServiceService } from './paint-service.service';

describe('PaintServiceService', () => {
  let service: PaintServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaintServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
