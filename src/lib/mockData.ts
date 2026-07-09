// Complete mock data matching the seed.ts structure for standalone operation
import { getDestinationImage, getHotelImage } from "./images";
export { getDestinationImage, getHotelImage };

export interface Destination {
  id: number;
  slug: string;
  name: string;
  state: string;
  country: string;
  description: string;
  images: string[];
  tags: string[];
  hotelCount: number;
  rating: number;
  bestTimeToVisit: string;
}

export interface Hotel {
  id: number;
  destinationSlug: string;
  destinationName: string;
  name: string;
  description: string;
  images: string[];
  starRating: number;
  pricePerNight: number;
  amenities: string[];
  address: string;
  state: string;
  rating: number;
  reviewCount: number;
  freeCancellation: boolean;
}

export interface Booking {
  id: number;
  hotelId: number;
  hotelName: string;
  hotelImage: string;
  destinationName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: "upcoming" | "completed" | "cancelled";
  createdAt: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

const rawDestinations = [
  { slug: "kolkata", name: "Kolkata", state: "West Bengal", country: "India", description: "The City of Joy — India's cultural capital with a rich colonial heritage, Victoria Memorial, Howrah Bridge, and vibrant street food scene along Park Street and College Street.", tags: ["heritage", "culture", "street-food", "art", "city"], hotelCount: 85, rating: 4.6, bestTimeToVisit: "October to March" },
  { slug: "darjeeling", name: "Darjeeling", state: "West Bengal", country: "India", description: "The Queen of Hills — home to world-famous tea gardens, the Himalayan Railways toy train (UNESCO Heritage), and breathtaking views of Kanchenjunga peak at sunrise from Tiger Hill.", tags: ["hills", "tea", "himalaya", "nature", "heritage"], hotelCount: 42, rating: 4.8, bestTimeToVisit: "March to May, October to December" },
  { slug: "sundarbans", name: "Sundarbans", state: "West Bengal", country: "India", description: "The world's largest mangrove delta — a UNESCO World Heritage site and home to the Royal Bengal Tiger, estuarine crocodiles, and Irrawaddy dolphins across 10,000 sq km of tidal waterways.", tags: ["wildlife", "nature", "tiger", "mangrove", "UNESCO"], hotelCount: 18, rating: 4.7, bestTimeToVisit: "November to February" },
  { slug: "digha", name: "Digha", state: "West Bengal", country: "India", description: "The 'Brighton of the East' — a beloved seaside resort with a wide sandy beach, gentle surf, fresh seafood, and the Marine Aquarium. Perfect for a quick beach escape from Kolkata.", tags: ["beach", "sea", "relaxation", "seafood", "weekend"], hotelCount: 55, rating: 4.2, bestTimeToVisit: "October to March" },
  { slug: "shantiniketan", name: "Shantiniketan", state: "West Bengal", country: "India", description: "Rabindranath Tagore's timeless creation — a university town radiating art, music, literature and Bengali culture. Home to Visva-Bharati University, Poush Mela, and the unique open-air Tagore museum.", tags: ["culture", "art", "literature", "heritage", "academia"], hotelCount: 22, rating: 4.5, bestTimeToVisit: "October to March" },
  { slug: "murshidabad", name: "Murshidabad", state: "West Bengal", country: "India", description: "The last capital of the Nawabs of Bengal — a historic city with the magnificent Hazarduari Palace (thousand-door palace), Imambara, Katra Mosque, and the famous silk weaving traditions.", tags: ["heritage", "history", "nawab", "palace", "silk"], hotelCount: 15, rating: 4.4, bestTimeToVisit: "October to March" },
  { slug: "bishnupur", name: "Bishnupur", state: "West Bengal", country: "India", description: "The terracotta temple town — ancient temples built entirely of laterite and terracotta, famous for Baluchari sarees, Bishnupur gharana classical music, and Dhokra metalcraft.", tags: ["temples", "heritage", "art", "terracotta", "handicraft"], hotelCount: 10, rating: 4.3, bestTimeToVisit: "October to February" },
  { slug: "cooch-behar", name: "Cooch Behar", state: "West Bengal", country: "India", description: "A royal city in North Bengal known for the splendid Cooch Behar Palace (modelled after Buckingham Palace), Madan Mohan Temple, and unique cultural festivals.", tags: ["palace", "heritage", "royal", "temple", "north-bengal"], hotelCount: 12, rating: 4.2, bestTimeToVisit: "October to March" },
  { slug: "jaipur", name: "Jaipur", state: "Rajasthan", country: "India", description: "The Pink City — a royal kaleidoscope of palaces, forts, bazaars and elephants. Home to Amber Fort, Hawa Mahal, City Palace, Jantar Mantar and some of the finest luxury heritage hotels in India.", tags: ["palace", "heritage", "culture", "shopping", "royalty"], hotelCount: 120, rating: 4.7, bestTimeToVisit: "October to March" },
  { slug: "udaipur", name: "Udaipur", state: "Rajasthan", country: "India", description: "The City of Lakes — a romantic city of shimmering lakes, whitewashed palaces and Aravalli hills. The Lake Palace floating on Pichola is among the most photographed hotels in the world.", tags: ["lakes", "palace", "romantic", "heritage", "luxury"], hotelCount: 92, rating: 4.9, bestTimeToVisit: "September to March" },
  { slug: "jodhpur", name: "Jodhpur", state: "Rajasthan", country: "India", description: "The Blue City — dominated by the magnificent Mehrangarh Fort, the old city painted in distinctive blue, bustling bazaars selling handicrafts, and spice markets that fill the air with aroma.", tags: ["fort", "heritage", "blue-city", "culture", "handicraft"], hotelCount: 78, rating: 4.6, bestTimeToVisit: "October to March" },
  { slug: "goa", name: "Goa", state: "Goa", country: "India", description: "India's beach paradise — a sun-soaked state with 100km of coastline, Portuguese colonial churches (UNESCO Heritage), lively nightlife, feni and fresh seafood.", tags: ["beach", "party", "heritage", "seafood", "nightlife"], hotelCount: 180, rating: 4.6, bestTimeToVisit: "November to February" },
  { slug: "alleppey", name: "Alleppey", state: "Kerala", country: "India", description: "The Venice of the East — a network of serene backwaters, rice paddy fields and coconut lagoons best explored on a traditional wooden houseboat.", tags: ["backwaters", "houseboat", "nature", "serene", "kerala"], hotelCount: 65, rating: 4.8, bestTimeToVisit: "September to March" },
  { slug: "munnar", name: "Munnar", state: "Kerala", country: "India", description: "A lush hill station carpeted in rolling tea estates, misty peaks and waterfalls. Eravikulam National Park protects the endangered Nilgiri Tahr.", tags: ["tea", "hills", "nature", "wildlife", "scenic"], hotelCount: 48, rating: 4.7, bestTimeToVisit: "September to May" },
  { slug: "manali", name: "Manali", state: "Himachal Pradesh", country: "India", description: "A high-altitude Himalayan resort town set in the Kullu Valley — gateway to Rohtang Pass and Spiti Valley, with adventure sports, pine forests and Buddhist monasteries.", tags: ["adventure", "snow", "himalaya", "skiing", "monastery"], hotelCount: 95, rating: 4.6, bestTimeToVisit: "October to June" },
  { slug: "shimla", name: "Shimla", state: "Himachal Pradesh", country: "India", description: "The former summer capital of British India — a charming hill station of colonial architecture along the celebrated Ridge, Christ Church, Mall Road and the Kalka-Shimla heritage toy train.", tags: ["hill-station", "colonial", "heritage", "shopping", "scenic"], hotelCount: 72, rating: 4.5, bestTimeToVisit: "March to June, December to January" },
  { slug: "ooty", name: "Ooty", state: "Tamil Nadu", country: "India", description: "The Queen of Hill Stations in the Nilgiris — famous for its botanical garden, Ooty Lake boat rides, the UNESCO-listed Nilgiri Mountain Railway toy train, and fragrant tea forests.", tags: ["hill-station", "tea", "botanical", "toy-train", "nature"], hotelCount: 55, rating: 4.4, bestTimeToVisit: "April to June, September to November" },
  { slug: "rishikesh", name: "Rishikesh", state: "Uttarakhand", country: "India", description: "The Yoga Capital of the World — a spiritual city on the banks of the Ganges with ashrams, white-water rafting, the Beatles Ashram, and Laxman Jhula suspension bridge.", tags: ["yoga", "spiritual", "adventure", "ganges", "rafting"], hotelCount: 68, rating: 4.7, bestTimeToVisit: "September to June" },
  { slug: "mumbai", name: "Mumbai", state: "Maharashtra", country: "India", description: "The City of Dreams — India's financial and entertainment capital with the Gateway of India, Marine Drive, Elephanta Caves, Bollywood studios, and world-class dining.", tags: ["city", "bollywood", "heritage", "food", "nightlife"], hotelCount: 210, rating: 4.5, bestTimeToVisit: "November to February" },
  { slug: "agra", name: "Agra", state: "Uttar Pradesh", country: "India", description: "Home to the eternal Taj Mahal — a UNESCO World Heritage monument and one of the Seven Wonders of the World. Agra Fort and Fatehpur Sikri add Mughal splendour.", tags: ["taj-mahal", "mughal", "UNESCO", "heritage", "wonder"], hotelCount: 88, rating: 4.6, bestTimeToVisit: "October to March" },
  { slug: "varanasi", name: "Varanasi", state: "Uttar Pradesh", country: "India", description: "The Eternal City — one of the world's oldest inhabited cities and Hinduism's holiest pilgrimage site. The ghats, Ganga Aarti at sunset, and narrow temple lanes.", tags: ["spiritual", "ghats", "ganges", "heritage", "pilgrimage"], hotelCount: 52, rating: 4.7, bestTimeToVisit: "October to March" },
  { slug: "delhi", name: "New Delhi", state: "Delhi", country: "India", description: "India's grand capital — a city of layered history from Mughal Red Fort to colonial Connaught Place. Humayun's Tomb, Qutub Minar, India Gate, and Chandni Chowk.", tags: ["capital", "mughal", "heritage", "food", "art"], hotelCount: 250, rating: 4.5, bestTimeToVisit: "October to March" },
];

export const destinations: Destination[] = rawDestinations.map((d, i) => ({
  ...d,
  id: i + 1,
  images: [getDestinationImage(d.slug)],
}));

const rawHotels = [
  { destinationSlug: "kolkata", destinationName: "Kolkata", name: "The Oberoi Grand Kolkata", description: "A colonial landmark on Chowringhee Road dating from 1887, offering impeccable service, an elegant pool, Baan Thai restaurant, and rooms with parkside views.", starRating: 5, pricePerNight: 12000, amenities: ["Pool", "Spa", "WiFi", "Restaurant", "Bar", "Gym"], address: "15 Jawaharlal Nehru Road, Kolkata", state: "West Bengal", rating: 4.8, reviewCount: 1240, freeCancellation: true },
  { destinationSlug: "kolkata", destinationName: "Kolkata", name: "ITC Royal Bengal", description: "A contemporary luxury hotel towering over New Town with panoramic views, legendary Dum Pum restaurant celebrating Bengali cuisine, and a spectacular rooftop pool.", starRating: 5, pricePerNight: 9500, amenities: ["Pool", "Spa", "WiFi", "Restaurant", "Gym", "Business Center"], address: "1, JBS Haldane Avenue, New Town, Kolkata", state: "West Bengal", rating: 4.7, reviewCount: 890, freeCancellation: true },
  { destinationSlug: "darjeeling", destinationName: "Darjeeling", name: "The Elgin Darjeeling", description: "A heritage hotel built in 1887 as a summer retreat for the Maharajas of Cooch Behar, offering Victorian grandeur, fireplaces, mountain views and exceptional cuisine.", starRating: 5, pricePerNight: 8500, amenities: ["WiFi", "Restaurant", "Fireplace", "Garden", "Library"], address: "HD Lama Road, Darjeeling", state: "West Bengal", rating: 4.9, reviewCount: 567, freeCancellation: true },
  { destinationSlug: "darjeeling", destinationName: "Darjeeling", name: "Mayfair Darjeeling", description: "Set amidst 3.5 acres of Himalayan gardens, this heritage resort offers panoramic Kanchenjunga views, traditional Tibetan décor, and an exceptional tea lounge.", starRating: 5, pricePerNight: 7200, amenities: ["Spa", "WiFi", "Restaurant", "Garden", "Tea Lounge"], address: "The Mall, Darjeeling", state: "West Bengal", rating: 4.8, reviewCount: 423, freeCancellation: true },
  { destinationSlug: "sundarbans", destinationName: "Sundarbans", name: "Sundarbans Tiger Camp", description: "An eco-resort nestled within the mangrove forests offering guided boat safaris, birdwatching, and a chance to spot the Royal Bengal Tiger in its natural habitat.", starRating: 3, pricePerNight: 4500, amenities: ["Safari", "WiFi", "Restaurant", "Birdwatching", "Boat Tours"], address: "Gosaba Island, Sundarbans", state: "West Bengal", rating: 4.7, reviewCount: 312, freeCancellation: false },
  { destinationSlug: "digha", destinationName: "Digha", name: "Sea View Resort Digha", description: "A beachfront resort directly on the Bay of Bengal with unobstructed sea views, a rooftop restaurant serving fresh seafood, and easy access to both beaches.", starRating: 4, pricePerNight: 3500, amenities: ["Pool", "WiFi", "Restaurant", "Beach Access", "Parking"], address: "Sea Beach Road, Digha", state: "West Bengal", rating: 4.3, reviewCount: 445, freeCancellation: true },
  { destinationSlug: "shantiniketan", destinationName: "Shantiniketan", name: "Santiniketan Hotel & Resort", description: "A cultural retreat inspired by Tagore's philosophy — terracotta architecture, traditional Bengali décor, folk music evenings, and organic farm-to-table cuisine.", starRating: 4, pricePerNight: 4200, amenities: ["WiFi", "Restaurant", "Garden", "Cultural Programs", "Parking"], address: "Sriniketan Road, Bolpur, Shantiniketan", state: "West Bengal", rating: 4.5, reviewCount: 289, freeCancellation: true },
  { destinationSlug: "jaipur", destinationName: "Jaipur", name: "Rambagh Palace", description: "Once the maharaja's hunting lodge, now a Taj hotel of legendary grandeur — lush Mughal gardens, polo grounds, heritage suites with painted alcoves.", starRating: 5, pricePerNight: 28000, amenities: ["Pool", "Spa", "WiFi", "Restaurant", "Polo", "Tennis", "Gym"], address: "Bhawani Singh Road, Jaipur", state: "Rajasthan", rating: 4.9, reviewCount: 2100, freeCancellation: true },
  { destinationSlug: "jaipur", destinationName: "Jaipur", name: "Samode Haveli", description: "A 475-year-old aristocratic mansion in the walled city — frescoed corridors, a rooftop plunge pool, Rajput cuisine evenings, and a living museum.", starRating: 5, pricePerNight: 14500, amenities: ["Pool", "Spa", "WiFi", "Restaurant", "Garden"], address: "Gangapole, Jaipur", state: "Rajasthan", rating: 4.8, reviewCount: 876, freeCancellation: true },
  { destinationSlug: "udaipur", destinationName: "Udaipur", name: "Taj Lake Palace", description: "The most romantic hotel in India — a 18th-century palace floating on Lake Pichola, accessible only by boat, with lotus-shaped outdoor pool and frescoed suites.", starRating: 5, pricePerNight: 35000, amenities: ["Pool", "Spa", "WiFi", "Restaurant", "Boat Transfer", "Gym"], address: "Lake Pichola, Udaipur", state: "Rajasthan", rating: 4.9, reviewCount: 3400, freeCancellation: true },
  { destinationSlug: "jodhpur", destinationName: "Jodhpur", name: "Umaid Bhawan Palace", description: "One of the last great palaces built in India — a Taj hotel within a functioning royal residence overlooking the Blue City. Art Deco suites and vintage cars.", starRating: 5, pricePerNight: 30000, amenities: ["Pool", "Spa", "WiFi", "Restaurant", "Tennis", "Billiards"], address: "Palace Road, Jodhpur", state: "Rajasthan", rating: 4.9, reviewCount: 1800, freeCancellation: true },
  { destinationSlug: "goa", destinationName: "Goa", name: "Taj Exotica Goa", description: "A barefoot luxury resort on 56 acres of Benaulim beachfront — private beach, four pools, seven dining outlets, and a world-class spa.", starRating: 5, pricePerNight: 18000, amenities: ["Beach Access", "Pool", "Spa", "WiFi", "Restaurant", "Golf", "Gym"], address: "Calwaddo, Benaulim, South Goa", state: "Goa", rating: 4.8, reviewCount: 2800, freeCancellation: true },
  { destinationSlug: "goa", destinationName: "Goa", name: "The Leela Goa", description: "A 75-acre beachside resort on Mobor Beach where the Arabian Sea meets the Sal River — lagoon pools, private beach, and championship golf.", starRating: 5, pricePerNight: 16500, amenities: ["Beach Access", "Pool", "Spa", "WiFi", "Restaurant", "Golf"], address: "Mobor, Cavelossim, South Goa", state: "Goa", rating: 4.7, reviewCount: 2100, freeCancellation: true },
  { destinationSlug: "alleppey", destinationName: "Alleppey", name: "Marari Beach Resort", description: "An award-winning eco-resort on pristine Marari Beach — private beach villa, Ayurvedic spa, yoga pavilion, and farm-to-table kitchen.", starRating: 5, pricePerNight: 12500, amenities: ["Beach Access", "Pool", "Spa", "WiFi", "Ayurveda", "Yoga", "Fishing"], address: "Mararikulam, Alleppey", state: "Kerala", rating: 4.8, reviewCount: 1560, freeCancellation: true },
  { destinationSlug: "munnar", destinationName: "Munnar", name: "Spice Tree Munnar", description: "An intimate hillside retreat perched among tea gardens at 5,000 ft — only 14 spacious villas with private plunge pools and forest views.", starRating: 5, pricePerNight: 15000, amenities: ["Pool", "Spa", "WiFi", "Restaurant", "Nature Walks", "Garden"], address: "Devikulam, Munnar", state: "Kerala", rating: 4.9, reviewCount: 678, freeCancellation: true },
  { destinationSlug: "manali", destinationName: "Manali", name: "Span Resort & Spa", description: "A luxury wilderness retreat on the banks of the Beas River — elegant cottages with river views, rejuvenating spa, and heated outdoor pool.", starRating: 5, pricePerNight: 9000, amenities: ["Pool", "Spa", "WiFi", "Restaurant", "Adventure Sports"], address: "Katrain, Kullu Valley, Manali", state: "Himachal Pradesh", rating: 4.7, reviewCount: 890, freeCancellation: true },
  { destinationSlug: "shimla", destinationName: "Shimla", name: "Wildflower Hall", description: "A former Cecil mansion at 8,250 ft on a cedar-forested ridge — infinity pool, croquet, archery and the finest views in Shimla.", starRating: 5, pricePerNight: 22000, amenities: ["Pool", "Spa", "WiFi", "Restaurant", "Gym", "Archery"], address: "Chharabra, Shimla", state: "Himachal Pradesh", rating: 4.9, reviewCount: 1100, freeCancellation: true },
  { destinationSlug: "ooty", destinationName: "Ooty", name: "Savoy Hotel Ooty", description: "A historic Taj property founded in 1829 — 42 cottages set in 6 acres of manicured gardens, fireplaces, vintage furnishings, and classic Nilgiri cuisine.", starRating: 4, pricePerNight: 7500, amenities: ["WiFi", "Restaurant", "Garden", "Fireplace", "Gym"], address: "77 Sylks Road, Ooty", state: "Tamil Nadu", rating: 4.6, reviewCount: 760, freeCancellation: true },
  { destinationSlug: "rishikesh", destinationName: "Rishikesh", name: "Aloha on the Ganges", description: "A serene wellness resort on the Ganga bank offering yoga, meditation and Ayurvedic treatments — tented cottages with river views.", starRating: 4, pricePerNight: 6000, amenities: ["Yoga", "Spa", "WiFi", "Restaurant", "Rafting", "River View"], address: "Swargashram, Rishikesh", state: "Uttarakhand", rating: 4.7, reviewCount: 934, freeCancellation: true },
  { destinationSlug: "mumbai", destinationName: "Mumbai", name: "Taj Mahal Palace Mumbai", description: "India's most iconic hotel — a 1903 heritage landmark facing the Gateway of India and the Arabian Sea. Royal suites and legendary dining.", starRating: 5, pricePerNight: 25000, amenities: ["Pool", "Spa", "WiFi", "Restaurant", "Bar", "Gym", "Butler"], address: "Apollo Bunder, Colaba, Mumbai", state: "Maharashtra", rating: 4.9, reviewCount: 4500, freeCancellation: true },
  { destinationSlug: "agra", destinationName: "Agra", name: "The Oberoi Amarvilas", description: "The closest luxury hotel to the Taj Mahal — every room has an unobstructed Taj view, Mughal fountain courtyard and butler-drawn baths.", starRating: 5, pricePerNight: 38000, amenities: ["Pool", "Spa", "WiFi", "Restaurant", "Taj View", "Butler"], address: "Taj East Gate Road, Agra", state: "Uttar Pradesh", rating: 4.9, reviewCount: 2890, freeCancellation: true },
  { destinationSlug: "delhi", destinationName: "New Delhi", name: "The Imperial New Delhi", description: "A 1936 Art Deco masterpiece on Janpath — a living museum with 5,000 rare paintings, Patiala restaurant and gardens of jasmine.", starRating: 5, pricePerNight: 20000, amenities: ["Pool", "Spa", "WiFi", "Restaurant", "Bar", "Gym", "Museum"], address: "Janpath, New Delhi", state: "Delhi", rating: 4.8, reviewCount: 3200, freeCancellation: true },
];

export const hotels: Hotel[] = rawHotels.map((h, i) => ({
  ...h,
  id: i + 1,
  images: [getHotelImage(h.name)],
}));

// Location coordinates for Google Maps
export const LOCATION_COORDS: Record<string, { lat: number; lng: number }> = {
  "kolkata": { lat: 22.5726, lng: 88.3639 },
  "darjeeling": { lat: 27.0360, lng: 88.2627 },
  "sundarbans": { lat: 21.9497, lng: 89.1833 },
  "digha": { lat: 21.6274, lng: 87.5079 },
  "shantiniketan": { lat: 23.6783, lng: 87.6856 },
  "murshidabad": { lat: 24.1742, lng: 88.2733 },
  "bishnupur": { lat: 23.0733, lng: 87.3219 },
  "cooch-behar": { lat: 26.3245, lng: 89.4482 },
  "jaipur": { lat: 26.9124, lng: 75.7873 },
  "udaipur": { lat: 24.5854, lng: 73.7125 },
  "jodhpur": { lat: 26.2389, lng: 73.0243 },
  "goa": { lat: 15.2993, lng: 74.1240 },
  "alleppey": { lat: 9.4981, lng: 76.3388 },
  "munnar": { lat: 10.0889, lng: 77.0595 },
  "manali": { lat: 32.2396, lng: 77.1887 },
  "shimla": { lat: 31.1048, lng: 77.1734 },
  "ooty": { lat: 11.4102, lng: 76.6950 },
  "rishikesh": { lat: 30.0869, lng: 78.2676 },
  "mumbai": { lat: 19.0760, lng: 72.8777 },
  "agra": { lat: 27.1767, lng: 78.0081 },
  "varanasi": { lat: 25.3176, lng: 82.9739 },
  "delhi": { lat: 28.6139, lng: 77.2090 },
};

// ── Local Storage Helpers ──────────────────────────────────────────────────
const STORAGE_KEYS = {
  USER: "wanderstay_user",
  BOOKINGS: "wanderstay_bookings",
};

function getLocalUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function setLocalUser(user: User | null) {
  if (typeof window === "undefined") return;
  if (user) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  else localStorage.removeItem(STORAGE_KEYS.USER);
}

function getLocalBookings(): Booking[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function setLocalBookings(bookings: Booking[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
}

// ── Bookings ───────────────────────────────────────────────────────────────
export function getBookings(): Booking[] {
  return getLocalBookings();
}

export function addBooking(booking: Omit<Booking, "id" | "createdAt" | "status">): Booking {
  const bookings = getLocalBookings();
  const nextId = bookings.length > 0 ? Math.max(...bookings.map(b => b.id)) + 1 : 1;
  
  const newBooking: Booking = {
    ...booking,
    id: nextId,
    status: "upcoming",
    createdAt: new Date().toISOString(),
  };
  
  bookings.push(newBooking);
  setLocalBookings(bookings);
  return newBooking;
}

export function cancelBooking(id: number): boolean {
  const bookings = getLocalBookings();
  const bookingIndex = bookings.findIndex((b) => b.id === id);
  
  if (bookingIndex !== -1 && bookings[bookingIndex].status === "upcoming") {
    bookings[bookingIndex].status = "cancelled";
    setLocalBookings(bookings);
    return true;
  }
  return false;
}

// ── Auth ───────────────────────────────────────────────────────────────────
export function loginUser(email: string, _password: string): User | null {
  const user = { 
    id: 1, 
    name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, c => c.toUpperCase()), 
    email, 
    createdAt: new Date().toISOString() 
  };
  setLocalUser(user);
  return user;
}

export function registerUser(name: string, email: string, _password: string): User | null {
  const user = { 
    id: 1, 
    name, 
    email, 
    createdAt: new Date().toISOString() 
  };
  setLocalUser(user);
  return user;
}

export function logoutUser(): void {
  setLocalUser(null);
}

export function getCurrentUser(): User | null {
  return getLocalUser();
}
