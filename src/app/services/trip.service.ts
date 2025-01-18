import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Trip, TripAdapter } from '../models/trip.model';
import { map } from 'rxjs';

const TRIPS_API = "https://iy3ipnv3uc.execute-api.eu-west-1.amazonaws.com/Prod/v1"

@Injectable({
  providedIn: 'root'
})
export class TripService {

  constructor(private http: HttpClient, private tripAdapter: TripAdapter) { }

  public getTrip(id: string) {
    const url = `${TRIPS_API}/trips/${id}`;
    return this.http.get<Trip>(url).pipe(map((val: any) => val ? this.tripAdapter.adapt(val) : val));
  }
}
