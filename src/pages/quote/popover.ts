import { Component, OnInit } from '@angular/core';
import {Quote} from "@angular/compiler";
import { LocalDataServiceProvider } from '../../providers/local-data-service/local-data-service';
import { AlertController, NavParams } from 'ionic-angular';

@Component({
	selector: "page-popover",
  templateUrl: 'popover.html'
})
export class Popover{

	public on_off: {};
  public actions: any;
  public onlineStatus: any;

  constructor(private alertCtrl: AlertController, 
    public localDataService: LocalDataServiceProvider, private params: NavParams) {

    this.actions = {
      goToQuotes: true,
      downloadOpportunityOnly: true,
      downloadAllQuotesReadOnly: true,
      checkInAllQuotes: true,
      checkOutAllQuotes: true
    }

    // TODO - connect to data object
    let itemType = 'opportunity';
    let isOnline : any; // TODO - get Online Mode
    let inStorage = true;
    this.onlineStatus = params.data;
    isOnline = this.onlineStatus.onlineMode;

    // this.localDataService.getOnlineStatus()
    // .then(data => {
    //   this.onlineStatus = data;
    //   console.log("ON/OFF status Popover " + this.onlineStatus.onlineMode);
    // });
    //
    // OPPORTUNITY
    //
    if(itemType=='opportunity'){
      
      if(inStorage){
        // IN STORAGE
        if(isOnline){
          // ONLINE
          this.actions = {
            goToQuotes: true,
            removeAllQuotes: true,
            downloadOpportunityOnly: true,
            downloadAllQuotesReadOnly: true,
            checkInAllQuotes: true,
          }
        }
        else{
          // OFFLINE
          this.actions = {
            removeAllQuotes: false,
            downloadOpportunityOnly: false,
            downloadAllQuotesReadOnly: false,
            goToQuotes: true,
            checkInAllQuotes: true
          }
        }
      }
      else{
        // NOT IN STORAGE
        if(isOnline){
          console.log("IN storage OFF LINE");
          // ONLINE
          this.actions = {
            goToQuotes: true,
            downloadOpportunityOnly: true,
            downloadAllQuotesReadOnly: true,
            checkOutAllQuotes: true
          }
        }
        else{
          // OFFLINE
          // NOT SUPPORTED
        }



      }

    }

    // ALL 

    // this.localDataService.getOnlineStatus()
    // .then(data => {
    //   this.onlineStatus = data;
    // });

    

  }



  doGoToQuotes(){
    this.doAction('UI Action - goToQuotes');
  }

  doRemoveAllQuotes(){
    this.doAction("LocalDataService\nremoveAllQuotes");
  }

  doCheckInAllQuotes(){
    this.doAction('LDS.checkInAllQuotes');
  }

  doDownloadOpportunityOnly(){
    this.doAction('LDS.downloadOpportunityOnly');
  }

  doDownloadAllQuotesReadOnly(){
    this.doAction('LDS.downloadAllQuotesReadOnly');
  }

  doCheckOutAllQuotes(){
    this.doAction('LDS.checkOutAllQuotes');
  }

  doAction(actionName){

    let alert = this.alertCtrl.create({
      title: 'Invoking',
      message: actionName,
      buttons: [
        {
          text: 'OK',
          handler: () => {

          }
        }
      ]
    });
    alert.present();

  }

}
