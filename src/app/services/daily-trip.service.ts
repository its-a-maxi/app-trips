import { Injectable } from '@angular/core';
import { TripService } from './trip.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DailyTripService {

  // private _dailyTrip?: { id: string, date: Date }
  // public get dailyTrip() {
  //   return 
  // }

  constructor(private tripService: TripService) { }

  public async getDailyTrip(): Promise<string | null> {
    const dailyTripId = localStorage.getItem("dailyTripId");
    const dailyTripDay = localStorage.getItem("dailyTripDay");
    const today = new Date().toDateString();
    console.log(today, dailyTripDay, dailyTripId);

    if (dailyTripId && dailyTripDay && today === dailyTripDay) {
      return Promise.resolve(dailyTripId);
    }
    
    const trip = await firstValueFrom(this.tripService.getRandomTrip());
    if (trip) {
      localStorage.setItem("dailyTripId", trip.id);
      localStorage.setItem("dailyTripDay", today);
      return Promise.resolve(trip.id);
    } else {
      return Promise.resolve(null);
    }
  }
}
