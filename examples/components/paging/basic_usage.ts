import {Component} from "angular2/core";
import {MATERIAL_DIRECTIVES} from "ng2-material/all";

import {tableDatas} from './paging_datas';

@Component({
  selector: 'paging-basic-usage',
  templateUrl: 'examples/components/paging/basic_usage.html',
  directives: [MATERIAL_DIRECTIVES]
})
export default class PagingBasicUsage {
  materials: Array<any> = tableDatas;

  paging: any = {
    currentPage: 1,
    itemsPerPage: 5,
    totalItems: 24
  };

  availableLength: Array<number> = [5, 10, 20];

  pagedMaterials: Array<any> = [];

  constructor() {
    this.refreshMaterials();
  }

  refreshMaterials() {
    let start = (this.paging.currentPage - 1) * this.paging.itemsPerPage,
      end = start + this.paging.itemsPerPage;
    this.pagedMaterials = this.materials.slice(start, end);
  }

  detectChange(event) {
    if (event !== undefined && event.name === 'paging_changed' && event.paging !== undefined) {
      this.paging = event.paging;
      this.refreshMaterials();
    }
  }
}
