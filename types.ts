/**
 * Represeents a hotel room and its details.
 */
export interface Room {
  id: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  image: string;
  features: string[];
  /** Optional URL for booking on an external PMS like AvaiBook or Booking.com */
  externalBookingUrl?: string;
  /** Link for online check-in portal when available */
  checkInUrl?: string;
}

/**
 * Represents a local activity or tourist attraction.
 */
export interface Activity {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: 'mountain' | 'mushroom' | 'history' | 'food';
}

/**
 * Detailed information for any section about the local environment.
 */
export interface EnvironmentSection {
  id: string;
  title: string;
  subtitle: string;
  content: string[];
  image: string;
  details?: { label: string; value: string }[];
  category?: 'nature' | 'culture' | 'gastronomy' | 'adventure';
  isRecommended?: boolean;
  duration?: string;
}

/**
 * Form data for a direct booking request via the website.
 */
export interface BookingRequest {
  roomId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  name: string;
  email: string;
  phone: string;
  comments: string;
}

export interface MenuItem {
  name: string;
  price: string;
  desc?: string;
}

export interface MenuCategory {
  title: string;
  items: MenuItem[];
}

/**
 * Navigation state for the application.
 */
export enum PageState {
  HOME,
  ROOMS,
  RESTAURANT,
  ACTIVITIES,
  GALLERY,
  CONTACT,
  STAFF,
  GUEST_PORTAL
}