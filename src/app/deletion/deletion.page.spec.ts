import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeletionPage } from './deletion.page';

describe('DeletionPage', () => {
  let component: DeletionPage;
  let fixture: ComponentFixture<DeletionPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DeletionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
