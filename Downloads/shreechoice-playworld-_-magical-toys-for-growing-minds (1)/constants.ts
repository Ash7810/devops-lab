
import type { Product, Category } from './types';

export const HERO_SLIDES = [
  {
    id: 1,
    title: "Play Begins Here at ShreeChoice",
    subtitle: "Where learning, creativity, and fun come together. Discover the magic of play with our curated collection.",
    image_url: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80", 
    buttonText: "Shop by Age"
  },
  {
    id: 2,
    title: "Spark Imagination & Joy",
    subtitle: "Explore our wide range of safe, educational, and exciting toys for every developmental stage.",
    image_url: "https://images.unsplash.com/photo-1566576912902-199bd62052db?auto=format&fit=crop&w=800&q=80", 
    buttonText: "View New Arrivals"
  }
];

// FIX: Added sequential 'id' property to each category object to conform to the 'Category' type.
export const CATEGORIES: Category[] = [
  { id: 1, name: 'Arts and Crafts', image_url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=300&q=60' },
  { id: 2, name: 'Toys', image_url: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=300&q=60' },
  { id: 3, name: 'Soft Toys', image_url: 'https://images.unsplash.com/photo-1559454403-b8fb87521bc7?auto=format&fit=crop&w=300&q=60' },
  { id: 4, name: 'Puzzles', image_url: 'https://images.unsplash.com/photo-1563941302062-5953b1b482c8?auto=format&fit=crop&w=300&q=60' },
  { id: 5, name: 'Books', image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=300&q=60' },
  { id: 6, name: 'Infants', image_url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=300&q=60' },
];

export const AGE_GROUPS = ['0-12m', '1-3y', '3-5y', '5-8y', '8-14y', '14+'];

export const REVIEWS = [
    { id: 1, name: 'John', avatarUrl: 'https://i.pravatar.cc/150?img=1', rating: 5, comment: "Had placed an order for my nephew's birthday. ShreeChoice team ensured the order was delivered well in time and received the gift in perfect packaging. Definitely buying again from here!" },
    { id: 2, name: 'Mukul', avatarUrl: 'https://i.pravatar.cc/150?img=2', rating: 5, comment: "Products here are of amazing quality and durability. I've been using their products for 3 years and it still feels like new. Heartfelt appreciation for their work." }
]

export const ALL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Classic Building Blocks',
    price: 1299,
    original_price: 1599,
    image_url: 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&w=500&q=60',
    images: ['https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?auto=format&fit=crop&w=600&q=80'],
    description: 'Classic wooden blocks for endless creativity. Helps develop fine motor skills and spatial reasoning.',
    category: 'Toys',
    age_group: '1-3y',
    brand: 'Melissa & Doug',
    tags: ['trending', 'educational'],
    rating: 4.8,
    reviews: 152,
    in_stock: true,
    stock_quantity: 50,
    colors: ['Natural Wood', 'Multi-Color']
  },
  {
    id: 2,
    name: 'Cuddly Teddy Bear',
    price: 899,
    image_url: 'https://images.unsplash.com/photo-1559454403-b8fb87521bc7?auto=format&fit=crop&w=500&q=60',
    images: ['https://images.unsplash.com/photo-1559454403-b8fb87521bc7?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1543332164-6e82f355badc?auto=format&fit=crop&w=600&q=80'],
    description: 'A soft and cuddly companion for your little one. Made with hypoallergenic materials.',
    category: 'Soft Toys',
    age_group: '0-12m',
    brand: 'Funskool',
    tags: ['bestseller'],
    rating: 4.9,
    reviews: 210,
    in_stock: true,
    stock_quantity: 30,
    colors: ['Brown', 'White', 'Pink']
  },
  {
    id: 3,
    name: 'Space Explorer Puzzle',
    price: 749,
    original_price: 999,
    image_url: 'https://images.unsplash.com/photo-1611604548018-d56bbd85d681?auto=format&fit=crop&w=500&q=60',
    images: ['https://images.unsplash.com/photo-1611604548018-d56bbd85d681?auto=format&fit=crop&w=600&q=80'],
    description: '100-piece jigsaw puzzle featuring a vibrant space scene. Perfect for family fun.',
    category: 'Puzzles',
    age_group: '5-8y',
    brand: 'Hasbro',
    tags: ['trending'],
    rating: 4.6,
    reviews: 89,
    in_stock: false,
    stock_quantity: 0
  },
  {
    id: 4,
    name: 'Robot Builder Kit',
    price: 1999,
    image_url: 'https://images.unsplash.com/photo-1535378437327-10ff28d457cc?auto=format&fit=crop&w=500&q=60',
    images: ['https://images.unsplash.com/photo-1535378437327-10ff28d457cc?auto=format&fit=crop&w=600&q=80'],
    description: 'A beginner-friendly STEM kit with 20+ safe and exciting experiments.',
    category: 'STEM',
    age_group: '8-14y',
    brand: 'Lego',
    tags: ['educational', 'bestseller'],
    rating: 4.7,
    reviews: 112,
    in_stock: true,
    stock_quantity: 25
  },
  {
    id: 5,
    name: 'Finger Painting Set',
    price: 599,
    image_url: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=500&q=60',
    images: ['https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=600&q=80'],
    description: "Non-toxic, washable finger paints in 6 bright colors. Unleash your child's inner artist.",
    category: 'Arts & Crafts',
    age_group: '3-5y',
    brand: 'Melissa & Doug',
    tags: ['clearance'],
    rating: 4.5,
    reviews: 76,
    in_stock: true,
    stock_quantity: 40
  },
  {
    id: 6,
    name: 'Magical Story Book',
    price: 450,
    image_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&q=60',
    images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80'],
    description: 'An interactive pop-up book that brings stories to life. A perfect bedtime read.',
    category: 'Books',
    age_group: '1-3y',
    brand: 'Funskool',
    tags: ['bestseller'],
    rating: 3.9,
    reviews: 180,
    in_stock: true,
    stock_quantity: 60
  },
   {
    id: 7,
    name: 'Racing Car Red',
    price: 2499,
    original_price: 2999,
    image_url: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=500&q=60',
    images: ['https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&w=600&q=80', 'https://images.unsplash.com/photo-1580274455191-1c62238fa333?auto=format&fit=crop&w=600&q=80'],
    description: 'High-speed remote control car with durable design. Ready to race on any terrain.',
    category: 'Toys',
    age_group: '8-14y',
    brand: 'Mattel',
    tags: ['trending', 'new'],
    rating: 4.7,
    reviews: 95,
    in_stock: false,
    stock_quantity: 0,
    colors: ['Red', 'Blue Sapphire', 'Green Emerald']
  },
  {
    id: 8,
    name: 'Baby Rattle Set',
    price: 399,
    image_url: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=500&q=60',
    images: ['https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80'],
    description: "Set of 4 colorful rattles to stimulate your baby's senses. BPA-free and safe.",
    category: 'Infants',
    age_group: '0-12m',
    brand: 'Funskool',
    tags: [],
    rating: 2.8,
    reviews: 130,
    in_stock: true,
    stock_quantity: 20
  }
];
