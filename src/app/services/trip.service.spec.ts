import { TestBed } from '@angular/core/testing';

import { TripService } from './trip.service';
import { TripAdapter } from '../models/trip.model';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { TRIPS_API_URL } from '../constants/settings';
import { MOCK_TRIP } from '../testing/mocks';

describe('TripService', () => {
  let tripAdapter: TripAdapter;
  let tripService: TripService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    tripService = TestBed.inject(TripService);
    tripAdapter = TestBed.inject(TripAdapter);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('#getTrip should return a trip', (done: DoneFn) => {
    const expectedTrip = MOCK_TRIP;
    const tripId = MOCK_TRIP.id;

    tripService.getTrip(tripId).subscribe({
      next: (trip) => {
        expect(trip).withContext('expected trip').toEqual(tripAdapter.adapt(expectedTrip));
        done();
      },
      error: done.fail,
    });

    const req = httpTesting.expectOne(`${TRIPS_API_URL}/trips/${tripId}`);
    expect(req.request.method).toBe("GET");
    req.flush(expectedTrip);
  });

  it('#getTrip should return an error when no trip is found', (done: DoneFn) => {
    const tripId = `bad-${MOCK_TRIP.id}`;

    tripService.getTrip(tripId).subscribe({
      next: (trip) => done.fail('expected an error, not trip'),
      error: (error) => {
        expect(error.status).withContext('expected status').toEqual(400);
        done();
      },
    });

    const req = httpTesting.expectOne(`${TRIPS_API_URL}/trips/${tripId}`);
    expect(req.request.method).toBe("GET");
    req.flush(null);
  });
  
  it('#getTrip should return an error when the server returns a 404', (done: DoneFn) => {
    const errorResponse = new HttpErrorResponse({
      error: 'Test 404 error',
      status: 404,
      statusText: 'Not Found',
    });
    const tripId = MOCK_TRIP.id;
    tripService.getTrip(tripId).subscribe({
      next: (trip) => done.fail('expected an error, not trip'),
      error: (error) => {
        expect(error.status).withContext('expected status').toEqual(404);
        done();
      },
    });

    const req = httpTesting.expectOne(`${TRIPS_API_URL}/trips/${tripId}`);
    req.flush('Failed!', {status: 404, statusText: 'Not Found'});
  });

  it('#getRandomTrip should return a trip', (done: DoneFn) => {
    const expectedTrip = MOCK_TRIP;

    tripService.getRandomTrip().subscribe({
      next: (trip) => {
        expect(trip).withContext('expected trip').toEqual(tripAdapter.adapt(expectedTrip));
        done();
      },
      error: done.fail,
    });

    const req = httpTesting.expectOne(`${TRIPS_API_URL}/trips/random/trip-of-the-day`);
    expect(req.request.method).toBe("GET");
    req.flush(expectedTrip);
  });
  
  it('#getRandomTrip should return an error when the server returns a 404', (done: DoneFn) => {
    const errorResponse = new HttpErrorResponse({
      error: 'Test 404 error',
      status: 404,
      statusText: 'Not Found',
    });
    tripService.getRandomTrip().subscribe({
      next: (trip) => done.fail('expected an error, not trip'),
      error: (error) => {
        expect(error.status).withContext('expected status').toEqual(404);
        done();
      },
    });

    const req = httpTesting.expectOne(`${TRIPS_API_URL}/trips/random/trip-of-the-day`);
    req.flush('Failed!', {status: 404, statusText: 'Not Found'});
  });
});
