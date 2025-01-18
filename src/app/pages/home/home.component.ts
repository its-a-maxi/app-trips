import { Component, OnInit } from '@angular/core';
import { PageService } from '../../services/page.service';
import { CommonModule } from '@angular/common';
import { TripCardComponent } from '../../components/trip-card/trip-card.component';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatGridListModule } from '@angular/material/grid-list';
import { RouterLink } from '@angular/router';
import { Page, PageFilters } from '../../models/page.model';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatExpansionModule} from '@angular/material/expansion';
import { LoaderComponent } from '../../components/loader/loader.component';
import { PageFilterComponent } from '../../components/page-filter/page-filter.component';
import { PAGE_SIZE_OPTIONS } from '../../constants/settings';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    TripCardComponent,
    MatPaginatorModule,
    MatGridListModule,
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

  constructor(public pageService: PageService) {
    this.pageFilters = this.pageService.storedPageFilters;
    this.pageService.getPage().subscribe(page => {
      this.page = page,
      this.loading = false
    });
  }

  public handlePageEvent(event: PageEvent) {
    this.loading = true;
    this.pageService.updatePage(event.pageIndex + 1, event.pageSize);
  }

  public filterChanges(filters: PageFilters) {
    if (!this.pageService.storedPageFilters.compareTo(filters)) {
      this.loading = true;
      this.pageService.updatePage(this.page.page, this.page.limit, filters);
    }
  }
}
