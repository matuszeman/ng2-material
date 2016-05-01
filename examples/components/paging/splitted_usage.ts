import {Component, ViewEncapsulation} from "angular2/core";
import {MATERIAL_DIRECTIVES} from "ng2-material/all";

import {bookDatas} from './paging_datas';

@Component({
  selector: 'paging-splitted-usage',
  templateUrl: 'examples/components/paging/splitted_usage.html',
  styleUrls: ['examples/components/paging/splitted_usage.css'],
  directives: [MATERIAL_DIRECTIVES],
  encapsulation: ViewEncapsulation.None
})
export default class PagingSplittedUsage {
  pages: Array<string> = bookDatas;

  paging: any = {
    currentPage: 1,
    itemsPerPage: 2,
    totalItems: 6
  };
  
  rangeFormat: string = `
    <span flex="50" layout="column" class="page-number">{start}</span>
    <span flex="50" layout="column" class="page-number">{end}</span>
  `;

  displayedPages: Array<string> = [];

  constructor() {
    this.refreshPages();
  }

  refreshPages() {
    let start = (this.paging.currentPage - 1) * this.paging.itemsPerPage,
      end = start + this.paging.itemsPerPage;
    this.displayedPages = this.pages.slice(start, end);
  }

  detectChange(event) {
    if (event !== undefined && event.name === 'paging_changed' && event.paging !== undefined) {
      this.paging = event.paging;
      this.refreshPages();
    }
  }
}
