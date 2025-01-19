import { Component } from '@angular/core';
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
export class TripDetailComponent {
  private id?: string;

  public trip?: Trip;

  constructor(
    private activeRoute: ActivatedRoute,
    private route: Router,
    private tripService: TripService
  ) {
    this.activeRoute.params.subscribe(params => {
      if (params['id'] && (!this.trip || params['id'] !== this.trip.id)) {
        this.setActiveTrip(params['id'])
      } else if (!params['id']) {
        this.route.navigate(['/']);
      }
    })
  }

  private setActiveTrip(id: string) {
    this.tripService.getTrip(id).subscribe({
      next: (res) => this.trip = res,
      error: () => this.route.navigate(['/'])
    });
  }
}
