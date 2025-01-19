import { Component } from '@angular/core';
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
export class HomeComponent {

  public loading = true;
  public page: Page = new Page;
  public pageFilters?: PageFilters;
  public pageSizeOptions = PAGE_SIZE_OPTIONS;

  constructor(
    private pageService: PageService,
    private dailyTripService: DailyTripService,
    private router: Router
  ) {
    this.pageFilters = this.pageService.storedPageFilters;
    this.pageService.getPage().subscribe(page => {
      this.page = page;
      this.loading = false;
    });
  }

  public handlePageEvent(event: PageEvent) {
    this.loading = true;
    const pageSubscription = this.pageService.updatePage(event.pageIndex + 1, event.pageSize).subscribe({
      error: (error) => this.windowReload(),
      complete: () => pageSubscription.unsubscribe()
    });
  }

  public filterChanges(filters: PageFilters) {
    if (!this.pageService.storedPageFilters.compareTo(filters)) {
      this.loading = true;
      const pageSubscription = this.pageService.updatePage(this.page.page, this.page.limit, filters).subscribe({
        error: () => this.windowReload(),
        complete: () => pageSubscription.unsubscribe()
      });
    }
  }

  public async goToDailyTrip() {
    const tripId = await this.dailyTripService.getDailyTrip();
    if (tripId) {
      this.router.navigateByUrl(`/trip/${tripId}`);
    }
  }

  private windowReload () {
    window.location.reload();
  }
}
