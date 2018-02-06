import {Component, Input} from '@angular/core';

import * as Models from './models';

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
export class TradeSafetyComponent {

  public fairValue: number;
  private buySafety: number;
  private sellSafety: number;
  private buySizeSafety: number;
  private sellSizeSafety: number;
  private tradeSafetyValue: number;

  @Input() tradeFreq: number;

  @Input() product: Models.ProductState;

  @Input() set setFairValue(o: Models.FairValue) {
    if (o === null)
      this.fairValue = null;
    else
      this.fairValue = o.price;
  }

  @Input() set setTradeSafety(o: Models.TradeSafety) {
    if (o === null) {
      this.tradeSafetyValue = null;
      this.buySafety = null;
      this.sellSafety = null;
      this.buySizeSafety = null;
      this.sellSizeSafety = null;
    } else {
      this.tradeSafetyValue = o.combined;
      this.buySafety = o.buy;
      this.sellSafety = o.sell;
      this.buySizeSafety = o.buyPing;
      this.sellSizeSafety = o.sellPing;
    }
  }
}
