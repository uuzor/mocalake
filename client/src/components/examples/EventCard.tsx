import EventCard from '../EventCard';
import { mockEvents } from '@/lib/mockData';

export default function EventCardExample() {
  return <EventCard event={mockEvents[0]} />;
}