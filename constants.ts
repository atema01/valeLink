import { BackgroundTheme } from './types';

export const BACKGROUNDS: BackgroundTheme[] = [
  {
    id: 'sunset',
    name: 'Golden Sunset',
    url: 'https://images.unsplash.com/photo-1502485019198-a625bd53ceb7?w=800&q=80',
    previewUrl: 'https://images.unsplash.com/photo-1502485019198-a625bd53ceb7?w=300&q=80',
    textColor: 'text-white',
    alt: 'Romantic sunset with warm orange and pink hues'
  },
  {
    id: 'rose',
    name: 'Rose Garden',
    url: 'https://images.unsplash.com/photo-1496661415325-ef852f9c0983?w=800&q=80',
    previewUrl: 'https://images.unsplash.com/photo-1496661415325-ef852f9c0983?w=300&q=80',
    textColor: 'text-white',
    alt: 'Soft red rose petals scattered on white surface'
  },
  {
    id: 'night',
    name: 'Night Sparkles',
    url: 'https://images.unsplash.com/photo-1519750783826-e2420f4d687f?w=800&q=80',
    previewUrl: 'https://images.unsplash.com/photo-1519750783826-e2420f4d687f?w=300&q=80',
    textColor: 'text-white',
    alt: 'Sparkling city lights at night from a distance'
  },
  {
    id: 'hearts',
    name: 'Cute Hearts',
    url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&q=80',
    previewUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=300&q=80',
    textColor: 'text-pink-900',
    alt: 'Minimalist pink hearts pattern on light background'
  },
  {
    id: 'clouds',
    name: 'Dreamy Clouds',
    url: 'https://images.unsplash.com/photo-1499346030926-9a72daac6ea6?w=800&q=80',
    previewUrl: 'https://images.unsplash.com/photo-1499346030926-9a72daac6ea6?w=300&q=80',
    textColor: 'text-blue-900',
    alt: 'Soft pink and blue clouds'
  },
];

export const TEMPLATES = [
  { value: 'romantic', label: 'Romantic & Deep', text: "Every moment with you feels like a dream I never want to wake up from. You make my world so much brighter. Will you be my Valentine?" },
  { value: 'funny', label: 'Funny & Cheesy', text: "Are you a keyboard? Because you're just my type. Be my Valentine?" },
  { value: 'cute', label: 'Cute & Sweet', text: "I've been waiting to ask you this for a long time. You make every day feel like a dream. ❤️ Will you be my Valentine?" },
  { value: 'direct', label: 'Short & Direct', text: "I like you a lottle. It's like a little, except a lot. Be mine?" },
  { value: 'poem', label: 'Poetic', text: "Roses are red, violets are blue, I'm not good at poems, but I really like you." },
  { value: 'partner', label: 'Partner in Crime', text: "I need a partner in crime for all my adventures. You in? 🕵️‍♂️❤️" },
];

export const COVER_IMAGES = [
  'https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=600&q=80', // Holding hands
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80', // Cute cat
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80', // Flowers
  'https://images.unsplash.com/photo-1548848221-0c2e497ed557?w=600&q=80', // Teddy bear
  'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80', // Love balloons
  'https://images.unsplash.com/photo-1454391304352-2bf4678b1a7a?w=600&q=80', // Beach hearts
  'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=600&q=80', // Coffee date
  'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=600&q=80', // Flowers Close up
];

export const DEFAULT_PHOTO = COVER_IMAGES[0];