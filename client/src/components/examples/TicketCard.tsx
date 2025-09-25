import TicketCard from '../TicketCard';
import { mockTickets, mockEvents } from '@/lib/mockData';

export default function TicketCardExample() {
  return <TicketCard ticket={mockTickets[0]} event={mockEvents[0]} />;
}