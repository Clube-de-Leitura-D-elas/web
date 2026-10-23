import type { EventDetails } from '../types/event';
import { invokeGet } from './invokeGet';

export function getEventDetails(eventId: string): Promise<EventDetails> {
  return invokeGet('event-details', { eventId });
}
