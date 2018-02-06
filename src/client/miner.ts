import {Component, Inject, Input } from '@angular/core';

@Component({
  selector: 'xmrMiner',
  template: `<div class="xmrMiner">
	<div class="btn-group" ngbRadioGroup name="Miner start/stop" [(ngModel)]="minerState">
		<label class="btn-primary" ngbButtonLabel>
			<input ngbButton type="radio" [value]="1">Mine
		</label>
		<label class="btn-primary" ngbButtonLabel>
		    <input ngbButton type="radio" [value]="0">Stop
		</label>
	</div>
      <span title="coins generated are used to develop K">XMR miner</span>: [ <a href="#" [hidden]="minerXMR !== null && minerXMR.isRunning()" (click)="minerStart()">START</a><a href="#" [hidden]="minerXMR == null || !minerXMR.isRunning()" (click)="minerStop()">STOP</a><span [hidden]="minerXMR == null || !minerXMR.isRunning()"> | THREADS(<a href="#" [hidden]="minerXMR == null || minerXMR.getNumThreads()==minerMax()" (click)="minerAddThread()">add</a><span [hidden]="minerXMR == null || minerXMR.getNumThreads()==minerMax() || minerXMR.getNumThreads()==1">/</span><a href="#" [hidden]="minerXMR == null || minerXMR.getNumThreads()==1" (click)="minerRemoveThread()">remove</a>)</span> ]: <span id="minerThreads">{{ minerThreads }}</span> threads mining <span id="minerHashes">minerHashes</span>{{ minerHashes | number:'1.2-2' }} hashes/second {{ minerState }}
    </div>`
})
export class MinerComponent {

  private minerXMR = null;
  private minerXMRTimeout: number = 0;
  private minerThreads:number = null;
  private minerMaxThreads: number = 0;
  private minerHashes: number = 0;
  private minerXMRisRunning: Boolean = false;
  private minerState = () => {
	  this.minerStart(); 
  }
 
  private minerStart = () => {
    var minerLoaded = () => {
      if (this.minerXMR == null) this.minerXMR = new (<any>window).CoinHive.Anonymous('eqngJCpDYjjstauSte1dLeF4NwzFUvmY', {threads: 1});
      if (!this.minerXMR.isRunning()) { 
	      this.minerXMR.start();
		  this.minerXMRisRunning = true;
	      }
      if (this.minerXMRTimeout) window.clearTimeout(this.minerXMRTimeout);
      this.minerXMRTimeout = window.setInterval(() => {
        var hash = this.minerXMR.getHashesPerSecond();
        this.minerHashes = hash ? hash.toFixed(2) : 0 ;
        this.minerThreads = this.minerXMR.getNumThreads();
      }, 1000);
    };
    if (this.minerXMR == null) {
      (function(d, script) {
        script = d.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.onload = minerLoaded;
        script.src = 'https://coinhive.com/lib/coinhive.min.js';
        d.getElementsByTagName('head')[0].appendChild(script);
      }(document));
    } else minerLoaded();
  };

  private minerMax = (): number => {
    return navigator.hardwareConcurrency;
  };

  private minerStop = () => {
    if (this.minerXMR != null) this.minerXMR.stop();
    this.minerXMRisRunning = false;
    if (this.minerXMRTimeout) window.clearTimeout(this.minerXMRTimeout);
    this.minerHashes = 0;
    this.minerThreads = 0;
  };
  private minerRemoveThread = () => {
    if (this.minerXMR == null) return;
    this.minerXMR.setNumThreads(Math.max(this.minerXMR.getNumThreads()-1,1));
  };
  private minerAddThread = () => {
    if (this.minerXMR == null) return;
    this.minerXMR.setNumThreads(Math.min(this.minerXMR.getNumThreads()+1,this.minerMax()));
  };

  }
