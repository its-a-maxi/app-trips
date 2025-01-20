import { Component, OnDestroy } from '@angular/core';
import { TripService } from '../../services/trip.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Trip } from '../../models/trip.model';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { FormatDatePipe } from '../../pipes/format-date.pipe';
import { LoaderComponent } from '../../components/loader/loader.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-trip-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatTooltipModule,
    MatChipsModule,
    MatCardModule,
    FormatDatePipe,
    LoaderComponent,
  ],
  templateUrl: './trip-detail.component.html',
  styleUrl: './trip-detail.component.scss'
})
export class TripDetailComponent implements OnDestroy {

  /** Trip to display */
  public trip?: Trip;
  
  /** Keeps track of subscriptions */
  private subscriptions: Subscription = new Subscription();

  /**
   * Suscribes to the route to get the trip id and tries to fetch it.
   * 
   * @param activeRoute Used to get the route id parameter
   * @param route Used to send the user back to the home page if something fails
   * @param tripService Used to fetch the trip
   */
  constructor(
    private activeRoute: ActivatedRoute,
    private route: Router,
    private tripService: TripService
  ) {
    this.subscriptions.add(
      this.activeRoute.params.subscribe(params => {
        if (params['id'] && (!this.trip || params['id'] !== this.trip.id)) {
          this.setActiveTrip(params['id'])
        } else if (!params['id']) {
          this.route.navigate(['/']); // Should never happen
        }
      })
    );
  }

  /**
   * Fetches the trip corresponding to the passed id, if any error occurs it goes back to the home page
   * 
   * @param id Id of the trip to fetch
   */
  private setActiveTrip(id: string) {
    this.subscriptions.add(
      this.tripService.getTrip(id).subscribe({
        next: (res) => this.trip = res,
        error: () => this.route.navigate(['/'])
      })
    );
  }

  /**
   * Destroys existing subscriptions
   */
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
