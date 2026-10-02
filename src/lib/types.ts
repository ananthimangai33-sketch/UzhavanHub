export type UserRole = 'farmer' | 'buyer' | 'admin';

export interface Profile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  location: string | null;
  district: string | null;
  state: string | null;
  created_at: string;
}

export interface Farmer {
  id: string;
  user_id: string;
  main_crop: string | null;
  farm_location: string | null;
  created_at: string;
}

export interface Buyer {
  id: string;
  user_id: string;
  business_name: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  required_crops: string | null;
  created_at: string;
}

export interface Crop {
  id: string;
  name: string;
  category: 'Vegetables' | 'Fruits' | 'Grains' | 'Pulses' | 'Spices' | 'Flowers';
  unit: string;
}

export interface CropListing {
  id: string;
  farmer_id: string;
  crop_name: string;
  quantity: number;
  unit: string;
  expected_price: number;
  quality_grade: 'A' | 'B' | 'C';
  harvest_date: string | null;
  location: string | null;
  description: string | null;
  image_url: string | null;
  status: 'active' | 'buyer_interested' | 'sold';
  created_at: string;
  farmer_name?: string;
}

export interface BuyerRequest {
  id: string;
  buyer_id: string;
  crop_name: string;
  quantity: number;
  unit: string;
  offered_price: number;
  location: string | null;
  status: 'open' | 'negotiating' | 'accepted' | 'rejected' | 'closed';
  created_at: string;
  buyer_name?: string;
  business_name?: string;
  verification_status?: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  message_type: 'text' | 'listing' | 'offer' | 'system';
  offer_price: number | null;
  offer_status: 'pending' | 'accepted' | 'rejected' | 'countered' | null;
  listing_ref: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'price' | 'buyer' | 'demand' | 'weather' | 'listing' | 'info';
  is_read: boolean;
  created_at: string;
}

export interface MarketPrice {
  id: string;
  crop_name: string;
  market_name: string;
  location: string;
  price: number;
  price_yesterday: number | null;
  price_high: number | null;
  price_low: number | null;
  distance_km: number | null;
  date: string;
}

export interface WeatherAlert {
  id: string;
  location: string;
  alert_type: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  temperature: number | null;
  rain_probability: number | null;
  humidity: number | null;
  wind_speed: number | null;
  date: string;
}

export interface PricePrediction {
  id: string;
  crop_name: string;
  market_name: string | null;
  current_price: number;
  predicted_price: number;
  prediction_date: string;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
}
