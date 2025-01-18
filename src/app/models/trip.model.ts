import { Injectable } from "@angular/core";
import { Adapter } from "./adapter";

/**
 * Trip type declaration
 */
export interface Trip {
    id: string,
    title: string,
    description: string,
    price: number,
    rating: number,
    nrOfRatings: number,
    verticalType: string,
    tags: string[],
    co2: number,
    thumbnailUrl: string,
    imageUrl: string,
    creationDate: Date
}

/**
 * Used to adapt trip API responses to typed objects
 */
@Injectable({
  providedIn: 'root',
})
export class TripAdapter implements Adapter<Trip> {
  /**
   * Creates a new Trip object from the API response
   *
   * @param API item to adapt
   * @returns Adapted item as a Trip object
   */
  adapt(item: any): Trip {
    const trip: Trip = {
      id: item.id,
      title: item.title,
      description: item.description,
      price: item.price,
      rating: item.rating,
      nrOfRatings: item.nrOfRatings,
      verticalType: item.verticalType,
      tags: item.tags,
      co2: item.co2,
      thumbnailUrl: item.thumbnailUrl,
      imageUrl: item.imageUrl,
      creationDate: new Date(item.creationDate)
    };
    return trip;
  }
}