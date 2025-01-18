import { Injectable } from "@angular/core";
import { Trip, TripAdapter } from "./trip.model";
import { Adapter } from "./adapter";
import { MAX_FILTER_PRICE, MIN_FILTER_PRICE } from "../constants/settings";

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
    minPrice: number = MIN_FILTER_PRICE;
    maxPrice: number = MAX_FILTER_PRICE;
    minRating: number = 0;
    tags?: string;

    /**
     * Creates a PageFilter object from the provided item, if no item is provided teh class is created with the basic parameters.
     * 
     * @param item Object to overwrite class with
     */
    constructor(item?: any) {
      if (typeof item === 'object') {
        for (var prop in item) {
          if (
            Object.prototype.hasOwnProperty.call(item, prop) && // Checks if item has the property
            Object.prototype.hasOwnProperty.call(this, prop) // Checks if the PageFilter class has the property
          ) {
            (this as any)[prop] = item[prop];
          }
        }
      }
    }

    /**
     * Checks if the passed PageFilters has the same values as this one
     * 
     * @param filters PageFilters to compare
     * @returns true if the values are the same, false if not
     */
    compareTo(filters: PageFilters): boolean {
      return JSON.stringify(filters) === JSON.stringify(this);
    }
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