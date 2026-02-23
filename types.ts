export interface Room {
  id: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  image: string;
  features: string[];
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: 'mountain' | 'mushroom' | 'history' | 'food';
}

export interface EnvironmentSection {
  id: string;
  title: string;
  subtitle: string;
  content: string[];
  image: string;
  details?: { label: string; value: string }[];
}

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

export enum PageState {
  HOME,
  ROOMS,
  RESTAURANT,
  ACTIVITIES,
  GALLERY,
  CONTACT
}