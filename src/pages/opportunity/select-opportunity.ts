import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NavController, PopoverController, NavParams, LoadingController } from 'ionic-angular';
import { LocalDataServiceProvider } from '../../providers/local-data-service/local-data-service';
import { Popover } from './popover';
import { Filter } from '../../components/filter.component';
import { OpportunityDetails } from './opportunity-details';

@Component({
  selector: 'select-opportunity',
  templateUrl: 'select-opportunity.html'
})
export class SelectOpportunity {

	public opportunities: any;
  public on_off:any;
  public filterOptionValues: any;
  
  constructor(public navCtrl: NavController, 
    public params: NavParams, 
    public localDataService: LocalDataServiceProvider, 
    private popoverCtrl: PopoverController, 
    private filterCtrl: PopoverController,
    private changeDetector: ChangeDetectorRef,
    private loadingCtrl: LoadingController) {

    this.loaddata();
  	
  }

  loaddata(){
    
    this.localDataService.getOnlineStatus()
    .then(data => {
      this.on_off = data;
    });

    let options = {
      filterOptionValues: this.filterOptionValues,
      isOnline: this.on_off
    };

  	this.localDataService.getOpportunities(options)
    .then(data => {
      this.opportunities = data;
    });

	}

	showPopover(ev) {
    
    let popover = this.popoverCtrl.create(Popover, {
      onlineMode:this.on_off.onlineMode, 
      objectType: 'opportunity'},
      {cssClass:'popover-more'});
    popover.present({
      ev: ev
    }); 
  }

  showFilter(ev) {
    let filter = this.popoverCtrl.create(Filter);
    filter.present({
      ev: ev
    });

    let _that = this;

    filter.onDidDismiss((data) => {

      //_that.localDataService.updateQuoteFilterOptions(data);

      let newOptions = {
        filterOptionValues: data,
        isOnline: this.on_off
      };

      //show loading bar while loading
      let loading = this.loadingCtrl.create();
      loading.present();
      
      // reload quotes with new params
      _that.localDataService.getOpportunities(newOptions)
        .then(newOpportunities => {

          this.opportunities = newOpportunities;
          this.changeDetector.detectChanges();
          loading.dismiss();
        
        });

    });
  }

  navigate(opp){
    this.navCtrl.push(OpportunityDetails,{
            firstPassed: opp.customer,
            secondPassed: opp.status
          });
  }

}


