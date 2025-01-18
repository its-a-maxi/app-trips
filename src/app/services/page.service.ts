import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, Observable } from 'rxjs';
import { Page, PageAdapter, PageFilters } from '../models/page.model';
import { PAGE_SIZE_OPTIONS, TRIPS_API_URL } from '../constants/settings';

@Injectable({
  providedIn: 'root'
})
export class PageService {

  public storedPageFilters = new PageFilters;

  private $page = new BehaviorSubject<Page>(new Page);

  constructor(private http: HttpClient, private pageAdapter: PageAdapter) {
    this.updatePage();
  }

  /**
   * Gets the saved page
   * 
   * @returns an observable of the saved page, which will change whent he page is updated.
   */
  public getPage() {
    return this.$page.asObservable();
  }

  /**
   * Fetches a new page using the provided parameters, the result will update the saved page.
   * 
   * @param page Page index
   * @param size Page size
   * @param filters Applied filters
   */
  public updatePage(page: number = 1, size: number = PAGE_SIZE_OPTIONS[0], filters?: PageFilters) {
    if (filters) {
      // Saves the passed filters
      this.storedPageFilters = filters;
      page = 1;
    }
    const url = `${TRIPS_API_URL}/trips`;
    const options = {
      params: {
        page,
        limit: size,
        ...this.filterAsOptions(this.storedPageFilters)
      }
    }
    const pageSubscription = this.http.get<Page>(url, options)
      .pipe( map( (val: any) => val ? this.pageAdapter.adapt(val) : val )).subscribe((page: Page) => {
        this.$page.next(page);
        pageSubscription.unsubscribe();
      });
  }

  private filterAsOptions(filters: any): any {
    let result: any = {};
    for (var prop in filters) {
      if (Object.prototype.hasOwnProperty.call(filters, prop)) {
        if (typeof (filters as any)[prop] !== 'undefined') {
          result[prop] = filters[prop];
        }
      }
    }
    return result;
  }
}
