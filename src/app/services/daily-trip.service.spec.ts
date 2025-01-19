import { TestBed } from '@angular/core/testing';

import { DailyTripService } from './daily-trip.service';
import { provideHttpClient } from '@angular/common/http';

import { MOCK_TRIP } from '../testing/mocks';
import { TripService } from './trip.service';
import { Trip, TripAdapter } from '../models/trip.model';
import { BehaviorSubject } from 'rxjs';

describe('DailyTripService', () => {
  let dailyTripService: DailyTripService;
  let tripService: TripService;
  let tripAdapter = new TripAdapter();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient()
      ],
    });
    dailyTripService = TestBed.inject(DailyTripService);
    tripService = TestBed.inject(TripService);

    // Set default local storage values
    localStorage.setItem("dailyTripId", 'locally-stored-id');
    localStorage.setItem("dailyTripDay", new Date().toDateString());

    // Mock implementation of getRandomTrip without the use of http
    tripService.getRandomTrip = () => {
      const result = new BehaviorSubject<Trip>(tripAdapter.adapt(MOCK_TRIP));
      return result.asObservable();
    }
  });
    
  it('#getDailyTrip should return an id', async () => {
    const expectedId = MOCK_TRIP.id;
    localStorage.clear(); // Clear local storage
    await dailyTripService.getDailyTrip().then((res) => {
      expect(res).withContext('expected trip id').toBe(expectedId);
    });
  })
    
  it('#getDailyTrip should return the locally stored id if the day matches', async () => {

    tripService.getRandomTrip = () => {
      const result = new BehaviorSubject<Trip>(tripAdapter.adapt(MOCK_TRIP));
      return result.asObservable();
    }
    await dailyTripService.getDailyTrip().then((res) => {
      expect(res).withContext('expected trip id').toBe('locally-stored-id');
    });
  })
    
  it('#getDailyTrip shouldn\'t return the locally stored id if the day doesn\'t match', async () => {
    const expectedId = MOCK_TRIP.id;

    let yesterday = new Date();
    yesterday.setDate(new Date().getDate() - 1);
    localStorage.setItem("dailyTripDay", yesterday.toDateString()); // Update local storage date

    tripService.getRandomTrip = () => {
      const result = new BehaviorSubject<Trip>(tripAdapter.adapt(MOCK_TRIP));
      return result.asObservable();
    }
    await dailyTripService.getDailyTrip().then((res) => {
      expect(res).withContext('expected trip id').toBe(expectedId);
    });
  })
});
