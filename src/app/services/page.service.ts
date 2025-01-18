import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Page, PageAdapter, PageFilters } from '../models/page.model';

const TRIPS_API = "https://iy3ipnv3uc.execute-api.eu-west-1.amazonaws.com/Prod/v1"
const PAGE_SIZE_OPTIONS = [12, 48, 96]

@Injectable({
  providedIn: 'root'
})
export class PageService {

  public pageSizeOptions = PAGE_SIZE_OPTIONS

  public storedPageFilters?: PageFilters;

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
    const url = `${TRIPS_API}/trips`;
    const options = {
      params: {
        page,
        limit: size,
        ...this.storedPageFilters
      }
    }
    const pageSubscription = this.http.get<Page>(url, options)
      .pipe( map( (val: any) => val ? this.pageAdapter.adapt(val) : val )).subscribe((page: Page) => {
        this.$page.next(page);
        pageSubscription.unsubscribe();
      });
  }
}
