import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Trip, TripAdapter } from '../models/trip.model';
import { catchError, map, Observable, throwError } from 'rxjs';
import { TRIPS_API_URL } from '../constants/settings';

@Injectable({
  providedIn: 'root'
})
export class TripService {

  constructor(private http: HttpClient, private tripAdapter: TripAdapter) { }

  public getTrip(id: string): Observable<Trip> {
    const url = `${TRIPS_API_URL}/trips/${id}`;
    return this.http.get<Trip>(url).pipe(
      map((val: any) => {
        if (val) {
          return this.tripAdapter.adapt(val)
        } else {
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
}
