import { TestBed } from '@angular/core/testing';

import { PageService } from './page.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Page, PageAdapter, PageFilters } from '../models/page.model';
import { TRIPS_API_URL } from '../constants/settings';
import { skip } from 'rxjs';

describe('PageService', () => {
  let pageService: PageService;
  let pageAdapter: PageAdapter;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    pageService = TestBed.inject(PageService);
    pageAdapter = TestBed.inject(PageAdapter);
    httpTesting = TestBed.inject(HttpTestingController);
    
    const req = httpTesting.expectOne(req => req.url.startsWith(`${TRIPS_API_URL}/trips`));
    expect(req.request.method).toBe("GET");
    req.flush(new Page);
  });

  afterEach(() => {
    httpTesting.verify();
  });
  
  it('#getPage should return a page', (done: DoneFn) => {
    pageService.getPage().subscribe({
      next: (page) => {
        expect(page).withContext('expected page').toEqual({...new Page});
        done();
      },
      error: done.fail,
    });
  })

  it('#getPage should be updated with expected page by #updatePage', (done: DoneFn) => {
     const expectedPage = {
      items: [
        {
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
      ],
      total: 1011,
      page: 1,
      limit: 1
    }

    pageService.getPage().pipe(skip(1)).subscribe({
      next: (page) => {
        expect(page).withContext('expected page').toEqual(pageAdapter.adapt(expectedPage));
        done();
      },
      error: done.fail,
    });
    pageService.updatePage();
    
    const req = httpTesting.expectOne(req => req.url.startsWith(`${TRIPS_API_URL}/trips`));
    expect(req.request.method).toBe("GET");
    req.flush(expectedPage);
  });

  it('#getPage shouldn\'t be updated when #updatePage fails', (done: DoneFn) => {

    pageService.getPage().pipe(skip(1)).subscribe({
      next: (page) => {
        done.fail('#getPage shouldn\'t be updated');
      },
      error: done.fail,
    });
    pageService.updatePage();
    
    const req = httpTesting.expectOne(req => req.url.startsWith(`${TRIPS_API_URL}/trips`));
    req.flush('Failed!', {status: 404, statusText: 'Not Found'});
    done();
  });
});
