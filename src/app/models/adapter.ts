/**
 * Basic interface for adapters
 */
export interface Adapter<T> {
  adapt(item: any): T;
}
