import { Component } from '@angular/core';
import { LocalDataServiceProvider } from '../../providers/local-data-service/local-data-service';
import {ViewController} from 'ionic-angular';

@Component({
  selector: "quote-filter",
  templateUrl: 'quote-filter.html',
  providers: [LocalDataServiceProvider]
})
export class QuoteFilter {
  public filter: {};
  public isQuotesSelected: boolean;
  public isDateModifiedSelected: boolean;
  public quotesSelected: any;
  public datesSelected: any;

  public quoteParamaters: any;
  public dateModifiedParamater: string;


  constructor(public localDataService: LocalDataServiceProvider,
    private viewCtrl: ViewController) {
    this.isQuotesSelected = false;
    this.isDateModifiedSelected = false;
    this.quoteParamaters = [];
    this.dateModifiedParamater = '';
    this.loaddata();

  }

  loaddata() {
    this.localDataService.getQuoteFilterOptions()
      .then(data => {
        debugger;
        this.filter = data;
        console.log(this.filter);
      });
  }

  toggleQuotesSelection() {
    this.isQuotesSelected = !this.isQuotesSelected;
  }

  toggleDateModifiedSelection() {
    this.isDateModifiedSelected = !this.isDateModifiedSelected;
  }

  setDateModifiedParamater(paramater: string) {
    if (this.dateModifiedParamater === paramater) {
      // set to empty string when clicked twice
      this.dateModifiedParamater = '';
    } else {
      this.dateModifiedParamater = paramater;
    }
  }

  toggleQuotesParamater(paramater: string) {
    if (this.quoteParamaters.includes(paramater)) {
      let i = this.quoteParamaters.indexOf(paramater);
      this.quoteParamaters.splice(i, 1);
    } else {
      this.quoteParamaters.push(paramater);
    }

    console.log(this.quoteParamaters);
  }

  clearAll() {
    this.isQuotesSelected = false;
    this.isDateModifiedSelected = false;
    this.dateModifiedParamater = '';
    this.loaddata();
    // TODO: make clear checks from filter
  }

  undoCamelCase(str) {
    let tmp = str.replace(/([A-Z])/g, " $1");
    return tmp.charAt(0).toUpperCase() + tmp.slice(1);
  }

  applyFilter() {
    console.log('applying filter');
    let options = {
      filter: this.filter, // contains currency, owner, status, selections
      dateModifiedParamater: this.dateModifiedParamater,
      quotesParamater: this.quoteParamaters,
    }
    console.log(options);

    // Now send new filter data back to view
    this.viewCtrl.dismiss(options);


  }

}
