import {Component, Input} from '@angular/core';

import * as Models from './models';

@Component({
  selector: 'wallet-position',
  template: `<div class="container wallet" *ngIf="baseValue || quoteValue">
  	<div class="row"><div class="col-1">{{ baseCurrency }}<br>{{ quoteCurrency }}<span class="wallet-description">currency</span></div>
  		<div class="col">{{ baseValue | number:'1.8-8' }}<br>{{ quoteValue | number:'1.'+product.fixed+'-'+product.fixed }}<span class="wallet-description">total</span></div>
  		<div class="col width-120"><span [ngClass]="profitBase<0 ? 'K-Red' : 'K-Green'">{{ profitBase>=0?'+':'' }}{{ profitBase | number:'1.2-2' }}%</span><br><span [ngClass]="profitQuote<0 ? 'K-Red' : 'K-Green'">{{ profitQuote>=0?'+':'' }}{{ profitQuote | number:'1.2-2' }}%</span><br><span class="wallet-description">profit last {{ profitTime | number:'1.0-2'}} h</span></div>
  		<div class="col">{{ basePosition | number:'1.8-8' }}<br>{{ quotePosition | number:'1.'+product.fixed+'-'+product.fixed }}<br><span class="wallet-description">Available</span></div>
  		<div class="col"><span [ngClass]="baseHeldPosition ? '' : 'ktext-muted'">{{ baseHeldPosition | number:'1.8-8' }}</span><br><span [ngClass]="quoteHeldPosition ? '' : 'ktext-muted'">{{ quoteHeldPosition | number:'1.'+product.fixed+'-'+product.fixed }}</span><br><span class="wallet-description">Held</span></div>
	</div>
</div><div class="positions" *ngIf="!baseCurrency && !quoteCurrency"><br/><b>NO WALLET DATA</b><br/><br/>Do a manual order first using the website of this Market!<br/></div>`
})
export class WalletPositionComponent {

  public baseCurrency: string;
  public basePosition: number;
  public quoteCurrency: string;
  public quotePosition: number;
  public baseHeldPosition: number;
  public quoteHeldPosition: number;
  public baseValue: number;
  public quoteValue: number;
  private profitBase: number = 0;
  private profitQuote: number = 0;

  @Input() product: Models.ProductState;

  @Input() set setPosition(o: Models.PositionReport) {
    if (o === null) {
      this.baseCurrency = null;
      this.quoteCurrency = null;
      this.basePosition = null;
      this.quotePosition = null;
      this.baseHeldPosition = null;
      this.quoteHeldPosition = null;
      this.baseValue = null;
      this.quoteValue = null;
      this.profitBase = 0;
      this.profitQuote = 0;
    } else {
      this.basePosition = o.baseAmount;
      this.quotePosition = o.quoteAmount;
      this.baseHeldPosition = o.baseHeldAmount;
      this.quoteHeldPosition = o.quoteHeldAmount;
      this.baseValue = o.baseValue;
      this.quoteValue = o.quoteValue;
      this.profitBase = o.profitBase;
      this.profitQuote = o.profitQuote;
      this.baseCurrency = o.pair.base;
      this.quoteCurrency = o.pair.quote;
    }
  }
}
