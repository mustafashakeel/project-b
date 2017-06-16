import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LocalDataServiceProvider } from '../../providers/local-data-service/local-data-service';
import { AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';

// ***** for progress bar plugin
//import {NgProgressService} from 'ngx-progressbar';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
 
})

export class HomePage {

  public alerts: any;
  public notifications: any;
  public myRecentActivity: any;
  public myCPQDriveSummary: any;
  public onlineStatus: any;

  constructor(public navCtrl: NavController,
              private alertCtrl: AlertController,
              private toastCtrl: ToastController,
              public localDataService: LocalDataServiceProvider) {
  	this.loadData();

    this.localDataService.initDatabase();

  }
  

  loadData(){





    // Load "Alerts" data
  	this.localDataService.getAlerts()
    .then(data => {
  		this.alerts = data;
      this.alerts.selected = false;
      this.alerts.count = this.alerts.expiredCatalogOnQuote.length + this.alerts.expiredQuotes.length;
      this.alerts.pluralize = (this.alerts.count!=1)? 'S': '';
      
  	});

     // Load "Notifications" data
  	this.localDataService.getNotifications()
    .then(data => {
  		this.notifications = data;
      this.notifications.selected = false;
      this.notifications.pluralize = (this.notifications.length!=1)? 'S': '';
  	});

     // Load "My Recent Activity" data
  	this.localDataService.getMyRecentActivity()
    .then(data => {
  		this.myRecentActivity = data;
      this.myRecentActivity.selected = false
  	});

     // Load "My CQP Drive Summary" data
  	this.localDataService.getMyCPQDriveSummary()
    .then(data => {
  		this.myCPQDriveSummary = data;
      // get percent progress, then add to view with pService
      //let progress = this.myCPQDriveSummary.storage.mbUsed / this.myCPQDriveSummary.storage.mbUsed.mbAvailable;
      //this.pService.start();
      //this.pService.set(progress);
      this.myCPQDriveSummary.pluralize = (this.myCPQDriveSummary.checkedOutQuotes!=1)? 'S': '';
  	});

     // Load "My CQP Drive Summary" data
  	this.localDataService.getOnlineStatus()
    .then(data => {
  		this.onlineStatus = data;
  	});

  }
  // Function to pass ON_OFF params to Opportunity page
  

  // The following functions are used to reverse wheather the apropriate
  // sections will display all provided information (as opposed to just the
  // summary). In the objects corresponding to each function, the boolean 
  // value "selected" is negated to do this
  toggleAlertsSelection(){
    this.alerts.selected = !this.alerts.selected;
  }

  toggleNotificationsSelection(){
     this.notifications.selected = !this.notifications.selected;
  }

  toggleMyRecentActivitySelection() {
    this.myRecentActivity.selected = !this.myRecentActivity.selected;
  }


  // Toggles if device is set to "Online Mode"
  toggleOnlineMode() {
    
    const newStatus = !(this.onlineStatus.onlineMode);
    console.log(newStatus);

    this.localDataService.setOnlineStatus({ onlineMode: newStatus});
    this.onlineStatus.onlineMode = newStatus;

  }

  // Toggles if device is set to "Auto Refresh"
  toggleAutoRefresh() {
    
    const newStatus = !this.onlineStatus.autoRefresh;
    console.log(newStatus);

    this.localDataService.setOnlineStatus({ autoRefresh: newStatus});
    this.onlineStatus.autoRefresh = newStatus;

  }


  presentConfirm() {
  
    let alert = this.alertCtrl.create({
      title: 'Confirm Sync',
      message: 'Are you sure you want to sync?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Sync',
          handler: () => {
            console.log('Sync clicked');
          }
        }
      ]
    });
    alert.present();

  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Sync completed successfully',
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

}
