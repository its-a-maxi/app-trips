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

const MAX_FILTER_PRICE = 5000;
const MIN_FILTER_PRICE = 500;

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

  public maxPrice = MAX_FILTER_PRICE;
  public minPrice = MIN_FILTER_PRICE;

  public filtersAreOpen = false;
  
  public filterForm = new FormGroup({
    titleFilter: new FormControl(''),
    sortBy: new FormControl<SortBy | null>(null),
    sortOrder: new FormControl<SortOrder | null>(null),
    minPrice: new FormControl(this.minPrice),
    maxPrice: new FormControl(this.maxPrice),
    minRating: new FormControl(0),
  });

  @Input() pageFilters?: PageFilters;
  @Output() filterChanges = new EventEmitter<PageFilters>();

  ngOnChanges(): void {
    if (this.pageFilters) {
      // Checks if any filter properly has been altered compared to the filter "clean" state
      if (
        this.pageFilters.sortBy ||
        this.pageFilters.sortOrder ||
        this.pageFilters.maxPrice !== this.filterForm.value.maxPrice ||
        this.pageFilters.minPrice !== this.filterForm.value.minPrice ||
        this.pageFilters.minRating !== this.filterForm.value.minRating
      ) {
        this.toggleFilters();
      }
      this.filterForm.patchValue(this.pageFilters);
    }
  }

  public applyFilters() {
    const cleanedObject = Object.fromEntries(Object.entries(this.filterForm.value).filter(([_, v]) => v != null)) as unknown as PageFilters;
    this.filterChanges.emit(cleanedObject);
  }

  /**
   * The sort event result is applied to the filterForm
   * 
   * @param sort Sort event of the mat-sort
   */
  public sortData(sort: Sort) {
    // Checks the event direction, if no direction exist it assumes you dont want to sort anymore
    if (sort.direction) {
      this.filterForm.patchValue({
        sortBy: sort.active as SortBy,
        sortOrder: sort.direction.toUpperCase() as SortOrder
      })
    } else {
      this.filterForm.patchValue({
        sortBy: null,
        sortOrder: null
      })
    }
    this.applyFilters()
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

  public toggleFilters() {
    if (this.filtersAreOpen) {
      this.clearFilters();
    }
    this.filtersAreOpen = !this.filtersAreOpen;
  }

  /**
   * Clears filterForm except the searchbar
   */
  private clearFilters() {
    this.filterForm.patchValue({
      sortBy: null,
      sortOrder: null,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      minRating: 0,
    })
    // Resets mat-sort state
    this.sort.active = '';
    this.sort.direction = '';
    this.sort._stateChanges.next();
    this.applyFilters();
  }

}
