import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';

import { SelectQuote } from '../pages/quote/select-quote';
import { QuoteFilter } from '../pages/quote/quote-filter';
import { QuoteDetails } from '../pages/quote/quote-details';
import { ProductSummary } from '../pages/quote/product-summary';

import { SelectOpportunity } from '../pages/opportunity/select-opportunity';
import { OpportunityDetails } from '../pages/opportunity/opportunity-details';
import { Popover } from '../pages/opportunity/popover';
import { OpportunityFilter } from '../pages/opportunity/opportunity-filter';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LocalDataServiceProvider } from '../providers/local-data-service/local-data-service';
import { HttpModule } from '@angular/http';

import { StatusbarComponent} from "../components/statusbar.component";
import { Filter} from "../components/filter.component";

import { SQLite } from '@ionic-native/sqlite';
import { IonicStorageModule } from '@ionic/storage';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TabsPage,
    SelectQuote,
    QuoteFilter,
    QuoteDetails,
    SelectOpportunity,
    OpportunityDetails,
    OpportunityFilter,
    ProductSummary,
    Popover,
    StatusbarComponent, 
    Filter
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name: '__fpxdb',
         driverOrder: ['indexeddb', 'sqlite', 'websql']
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TabsPage,
    SelectQuote,
    QuoteFilter,
    QuoteDetails,
    SelectOpportunity,
    OpportunityFilter,
    OpportunityDetails,
    ProductSummary,
    Popover,
    StatusbarComponent,
    Filter
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    LocalDataServiceProvider,
    SQLite
  ]
})
export class AppModule {}
