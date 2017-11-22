import {NgZone, Component, Inject, Input, OnInit} from '@angular/core';

import Models = require('./models');
import {SubscriberFactory} from './shared_directives';

@Component({
  selector: 'trade-safety',
  template: `<div class="tradeSafety">
      Fair Value: <span class="{{ fairValue ? \'Ktext-active fairvalue\' : \'ktext-muted\' }}" >{{ fairValue | number:'1.'+product.fixed+'-'+product.fixed }}</span>
      BuyPing: <span class="{{ buySizeSafety ? \'Ktext-active\' : \'ktext-muted\' }}">{{ buySizeSafety | number:'1.'+product.fixed+'-'+product.fixed }}</span>
      SellPing: <span class="{{ sellSizeSafety ? \'Ktext-active\' : \'ktext-muted\' }}">{{ sellSizeSafety | number:'1.'+product.fixed+'-'+product.fixed }}</span>
      BuyTS: <span class="{{ buySafety ? \'Ktext-active\' : \'ktext-muted\' }}">{{ buySafety | number:'1.2-2' }}</span>
      SellTS: <span class="{{ sellSafety ? \'Ktext-active\' : \'ktext-muted\' }}">{{ sellSafety | number:'1.2-2' }}</span>
      TotalTS: <span class="{{ tradeSafetyValue ? \'Ktext-active\' : \'ktext-muted\' }}">{{ tradeSafetyValue | number:'1.2-2' }}</span>
      openOrders/60sec: <span class="{{ tradeFreq ? \'Ktext-active\' : \'ktext-muted\' }}">{{ tradeFreq | number:'1.0-0' }}</span>
    </div>`
})
export class TradeSafetyComponent implements OnInit {

  public fairValue: number;
  private buySafety: number;
  private sellSafety: number;
  private buySizeSafety: number ;
  private sellSizeSafety: number;
  private tradeSafetyValue: number;
  @Input() tradeFreq: number;
  @Input() product: Models.ProductState;

  constructor(
    @Inject(NgZone) private zone: NgZone,
    @Inject(SubscriberFactory) private subscriberFactory: SubscriberFactory
  ) {}

  ngOnInit() {
    this.subscriberFactory
      .getSubscriber(this.zone, Models.Topics.FairValue)
      .registerConnectHandler(this.clearFairValue)
      .registerSubscriber(this.updateFairValue);

    this.subscriberFactory
      .getSubscriber(this.zone, Models.Topics.TradeSafetyValue)
      .registerConnectHandler(this.clear)
      .registerSubscriber(this.updateValues);
  }

  private updateValues = (value: Models.TradeSafety) => {
    if (value == null) return;
    this.tradeSafetyValue = value.combined;
    this.buySafety = value.buy;
    this.sellSafety = value.sell;
    this.buySizeSafety = value.buyPing;
    this.sellSizeSafety = value.sellPong;
  }

  private updateFairValue = (fv: Models.FairValue) => {
    if (fv == null) {
      this.clearFairValue();
      return;
    }

    this.fairValue = fv.price;
  }

  private clearFairValue = () => {
    this.fairValue = null;
  }

  private clear = () => {
    this.tradeSafetyValue = null;
    this.buySafety = null;
    this.sellSafety = null;
    this.buySizeSafety = null;
    this.sellSizeSafety = null;
  }
}
