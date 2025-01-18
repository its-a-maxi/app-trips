import { TestBed } from '@angular/core/testing';

import { TripService } from './trip.service';
import { Trip, TripAdapter } from '../models/trip.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { asyncData, asyncError } from '../testing/async-observable-helpers';

describe('TripService', () => {
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let tripAdapter: TripAdapter;
  let tripService: TripService;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    tripAdapter = new TripAdapter;
    tripService = new TripService(httpClientSpy, tripAdapter);
  });

  it('#getTrip should return expected trip (HttpClient called once)', (done: DoneFn) => {
    const expectedTrip: any = {
      id: "uuid",
      title: "Trip to Paris",
      description: "A beautiful journey through the city of lights",
      price: 1000,
      rating: 4.5,
      nrOfRatings: 120,
      verticalType: "flight",
      tags: [
        "station",
        "airport",
        "city",
        "culture"
      ],
      co2: 5.9,
      thumbnailUrl: "https://example.com/thumbnail.jpg",
      imageUrl: "https://example.com/image.jpg",
      creationDate: "2024-01-01T00:00:00Z"
    }
    httpClientSpy.get.and.returnValue(asyncData(expectedTrip));
    tripService.getTrip('uuid').subscribe({
      next: (trip) => {
        expect(trip).withContext('expected trip').toEqual(tripAdapter.adapt(expectedTrip));
        done();
      },
      error: done.fail,
    });
    expect(httpClientSpy.get.calls.count()).withContext('one call').toBe(1);
  });

  it('#getTrip should return an error when no trip is found', (done: DoneFn) => {
    httpClientSpy.get.and.returnValue(asyncData(undefined));
    tripService.getTrip('nonExistent-uuid').subscribe({
      next: (trip) => done.fail('expected an error, not trip'),
      error: (error) => {
        expect(error.status).withContext('expected status').toEqual(400);
        done();
      },
    });
  });
  
  it('#getTrip should return an error when the server returns a 404', (done: DoneFn) => {
    const errorResponse = new HttpErrorResponse({
      error: 'Test 404 error',
      status: 404,
      statusText: 'Not Found',
    });
    httpClientSpy.get.and.returnValue(asyncError(errorResponse));
    tripService.getTrip('uuid').subscribe({
      next: (trip) => done.fail('expected an error, not trip'),
      error: (error) => {
        expect(error.status).withContext('expected status').toEqual(404);
        done();
      },
    });
  });
});
