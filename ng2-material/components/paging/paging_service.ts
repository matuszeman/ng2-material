import {Injectable} from 'angular2/core';
import {Subject} from 'rxjs/Subject';
import {IPagingModel, IPagingChange} from './paging';


@Injectable()
export class PagingService {
  public onChange: Subject<IPagingChange>;

  constructor() {
    this.onChange = new Subject(null);
  }

  change(_name: string, _paging: IPagingModel) {
    let newEvent: IPagingChange = {
      name: 'paging_changed',
      target: _name,
      paging: _paging
    };

    this.onChange.next(newEvent);
  }
}
