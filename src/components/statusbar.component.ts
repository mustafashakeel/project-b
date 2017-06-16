import { Component, OnInit } from '@angular/core';
import {Quote} from "@angular/compiler";
import { LocalDataServiceProvider } from '../providers/local-data-service/local-data-service';

@Component({
  selector: 'app-statusbar',
  templateUrl: 'statusbar.component.html'
})
export class StatusbarComponent implements OnInit {

  public notifications: any;
  public myCPQDriveSummary: any;
  public onlineStatus: any;

  constructor(public localDataService: LocalDataServiceProvider) {

     // Load "Notifications" data
    this.localDataService.getNotifications()
    .then(data => {
      this.notifications = data;
      this.notifications.selected = false;
      this.notifications.pluralize = (this.notifications.length!=1)? 'S': '';
    });

     // Load "My CQP Drive Summary" data
    this.localDataService.getMyCPQDriveSummary()
    .then(data => {
      this.myCPQDriveSummary = data;
    });

     // Load "My CQP Drive Summary" data
    this.localDataService.getOnlineStatus()
    .then(data => {
      this.onlineStatus = data;
    });
  }

  ngOnInit() {

  }

}
