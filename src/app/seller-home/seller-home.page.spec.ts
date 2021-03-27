import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SellerHomePage } from './seller-home.page';

describe('SellerHomePage', () => {
  let component: SellerHomePage;
  let fixture: ComponentFixture<SellerHomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellerHomePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SellerHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
