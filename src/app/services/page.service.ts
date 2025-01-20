import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, filter, map, Observable, throwError } from 'rxjs';
import { Page, PageAdapter, PageFilters } from '../models/page.model';
import { PAGE_SIZE_OPTIONS, TRIPS_API_URL } from '../constants/settings';

@Injectable({
  providedIn: 'root'
})
export class PageService {

  /**
   * Simple variable to save the page filters in the service
   */
  public storedPageFilters = new PageFilters;

  /**
   * Behaviour subject used to save the current page in the service
   */
  private $page = new BehaviorSubject<Page>(new Page);

  /**
   * Fetches the first page when constructed
   * 
   * @param http Angular http client
   * @param pageAdapter Used to transform fetched pages to a typed objects
   */
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
   * @returns an observable with the result of the query
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
    const pageObservable = this.http.get<Page>(url, options)
      .pipe(
        map((val) => this.pageAdapter.adapt(val)),
        catchError(error => throwError(() => error))
      );

    const pageSubscription = pageObservable.subscribe({
      next: (page) => this.$page.next(page),
      error: () => this.storedPageFilters = new PageFilters, // Resets filters in case that caused the error.
      complete:() => pageSubscription.unsubscribe()
    });
    
    return pageObservable;
  }

  /**
   * Returns the passed filter without the undefined options
   * 
   * @param filters Filters
   * @returns Passed param without undefined options
   */
  private filterAsOptions(filters: PageFilters): any {
    let result: any = {};
    for (var prop in filters) {
      if (Object.prototype.hasOwnProperty.call(filters, prop)) {
        if (typeof (filters as any)[prop] !== 'undefined') {
          result[prop] = (filters as any)[prop];
        }
      }
    }
    return result;
  }
}
