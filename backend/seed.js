import dotenv from 'dotenv';
import Restaurant from './models/Restaurant.js';
import Product from './models/Product.js';
import connectDB from './config/database.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await Restaurant.deleteMany();
    await Product.deleteMany();
    
    console.log('Cleared existing data');
    
    // Seed restaurants
    const restaurants = await Restaurant.insertMany([
      {
        name: 'KFC',
        description: 'Poulet frit et accompagnements',
        image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=800&q=80',
        rating: 3.8,
        reviews: '1000+',
        deliveryTime: '10-20 min',
        deliveryFee: 2.50,
        badge: '2 offres disponibles',
        badgeColor: 'red',
        category: 'Fast food'
      },
      {
        name: 'Burger King',
        description: 'Burgers flame-grilled',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
        rating: 3.8,
        reviews: '15000+',
        deliveryTime: '15-25 min',
        deliveryFee: 2.00,
        badge: '1 acheté(s) = 1 offert(s)',
        badgeColor: 'red',
        category: 'Burgers'
      },
      {
        name: 'Sushi Shop',
        description: 'Sushis frais et makis',
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&q=80',
        rating: 4.3,
        reviews: '5000+',
        deliveryTime: '20-30 min',
        deliveryFee: 3.00,
        badge: 'Des articles en promotion',
        badgeColor: 'red',
        category: 'Sushis'
      },
      {
        name: 'Toasushi',
        description: 'Cuisine japonaise fusion',
        image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=800&q=80',
        rating: 4.3,
        reviews: '4000+',
        deliveryTime: '25-35 min',
        deliveryFee: 2.50,
        badge: 'Article gratuit (commande sup. à 20 €)',
        badgeColor: 'red',
        category: 'Sushis'
      },
      {
        name: 'Pizza Hut',
        description: 'Pizzas et plus',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
        rating: 4.0,
        reviews: '8000+',
        deliveryTime: '20-30 min',
        deliveryFee: 2.00,
        badge: '1 pizza achetée = 1 offerte',
        badgeColor: 'red',
        category: 'Pizzas'
      },
      {
        name: 'McDonald\'s',
        description: 'Fast food classique',
        image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80',
        rating: 3.9,
        reviews: '20000+',
        deliveryTime: '10-20 min',
        deliveryFee: 1.50,
        badge: '1 acheté = 1 offert',
        badgeColor: 'red',
        category: 'Fast food'
      }
    ]);
    
    console.log('Restaurants seeded:', restaurants.length);
    
    // Seed products for each restaurant
    const products = [];
    
    // KFC products
    products.push(
      {
        name: 'Bucket 10 pièces',
        description: '10 pièces de poulet croustillant',
        price: 15.99,
        image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400',
        restaurant: restaurants[0]._id,
        category: 'Poulet'
      },
      {
        name: 'Menu Colonel',
        description: 'Burger Colonel, frites, boisson',
        price: 9.99,
        image: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400',
        restaurant: restaurants[0]._id,
        category: 'Menus'
      }
    );
    
    // Burger King products
    products.push(
      {
        name: 'Whopper Menu',
        description: 'Whopper, frites, boisson',
        price: 9.99,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
        restaurant: restaurants[1]._id,
        category: 'Menus'
      },
      {
        name: 'King Nuggets 9 pcs',
        description: '9 nuggets de poulet',
        price: 6.49,
        image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400',
        restaurant: restaurants[1]._id,
        category: 'Nuggets'
      }
    );
    
    // Sushi Shop products
    products.push(
      {
        name: 'Mix California',
        description: '12 pièces de california rolls',
        price: 12.90,
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
        restaurant: restaurants[2]._id,
        category: 'California'
      },
      {
        name: 'Sashimi Saumon',
        description: '8 pièces de sashimi saumon',
        price: 14.50,
        image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=400',
        restaurant: restaurants[2]._id,
        category: 'Sashimi'
      }
    );
    
    await Product.insertMany(products);
    
    console.log('Products seeded:', products.length);
    console.log('Database seeded successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
