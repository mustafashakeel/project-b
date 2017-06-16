import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavController, PopoverController, NavParams, LoadingController } from 'ionic-angular';
import { LocalDataServiceProvider } from '../../providers/local-data-service/local-data-service';
import { Popover } from '../opportunity/popover';
import { QuoteDetails } from "./quote-details";

@Component({
  selector: 'product-summary',
  templateUrl: 'product-summary.html'
})
export class ProductSummary {

  public quotes: any;
  public on_off: any;

  constructor(public navCtrl: NavController,
    public params: NavParams,
    public localDataService: LocalDataServiceProvider,
    private popoverCtrl: PopoverController,
    private changeDetector: ChangeDetectorRef,
    private loadingCtrl: LoadingController) {

    this.loaddata();

  }

  loaddata() {

    // this.localDataService.getOnlineStatus()
    //   .then(data => {
    //     this.on_off = data;
    //   });

  }

  // showPopover(ev) {
    
    
  //   let popover = this.popoverCtrl.create(Popover, {
  //     onlineMode:this.on_off.onlineMode,
  //     objectType: 'quote',
  //   }, {cssClass:'popover-more'});
  //   popover.present({
  //     ev: ev
  //   });

  // }

  
}
