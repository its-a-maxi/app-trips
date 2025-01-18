import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripCardComponent } from './trip-card.component';
import { TripAdapter } from '../../models/trip.model';
import { FormatDatePipe } from '../../pipes/format-date.pipe';

describe('TripCardComponent', () => {
  let component: TripCardComponent;
  let fixture: ComponentFixture<TripCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TripCardComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripCardComponent);
    component = fixture.componentInstance;

    const tripAdapter = new TripAdapter;
    component.trip = tripAdapter.adapt({
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
    });
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should display trip title', () => {
    const title = fixture.debugElement.nativeElement.querySelector('#title');
    expect(title.textContent).toContain(component.trip.title);
  });
  it('should display trip price', () => {
    const title = fixture.debugElement.nativeElement.querySelector('#price');
    expect(title.textContent).toContain(component.trip.price);
  });
  it('should display and format trip date', () => {
    const title = fixture.debugElement.nativeElement.querySelector('#date');
    expect(title.textContent).toContain(new FormatDatePipe().transform(component.trip.creationDate));
  });
  it('should display trip rating', () => {
    const title = fixture.debugElement.nativeElement.querySelector('#rating');
    expect(title.textContent).toContain(component.trip.rating);
  });
});
