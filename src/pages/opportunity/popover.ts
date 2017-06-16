import { Component, Output, EventEmitter } from '@angular/core';
import { LocalDataServiceProvider } from '../../providers/local-data-service/local-data-service';
import { AlertController, NavParams, NavController, ViewController } from 'ionic-angular';
import { ProductSummary } from '../quote/product-summary';


@Component({
	selector: 'page-popover',
  templateUrl: 'popover.html'
})
export class Popover{

	public on_off: {};
  public actions: any;
  public onlineStatus: any;

  @Output("onClose") eventOnClosed = new EventEmitter();


  constructor(private alertCtrl: AlertController, 
    public localDataService: LocalDataServiceProvider, 
    private params: NavParams,
    private navCtrl:  NavController,
    private viewCtrl: ViewController) {

    debugger;
    this.actions = {
      goToQuotes: true,
      downloadOpportunityOnly: true,
      downloadAllQuotesReadOnly: true,
      checkInAllQuotes: true,
      checkOutAllQuotes: true
    }


    // TODO - connect to data object
    let itemType = params.data.objectType;
    let isOnline = true; // TODO - get Online Mode
    let inStorage = true;
    let isCheckedOut = false;
    let isViewOnly = false;
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
            checkInAllQuotes: true,
            removeAllQuotes: true
          }
        }
        else{
          // OFFLINE
          this.actions = {
            goToQuotes: true,
            removeAllQuotes: true
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

    if(itemType=='quote'){
      
      if(isOnline){
        // ONLINE
        if(isCheckedOut){
          this.actions = {
            checkInQuote: true,
            copyQuoteWithProducts: true,
            viewBOMDetails: true,
            viewProposal: true,
            removeFromCPQDrive: true,
          }  
        }
        else if(isViewOnly){
          this.actions = {
            refreshQuote: true,
            checkOutQuote: true,
            viewProposal: true,
            removeFromCPQDrive: true,
          }
        }
        else{
          this.actions = {
            goToQuotes: true,
            removeAllQuotes: true,
            downloadOpportunityOnly: true,
            downloadAllQuotesReadOnly: true,
            checkInAllQuotes: true,
          }
        }
      }
      else{
        if(isViewOnly){
          // OFFLINE
          this.actions = {
            goToProducts: true,
            copyQuoteOnly: true,
            removeFromCPQDrive: true
          }
        }
        else{
          this.actions = {
            goToProducts: true,
            copyQuoteOnly: true,
            copyQuoteWithProducts: true,
            removeFromCPQDrive: true
          }
        }
      }
     

/*
            goToProducts: true,
            copyQuoteOnly: true,
            copyQuoteWithProducts: true,
            removeFromCPQDrive: true
            checkInQuote: true,
            viewBOMDetails
            viewProposal
            refreshQuote
            checkOutQuote
        */
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


  doGoToProducts(){
    this.navCtrl.push(ProductSummary, {
      ProductID: ''
    });
    this.viewCtrl.dismiss();

  }

  doCopyQuoteOnly(){
    this.doAction('LDS.CopyQuoteOnly');
  }

  doCopyQuoteWithProducts(){
    this.doAction('LDS.CopyQuoteWithProducts');
  }

  doRemoveFromCPQDrive(){
    this.doAction('LDS.RemoveFromCPQDrive');
  }

  doCheckInQuote(){
    this.doAction('LDS.CheckInQuote');
  }

  doViewBOMDetails(){
    this.doAction('LDS.ViewBOMDetails');
  }

  doViewProposal(){
    this.doAction('LDS.ViewProposal');
  }

  doRefreshQuote(){
    this.doAction('LDS.RefreshQuote');
  }

  doCheckOutQuote(){
    this.doAction('LDS.CheckOutQuote');
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
