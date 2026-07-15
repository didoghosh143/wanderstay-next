import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { destinationsTable, hotelsTable, usersTable } from "./src/lib/db/schema";
import { hashSync } from "bcryptjs";

const sqlite = new Database("sqlite.db");
const db = drizzle(sqlite);

// ── Image helpers (copied from src/lib/images.ts) ─────────────────────────
const DEST_IMAGES: Record<string, string> = {
  "kolkata": "https://images.unsplash.com/photo-1558431382-27e303142255?w=800&q=80",
  "darjeeling": "https://images.unsplash.com/photo-1622308644420-27280a6b4e4e?w=800&q=80",
  "sundarbans": "https://images.unsplash.com/photo-1609948543911-7481ba553bc5?w=800&q=80",
  "digha": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
  "shantiniketan": "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80",
  "murshidabad": "https://images.unsplash.com/photo-1585135497273-1a86d9d9e893?w=800&q=80",
  "bishnupur": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&q=80",
  "cooch-behar": "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80",
  "jaipur": "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80",
  "udaipur": "https://images.unsplash.com/photo-1524309168994-e0e010b5a40b?w=800&q=80",
  "jodhpur": "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80",
  "goa": "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80",
  "alleppey": "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80",
  "munnar": "https://images.unsplash.com/photo-1625130220976-e4200e36226c?w=800&q=80",
  "manali": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80",
  "shimla": "https://images.unsplash.com/photo-1597074866923-dc0589150887?w=800&q=80",
  "ooty": "https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&q=80",
  "rishikesh": "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=800&q=80",
  "mumbai": "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?w=800&q=80",
  "agra": "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80",
  "varanasi": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&q=80",
  "delhi": "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80",
};

const HOTEL_IMAGES: Record<string, string> = {
  "The Oberoi Grand Kolkata": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
  "ITC Royal Bengal": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
  "The Elgin Darjeeling": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
  "Mayfair Darjeeling": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
  "Sundarbans Tiger Camp": "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80",
  "Sea View Resort Digha": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
  "Santiniketan Hotel & Resort": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
  "Rambagh Palace": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
  "Samode Haveli": "https://images.unsplash.com/photo-1600011689032-8b628b8a8747?w=800&q=80",
  "Taj Lake Palace": "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80",
  "Umaid Bhawan Palace": "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80",
  "Taj Exotica Goa": "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&q=80",
  "The Leela Goa": "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
  "Marari Beach Resort": "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=800&q=80",
  "Spice Tree Munnar": "https://images.unsplash.com/photo-1585543805890-6051f7829f98?w=800&q=80",
  "Span Resort & Spa": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
  "Wildflower Hall": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
  "Savoy Hotel Ooty": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
  "Aloha on the Ganges": "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80",
  "Taj Mahal Palace Mumbai": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
  "The Oberoi Amarvilas": "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80",
  "The Imperial New Delhi": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
};

const DEFAULT_HOTEL_IMAGE = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80";
const DEFAULT_DEST_IMAGE = "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80";

// ── Seed Data ─────────────────────────────────────────────────────────────
const rawDestinations = [
  { slug: "kolkata", name: "Kolkata", state: "West Bengal", country: "India", description: "The City of Joy — India's cultural capital with a rich colonial heritage, Victoria Memorial, Howrah Bridge, and vibrant street food scene along Park Street and College Street.", tags: ["heritage", "culture", "street-food", "art", "city"], hotelCount: 85, rating: 4.6, bestTimeToVisit: "October to March" },
  { slug: "darjeeling", name: "Darjeeling", state: "West Bengal", country: "India", description: "The Queen of Hills — home to world-famous tea gardens, the Himalayan Railways toy train (UNESCO Heritage), and breathtaking views of Kanchenjunga peak at sunrise from Tiger Hill.", tags: ["hills", "tea", "himalaya", "nature", "heritage"], hotelCount: 42, rating: 4.8, bestTimeToVisit: "March to May, October to December" },
  { slug: "sundarbans", name: "Sundarbans", state: "West Bengal", country: "India", description: "The world's largest mangrove delta — a UNESCO World Heritage site and home to the Royal Bengal Tiger, estuarine crocodiles, and Irrawaddy dolphins across 10,000 sq km of tidal waterways.", tags: ["wildlife", "nature", "tiger", "mangrove", "UNESCO"], hotelCount: 18, rating: 4.7, bestTimeToVisit: "November to February" },
  { slug: "digha", name: "Digha", state: "West Bengal", country: "India", description: "The 'Brighton of the East' — a beloved seaside resort with a wide sandy beach, gentle surf, fresh seafood, and the Marine Aquarium.", tags: ["beach", "sea", "relaxation", "seafood", "weekend"], hotelCount: 55, rating: 4.2, bestTimeToVisit: "October to March" },
  { slug: "shantiniketan", name: "Shantiniketan", state: "West Bengal", country: "India", description: "Rabindranath Tagore's timeless creation — a university town radiating art, music, literature and Bengali culture.", tags: ["culture", "art", "literature", "heritage", "academia"], hotelCount: 22, rating: 4.5, bestTimeToVisit: "October to March" },
  { slug: "murshidabad", name: "Murshidabad", state: "West Bengal", country: "India", description: "The last capital of the Nawabs of Bengal — a historic city with the magnificent Hazarduari Palace.", tags: ["heritage", "history", "nawab", "palace", "silk"], hotelCount: 15, rating: 4.4, bestTimeToVisit: "October to March" },
  { slug: "bishnupur", name: "Bishnupur", state: "West Bengal", country: "India", description: "The terracotta temple town — ancient temples built entirely of laterite and terracotta.", tags: ["temples", "heritage", "art", "terracotta", "handicraft"], hotelCount: 10, rating: 4.3, bestTimeToVisit: "October to February" },
  { slug: "cooch-behar", name: "Cooch Behar", state: "West Bengal", country: "India", description: "A royal city in North Bengal known for the splendid Cooch Behar Palace.", tags: ["palace", "heritage", "royal", "temple", "north-bengal"], hotelCount: 12, rating: 4.2, bestTimeToVisit: "October to March" },
  { slug: "jaipur", name: "Jaipur", state: "Rajasthan", country: "India", description: "The Pink City — a royal kaleidoscope of palaces, forts, bazaars and elephants.", tags: ["palace", "heritage", "culture", "shopping", "royalty"], hotelCount: 120, rating: 4.7, bestTimeToVisit: "October to March" },
  { slug: "udaipur", name: "Udaipur", state: "Rajasthan", country: "India", description: "The City of Lakes — a romantic city of shimmering lakes, whitewashed palaces and Aravalli hills.", tags: ["lakes", "palace", "romantic", "heritage", "luxury"], hotelCount: 92, rating: 4.9, bestTimeToVisit: "September to March" },
  { slug: "jodhpur", name: "Jodhpur", state: "Rajasthan", country: "India", description: "The Blue City — dominated by the magnificent Mehrangarh Fort.", tags: ["fort", "heritage", "blue-city", "culture", "handicraft"], hotelCount: 78, rating: 4.6, bestTimeToVisit: "October to March" },
  { slug: "goa", name: "Goa", state: "Goa", country: "India", description: "India's beach paradise — a sun-soaked state with 100km of coastline.", tags: ["beach", "party", "heritage", "seafood", "nightlife"], hotelCount: 180, rating: 4.6, bestTimeToVisit: "November to February" },
  { slug: "alleppey", name: "Alleppey", state: "Kerala", country: "India", description: "The Venice of the East — a network of serene backwaters.", tags: ["backwaters", "houseboat", "nature", "serene", "kerala"], hotelCount: 65, rating: 4.8, bestTimeToVisit: "September to March" },
  { slug: "munnar", name: "Munnar", state: "Kerala", country: "India", description: "A lush hill station carpeted in rolling tea estates, misty peaks and waterfalls.", tags: ["tea", "hills", "nature", "wildlife", "scenic"], hotelCount: 48, rating: 4.7, bestTimeToVisit: "September to May" },
  { slug: "manali", name: "Manali", state: "Himachal Pradesh", country: "India", description: "A high-altitude Himalayan resort town set in the Kullu Valley.", tags: ["adventure", "snow", "himalaya", "skiing", "monastery"], hotelCount: 95, rating: 4.6, bestTimeToVisit: "October to June" },
  { slug: "shimla", name: "Shimla", state: "Himachal Pradesh", country: "India", description: "The former summer capital of British India — a charming hill station.", tags: ["hill-station", "colonial", "heritage", "shopping", "scenic"], hotelCount: 72, rating: 4.5, bestTimeToVisit: "March to June, December to January" },
  { slug: "ooty", name: "Ooty", state: "Tamil Nadu", country: "India", description: "The Queen of Hill Stations in the Nilgiris.", tags: ["hill-station", "tea", "botanical", "toy-train", "nature"], hotelCount: 55, rating: 4.4, bestTimeToVisit: "April to June, September to November" },
  { slug: "rishikesh", name: "Rishikesh", state: "Uttarakhand", country: "India", description: "The Yoga Capital of the World — a spiritual city on the banks of the Ganges.", tags: ["yoga", "spiritual", "adventure", "ganges", "rafting"], hotelCount: 68, rating: 4.7, bestTimeToVisit: "September to June" },
  { slug: "mumbai", name: "Mumbai", state: "Maharashtra", country: "India", description: "The City of Dreams — India's financial and entertainment capital.", tags: ["city", "bollywood", "heritage", "food", "nightlife"], hotelCount: 210, rating: 4.5, bestTimeToVisit: "November to February" },
  { slug: "agra", name: "Agra", state: "Uttar Pradesh", country: "India", description: "Home to the eternal Taj Mahal — a UNESCO World Heritage monument.", tags: ["taj-mahal", "mughal", "UNESCO", "heritage", "wonder"], hotelCount: 88, rating: 4.6, bestTimeToVisit: "October to March" },
  { slug: "varanasi", name: "Varanasi", state: "Uttar Pradesh", country: "India", description: "The Eternal City — one of the world's oldest inhabited cities.", tags: ["spiritual", "ghats", "ganges", "heritage", "pilgrimage"], hotelCount: 52, rating: 4.7, bestTimeToVisit: "October to March" },
  { slug: "delhi", name: "New Delhi", state: "Delhi", country: "India", description: "India's grand capital — a city of layered history from Mughal Red Fort to colonial Connaught Place.", tags: ["capital", "mughal", "heritage", "food", "art"], hotelCount: 250, rating: 4.5, bestTimeToVisit: "October to March" },
];

const rawHotels = [
  { destinationSlug: "kolkata", destinationName: "Kolkata", name: "The Oberoi Grand Kolkata", description: "A colonial landmark on Chowringhee Road dating from 1887.", starRating: 5, pricePerNight: 12000, amenities: ["Pool", "Spa", "WiFi", "Restaurant", "Bar", "Gym"], address: "15 Jawaharlal Nehru Road, Kolkata", state: "West Bengal", rating: 4.8, reviewCount: 1240, freeCancellation: true },
  { destinationSlug: "kolkata", destinationName: "Kolkata", name: "ITC Royal Bengal", description: "A contemporary luxury hotel towering over New Town.", starRating: 5, pricePerNight: 9500, amenities: ["Pool", "Spa", "WiFi", "Restaurant", "Gym", "Business Center"], address: "1, JBS Haldane Avenue, New Town, Kolkata", state: "West Bengal", rating: 4.7, reviewCount: 890, freeCancellation: true },
  { destinationSlug: "darjeeling", destinationName: "Darjeeling", name: "The Elgin Darjeeling", description: "A heritage hotel built in 1887 as a summer retreat.", starRating: 5, pricePerNight: 8500, amenities: ["WiFi", "Restaurant", "Fireplace", "Garden", "Library"], address: "HD Lama Road, Darjeeling", state: "West Bengal", rating: 4.9, reviewCount: 567, freeCancellation: true },
  { destinationSlug: "darjeeling", destinationName: "Darjeeling", name: "Mayfair Darjeeling", description: "Set amidst 3.5 acres of Himalayan gardens.", starRating: 5, pricePerNight: 7200, amenities: ["Spa", "WiFi", "Restaurant", "Garden", "Tea Lounge"], address: "The Mall, Darjeeling", state: "West Bengal", rating: 4.8, reviewCount: 423, freeCancellation: true },
  { destinationSlug: "sundarbans", destinationName: "Sundarbans", name: "Sundarbans Tiger Camp", description: "An eco-resort nestled within the mangrove forests.", starRating: 3, pricePerNight: 4500, amenities: ["Safari", "WiFi", "Restaurant", "Birdwatching", "Boat Tours"], address: "Gosaba Island, Sundarbans", state: "West Bengal", rating: 4.7, reviewCount: 312, freeCancellation: false },
  { destinationSlug: "digha", destinationName: "Digha", name: "Sea View Resort Digha", description: "A beachfront resort directly on the Bay of Bengal.", starRating: 4, pricePerNight: 3500, amenities: ["Pool", "WiFi", "Restaurant", "Beach Access", "Parking"], address: "Sea Beach Road, Digha", state: "West Bengal", rating: 4.3, reviewCount: 445, freeCancellation: true },
  { destinationSlug: "shantiniketan", destinationName: "Shantiniketan", name: "Santiniketan Hotel & Resort", description: "A cultural retreat inspired by Tagore's philosophy.", starRating: 4, pricePerNight: 4200, amenities: ["WiFi", "Restaurant", "Garden", "Cultural Programs", "Parking"], address: "Sriniketan Road, Bolpur, Shantiniketan", state: "West Bengal", rating: 4.5, reviewCount: 289, freeCancellation: true },
  { destinationSlug: "jaipur", destinationName: "Jaipur", name: "Rambagh Palace", description: "Once the maharaja's hunting lodge, now a Taj hotel.", starRating: 5, pricePerNight: 28000, amenities: ["Pool", "Spa", "WiFi", "Restaurant", "Polo", "Tennis", "Gym"], address: "Bhawani Singh Road, Jaipur", state: "Rajasthan", rating: 4.9, reviewCount: 2100, freeCancellation: true },
  { destinationSlug: "jaipur", destinationName: "Jaipur", name: "Samode Haveli", description: "A 475-year-old aristocratic mansion in the walled city.", starRating: 5, pricePerNight: 14500, amenities: ["Pool", "Spa", "WiFi", "Restaurant", "Garden"], address: "Gangapole, Jaipur", state: "Rajasthan", rating: 4.8, reviewCount: 876, freeCancellation: true },
  { destinationSlug: "udaipur", destinationName: "Udaipur", name: "Taj Lake Palace", description: "The most romantic hotel in India — floating on Lake Pichola.", starRating: 5, pricePerNight: 35000, amenities: ["Pool", "Spa", "WiFi", "Restaurant", "Boat Transfer", "Gym"], address: "Lake Pichola, Udaipur", state: "Rajasthan", rating: 4.9, reviewCount: 3400, freeCancellation: true },
  { destinationSlug: "jodhpur", destinationName: "Jodhpur", name: "Umaid Bhawan Palace", description: "One of the last great palaces built in India.", starRating: 5, pricePerNight: 30000, amenities: ["Pool", "Spa", "WiFi", "Restaurant", "Tennis", "Billiards"], address: "Palace Road, Jodhpur", state: "Rajasthan", rating: 4.9, reviewCount: 1800, freeCancellation: true },
  { destinationSlug: "goa", destinationName: "Goa", name: "Taj Exotica Goa", description: "A barefoot luxury resort on 56 acres of Benaulim beachfront.", starRating: 5, pricePerNight: 18000, amenities: ["Beach Access", "Pool", "Spa", "WiFi", "Restaurant", "Golf", "Gym"], address: "Calwaddo, Benaulim, South Goa", state: "Goa", rating: 4.8, reviewCount: 2800, freeCancellation: true },
  { destinationSlug: "goa", destinationName: "Goa", name: "The Leela Goa", description: "A 75-acre beachside resort on Mobor Beach.", starRating: 5, pricePerNight: 16500, amenities: ["Beach Access", "Pool", "Spa", "WiFi", "Restaurant", "Golf"], address: "Mobor, Cavelossim, South Goa", state: "Goa", rating: 4.7, reviewCount: 2100, freeCancellation: true },
  { destinationSlug: "alleppey", destinationName: "Alleppey", name: "Marari Beach Resort", description: "An award-winning eco-resort on pristine Marari Beach.", starRating: 5, pricePerNight: 12500, amenities: ["Beach Access", "Pool", "Spa", "WiFi", "Ayurveda", "Yoga", "Fishing"], address: "Mararikulam, Alleppey", state: "Kerala", rating: 4.8, reviewCount: 1560, freeCancellation: true },
  { destinationSlug: "munnar", destinationName: "Munnar", name: "Spice Tree Munnar", description: "An intimate hillside retreat perched among tea gardens.", starRating: 5, pricePerNight: 15000, amenities: ["Pool", "Spa", "WiFi", "Restaurant", "Nature Walks", "Garden"], address: "Devikulam, Munnar", state: "Kerala", rating: 4.9, reviewCount: 678, freeCancellation: true },
  { destinationSlug: "manali", destinationName: "Manali", name: "Span Resort & Spa", description: "A luxury wilderness retreat on the banks of the Beas River.", starRating: 5, pricePerNight: 9000, amenities: ["Pool", "Spa", "WiFi", "Restaurant", "Adventure Sports"], address: "Katrain, Kullu Valley, Manali", state: "Himachal Pradesh", rating: 4.7, reviewCount: 890, freeCancellation: true },
  { destinationSlug: "shimla", destinationName: "Shimla", name: "Wildflower Hall", description: "A former Cecil mansion at 8,250 ft on a cedar-forested ridge.", starRating: 5, pricePerNight: 22000, amenities: ["Pool", "Spa", "WiFi", "Restaurant", "Gym", "Archery"], address: "Chharabra, Shimla", state: "Himachal Pradesh", rating: 4.9, reviewCount: 1100, freeCancellation: true },
  { destinationSlug: "ooty", destinationName: "Ooty", name: "Savoy Hotel Ooty", description: "A historic Taj property founded in 1829.", starRating: 4, pricePerNight: 7500, amenities: ["WiFi", "Restaurant", "Garden", "Fireplace", "Gym"], address: "77 Sylks Road, Ooty", state: "Tamil Nadu", rating: 4.6, reviewCount: 760, freeCancellation: true },
  { destinationSlug: "rishikesh", destinationName: "Rishikesh", name: "Aloha on the Ganges", description: "A serene wellness resort on the Ganga bank.", starRating: 4, pricePerNight: 6000, amenities: ["Yoga", "Spa", "WiFi", "Restaurant", "Rafting", "River View"], address: "Swargashram, Rishikesh", state: "Uttarakhand", rating: 4.7, reviewCount: 934, freeCancellation: true },
  { destinationSlug: "mumbai", destinationName: "Mumbai", name: "Taj Mahal Palace Mumbai", description: "India's most iconic hotel — a 1903 heritage landmark.", starRating: 5, pricePerNight: 25000, amenities: ["Pool", "Spa", "WiFi", "Restaurant", "Bar", "Gym", "Butler"], address: "Apollo Bunder, Colaba, Mumbai", state: "Maharashtra", rating: 4.9, reviewCount: 4500, freeCancellation: true },
  { destinationSlug: "agra", destinationName: "Agra", name: "The Oberoi Amarvilas", description: "The closest luxury hotel to the Taj Mahal.", starRating: 5, pricePerNight: 38000, amenities: ["Pool", "Spa", "WiFi", "Restaurant", "Taj View", "Butler"], address: "Taj East Gate Road, Agra", state: "Uttar Pradesh", rating: 4.9, reviewCount: 2890, freeCancellation: true },
  { destinationSlug: "delhi", destinationName: "New Delhi", name: "The Imperial New Delhi", description: "A 1936 Art Deco masterpiece on Janpath.", starRating: 5, pricePerNight: 20000, amenities: ["Pool", "Spa", "WiFi", "Restaurant", "Bar", "Gym", "Museum"], address: "Janpath, New Delhi", state: "Delhi", rating: 4.8, reviewCount: 3200, freeCancellation: true },
];

// ── Run Seed ──────────────────────────────────────────────────────────────
async function seed() {
  console.log("🌱 Seeding database...\n");

  // Create tables
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS destinations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      state TEXT NOT NULL,
      country TEXT NOT NULL DEFAULT 'India',
      description TEXT NOT NULL,
      images TEXT NOT NULL DEFAULT '[]',
      tags TEXT NOT NULL DEFAULT '[]',
      hotel_count INTEGER NOT NULL DEFAULT 0,
      rating REAL NOT NULL DEFAULT 4.5,
      best_time_to_visit TEXT NOT NULL DEFAULT 'October to March',
      created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
    );

    CREATE TABLE IF NOT EXISTS hotels (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      destination_slug TEXT NOT NULL,
      destination_name TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      images TEXT NOT NULL DEFAULT '[]',
      star_rating INTEGER NOT NULL DEFAULT 4,
      price_per_night INTEGER NOT NULL,
      amenities TEXT NOT NULL DEFAULT '[]',
      address TEXT NOT NULL,
      state TEXT NOT NULL,
      rating REAL NOT NULL DEFAULT 4.5,
      review_count INTEGER NOT NULL DEFAULT 0,
      free_cancellation INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      hotel_id INTEGER NOT NULL,
      hotel_name TEXT NOT NULL,
      hotel_image TEXT NOT NULL DEFAULT '',
      destination_name TEXT NOT NULL,
      check_in TEXT NOT NULL,
      check_out TEXT NOT NULL,
      guests INTEGER NOT NULL DEFAULT 1,
      total_price REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'upcoming',
      created_at TEXT NOT NULL DEFAULT (CURRENT_TIMESTAMP)
    );
  `);

  // Clear existing data
  sqlite.exec("DELETE FROM bookings; DELETE FROM hotels; DELETE FROM destinations; DELETE FROM users;");

  // Seed destinations
  console.log("📍 Seeding destinations...");
  for (const dest of rawDestinations) {
    const image = DEST_IMAGES[dest.slug] || DEFAULT_DEST_IMAGE;
    db.insert(destinationsTable).values({
      ...dest,
      images: [image],
      tags: dest.tags,
    }).run();
  }
  console.log(`   ✓ ${rawDestinations.length} destinations added`);

  // Seed hotels
  console.log("🏨 Seeding hotels...");
  for (const hotel of rawHotels) {
    const image = HOTEL_IMAGES[hotel.name] || DEFAULT_HOTEL_IMAGE;
    db.insert(hotelsTable).values({
      ...hotel,
      images: [image],
      amenities: hotel.amenities,
    }).run();
  }
  console.log(`   ✓ ${rawHotels.length} hotels added`);

  // Seed demo user
  console.log("👤 Seeding demo user...");
  const hashedPassword = hashSync("password123", 10);
  db.insert(usersTable).values({
    name: "Test User",
    email: "test@wanderstay.in",
    password: hashedPassword,
  }).run();
  console.log("   ✓ Demo user: test@wanderstay.in / password123");

  console.log("\n✅ Database seeded successfully!");
}

seed().catch(console.error);
