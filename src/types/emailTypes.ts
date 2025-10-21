import { Event, User } from './index';

// Tipos compartidos entre emailService y pdfService
export interface PurchaseDetails {
  orderNumber: string;
  event: Event;
  quantity: number;
  totalPrice: number;
  serviceCharge: number;
  purchaseDate: string;
  user: User;
}

export interface TicketPDFOptions {
  includeQR?: boolean;
  customStyles?: string;
  logoUrl?: string;
}