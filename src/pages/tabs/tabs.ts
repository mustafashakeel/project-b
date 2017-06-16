import { Component } from '@angular/core';

import { SelectQuote } from '../quote/select-quote';
import { SelectOpportunity } from '../opportunity/select-opportunity';
import { HomePage } from '../home/home';
//mport { ContactPage } from '../contact/contact';
//mport { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = SelectQuote;
  tab3Root = SelectOpportunity;
  tab4Root = SelectQuote;
  tab5Root = HomePage;

  constructor() {

  }
}
