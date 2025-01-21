import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Trip, TripAdapter } from '../models/trip.model';
import { catchError, map, Observable, throwError } from 'rxjs';
import { TRIPS_API_URL } from '../../constants/settings';

@Injectable({
  providedIn: 'root'
})
export class TripService {

  /**
   * 
   * @param http Angular http client
   * @param tripAdapter Used to transform fetched trips into typed objects
   */
  constructor(private http: HttpClient, private tripAdapter: TripAdapter) { }

  /**
   * Fetches the trip with the passed id from the API
   * 
   * @param id Id of the Trip to fetch
   * @returns An observable with the result of the query
   */
  public getTrip(id: string): Observable<Trip> {
    const url = `${TRIPS_API_URL}/trips/${id}`;
    return this.http.get<Trip>(url).pipe(
      map((val: any) => {
        if (val) {
          return this.tripAdapter.adapt(val)
        } else {
          // We throw a custom error if no data, as the provided API will not throw an error by itself
          throw new HttpErrorResponse({
            error: 'No trip with that ID has been found',
            statusText: `No trip with id:${id} exists`,
            status: 400,
            url
          })}
        }),
      catchError(error => throwError(() => error))
    );
  }

  /**
   * Fetches a random trip from the API
   * 
   * @returns An observable with the result of the query
   */
  public getRandomTrip(): Observable<Trip> {
    const url = `${TRIPS_API_URL}/trips/random/trip-of-the-day`;
    return this.http.get<Trip>(url).pipe(
      map((val: any) => this.tripAdapter.adapt(val)),
      catchError(error => throwError(() => error))
    );
  }
}
