import { Component, OnInit } from '@angular/core';
import {Quote} from "@angular/compiler";
import { LocalDataServiceProvider } from '../providers/local-data-service/local-data-service';

@Component({
  selector: 'app-popover',
  templateUrl: 'popover.component.html'
})
export class PopoverComponent implements OnInit {

  private actions;

  constructor(public localDataService: LocalDataServiceProvider) {

    if(true){

        this.actions = {
          goToQuote: true
        }
        
    }


  }

  ngOnInit() {

  }

}
