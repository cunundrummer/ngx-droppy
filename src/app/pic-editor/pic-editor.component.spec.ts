import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PicEditorComponent } from './pic-editor.component';

describe('PicEditorComponent', () => {
  let component: PicEditorComponent;
  let fixture: ComponentFixture<PicEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PicEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PicEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
