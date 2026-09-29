export interface Destination {
  id: number;
  name: string;
  slug: string;
  province: string;
  region: string;
  short_intro: string;
  description: string;
  image: string;
  attractions: string[];
  activities: string[];
  categories: string[];
  best_time: string;
  latitude: number | null;
  longitude: number | null;
  featured: boolean;
}

export interface ItineraryDay {
  day: string;
  title: string;
  detail: string;
}

export interface TourPackage {
  id: number;
  name: string;
  slug: string;
  category: string;
  price_usd: number | null;
  price_note: string;
  duration_days: number;
  duration_label: string;
  destinations: string[];
  image: string;
  short_desc: string;
  description: string;
  itinerary: ItineraryDay[];
  activities: string[];
  accommodation: string;
  transport: string;
  included: string[];
  excluded: string[];
  terms: string;
  featured: boolean;
  discount_pct: number;
  rating: number;
  reviews_count: number;
}

export interface Vehicle {
  id: number;
  name: string;
  type: string;
  image: string;
  passengers: number;
  luggage: string;
  ac: boolean;
  driver_included: boolean;
  price_per_day_usd: number | null;
  price_note: string;
  features: string[];
}

export interface Hotel {
  id: number;
  name: string;
  type: string;
  location: string;
  destination: string;
  image: string;
  description: string;
  facilities: string[];
  price_range: string;
  price_from_usd: number | null;
  nearby: string[];
  rating: number;
}

export interface Booking {
  id: number;
  ref: string;
  full_name: string;
  country: string;
  email: string;
  phone: string;
  whatsapp: string;
  package_id: number | null;
  package_name: string;
  arrival_date: string;
  departure_date: string;
  adults: number;
  children: number;
  accommodation: string;
  vehicle: string;
  airport_pickup: boolean;
  special_requests: string;
  message: string;
  status: string;
  admin_notes: string;
  created_at: string;
}

export interface CustomTour {
  id: number;
  ref: string;
  full_name: string;
  email: string;
  phone: string;
  country: string;
  destinations: string[];
  arrival_date: string;
  departure_date: string;
  adults: number;
  children: number;
  accommodation: string;
  vehicle: string;
  airport_pickup: boolean;
  activities: string[];
  budget: string;
  special_requirements: string;
  status: string;
  admin_notes: string;
  created_at: string;
}

export interface Review {
  id: number;
  name: string;
  country: string;
  avatar: string;
  rating: number;
  package_name: string;
  title: string;
  experience: string;
  tour_date: string;
  featured: boolean;
  approved: boolean;
  created_at: string;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  category: string;
  image: string;
  excerpt: string;
  content: string;
  author: string;
  read_minutes: number;
  published: boolean;
  created_at: string;
}

export interface Faq {
  id: number;
  category: string;
  question: string;
  answer: string;
  sort_order: number;
}

export interface GalleryItem {
  id: number;
  title: string;
  category: string;
  image: string;
}

export interface Message {
  id: number;
  name: string;
  email: string;
  phone: string;
  country: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

export interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  country: string;
  vehicle_id: number | null;
  vehicle_name: string;
  pickup_date: string;
  return_date: string;
  pickup_location: string;
  passengers: number;
  message: string;
  status: string;
  created_at: string;
}

export interface Offer {
  id: number;
  title: string;
  description: string;
  discount: string;
  valid_until: string;
  package_id: number | null;
  image: string;
  active: boolean;
}

export interface Setting {
  id: number;
  key: string;
  value: string;
}
