import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { provideRouter, Router } from '@angular/router';
import { MOCK_PAGE, MOCK_TRIP } from '../../testing/mocks';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { PageService } from '../../services/page.service';
import { DailyTripService } from '../../services/daily-trip.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { RouterTestingHarness } from '@angular/router/testing';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { Page, PageAdapter, PageFilters } from '../../models/page.model';
import { TripAdapter } from '../../models/trip.model';
import { TripDetailComponent } from '../trip-detail/trip-detail.component';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatPaginatorHarness } from '@angular/material/paginator/testing';
import { Component } from '@angular/core';

@Component({
  selector: 'mock-component',
  standalone: true,
  imports: [],
  template: ''
})
export class MockComponent {}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let pageService: PageService;
  let dailyTripService: DailyTripService;
  let pageAdapter: PageAdapter;
  let loader: HarnessLoader;
  let mockPageObservable: Observable<Page>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent, TripDetailComponent, MatPaginatorModule, NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        provideRouter([
          {path: 'home', component: HomeComponent},
          {path: 'trip/:id', component: MockComponent},
        ]),
      ]
    })
    .compileComponents();

    pageAdapter = new PageAdapter(new TripAdapter);
    mockPageObservable = new BehaviorSubject<Page>(pageAdapter.adapt(MOCK_PAGE)).asObservable();
    pageService = TestBed.inject(PageService);
    pageService.updatePage = (page?: number, size?: number, filters?: PageFilters) => mockPageObservable;
    pageService.getPage = () => mockPageObservable;
    dailyTripService = TestBed.inject(DailyTripService);
    dailyTripService.getDailyTrip = () => Promise.resolve(MOCK_TRIP.id);

    const harness = await RouterTestingHarness.create();
    fixture = harness.fixture as ComponentFixture<HomeComponent>;
    component = await harness.navigateByUrl(
      `home`,
      HomeComponent
    );
    // fixture = TestBed.createComponent(HomeComponent);
    // component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should run #updatePage when #handlePageEvent is triggered', async () => {
    const pageServiceSpy = spyOn(pageService, 'updatePage').and.callThrough();

    expect(pageServiceSpy).not.toHaveBeenCalled();

    component.handlePageEvent(new PageEvent);

    expect(pageServiceSpy).toHaveBeenCalledTimes(1);
  })
  
  it('should navigate to /trip/[id] when daily trip button is clicked', async () => {
    const button = fixture.debugElement.nativeElement.querySelector(`#daily-trip`);
    button.click();
    await fixture.whenStable();
    expect(TestBed.inject(Router).url)
      .withContext('should nav to trip if daily trip is clicked')
      .toEqual(`/trip/${MOCK_TRIP.id}`);
  });
  
  it('should navigate to /trips/[id] when trip-card is clicked', async () => {
    const tripCard = fixture.debugElement.nativeElement.querySelector(`#trip-${MOCK_TRIP.id}`);
    tripCard.click();
    await fixture.whenStable();
    expect(TestBed.inject(Router).url)
      .withContext('should nav to trip if trip-card is clicked')
      .toEqual(`/trip/${MOCK_TRIP.id}`);
  });

  it('should run #updatePage when #filterChanges is triggered with a new filter', async () => {
    const pageServiceSpy = spyOn(pageService, 'updatePage').and.callThrough();
    expect(pageServiceSpy).not.toHaveBeenCalled();

    component.filterChanges(new PageFilters({titleFilter: 'new search term'}));

    expect(pageServiceSpy).toHaveBeenCalledTimes(1);
  })

  it('shoulnd\'t run #updatePage when #filterChanges is triggered with the same filter', async () => {
    const pageServiceSpy = spyOn(pageService, 'updatePage').and.callThrough();
    expect(pageServiceSpy).not.toHaveBeenCalled();

    component.filterChanges(new PageFilters());

    expect(pageServiceSpy).not.toHaveBeenCalled();
  })

  it('should update #page from #getPage', async () => {
    expect(component.page).toEqual(pageAdapter.adapt(MOCK_PAGE));
  })

  it('should reload page if #updatePage fails', async () => {

    pageService.updatePage = (page?: number, size?: number, filters?: PageFilters) => {
      return mockPageObservable.pipe(map(() => {
          throw new HttpErrorResponse({ status: 404 });
        }),
        catchError(error => throwError(() => error))
      )
    }
    const windowReloadSpy = spyOn<any>(component, 'windowReload');
    expect(windowReloadSpy).not.toHaveBeenCalled();

    component.handlePageEvent(new PageEvent);
    component.filterChanges(new PageFilters({titleFilter: 'new search term'}));

    expect(windowReloadSpy).toHaveBeenCalledTimes(2);
  })
});
