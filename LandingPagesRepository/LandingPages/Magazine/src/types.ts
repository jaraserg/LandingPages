export interface Recommendation {
  name: string;
  category: "Food" | "Culture" | "Nature" | "Nightlife" | "Hidden Gem";
  description: string;
  whyLocal: string;
  address?: string;
  imageUrl?: string;
}

export interface LocalGuide {
  name: string;
  specialty: string;
  rating: number;
  bio: string;
  pricePerHour: number;
  avatarColor: string;
  phoneNumber?: string;
  imageUrl?: string;
}

export interface TravelEvent {
  title: string;
  date: string; // Keep string for display
  startDate: string; // ISO date string for filtering e.g. "2026-05-01"
  endDate?: string;  // ISO date string for filtering e.g. "2026-05-10"
  description: string;
  locationName: string;
  imageUrl?: string;
}

export interface TravelTip {
  topic: string;
  iconName: string;
  text: string;
}

export interface TravelGuidance {
  city: string;
  tagline: string;
  overview: string;
  heroImage?: string;
  tips: TravelTip[];
  recommendations: Recommendation[];
  localGuides: LocalGuide[];
  events: TravelEvent[];
}
