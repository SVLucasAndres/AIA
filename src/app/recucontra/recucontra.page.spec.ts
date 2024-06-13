import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecucontraPage } from './recucontra.page';

describe('RecucontraPage', () => {
  let component: RecucontraPage;
  let fixture: ComponentFixture<RecucontraPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RecucontraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
