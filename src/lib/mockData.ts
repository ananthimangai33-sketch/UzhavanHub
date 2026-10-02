export const mockPriceHistory: Record<string, { day: string; price: number }[]> = {
  Tomato: [
    { day: 'Mon', price: 22 },
    { day: 'Tue', price: 24 },
    { day: 'Wed', price: 25 },
    { day: 'Thu', price: 27 },
    { day: 'Fri', price: 26 },
    { day: 'Sat', price: 28 },
    { day: 'Sun', price: 30 },
  ],
  Onion: [
    { day: 'Mon', price: 32 },
    { day: 'Tue', price: 34 },
    { day: 'Wed', price: 33 },
    { day: 'Thu', price: 36 },
    { day: 'Fri', price: 35 },
    { day: 'Sat', price: 37 },
    { day: 'Sun', price: 38 },
  ],
  Potato: [
    { day: 'Mon', price: 23 },
    { day: 'Tue', price: 24 },
    { day: 'Wed', price: 22 },
    { day: 'Thu', price: 25 },
    { day: 'Fri', price: 24 },
    { day: 'Sat', price: 26 },
    { day: 'Sun', price: 25 },
  ],
  Paddy: [
    { day: 'Mon', price: 30 },
    { day: 'Tue', price: 31 },
    { day: 'Wed', price: 30 },
    { day: 'Thu', price: 32 },
    { day: 'Fri', price: 31 },
    { day: 'Sat', price: 32 },
    { day: 'Sun', price: 32 },
  ],
  Banana: [
    { day: 'Mon', price: 16 },
    { day: 'Tue', price: 17 },
    { day: 'Wed', price: 17 },
    { day: 'Thu', price: 18 },
    { day: 'Fri', price: 18 },
    { day: 'Sat', price: 17 },
    { day: 'Sun', price: 18 },
  ],
  Turmeric: [
    { day: 'Mon', price: 110 },
    { day: 'Tue', price: 112 },
    { day: 'Wed', price: 115 },
    { day: 'Thu', price: 114 },
    { day: 'Fri', price: 116 },
    { day: 'Sat', price: 118 },
    { day: 'Sun', price: 120 },
  ],
};

export const mockPredictionHistory: Record<string, { day: string; price: number; predicted?: boolean }[]> = {
  Tomato: [
    { day: 'Day 1', price: 22 },
    { day: 'Day 2', price: 24 },
    { day: 'Day 3', price: 25 },
    { day: 'Day 4', price: 27 },
    { day: 'Day 5', price: 26 },
    { day: 'Day 6', price: 28 },
    { day: 'Day 7', price: 30 },
    { day: 'Day 8', price: 31, predicted: true },
    { day: 'Day 9', price: 32, predicted: true },
    { day: 'Day 10', price: 33, predicted: true },
  ],
  Onion: [
    { day: 'Day 1', price: 32 },
    { day: 'Day 2', price: 34 },
    { day: 'Day 3', price: 33 },
    { day: 'Day 4', price: 36 },
    { day: 'Day 5', price: 35 },
    { day: 'Day 6', price: 37 },
    { day: 'Day 7', price: 38 },
    { day: 'Day 8', price: 39, predicted: true },
    { day: 'Day 9', price: 41, predicted: true },
    { day: 'Day 10', price: 42, predicted: true },
  ],
};

export const mockDemandAlerts = [
  { crop: 'Tomato', level: 'high', change: 18, demandQty: 2500, location: 'Pollachi', action: 'Consider listing your tomato harvest now — demand is surging.' },
  { crop: 'Onion', level: 'increasing', change: 12, demandQty: 1800, location: 'Coimbatore', action: 'Onion demand is rising. Good time to plan your sale.' },
  { crop: 'Paddy', level: 'stable', change: 2, demandQty: 3200, location: 'Madurai', action: 'Paddy demand is stable. Prices are steady.' },
  { crop: 'Banana', level: 'high', change: 15, demandQty: 1200, location: 'Pollachi', action: 'Banana demand is high in Pollachi market.' },
  { crop: 'Turmeric', level: 'increasing', change: 8, demandQty: 800, location: 'Erode', action: 'Turmeric demand increasing in Erode. Wait for better prices.' },
  { crop: 'Potato', level: 'stable', change: -3, demandQty: 2000, location: 'Salem', action: 'Potato demand slightly declining. Consider holding your stock.' },
];

export const mockBuyers = [
  {
    id: 'b1',
    buyer_name: 'Rajesh Kumar',
    business_name: 'ABC Vegetables Pvt Ltd',
    crop_name: 'Tomato',
    quantity: 1000,
    unit: 'kg',
    offered_price: 31,
    location: 'Coimbatore',
    verification_status: 'verified',
    required_crops: 'Tomato, Onion, Potato',
  },
  {
    id: 'b2',
    buyer_name: 'Suresh Patel',
    business_name: 'Fresh Foods Export Co',
    crop_name: 'Tomato',
    quantity: 500,
    unit: 'kg',
    offered_price: 30,
    location: 'Pollachi',
    verification_status: 'verified',
    required_crops: 'Tomato, Brinjal, Cabbage',
  },
  {
    id: 'b3',
    buyer_name: 'Murugan S',
    business_name: 'Tamil Traders Association',
    crop_name: 'Onion',
    quantity: 2000,
    unit: 'kg',
    offered_price: 39,
    location: 'Erode',
    verification_status: 'verified',
    required_crops: 'Onion, Potato',
  },
  {
    id: 'b4',
    buyer_name: 'Lakshmi N',
    business_name: 'Organic Foods Hub',
    crop_name: 'Banana',
    quantity: 800,
    unit: 'kg',
    offered_price: 19,
    location: 'Tiruppur',
    verification_status: 'pending',
    required_crops: 'Banana, Coconut',
  },
  {
    id: 'b5',
    buyer_name: 'Karthik R',
    business_name: 'Spice World Exports',
    crop_name: 'Turmeric',
    quantity: 500,
    unit: 'kg',
    offered_price: 125,
    location: 'Erode',
    verification_status: 'verified',
    required_crops: 'Turmeric, Chilli',
  },
  {
    id: 'b6',
    buyer_name: 'Anand V',
    business_name: 'Green Harvest Trading',
    crop_name: 'Paddy',
    quantity: 3000,
    unit: 'kg',
    offered_price: 33,
    location: 'Madurai',
    verification_status: 'verified',
    required_crops: 'Paddy, Ragi',
  },
];

export const mockChatMessages = [
  {
    id: 'm1',
    sender: 'farmer',
    message: 'I have 500 kg of Grade A tomatoes, freshly harvested.',
    type: 'text' as const,
    time: '10:30 AM',
  },
  {
    id: 'm2',
    sender: 'buyer',
    message: 'We can offer ₹31/kg for Grade A quality.',
    type: 'offer' as const,
    offer_price: 31,
    offer_status: 'pending' as const,
    time: '10:32 AM',
  },
  {
    id: 'm3',
    sender: 'farmer',
    message: 'Can you offer ₹32/kg? The market price in Pollachi is ₹32.',
    type: 'text' as const,
    time: '10:34 AM',
  },
  {
    id: 'm4',
    sender: 'buyer',
    message: 'We can do ₹31.5/kg if you can deliver to our warehouse in Coimbatore.',
    type: 'offer' as const,
    offer_price: 31.5,
    offer_status: 'pending' as const,
    time: '10:36 AM',
  },
];

export const mockQualityGrades: Record<string, { grade: string; qualities: string[] }[]> = {
  Tomato: [
    { grade: 'A', qualities: ['Good red color', 'Proper round size', 'No visible damage', 'Fresh and firm appearance', 'Uniform ripeness'] },
    { grade: 'B', qualities: ['Minor color variation', 'Slight size variation', 'Small blemishes', 'Generally fresh'] },
    { grade: 'C', qualities: ['Visible defects or cracks', 'Overripe or underripe', 'Lower market value', 'Best for processing'] },
  ],
  Onion: [
    { grade: 'A', qualities: ['Good bulb size', 'Dry outer skin', 'No sprouting', 'Uniform shape', 'No rot'] },
    { grade: 'B', qualities: ['Slight size variation', 'Minor skin damage', 'No major defects'] },
    { grade: 'C', qualities: ['Small bulbs', 'Some sprouting', 'Visible damage', 'Lower market value'] },
  ],
  Potato: [
    { grade: 'A', qualities: ['Good size and shape', 'Smooth skin', 'No green spots', 'No pest damage', 'Firm texture'] },
    { grade: 'B', qualities: ['Minor shape variation', 'Small blemishes', 'No green spots'] },
    { grade: 'C', qualities: ['Small or misshapen', 'Some green spots', 'Visible damage', 'Lower market value'] },
  ],
  Paddy: [
    { grade: 'A', qualities: ['Golden grain color', 'Uniform grain size', 'Low moisture content', 'No broken grains', 'Pest-free'] },
    { grade: 'B', qualities: ['Slight color variation', 'Some broken grains', 'Acceptable moisture'] },
    { grade: 'C', qualities: ['High moisture content', 'Many broken grains', 'Discolored', 'Lower market value'] },
  ],
};

export const mockNearbyMarkets = [
  { name: 'Coimbatore Market', distance: 12, price: 30, crop: 'Tomato', hours: '5 AM - 8 PM', crops: ['Tomato', 'Onion', 'Potato', 'Cabbage'] },
  { name: 'Mettupalayam Market', distance: 25, price: 28, crop: 'Tomato', hours: '6 AM - 6 PM', crops: ['Tomato', 'Carrot', 'Cabbage'] },
  { name: 'Pollachi Market', distance: 40, price: 32, crop: 'Tomato', hours: '4 AM - 9 PM', crops: ['Tomato', 'Banana', 'Coconut', 'Onion'] },
  { name: 'Erode Market', distance: 55, price: 29, crop: 'Tomato', hours: '5 AM - 7 PM', crops: ['Tomato', 'Turmeric', 'Onion'] },
  { name: 'Tiruppur Market', distance: 45, price: 31, crop: 'Tomato', hours: '5 AM - 8 PM', crops: ['Tomato', 'Banana', 'Onion'] },
];

export const mockTransportRates: Record<string, number> = {
  'Auto': 8,
  'Mini Truck': 12,
  'Large Truck': 18,
  'Tractor Trailer': 6,
};

export const tnLocations = ['Coimbatore', 'Pollachi', 'Mettupalayam', 'Erode', 'Tiruppur', 'Salem', 'Madurai', 'Chennai'];
export const tnDistricts = ['Coimbatore', 'Erode', 'Tiruppur', 'Salem', 'Madurai', 'Chennai', 'Dindigul', 'Thanjavur'];
export const cropCategories = ['Vegetables', 'Fruits', 'Grains', 'Pulses', 'Spices', 'Flowers'] as const;
export const allCrops = ['Tomato', 'Onion', 'Potato', 'Paddy', 'Banana', 'Coconut', 'Turmeric', 'Carrot', 'Cabbage', 'Brinjal'];

export const voiceResponses: Record<string, { ta: string; en: string }> = {
  tomato_price: {
    ta: 'இன்று கோயம்புத்தூர் மார்க்கெட்டில் தக்காளியின் சராசரி விலை ₹30 ஒரு கிலோ. Pollachi market-ல் ₹32 வரை கிடைக்கிறது.',
    en: 'Today the average price of tomato in Coimbatore market is ₹30 per kg. In Pollachi market, it goes up to ₹32 per kg.',
  },
  best_market: {
    ta: 'Pollachi மார்க்கெட்டில் தக்காளிக்கு அதிக விலை கிடைக்கிறது — ₹32 ஒரு கிலோ. அது உங்கள் இடத்திலிருந்து 40 கிலோமீட்டர் தூரத்தில் உள்ளது.',
    en: 'Pollachi market offers the highest price for tomato — ₹32 per kg. It is 40 kilometers from your location.',
  },
  sell_tomato: {
    ta: 'ABC Vegetables Pvt Ltd நிறுவனம் 1000 கிலோ தக்காளி தேடுகிறது. அவர்கள் ₹31 ஒரு கிலோ வழங்குகிறார்கள். நீங்கள் அவர்களுக்கு ஒரு request அனுப்பலாம்.',
    en: 'ABC Vegetables Pvt Ltd is looking for 1000 kg of tomatoes. They are offering ₹31 per kg. You can send them a request.',
  },
  rain: {
    ta: 'நாளை கோயம்புத்தூரில் கனமழை பெய்யக்கூடும். மழை வாய்ப்பு 85%. இன்றே பழுத்த பயிர்களை அறுவடை செய்யுங்கள்.',
    en: 'Heavy rain may occur in Coimbatore tomorrow. Rain probability is 85%. Consider harvesting mature crops today.',
  },
  onion_demand: {
    ta: 'வெங்காயத்துக்கு டிமாண்ட் அதிகரித்து வருகிறது. கோயம்புத்தூரில் 12% அதிகரிப்பு. இது விற்க சரியான நேரம்.',
    en: 'Onion demand is increasing. It has gone up by 12% in Coimbatore. This is a good time to sell.',
  },
  default: {
    ta: 'எனக்கு புரியவில்லை. தக்காளி விலை, சந்தை, மழை, அல்லது டிமாண்ட் பற்றி கேளுங்கள்.',
    en: 'I did not understand. You can ask me about tomato prices, markets, rain, or demand.',
  },
};
