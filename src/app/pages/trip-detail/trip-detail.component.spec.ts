import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripDetailComponent } from './trip-detail.component';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { TripService } from '../../services/trip.service';
import { BehaviorSubject, catchError, map, throwError } from 'rxjs';
import { Trip, TripAdapter } from '../../models/trip.model';
import { MOCK_TRIP } from '../../testing/mocks';
import { RouterTestingHarness } from '@angular/router/testing'
import { provideRouter, Router } from '@angular/router';
import { FormatDatePipe } from '../../pipes/format-date.pipe';

// Mock implementation of getTrip without the use of http
const mockGetTrip = function(id: string) {
  const result = new BehaviorSubject(new TripAdapter().adapt(MOCK_TRIP));
  return result.asObservable().pipe(map((val: any) => {
        if (val.id === id) {
          return val
        } else {
          console.log('error-triggered')
          throw new HttpErrorResponse({
            error: 'No trip with that ID has been found',
            statusText: `No trip with id:${id} exists`,
            status: 400
          })
        }
      }),
    catchError(error => throwError(() => error))
  );
}

describe('TripDetailComponent', () => {
  let component: TripDetailComponent;
  let harness: RouterTestingHarness;
  let fixture: ComponentFixture<TripDetailComponent>;
  let tripService: TripService;

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [
        TripDetailComponent
      ],
      providers: [
        provideRouter([
          {path: 'trips/:id', component: TripDetailComponent},
        ]),
        provideHttpClient(),
      ]
    })
    .compileComponents();

    tripService = TestBed.inject(TripService);
    tripService.getTrip = mockGetTrip;

    harness = await RouterTestingHarness.create();
    fixture = harness.fixture as ComponentFixture<TripDetailComponent>;

    component = await harness.navigateByUrl(
      `trips/${MOCK_TRIP.id}`,
      TripDetailComponent
    );
  });

  it('should fetch the expected trip from the url id', async () => {
    expect(component.trip?.id).withContext('expected trip id').toMatch(MOCK_TRIP.id);
  });

  it('should go back to home if the trip from the url id doesn\'t exist', async () => {
    await harness.navigateByUrl(
      `trips/non-existent-id`
    );
    expect(TestBed.inject(Router).url)
      .withContext('should nav to home if #getTrip returns an error')
      .toEqual(`/`);
  });

  it('should go back to home when back button clicked', async () => {
    const button = fixture.debugElement.nativeElement.querySelector('#go-back');
    button.click();
    await fixture.whenStable();
    expect(TestBed.inject(Router).url)
      .withContext('should nav to home if back button is clicked')
      .toEqual(`/`);
  });

  it('should display trip title', () => {
    const title = fixture.debugElement.nativeElement.querySelector('#title');
    expect(title.textContent).toContain(component.trip?.title);
  });

  it('should display trip price', () => {
    const title = fixture.debugElement.nativeElement.querySelector('#price');
    expect(title.textContent).toContain(component.trip?.price);
  });

  it('should display and format trip date', () => {
    const title = fixture.debugElement.nativeElement.querySelector('#date');
    expect(title.textContent).toContain(new FormatDatePipe().transform(component.trip!.creationDate));
  });

  it('should display trip rating', () => {
    const title = fixture.debugElement.nativeElement.querySelector('#rating');
    expect(title.textContent).toContain(component.trip?.rating);
  });
});