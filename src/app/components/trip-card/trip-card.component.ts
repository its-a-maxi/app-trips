import { Component, Input } from '@angular/core';
import { Trip } from '../../models/trip.model';
import {MatCardModule} from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { FormatDatePipe } from '../../pipes/format-date.pipe';

@Component({
  selector: 'app-trip-card',
  standalone: true,
  imports: [
    MatCardModule,
    MatTooltipModule,
    MatIconModule,
    FormatDatePipe
  ],
  templateUrl: './trip-card.component.html',
  styleUrl: './trip-card.component.scss'
})
export class TripCardComponent {
  @Input() trip!: Trip;
}
