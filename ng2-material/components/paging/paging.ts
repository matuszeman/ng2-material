import {Component, Input, Output, EventEmitter, ElementRef, ComponentRef, DynamicComponentLoader, AfterViewInit, AfterContentInit} from 'angular2/core';
import {isPresent} from "angular2/src/facade/lang";
import 'rxjs/add/operator/filter';
import {PagingService} from './paging_service';

export interface IPagingModel {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

@Component({
  selector: 'md-paging-range',
  template: '',
  host: {
    '[class.md-paging-range]': 'true',
    '[innerHTML]': 'getRange()'
  }
})
export class MdPagingRange {
  @Input()
  name: string = 'default';

  @Input()
  model: IPagingModel;

  @Input()
  rangeFormat: string = '{start}-{end} of {total}';

  public value: string = '';

  /**
   * tranform format into an readable string
   *
   * @returns {string}
   */
  public _getFormattedValue(rangeStart: number, rangeStop: number, totalItems: number) {
    let result: string = this.rangeFormat;

    result = result.replace(/\{start\}/gi, rangeStart.toString());
    result = result.replace(/\{end\}/gi, rangeStop.toString());
    result = result.replace(/\{total\}/gi, totalItems.toString());

    return result;
  }

  /**
   * calculate range depending via model parameters
   *
   * @param {IPagingModel} model
   * @private
   */
  private getRange() {
    if (isPresent(this.model)) {
      let _rangeStart = (this.model.currentPage - 1) * this.model.itemsPerPage + 1;

      let rest = this.model.totalItems - _rangeStart,
        _rangeStop = rest < this.model.itemsPerPage ? this.model.totalItems : _rangeStart + this.model.itemsPerPage - 1;

      return this._getFormattedValue(_rangeStart, _rangeStop, this.model.totalItems);
    }

    return;
  }

  constructor(private _service: PagingService) {
    this._service.onChange
      .filter(event => isPresent(event) && isPresent(event.name))
      .filter(event => event.target === this.name)
      .subscribe(event => {
        this.model = event.paging;
      });
  }
}

@Component({
  selector: 'md-paging-controls',
  template: `
      <span [class.md-paging-control-active]="!isFirstPage()" class="md-paging-control md-paging-control-previous">
        <button (click)="previousPage()" class="material-icons">keyboard_arrow_left</button>
      </span>
      <span [class.md-paging-control-active]="!isLastPage()" class="md-paging-control md-paging-control-next">
        <button (click)="nextPage()" class="material-icons">keyboard_arrow_right</button>
      </span>
    `,
  host: {
    '[class.md-paging-controls]': 'true'
  }
})
export class MdPagingControls {
  @Input()
  name: string = 'default';

  @Input()
  model: IPagingModel;

  isFirstPage() {
    return isPresent(this.model) && this.model.currentPage == 1;
  }

  isLastPage() {
    return isPresent(this.model) && this.model.totalItems <= this.model.currentPage * this.model.itemsPerPage;
  }

  previousPage() {
    this._changePage(this.model.currentPage - 1);
  }

  nextPage() {
    this._changePage(this.model.currentPage + 1);
  }

  _changePage(newPage: number) {
    let _model = JSON.parse(JSON.stringify(this.model));
    _model.currentPage = newPage;
    this._service.change(this.name, _model);
  }

  constructor(private _service: PagingService) {
    this._service.onChange
      .filter(event => isPresent(event) && isPresent(event.name))
      .filter(event => event.target === this.name)
      .subscribe(event => {
        this.model = event.paging;
      });
  }
}

@Component({
  selector: 'md-paging-length-selector',
  template: `
   <span *ngIf="selectorLengthBefore" class="md-paging-length-selector-label md-paging-length-selector-before">{{selectorLengthBefore}}</span>
   <select [(ngModel)]="model.itemsPerPage" (ngModelChange)="changePagingLength($event)" class="md-paging-length-select">
      <option *ngFor="#length of selectorLengthAvailable" [value]="length">
        {{length}}
      </option>
    </select>
    <span *ngIf="selectorLengthAfter" class="md-paging-length-selector-label md-paging-length-selector-after">{{selectorLengthAfter}}</span>
  `,
  host: {
    '[class.md-paging-length-selector]': 'true',
    '[hidden]': '!selectorLengthAvailable.length'
  }
})
export class MdPagingLengthSelector {
  @Input()
  selectorLengthBefore: string = 'Rows per page:';

  @Input()
  selectorLengthAfter: string;

  @Input()
  selectorLengthAvailable: Array<number> = [];

  @Input()
  name: string = 'default';

  @Input()
  model: IPagingModel = {
    currentPage: 0,
    itemsPerPage: 0,
    totalItems: 0
  };

  constructor(private _service: PagingService) {
    this._service.onChange
      .filter(event => isPresent(event) && isPresent(event.name))
      .filter(event => event.target === this.name)
      .subscribe(event => {
        if (isPresent(event.paging)) {
          this.model = event.paging;
        }
      });
  }

  changePagingLength(value) {
    let _model = JSON.parse(JSON.stringify(this.model));
    _model.currentPage = 1;
    _model.itemsPerPage = parseInt(value);
    this._service.change(this.name, _model);
  }

}

export interface IPagingChange {
  name: string;
  target: string;
  paging: IPagingModel;
}

@Component({
  selector: 'md-paging',
  template: `
    <ng-content></ng-content>
    <div #default></div>
  `,
  directives: [MdPagingRange, MdPagingControls, MdPagingLengthSelector],
  host: {
    '[class.md-paging]': 'true'
  }
})
export class MdPaging implements AfterContentInit, AfterViewInit {
  @Input()
  name: string = 'default';

  @Input()
  model: IPagingModel;

  @Input()
  range: boolean = true;

  @Input()
  controls: boolean = true;

  @Input()
  lengthSelector: boolean = true;

  @Input()
  rangeFormat: string;

  @Input()
  selectorLengthBefore: string;

  @Input()
  selectorLengthAfter: string;

  @Input()
  selectorLengthAvailable: Array<number>;

  @Output()
  onPageChange: EventEmitter<IPagingChange> = new EventEmitter(false);

  constructor(private _service: PagingService, private _element: ElementRef, private _componentLoader: DynamicComponentLoader) {
    this._service.onChange
      .filter(event => isPresent(event) && isPresent(event.name))
      .filter(event => event.target === this.name)
      .subscribe(event => this.onPageChange.emit(event));

  }

  _initDefaultLayout() {
    if (this.lengthSelector === true) {
      this._componentLoader.loadIntoLocation(MdPagingLengthSelector, this._element, 'default')
        .then((lengthSelector: ComponentRef) => {
          lengthSelector.instance.name = this.name;
          lengthSelector.instance.model = this.model;
          if (isPresent(this.selectorLengthBefore)) {
            lengthSelector.instance.selectorLengthBefore = this.selectorLengthBefore;
          }
          if (isPresent(this.selectorLengthAfter)) {
            lengthSelector.instance.selectorLengthAfter = this.selectorLengthAfter;
          }
          if (isPresent(this.selectorLengthAvailable)) {
            lengthSelector.instance.selectorLengthAvailable = this.selectorLengthAvailable;
          }
        });
    }
    if (this.range === true) {
      this._componentLoader.loadIntoLocation(MdPagingRange, this._element, 'default')
        .then((range: ComponentRef) => {
          range.instance.name = this.name;
          range.instance.model = this.model;
          if (isPresent(this.rangeFormat)) {
            range.instance.rangeFormat = this.rangeFormat;
          }
        });
    }
    if (this.controls === true) {
      this._componentLoader.loadIntoLocation(MdPagingControls, this._element, 'default')
        .then((controls: ComponentRef) => {
          controls.instance.name = this.name;
          controls.instance.model = this.model;
        });
    }
  }

  ngAfterContentInit() {
    if (this._element.nativeElement.childElementCount === 1) {
      this._initDefaultLayout();
    }
  }

  ngAfterViewInit() {
    this._service.change(this.name, this.model);
  }
}
