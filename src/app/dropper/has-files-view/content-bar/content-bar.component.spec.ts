import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentBarComponent } from './content-bar.component';

describe('ContentBarComponent', () => {
  let component: ContentBarComponent;
  let fixture: ComponentFixture<ContentBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContentBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
