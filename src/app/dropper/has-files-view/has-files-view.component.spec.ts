import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HasFilesViewComponent } from './has-files-view.component';

describe('HasFilesViewComponent', () => {
  let component: HasFilesViewComponent;
  let fixture: ComponentFixture<HasFilesViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HasFilesViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HasFilesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
