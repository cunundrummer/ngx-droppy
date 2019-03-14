import { TestBed } from '@angular/core/testing';

import { DropperService } from './dropper.service';

describe('DropperService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DropperService = TestBed.get(DropperService);
    expect(service).toBeTruthy();
  });
});
