import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromptFilesViewComponent } from './prompt-files-view.component';

describe('PromptFilesViewComponent', () => {
  let component: PromptFilesViewComponent;
  let fixture: ComponentFixture<PromptFilesViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromptFilesViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromptFilesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
