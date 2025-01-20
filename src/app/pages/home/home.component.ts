import { Component, OnDestroy } from '@angular/core';
import { PageService } from '../../services/page.service';
import { CommonModule } from '@angular/common';
import { TripCardComponent } from '../../components/trip-card/trip-card.component';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatGridListModule } from '@angular/material/grid-list';
import { Router, RouterLink } from '@angular/router';
import { Page, PageFilters } from '../../models/page.model';
import { LoaderComponent } from '../../components/loader/loader.component';
import { PageFilterComponent } from '../../components/page-filter/page-filter.component';
import { DailyTripService } from '../../services/daily-trip.service';

import { PAGE_SIZE_OPTIONS } from '../../constants/settings';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatGridListModule,
    MatButtonModule,
    TripCardComponent,
    LoaderComponent,
    RouterLink,
    PageFilterComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnDestroy {

  /** Loader state */
  public loading = true;
  /** Current page */
  public page: Page = new Page;
  /** Current filters */
  public pageFilters?: PageFilters;
  /** Pagination page size options */
  public pageSizeOptions = PAGE_SIZE_OPTIONS;

  /** Keeps track of subscriptions */
  private subscriptions: Subscription = new Subscription();

  /**
   * Gets the page filters and suscribes to the page observer of PageService
   * 
   * @param pageService Used to get the current page and filters
   * @param dailyTripService Used for the daily trip feature
   * @param router Used to navigate to the daily trip page
   */
  constructor(
    private pageService: PageService,
    private dailyTripService: DailyTripService,
    private router: Router
  ) {
    this.pageFilters = this.pageService.storedPageFilters;
    this.subscriptions.add(
      this.pageService.getPage().subscribe(page => {
        this.page = page;
        this.loading = false;
      })
    );
  }

  /**
   * Fetch a new page from the pagination event
   * 
   * @param event Pagination event info
   */
  public handlePageEvent(event: PageEvent) {
    this.loading = true;
    const pageSubscription = this.pageService.updatePage(event.pageIndex + 1, event.pageSize).subscribe({
      error: (error) => this.windowReload(),
      complete: () => pageSubscription.unsubscribe()
    });
  }

  /**
   * Fetch a new page if the filter has a changed
   * 
   * @param filters New filter state
   */
  public filterChanges(filters: PageFilters) {
    if (!this.pageService.storedPageFilters.compareTo(filters)) {
      this.loading = true;
      const pageSubscription = this.pageService.updatePage(this.page.page, this.page.limit, filters).subscribe({
        error: () => this.windowReload(),
        complete: () => pageSubscription.unsubscribe()
      });
    }
  }

  /**
   * Gets the daily trip and sends the user to its details page
   */
  public async goToDailyTrip() {
    const tripId = await this.dailyTripService.getDailyTrip();
    if (tripId) {
      this.router.navigateByUrl(`/trip/${tripId}`);
    }
  }

  /**
   * Reloads the page
   */
  private windowReload () {
    window.location.reload();
  }

  /**
   * Destroys existing subscriptions
   */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
