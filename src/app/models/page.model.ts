import { Injectable } from "@angular/core";
import { Trip, TripAdapter } from "./trip.model";
import { Adapter } from "./adapter";

/**
 * Page filter SortORder type
 */
export type SortOrder = 'ASC' | 'DESC';

/**
 * Page filter Sortby type
 */
export type SortBy = 'title' | 'price' | 'rating' | 'creationDate';

/**
 * Available filters for the trips query
 */
export class PageFilters {
    sortBy?: SortBy;
    sortOrder?: SortOrder;
    titleFilter: string = '';
    minPrice: number = 0;
    maxPrice: number = 0;
    minRating: number = 0;
    tags?: string;
}

/**
 * Trip page type declaration
 */
export class Page {
  items: Trip[] = [];
  limit: number = 0;
  page: number = 0;
  total: number = 0;
}

/**
 * Used to adapt trip page / list API responses to typed objects
 */
@Injectable({
  providedIn: 'root',
})
export class PageAdapter implements Adapter<Page> {

  /**
   * Imports required classes
   * 
   * @param tripAdapter Used to adapt trip items inside a Page
   */
  constructor(private tripAdapter: TripAdapter) {}

  /**
   * Creates a new Page object from the API response
   *
   * @param API item to adapt
   * @returns Adapted item as a Page object
   */
  adapt(item: any): Page {
    const page: Page = {
      items: item.items.map((trip: any) => this.tripAdapter.adapt(trip)),
      limit: item.limit,
      page: item.page,
      total: item.total
    };
    return page;
  }
}