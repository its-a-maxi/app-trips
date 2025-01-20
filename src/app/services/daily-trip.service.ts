import { Injectable } from '@angular/core';
import { TripService } from './trip.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DailyTripService {

  /**
   * 
   * @param tripService Used to fetch the random trip of the day
   */
  constructor(private tripService: TripService) { }

  /**
   * Tries to get the trip of the day from the local storage,
   * if that fails, it will fetch a random trip and save it in the local storage
   * 
   * @returns A promise which will return the trip of the day id or a null if there's any error
   */
  public async getDailyTrip(): Promise<string | null> {
    const dailyTripId = localStorage.getItem("dailyTripId");
    const dailyTripDay = localStorage.getItem("dailyTripDay");
    const today = new Date().toDateString();

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
