import { TestBed } from '@angular/core/testing';
import { DataPointService } from './data-point.service';

describe('DataPointService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataPointService = TestBed.get(DataPointService);
    expect(service).toBeTruthy();
  });
});
