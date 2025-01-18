import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {Sort, MatSortModule, SortDirection, MatSort} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatSliderModule} from '@angular/material/slider';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PageFilters, SortBy, SortOrder } from '../../models/page.model';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MAX_FILTER_PRICE, MIN_FILTER_PRICE } from '../../constants/settings';

@Component({
  selector: 'app-page-filter',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    MatExpansionModule,
    MatSortModule,
    MatTableModule,
    MatSliderModule,
    ReactiveFormsModule,
    MatTooltipModule
  ],
  templateUrl: './page-filter.component.html',
  styleUrl: './page-filter.component.scss'
})
export class PageFilterComponent implements OnChanges {

  @ViewChild(MatSort) sort!: MatSort;
  /** State of the filter panel */
  public filtersAreOpen = false;
  public maxPrice = MAX_FILTER_PRICE;
  public minPrice = MIN_FILTER_PRICE;

  /** Used to get the 'clean' state of the filters, shouldn't be reassigned or modified */
  private pristinePageFilters = new PageFilters;
  /** Reactive form for the filter values */
  public fitlersForm = new FormGroup({
    titleFilter: new FormControl(this.pristinePageFilters.titleFilter),
    sortBy: new FormControl<SortBy | undefined>(this.pristinePageFilters.sortBy),
    sortOrder: new FormControl<SortOrder | undefined>(this.pristinePageFilters.sortOrder),
    minPrice: new FormControl(this.pristinePageFilters.minPrice),
    maxPrice: new FormControl(this.pristinePageFilters.maxPrice),
    minRating: new FormControl(this.pristinePageFilters.minRating),
  });

  /** The state of the component filters */
  @Input() pageFilters?: PageFilters;
  /** Lets the parent know when the filter has been updated */
  @Output() filterChanges = new EventEmitter<PageFilters>();

  /**
   * Listens to changes and updates the fitlersForm when its input changes.
   */
  ngOnChanges(): void {
    if (this.pageFilters) {
      // Checks if any filter properly has been altered compared to the filter "clean" state
      if (!this.pristinePageFilters.compareTo(this.pageFilters)) {
        this.filtersAreOpen = true;
      }
      this.fitlersForm.patchValue(this.pageFilters);

      // Recursive functions than waits until MatSort has loaded to update its values
      const updateSort = () => {
        if (!this.sort) {
          setTimeout(updateSort, 50);
        } else {
          this.sort.active = this.pageFilters?.sortBy || '';
          this.sort.direction = this.pageFilters?.sortOrder?.toLowerCase() as SortDirection || '';
          this.sort._stateChanges.next();
        }
      }
      updateSort();
    }
  }

  /**
   * Emits the current selected filters as an event
   */
  public applyFilters() {
    this.filterChanges.emit(new PageFilters(this.fitlersForm.value));
  }

  /**
   * The sort event result is applied to the fitlersForm
   * 
   * @param sort Sort event of the mat-sort
   */
  public sortData(sort: Sort) {
    // Checks the event direction, if no direction exist it assumes you dont want to sort anymore
    if (sort.direction) {
      this.fitlersForm.patchValue({
        sortBy: sort.active as SortBy,
        sortOrder: sort.direction.toUpperCase() as SortOrder
      })
    } else {
      this.fitlersForm.patchValue({
        sortBy: undefined,
        sortOrder: undefined
      })
    }
    this.applyFilters();
  }

  /**
   * Price formater so values bigger than 100 show as 1k
   * 
   * @param value Number to format
   * @returns A string with the formatted value
   */
  public formatPrice(value: number): string {
    if (value >= 1000) {
      return Math.round(value / 100) / 10 + 'k';
    }

    return `${value}`;
  }

  /**
   * Toogles the filter open state, when closed it cleans the filters (except the searchbar) and applies them
   */
  public toggleFilters() {
    if (this.filtersAreOpen) {
      this.clearFilters();
      this.applyFilters();
    }
    this.filtersAreOpen = !this.filtersAreOpen;
  }

  /**
   * Clears fitlersForm except the searchbar
   */
  private clearFilters() {
    this.fitlersForm.patchValue({
      sortBy: this.pristinePageFilters.sortBy,
      sortOrder: this.pristinePageFilters.sortOrder,
      minPrice: this.pristinePageFilters.minPrice,
      maxPrice: this.pristinePageFilters.maxPrice,
      minRating: this.pristinePageFilters.minRating,
    })
    // Resets mat-sort state
    this.sort.active = '';
    this.sort.direction = '';
    this.sort._stateChanges.next();
  }

}
