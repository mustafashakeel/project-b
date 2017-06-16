import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/*
  Generated class for the LocalDataServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

/*
 
 LocalDataServiceProvider
 ========================
 
  * Delivers data to UI views
  
  * Loads sample data objects from assets/poc_data/*.json

  * Maintains Index of objects for querying - with keyword search capability

  * Uses Ionic Storage for underlying data store
    https://ionicframework.com/docs/storage/
      - WebSQL/IndexedDB in browser
      - SQLite on iOS/Android
 
 */

@Injectable()
export class LocalDataServiceProvider {

  // response cache
  public users;
  public alerts;
  public notifications;
  public myRecentActivity;
  public myCPQDriveSummary;
  public opportunities;
  public opportunityDetail;
  public opportunityQueryFilters;
  public quotes;
  public quoteSummary;
  public quoteFilterOptions;
  public quoteSummaryVisibleFields;
  public quoteSummaryEditableFields;

  //
  //
  //
  public index;
  public indexesByObjectType;

  public onlineMode : boolean;
  public autoRefresh = false;
  
  constructor(public platform: Platform,
              private storage: Storage,
              private sqlite: SQLite,
              public http: Http) {

    this.onlineMode = false;

  }

  initDatabase(){

    console.log('initDatabase');

    this.index = {
      'all-account': [],             // all
      'all-opportunity': [],         // all
      'all-quote': [],               // all 
      'quote-lastModifiedDate': [],  // sort index
      'quote-keywords': {},          // keyword index
      'opportunity-keywords': {}     // keyword index
    }

    this.indexesByObjectType = {
      'account': ['all-account'],
      'opportunity': ['all-opportunity', 'opportunity-keywords'],
      'quote': ['all-quote', 'quote-lastModifiedDate', 'quote-keywords']
    }


    this.loadSampleData().then(resolve => {
      this.indexLocalData();
    })


  }



  getOpportunities(params: any){

      // params.filterOptionValues = {
        
      //   // radio select options:
      //   //   expiredCatalogs
      //   //   expiredQuotes
      //   //   checkedOut
      //   //   viewOnly
      //   'quotes': 'expiredCatalogs', 

      //   // radio select options:
      //   //   today
      //   //   last7Days
      //   //   last30Days
      //   'dateModified': null,

      //   'currency': "USD",
      //   'owner': null,
      //   'status': null
      // }

    return new Promise(resolve => {

      let objectType = 'opportunity';

      this.queryItems(objectType, params).then(results => {

        let rows: any[] = results;
        /*

          "AccountId": {
            "Id": "0ca000012a6ijiva",
            "Name": "Salient Solutions"
          },
          "PrimaryQuoteId": {
            "Id": "03a000012a6ijiwf",
            "Name": "Quote for Salient Solutions"
          },
          "fpRules": {
            "showMoreInfo": false,
            "acl": {
              "canEdit": true,
              "canDelete": true
            },
            "wf": {
              "canAddQuote": true
            }
          },
          "Id": "08a000012a6ijiwb",
          "CurrencyIsoCode": "USD",
          "Name": "Opportunity for Salient Solutions"
        */
        if(rows.length>0){
          for(var i=0; i<rows.length; i++){

            if(!rows[i].AccountId){
              rows[i].AccountId = { Name: "Unknown Account" }
            }

          }
        }

        // TODO - remove filter stub
        if(params && params.filterOptionValues){
          resolve(rows.splice(0,3));
        }
        else{
          resolve(rows);
        }

      });


    });
  }


  getOpportunitySummary(id) {

    return new Promise(resolve => {

      this.loadItem('retrieve-opportunity', id).then(result => {

        /*
         {
          "ClonedFromId": null,
          "LastModifiedDate": "2017-05-23T19:30:40Z",
          "AccountId": "0ca000012a6ijiva",
          "Description": "Opportunity for Salient Solutions 2017",
          "LocaleSidKey": "en_US",
          "Probability_Percent__c": 30,
          "LanguageLocaleKey": "en_US",
          "ExternalId": null,
          "PrimaryQuoteId": "03a000012a6ijiwf",
          "IsClosed": false,
          "ArchivedDate": null,
          "CrmExportStatus": "NotExported",
          "CurrencyIsoCode": "USD",
          "Name": "Opportunity for Salient Solutions",
          "IsArchived": false,
          "CreatedById": "09a000000002z6qz",
          "OwnerId": "09a000000002z6qz",
          "CreatedDate": "2017-05-23T18:15:16Z",
          "fpRules": {
            "showMoreInfo": false,
            "acl": {
              "canEdit": true,
              "canDelete": true
            },
            "wf": {
              "canAddQuote": true
            }
          },
          "Id": "08a000012a6ijiwb",
          "LastModifiedById": "09a000000002z6qz"
        }
        */

        resolve(result);

      });
    
    });

  }

  getOpportunitySummaryFields() {

    return new Promise<any[]>(resolve => {

      this.loadItem('summarylayout-opportunity', null).then(result => {

        let column;
        let res = [];
        let rows = result.pageLayout.pageLayoutSections[0].rows;
        for(var i=0; i<rows.length; i++){

          column = rows[i].columns[0];
          /* 

              {
                "updateable": false,
                "filterable": false,
                "apiName": "IsPrimary",
                "precision": 0,
                "custom": false,
                "length": 0,
                "scale": 0,
                "description": "This field tells if this quote is the primary quote for the opportunity",
                "nameField": false,
                "label": "Primary",
                "type": "boolean",
                "nillable": true,
                "restrictedPicklist": false,
                "createable": false,
                "name": "IsPrimary",
                "columnIndex": 0,
                "digits": 0,
                "isSpan": false
              }
          */
          

          res.push(column);

        }

        resolve(res);

      });

    });

  }




  getQuotes(params: any){

      // params.filterOptionValues = {
        
      //   // radio select options:
      //   //   expiredCatalogs
      //   //   expiredQuotes
      //   //   checkedOut
      //   //   viewOnly
      //   'quotes': 'expiredCatalogs', 

      //   // radio select options:
      //   //   today
      //   //   last7Days
      //   //   last30Days
      //   'dateModified': null,

      //   'currency': "USD",
      //   'owner': null,
      //   'status': null
      // }

    return new Promise(resolve => {

      let objectType = 'quote';

      this.queryItems(objectType, params).then(results => {

        let rows: any[] = results;
        /*
          "IsPrimary": true,
          "fpRules": {
            "acl": {
              "canEdit": true,
              "canDelete": true
            },
            "updateAvailable": false,
            "isDependentDataOutOfSync": false,
            "wf": {
              "canExport": true,
              "canAddQuote": true,
              "canAddProduct": true,
              "fieldData": [
                {
                  "isLink": false,
                  "label": "No Approval Required"
                }
              ],
              "showMoreInfo": false,
              "canEdit": true,
              "canMakePrimary": true,
              "canCopy": true,
              "canDelete": true,
              "canAddProposal": true,
              "canPreview": true
            }
          },
          "Id": "03a000012a6ijiwf",
          "TotalAmount": 7245.96,
          "FormattedId": "194403-1",
          "CurrencyIsoCode": "USD",
          "Name": "Quote for Salient Solutions"
        */

        if(rows.length>0){
          for(var i=0; i<rows.length; i++){

            if(!rows[i].AccountId){
              rows[i].AccountId = { Name: "Unknown Account" }
            }
            if(!rows[i].OpportunityId){
              rows[i].OpportunityId = { Name: "Unknown Opportunity" }
            }
            if(!rows[i].status){
              rows[i].status = "Status";
            }

          }
        }

        // TODO - remove filter stub
        if(params && params.filterOptionValues){
          resolve(rows.splice(0,1));
        }
        else{
          resolve(rows);
        }
      });


    });
  }


  getQuoteSummary(id) {

    return new Promise(resolve => {

      this.loadItem('retrieve-quote', id).then(result => {

        /*
          "LastModifiedDate": "2017-05-23T19:30:40Z",
          "Description": "Quote for Salient Solutions May 2017",
          "TotalChargesCost": 0,
          "TotalDiscountsAmount": 0,
          "FormattedIdBase": "194403",
          "Name": "Quote for Salient Solutions",
          "TotalCost": 5194.4,
          "TotalFeesCost": 0,
          "CreatedById": "09a000000002z6qz",
          "OwnerId": "09a000000002z6qz",
          "OpportunityId": "08a000012a6ijiwb",
          "TotalProductsCost": 5194.4,
          "IsProductUpdateAllowed": false,
          "fpRules": {
            "acl": {
              "canEdit": true,
              "canDelete": true
            },
            "updateAvailable": false,
            "isDependentDataOutOfSync": false,
            "wf": {
              "canExport": true,
              "canAddQuote": true,
              "canAddProduct": true,
              "fieldData": [
                {
                  "isLink": false,
                  "label": "No Approval Required"
                }
              ],
              "showMoreInfo": false,
              "canEdit": true,
              "canMakePrimary": true,
              "canCopy": true,
              "canDelete": true,
              "canAddProposal": true,
              "canPreview": true
            }
          },
          "ProductsAmount": 7245.96,
          "IsDependentDataOutOfSync": false,
          "ProductsCount": 2,
          "TotalProfit": 2051.56,
          "LastExportedDate": null,
          "ClonedFromId": null,
          "TotalFeesAmount": 0,
          "ExternalId": null,
          "ChargesAmount": 0,
          "TotalAmount": 7245.96,
          "CurrencyIsoCode": "USD",
          "FormattedId": "194403-1",
          "DiscountAmount": 0,
          "WorkflowStatus": "None",
          "FormattedIdSuffix": "-1",
          "FeesAmount": 0,
          "TotalDiscountsCost": 0,
          "ExpirationDate": "2017-10-31T00:00:00Z",
          "Note": null,
          "CreatedDate": "2017-05-23T18:19:11Z",
          "IsPrimary": true,
          "Id": "03a000012a6ijiwf",
          "TotalMargin": 28.3132,
          "TotalChargesAmount": 0,
          "LastModifiedById": "09a000000002z6qz"
        */
        /*
        result.id = result.Id;

        // TODO - link with account via Opportunity
        result.accountName = "Account Unknown";

        // TODO - link with Opportunity via OpportunityId
        result.opportunityName = "Opportunity "+result.OpportunityId;
        result.quoteName = 'test';//result.Name;
        result.access = (result.fpRules.acl.canEdit)? 'EDIT': 'VIEW_ONLY';
        result.lastModified = {
          date: result.LastModifiedDate.substring(0,10),
          time: result.LastModifiedDate.substring(11,19)
        };
        result.status = result.WorkflowStatus;
        result.priceList = result.CurrencyIsoCode; // "BRL for Brazil"
        result.totalPrice = result.TotalAmount+' '+result.CurrencyIsoCode;

        // TODO - get real country
        result.country = 'US';
        */

        // TODO - link with account via Opportunity
        result.accountName = "Account";

        // TODO - link with Opportunity via OpportunityId
        result.opportunityName = "Opportunity "+result.OpportunityId;
        result.quoteName = result.Name;

        resolve(result);

      });
    
    });

  }

  getSummaryLayout(objectType) {

    return new Promise<any[]>(resolve => {

      this.loadItem('summarylayout-'+objectType, null).then(result => {

        let column;
        let res = [];
        let rows = result.pageLayout.pageLayoutSections[0].rows;
        for(var i=0; i<rows.length; i++){

          column = rows[i].columns[0];
          /* 

              {
                "updateable": false,
                "filterable": false,
                "apiName": "IsPrimary",
                "precision": 0,
                "custom": false,
                "length": 0,
                "scale": 0,
                "description": "This field tells if this quote is the primary quote for the opportunity",
                "nameField": false,
                "label": "Primary",
                "type": "boolean",
                "nillable": true,
                "restrictedPicklist": false,
                "createable": false,
                "name": "IsPrimary",
                "columnIndex": 0,
                "digits": 0,
                "isSpan": false
              }
          */
          

          res.push(column);

        }

        resolve(res);

      });

    });

  }


  getQuoteFilterOptions() {

    return new Promise(resolve => {

      this.quoteFilterOptions = {

        // radio select options:
        //   expiredCatalogs
        //   expiredQuotes
        //   checkedOut
        //   viewOnly
        'quotes': [
          'expiredCatalogs',
          'expiredQuotes',
          'checkedOut',
          'viewOnly'
        ],

        // radio select options:
        //   today
        //   last7Days
        //   last30Days
        'dateModified': [
          'today',
          'last7Days',
          'last30Days'
        ],

        'currency': "USD",
        'owner': null,
        'status': null

      }

      resolve(this.quoteFilterOptions);

    });

  }


  getOpportunityQueryFilters(){

    return new Promise(resolve => {
      
      this.opportunityQueryFilters = {

        // radio select options:
        //   expiredCatalogs
        //   expiredQuotes
        //   checkedOut
        //   viewOnly
        'quotes': [
          'expiredCatalogs', 
          'expiredQuotes',
          'checkedOut',
          'viewOnly'
         ],

        // radio select options:
        //   today
        //   last7Days
        //   last30Days
        'dateModified': [
          'today',
          'last7Days',
          'last30Days'
        ],

        'currency': "USD",
        'owner': null,
        'status': null

      }

      resolve(this.opportunityQueryFilters);
    
    });

  }

  //
  //
  // SAMPLE DATA
  //
  //

  loadSampleData(){

    return Promise.all([
      this.loadSampleQuery('query-accounts.json', 'account'),
      this.loadSampleQuery('query-opportunities.json', 'opportunity'),
      this.loadSampleQuery('query-quotes.json', 'quote'),

      this.loadSampleItem('retrieve-account.json', 'retrieve-account'),
      this.loadSampleItem('retrieve-opportunity.json', 'retrieve-opportunity'),
      this.loadSampleItem('retrieve-quote.json', 'retrieve-quote'),

      this.loadSampleItem('describe-account.json', 'describe-account'),
      this.loadSampleItem('describe-opportunity.json', 'describe-opportunity'),

      this.loadSampleItem('listlayout-accounts.json', 'listlayout-account'),
      this.loadSampleItem('listlayout-opportunities.json', 'listlayout-opportunity'),

      this.loadSampleItem('summarylayout-account.json', 'summarylayout-account'),
      this.loadSampleItem('summarylayout-opportunity.json', 'summarylayout-opportunity'),
      this.loadSampleItem('summarylayout-quote.json', 'summarylayout-quote')
    ]);

  }

  loadSampleQuery(fileName, objectType){

    let item;
    let index = this.index['all-'+objectType];

    return new Promise(resolve => {

      this.http.get('assets/poc_data/'+fileName)
        .map(res => res.json())
        .subscribe(data => {

          for(var i=0; i<data.records.length; i++){
            item = data.records[i];

            if (index.indexOf(item.Id) == -1){
              index.push(item.Id);
            }

            // save record to Storage / SQLite
            this.storage.set(objectType+':'+item.Id, item);
          }

          // save INDEX to Storage/SQLite
          this.storage.set('index-all-'+objectType, index);

          resolve(index);
        });
      });


  }

  loadSampleItem(fileName, objectType){

    let key;

    return new Promise(resolve => {

      this.http.get('assets/poc_data/'+fileName)
        .map(res => res.json())
        .subscribe(data => {

          key = (data.Id)? objectType+':'+data.Id: objectType;

          // save record to SQLite
          this.storage.set(key, data);

          resolve();
        });
      });

  }

  //
  //
  //
  //


  //
  //
  // INDEXING LOCAL DATA
  //
  //


  indexLocalData(){

    this.updateSortIndex('quote-lastModifiedDate', 'quote', 'LastModifiedDate');
    this.updateKeywordIndex('quote-keywords', 'quote', ['Name']);
    this.updateKeywordIndex('opportunity-keywords', 'opportunity', ['AccountId.Name','Name','PrimaryQuoteId.Name']);

  }

  // update index sorted by objectType.column
  updateSortIndex(indexName, objectType, column){

    // for each object of objectType
    let index = [];
    let itemId, item;
    let ps = [];
    let all = this.index['all-'+objectType];
    for(var i=0; i < all.length; i++){

      itemId = all[i];

      // load object from Storage / SQLite
      ps.push(this.storage.get('retrieve-'+objectType+':'+itemId));

      // sort by value

    }

    Promise.all(ps).then(items => {

      for(var j=0; j < items.length; j++){
        if(items[j] != null){
          // if item is available locally
          index.push({ id: items[j].Id, value: items[j][column] });
        }
        else{
          // must retrieve item from server
          // TODO
        }
      }

      // sort index by value descending
      index.sort(function(a, b) {
        return a.value - b.value;
      });

      this.index[indexName] = index;
      
      // save INDEX to Storage/SQLite
      this.storage.set('index-'+indexName, index);

    });

  }

  // update index listing all keywords found in paths in objectType, as defined by
  // columns[0], columns[1], ...
  //
  // columns: ['name', 'person.dob']
  // DATA:
  //  { id: 'id0', name: "WordA", person: { dob: "DOB-a"} },
  //  { id: 'id1', name: "WordB" },
  //  { id: 'id2', name: "WordA", person: { dob: "DOB-a"} },
  //  { id: 'id3', name: "WordA", person: { dob: "DOB-c"} },
  //
  //
  // INDEX:
  // {
  //    "WordA": ['id0', 'id2', 'id3'],
  //    "WordB": ['id2']
  //    "DOB-a": ['id0', 'id2']
  //    "DOB-c": ['id3']
  //    ...
  // }
  //
  updateKeywordIndex(indexName, objectType, columns){

    // find deep path in object
    // deepFind(item, "PrimaryQuoteId.Id")
    function deepFind(obj, path) {
      if(!path) return null;

      var paths = path.split('.')
        , current = obj
        , i;

      for (i = 0; i < paths.length; ++i) {
        if (current[paths[i]] == undefined) {
          return undefined;
        } else {
          current = current[paths[i]];
        }
      }
      return current;
    }

    // for each object of objectType
    let index = [];
    let itemId, item, columnVal, toks, keyword;
    let ps = [];
    let all = this.index['all-'+objectType];
    for(var i=0; i < all.length; i++){

      itemId = all[i];

      // load object from Storage / SQLite
      ps.push(this.storage.get(objectType+':'+itemId));

    }

    Promise.all(ps).then(items => {

      for(var j=0; j < items.length; j++){
        if(items[j] != null){
          // if item is available locally
          
          item = items[j];

          for(var k=0; k < columns.length; k++){

            columnVal = deepFind(item, columns[k])
            if(columnVal){

              toks = columnVal.toString().split(' ');
              for(var t=0; t < toks.length; t++){

                keyword = toks[t];
                if(!index[keyword]){
                  index[keyword] = [];
                }

                index[keyword].push(item.Id);

              }

            }

          }

        }
        else{
          // must retrieve item from server
          // TODO
        }
      }

      this.index[indexName] = index;
      
      // save INDEX to Storage/SQLite
      this.storage.set('index-'+indexName, index);

    });


  }


  //
  //
  //
  //



  //
  //
  // LOCAL QUERY ENGINE
  //

  queryItems(objectType, expr){

    // check indexes for objectType
    //let indexes = this.indexesByObjectType[objectType];

    let ps = [];
    let all_index = this.index['all-'+objectType];

    let ids = all_index;
    let ids_result = [];
    let resultHasId = {};


    //
    // keyword query
    //
    if(expr.keywordIndex && expr.keywordQuery){


      let keyword_i = this.index[expr.keywordIndex];

      let keyword, keyword_index, itemId;
      let qtoks = expr.keywordQuery.split(' ');
      for(var q=0; q<qtoks.length; q++){

        keyword = qtoks[q];
        keyword_index = keyword_i[keyword];
        if(keyword_index){
          // keyword found in index

          for(var i=0; i<keyword_index.length; i++){
            itemId = keyword_index[i];

            // UNION of keywords
            resultHasId[itemId] = true;
            //if(ids.indexOf(itemId) == -1){
            //  ids.push(itemId);
            //}
          }
        }

      }

    }
    else{
      for(var i=0; i<all_index.length; i++){
        resultHasId[all_index[i]] = true;
      }
    }

    //
    // Apply sortIndex if applicable
    //
    if(expr.sortIndex){

      let sort_i = this.index[expr.sortIndex];

      for(var i=0; i<sort_i.length; i++){

        if(resultHasId[sort_i[i]]){
          ids_result.push(sort_i[i]);
        }

      }

    }
    else{

      for(let id in resultHasId){
        ids_result.push(id);
      }

    }

    //
    // Resolve result items
    //
    let result = [];
    for(var i=0; i<ids_result.length; i++){

      // resolve item
      ps.push(this.storage.get(objectType+':'+ids_result[i]));

    }

    return new Promise<any[]>(resolve => {
      Promise.all(ps).then(function(result){

        resolve(result);
      });

    });
  }

  loadItem(objectType, id){

    return new Promise<any>(resolve => {
      // try local storage

      let key = (id)? objectType+':'+id: objectType;

      this.storage.get(key).then(result => {

        resolve(result);

      });

    });
  }


  //
  //
  //




  // test method
  getUsers() {

    if (this.users) {
      // already loaded data
      return Promise.resolve(this.users);
    }

    // don't have the data yet
    return new Promise(resolve => {
      // We're using Angular HTTP provider to request the data,
      // then on the response, it'll map the JSON data to a parsed JS object.
      // Next, we process the data and resolve the promise with the new data.
      this.http.get('https://randomuser.me/api/?results=10')
        .map(res => res.json())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          this.users = data.results;
          resolve(this.users);
        });
    });
  }

  getAlerts(){

    return new Promise(resolve => {
      
      this.alerts = {
        'expiredCatalogOnQuote': [
        ],
        'expiredQuotes': [
          {
            'accountName': "Account A1",
            'opportunityName': "Opportunity O1",
            'quoteName': "Quote Q1"
          },
          {
            'accountName': "Account A2",
            'opportunityName': "Opportunity O2",
            'quoteName': "Quote Q2"
          }
        ]
      };

      resolve(this.alerts);

    });
  }

  getNotifications(){

    return new Promise(resolve => {
      
      this.notifications = [
        {
          'title': "CPQ Mobile 1.1 Release",
          'body': "Announcing CPQ Mobile 1.1 releasing on June XX, XXXX.\nNew features include:\n\tEnhancement 1\nEnhancement 2\nEnhancement 3"
        },
        {
          'title': "Upcoming Scheduled Downtime",
          'body': "CPQ will be down for maintenance on May XX, XXXX, for approximately 2 hours."
        }
      ];

      resolve(this.notifications);

    });

  }

  getMyRecentActivity(){

    return new Promise(resolve => {
      
      this.myRecentActivity = {

        'recentQuotes': [
          {
            'accountName': "Account A1",
            'opportunityName': "Opportunity O1",
            'quoteName': "Quote Q1",
            'lastModified': {
              'date': '5.04.2017',
              'time': '2:45 PM'
            }
          },
          {
            'accountName': "Account A2",
            'opportunityName': "Opportunity O2",
            'quoteName': "Quote Q2",
            'lastModified': {
              'date': '5.02.2017',
              'time': '1:45 PM'
            }
          },
          {
            'accountName': "Account A3",
            'opportunityName': "Opportunity O3",
            'quoteName': "Quote Q3",
            'lastModified': {
              'date': '5.01.2017',
              'time': '12:45 PM'
            }
          }
        ]
      
      };

      resolve(this.myRecentActivity);

    });

  }

  getMyCPQDriveSummary(){

    return new Promise(resolve => {
      
      this.myCPQDriveSummary = {
        'storage': {
          'mbUsed': 35,
          'mbAvailable': 50
        },
        'lastRefresh': {
          'date': '5.01.2017',
          'time': '2:45 PM'
        },
        'checkedOutQuotes': 4
      };

      resolve(this.myCPQDriveSummary);

    });

  }

  // getOpportunity(){

  //   return new Promise(resolve => {
      
  //     this.Opportunity = {
  //       'infos':[
  //       {
  //       'Name': 'Opportunity TEST',
  //       'status': 'Booked',
  //       'country': 'Brazil',
  //       },
  //       {
  //       'Name': 'Opportunity TEST2',
  //       'status': 'Not booked',
  //       'country': 'Germany',
  //       },
  //       {
  //       'Name': 'Opportunity TEST3',
  //       'status': 'Booked',
  //       'country': 'Brazil',
  //       }
  //       ]

  //     };

  //     resolve(this.Opportunity);

  //   });

  // }



  getOnlineStatus(){

    return new Promise(resolve => {
      
      let response = {
        'onlineMode': this.onlineMode,
        'autoRefresh': this.autoRefresh
      };

      return resolve(response);

    });

  }

  setOnlineStatus(params){
    this.onlineMode = params.onlineMode;
    if(params.autoRefresh) this.autoRefresh = params.autoRefresh;

  }



















  //
  // STUBS
  //


  stub_getOpportunities(){

    
      // params.filterBy = {
        
      //   // radio select options:
      //   //   expiredCatalogs
      //   //   expiredQuotes
      //   //   checkedOut
      //   //   viewOnly
      //   'quotes': 'expiredCatalogs', 

      //   // radio select options:
      //   //   today
      //   //   last7Days
      //   //   last30Days
      //   'dateModified': null,

      //   'currency': "USD",
      //   'owner': null,
      //   'status': null
      // }
    
    return new Promise(resolve => {
      
      this.opportunities = [
        {
          'id': '01',
          'customer': "Salient Solutions",
          'status': "Staging",
          'country': "Brazil",

        },
        {
          'id': '02',
          'customer': "Opportunity 2",
          'status': "Created",
          'country': "Brazil",
          
        },
        {
          'id': '03',
          'customer': "Opportunity 3",
          'status': "Created",
          'country': "Brazil",
         
        },
        {
          'id': '04',
          'customer': "Opportunity 4",
          'status': "Proposed",
          'country': "Singapore",
          
        }
      ];

      resolve(this.opportunities);

    });

  }

  stub_getOpportunityQueryFilters(){

    return new Promise(resolve => {
      
      this.opportunityQueryFilters = {

        // radio select options:
        //   expiredCatalogs
        //   expiredQuotes
        //   checkedOut
        //   viewOnly
        'quotes': [
          'expiredCatalogs', 
          'expiredQuotes',
          'checkedOut',
          'viewOnly'
         ],

        // radio select options:
        //   today
        //   last7Days
        //   last30Days
        'dateModified': [
          'today',
          'last7Days',
          'last30Days'
        ],

        'currency': "USD",
        'owner': null,
        'status': null

      }

      resolve(this.opportunityQueryFilters);
    
    });

  }

  stub_getOpportunityDetail(){

    return new Promise(resolve => {
      
      this.opportunityDetail = {


      }

      resolve(this.opportunityDetail);
    
    });


  }

  stub_getQuotes(params) {

    /*
       params.filterOptionValues
       {
          quotes: 'expiredQuotes',
          dateModified: 'today',
          currency: 'USD',
          owner: null,
          status: null
       }
    */
    if (params.filterOptionValues) {

      return new Promise(resolve => {

        this.quotes = [
          {
            'id': '01',
            'accountName': "Account A1",
            'opportunityName': "Opportunity O1",
            'quoteName': "Quote Q1",
            'access': 'CHECKED_OUT',
            'lastModified': {
              'date': '5.04.2017',
              'time': '2:45 PM'
            },
            'status': 'waitingForApproval'
          }
        ]
        resolve(this.quotes);

      });

    }


    if (params.isOnline) {

      return new Promise(resolve => {

        this.quotes = [
          {
            'quoteId': '01',
            'accountName': "Account A1",
            'opportunityName': "Opportunity O1",
            'quoteName': "Quote Q1",
            'access': 'CHECKED_OUT',
            'lastModified': {
              'date': '5.04.2017',
              'time': '2:45 PM'
            },
            'status': 'waitingForApproval',
            'priceList': "BRL for Brazil",
            'totalPrice': '870,000.00 BRL',
            'country': 'Brazil'
          },
          {
            'quoteId': '02',
            'accountName': "Account A2",
            'opportunityName': "Opportunity O2",
            'quoteName': "Quote Q2",
            'access': 'VIEW_ONLY',
            'lastModified': {
              'date': '5.04.2017',
              'time': '2:45 PM'
            },
            'status': 'waitingForApproval',
            'priceList': "BRL for Brazil",
            'totalPrice': '870,000.00 BRL',
            'country': 'Brazil'
          },
          {
            'quoteId': '03',
            'accountName': "Account A3",
            'opportunityName': "Opportunity O3",
            'quoteName': "Quote Q3",
            'access': null,
            'lastModified': {
              'date': '5.04.2017',
              'time': '2:45 PM'
            },
            'status': 'waitingForApproval',
            'priceList': "BRL for Brazil",
            'totalPrice': '870,000.00 BRL',
            'country': 'Brazil'
          }
        ];

        resolve(this.quotes);

      });

    }
    else {

      return new Promise(resolve => {

        this.quotes = [
          {
            'quoteId': '01',
            'accountName': "Account A1",
            'opportunityName': "Opportunity O1",
            'quoteName': "Quote Q1",
            'access': 'VIEW_ONLY',
            'lastModified': {
              'date': '5.04.2017',
              'time': '2:45 PM'
            },
            'status': 'waitingForApproval',
            'priceList': "BRL for Brazil",
            'totalPrice': '870,000.00 BRL',
            'country': 'Brazil'
          },
          {
            'quoteId': '03',
            'accountName': "Account A2",
            'opportunityName': "Opportunity O2",
            'quoteName': "Quote Q2",
            'access': 'VIEW_ONLY',
            'lastModified': {
              'date': '5.04.2017',
              'time': '2:45 PM'
            },
            'status': 'waitingForApproval',
            'priceList': "BRL for Brazil",
            'totalPrice': '870,000.00 BRL',
            'country': 'Brazil'
          },
          {
            'quoteId': '03',
            'accountName': "Account A3",
            'opportunityName': "Opportunity O3",
            'quoteName': "Quote Q3",
            'access': 'CHECKED_OUT',
            'lastModified': {
              'date': '5.04.2017',
              'time': '2:45 PM'
            },
            'status': 'waitingForApproval',
            'priceList': "BRL for Brazil",
            'totalPrice': '999,999.99 BRL',
            'country': 'Brazil'
          }
        ];

        resolve(this.quotes);

      });

    }

  }

  

  stub_getQuoteSummary(id) {

    return new Promise(resolve => {

      this.quoteSummary = [
        {
          'id': '01',
          'accountName': "Account A1",
          'opportunityName': "Opportunity O1",
          'quoteName': "Quote Q1",
          'access': 'VIEW_ONLY',
          'lastModified': {
            'date': '5.04.2017',
            'time': '2:45 PM'
          },
          'status': 'waitingForApproval',
          'priceList': "BRL for Brazil",
          'totalPrice': '870,000.00 BRL',
          'country': 'Brazil'
        }
      ];

      resolve(this.quoteSummary);

    });

  }

  stub_getQuoteSummaryVisibleFields() {

    return new Promise(resolve => {

      this.quoteSummaryVisibleFields = {

        'quoteName': true,
        'id': true,
        'status': true,
        'priceList': true,
        'totalPrice': true,
        'country': true

      }

      resolve(this.quoteSummaryVisibleFields);

    });

  }

  stub_getQuoteSummaryEditableFields() {

    return new Promise(resolve => {

      this.quoteSummaryEditableFields = {
        'quoteName': {
          type: 'text',
          options: null,
          value: ''
        },
        'status': {
          type: 'selection',
          options: ['In Progress', 'Waiting', 'Done'],
          value: ''
        },
        'country': {
          type: 'text',
          options: null,
          value: ''
        }
      }

      resolve(this.quoteSummaryEditableFields);

    });

  }

  updateQuote(changes) {
    // TODO: make this update quote
    console.log('updating quote');
    console.log(changes);
  }


  // FilterQuotes(){
  //   let quotes: any;
  //   this.getQuotes({teste:'teste'})
  //     .then (data => {
  //       quotes = data;
  //       console.log(quotes);
  //     });

   
      
  //   this.Filter = quotes;
  //   this.Filter.filter(
  //     experiedCatalog => {
  //       return experiedCatalog.lastModified.date === '1.04.2017'; 
  //     });
    
  // }


  //
  // ACTIONS
  //

  



}
