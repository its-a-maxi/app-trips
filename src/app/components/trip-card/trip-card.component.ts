import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Trip } from '../../models/trip.model';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { FormatDatePipe } from '../../pipes/format-date.pipe';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-trip-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTooltipModule,
    MatIconModule,
    MatChipsModule,
    FormatDatePipe
  ],
  templateUrl: './trip-card.component.html',
  styleUrl: './trip-card.component.scss'
})
export class TripCardComponent {
  /**
   * Trip to display
   */
  @Input() trip!: Trip;
}
