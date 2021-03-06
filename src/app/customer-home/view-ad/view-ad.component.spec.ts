import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewAdComponent } from './view-ad.component';

describe('ViewAdComponent', () => {
  let component: ViewAdComponent;
  let fixture: ComponentFixture<ViewAdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewAdComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewAdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
