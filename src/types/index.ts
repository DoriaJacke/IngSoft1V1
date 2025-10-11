export interface Event {
  id: string;
  title: string;
  artist: string;
  date: string;
  time: string;
  venue: string;
  location: string;
  price: number;
  image: string;
  description: string;
  category: string;
  availableTickets: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  lastName: string;
  isAdmin?: boolean;
}

export interface TicketSelection {
  eventId: string;
  quantity: number;
  totalPrice: number;
}
