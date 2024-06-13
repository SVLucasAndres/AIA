import { TestBed } from '@angular/core/testing';

import { FacturadorService } from './facturador.service';

describe('FacturadorService', () => {
  let service: FacturadorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacturadorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
