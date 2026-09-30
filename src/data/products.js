export const products = [
  {
    id: 'pulse-pro', name: 'Pulse Pro', category: 'Headphones', price: 4999, oldPrice: 6999, rating: 4.9, reviews: 1284,
    color: 'Studio black', tag: 'BESTSELLER', tone: 'lime',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1100&q=85',
    description: 'Big, immersive sound. A little more quiet when you need it. Meet your new everyday over-ear.',
    features: ['Adaptive noise cancellation', 'Up to 60 hours of playtime', 'Fast charge: 10 min = 8 hours'],
  },
  {
    id: 'air-mini', name: 'Air Mini', category: 'Earbuds', price: 2299, oldPrice: 2999, rating: 4.8, reviews: 862,
    color: 'Cloud white', tag: 'NEW DROP', tone: 'blue',
    image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=1100&q=85',
    description: 'Small case, room-filling energy. Pocketable earbuds for everywhere your day takes you.',
    features: ['Clear-call dual microphones', '32 hours total playback', 'IPX5 splash resistance'],
  },
  {
    id: 'tempo-watch', name: 'Tempo Watch', category: 'Wearables', price: 3499, oldPrice: 4999, rating: 4.7, reviews: 641,
    color: 'Graphite', tag: 'JUST LANDED', tone: 'orange',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1100&q=85',
    description: 'A little more in sync. A bright, always-ready companion for movement, messages and everything between.',
    features: ['Always-on AMOLED display', '10-day battery life', '120+ activity modes'],
  },
  {
    id: 'studio-max', name: 'Studio Max', category: 'Headphones', price: 6999, oldPrice: 8999, rating: 4.9, reviews: 493,
    color: 'Sandstone', tag: 'FAN FAVOURITE', tone: 'pink',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1100&q=85',
    description: 'Your own front-row seat. Detailed, balanced audio in a fit that disappears into your routine.',
    features: ['Spatial audio with head tracking', '45 hours of battery', 'Memory foam ear cushions'],
  },
  {
    id: 'move-buds', name: 'Move Buds', category: 'Earbuds', price: 1799, oldPrice: 2499, rating: 4.6, reviews: 377,
    color: 'Electric lilac', tag: 'ON THE MOVE', tone: 'lavender',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1100&q=85',
    description: 'Made for the miles, the mat and the in-between. A snug fit that keeps pace with you.',
    features: ['Secure sport-fit design', 'Low-latency game mode', 'Up to 28 hours with case'],
  },
  {
    id: 'wave-speaker', name: 'Wave Speaker', category: 'Speakers', price: 2999, oldPrice: 3999, rating: 4.8, reviews: 528,
    color: 'Sunset coral', tag: 'WEEKEND READY', tone: 'coral',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=1100&q=85',
    description: 'Tiny footprint, main-character volume. Take the soundtrack from your room to the rooftop.',
    features: ['360-degree stereo sound', 'Water-resistant IP67 build', '16 hours of playback'],
  },
];

export const categories = ['All gear', 'Headphones', 'Earbuds', 'Wearables', 'Speakers'];
export const formatPrice = (amount) => `₹${amount.toLocaleString('en-IN')}`;
