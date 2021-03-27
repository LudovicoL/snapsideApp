import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CommentModalPage } from './comment-modal.page';

describe('CommentModalPage', () => {
  let component: CommentModalPage;
  let fixture: ComponentFixture<CommentModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CommentModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
