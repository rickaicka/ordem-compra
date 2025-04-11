import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import {OrderBuyOpenedPage} from './order-buy-opened.page';

describe('OrderBuyOpened', () => {
  let component: OrderBuyOpenedPage;
  let fixture: ComponentFixture<OrderBuyOpenedPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderBuyOpenedPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OrderBuyOpenedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
