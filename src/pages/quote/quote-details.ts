import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LocalDataServiceProvider } from '../../providers/local-data-service/local-data-service';
import { OpportunityDetails } from "../opportunity/opportunity-details";
import { ProductSummary } from './product-summary';

@Component({
  selector: 'quote-details',
  templateUrl: 'quote-details.html'
})
export class QuoteDetails {

  public firstParam: any;
  public secondParam: any;
  public quoteSummary: any;
  public visibleFields: any;
  public editableFields: any;
  public visibleFieldsLabels: any;

  constructor(public navCtrl: NavController,
    public params: NavParams,
    public localDataService: LocalDataServiceProvider) {

    this.firstParam = params.get("firstPassed");
    this.secondParam = params.get("secondPassed");
    this.loadData();

  }

  loadData() {
    // TODO: make get real id
    let id = '03a000012a6ijiwf';

    this.localDataService.getQuoteSummary(id)
      .then(data => {
        this.quoteSummary = data;
      });

    this.localDataService.getSummaryLayout('quote')
      .then(data => {
        this.visibleFields = data;

        // Now create array of labels to be accesed with "*ngFor"
        let labels = [];
        Object.keys(data).forEach((key) => {
          console.log(key, data[key]);
          labels.push({
            //asCamelCase: key,
            asCamelCase: data[key].name,
            name: data[key].label
            //name: this.undoCamelCase(key),
          })
        });

        let column, res = {}

        // determine editable fields
        for(var i=0; i<data.length; i++){

          column = data[i];
          if(column.updateable){

            if(column.restrictedPicklist){
              res[column.name] = {
                type: 'selection',
                options: column.picklistValues,
                value: ''
              }
            }
            else{
              res[column.name] = {
                type: 'text',
                options: null,
                value: ''
              }
            }


          }

        }
        
        this.editableFields = res;

        this.visibleFieldsLabels = labels;

      });
      
  }

  markSelection(label, option) {
    if (this.editableFields[label].value === option) {
      this.editableFields[label].value = '';
    } else {
      this.editableFields[label].value = option;
    }

  }

  undoCamelCase(str): string {
    let tmp = str.replace(/([A-Z])/g, " $1");
    return tmp.charAt(0).toUpperCase() + tmp.slice(1);
  }

  isEditable(label): boolean {

    if(!this.editableFields) return;

    let editableFields = Object.keys(this.editableFields);
    if (editableFields.indexOf(label.asCamelCase) > -1) {
      return true;
    }
    return false;

  }

  isTextField(label): boolean {
    if (this.editableFields[label.asCamelCase].type === 'text') {
      return true;
    }
    return false;
  }

  isSelectField(label): boolean {
    if (this.editableFields[label.asCamelCase].type === 'selection') {
      return true;
    }
    return false;
  }

  goToOpportunity() {
    this.navCtrl.push(OpportunityDetails, {
      firstPassed: this.quoteSummary.accountName,
      secondPassed: this.quoteSummary.status
    });
  }

  goToProducts(){
    this.navCtrl.push(ProductSummary, {
      firstPassed: 'test',
      secondPassed: 'test'
    });
  }

  reset() {
    this.loadData();
  }

  saveChanges() {
    console.log(this.editableFields);
    this.localDataService.updateQuote(this.editableFields);
  }


}