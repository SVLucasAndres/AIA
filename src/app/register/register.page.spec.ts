import { ComponentFixture, TestBed } from '@angular/core/testing';
import { REGISTERPage } from './register.page';

describe('REGISTERPage', () => {
  let component: REGISTERPage;
  let fixture: ComponentFixture<REGISTERPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(REGISTERPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
