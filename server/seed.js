import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import connectDB from './configs/db.js';
import User from './models/User.js';
import Car from './models/Car.js';
import Booking from './models/Booking.js';
import bcrypt from 'bcryptjs';
import fetch from 'node-fetch';

dotenv.config();

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
const NUM_USERS = 15;
const NUM_OWNERS = 5;
const NUM_CARS = 30;
const NUM_BOOKINGS = 120;

const carCategories = ['SUV', 'Sedan', 'Hatchback', 'Convertible', 'Coupe', 'Minivan'];
const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];
const transmissions = ['Manual', 'Automatic'];
const locations = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad'
];

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Helper to fetch a relevant car image from Unsplash
async function fetchCarImage(query) {
  if (!UNSPLASH_ACCESS_KEY) {
    console.warn('No Unsplash access key found. Using fallback image.');
    return 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=400&q=80';
  }
  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}%20car&per_page=1&client_id=${UNSPLASH_ACCESS_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].urls.regular;
    }
  } catch (err) {
    console.error('Unsplash fetch error:', err);
  }
  // fallback: generic car image
  return 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=400&q=80';
}

async function seed() {
  await connectDB();
  try {
    // Clear existing data
    await Booking.deleteMany();
    await Car.deleteMany();
    await User.deleteMany();

    // Seed owners
    const owners = [];
    for (let i = 0; i < NUM_OWNERS; i++) {
      const plainPassword = faker.internet.password();
      const hashedPassword = await bcrypt.hash(plainPassword, 10);
      owners.push(new User({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: hashedPassword,
        role: 'owner',
        image: faker.image.avatar(),
      }));
    }

    // Seed users
    const users = [];
    for (let i = 0; i < NUM_USERS; i++) {
      const plainPassword = faker.internet.password();
      const hashedPassword = await bcrypt.hash(plainPassword, 10);
      users.push(new User({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: hashedPassword,
        role: 'user',
        image: faker.image.avatar(),
      }));
    }
    const allUsers = [...owners, ...users];
    await User.insertMany(allUsers);

    const savedOwners = await User.find({ role: 'owner' });
    const savedUsers = await User.find({ role: 'user' });

    // Seed cars with relevant Unsplash images
    const cars = [];
    for (let i = 0; i < NUM_CARS; i++) {
      const owner = randomFrom(savedOwners);
      const brand = faker.vehicle.manufacturer();
      const model = faker.vehicle.model();
      const year = faker.number.int({ min: 2015, max: 2024 });
      const category = randomFrom(carCategories);
      const seating_capacity = faker.number.int({ min: 4, max: 8 });
      const fuel_type = randomFrom(fuelTypes);
      const transmission = randomFrom(transmissions);
      const pricePerDay = faker.number.int({ min: 1200, max: 5000 });
      const location = randomFrom(locations);
      const description = faker.lorem.sentences(2);
      // Fetch a relevant car image from Unsplash
      const image = await fetchCarImage(`${brand} ${model}`);
      cars.push(new Car({
        owner: owner._id,
        brand,
        model,
        image,
        year,
        category,
        seating_capacity,
        fuel_type,
        transmission,
        pricePerDay,
        location,
        description,
        isAvaliable: true,
      }));
      // Add a short delay to avoid Unsplash API rate limits
      await new Promise(res => setTimeout(res, 1200));
    }
    await Car.insertMany(cars);
    const savedCars = await Car.find();

    // Seed bookings
    const bookings = [];
    for (let i = 0; i < NUM_BOOKINGS; i++) {
      const car = randomFrom(savedCars);
      const user = randomFrom(savedUsers);
      const owner = car.owner;
      const pickupDate = faker.date.between({ from: '2024-07-01', to: '2024-08-15' });
      const minReturn = new Date(pickupDate.getTime() + 24*60*60*1000);
      const maxReturn = new Date(pickupDate.getTime() + 14*24*60*60*1000);
      const returnDate = faker.date.between({ from: minReturn, to: maxReturn });
      const days = Math.ceil((returnDate - pickupDate) / (1000 * 60 * 60 * 24));
      const price = car.pricePerDay * days;
      let status;
      const rand = Math.random();
      if (rand < 0.7) status = 'confirmed';
      else if (rand < 0.9) status = 'pending';
      else status = 'cancelled';
      bookings.push(new Booking({
        car: car._id,
        user: user._id,
        owner: owner,
        pickupDate,
        returnDate,
        status,
        price: Math.round(price),
      }));
    }
    await Booking.insertMany(bookings);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed(); 