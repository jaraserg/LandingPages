import { TravelGuidance } from '../types';

export const CURATED_DATA: Record<string, Record<string, TravelGuidance>> = {
  en: {
    "medellin": {
      city: "Medellín",
      tagline: "The City of Eternal Spring and Social Innovation.",
      overview: "Nestled in the Aburrá Valley, Medellín has transformed from a troubled past into a global model of social innovation. Its vibrant 'Paisa' culture, world-class metro system, and lush mountain views make it a magnetic destination for those seeking authenticity.",
      heroImage: "/images/hero_medellin_1777852601236.png",
      tips: [
        { topic: "Culture", iconName: "HeartHandshake", text: "Paisas are exceptionally polite. Always say 'con gusto' instead of just 'de nada'." },
        { topic: "Language", iconName: "Languages", text: "Locals use 'Usted' even with close friends and family, unlike other parts of Latin America." },
        { topic: "Getting Around", iconName: "Compass", text: "The Metro and Metrocable are points of immense local pride. They are clean, efficient, and offer the best views." },
        { topic: "Prices", iconName: "Banknote", text: "Cash is still king for street vendors and small shops, though cards are widely accepted elsewhere." },
        { topic: "Best Time", iconName: "Sun", text: "Year-round spring weather! August during 'Feria de las Flores' is spectacular but crowded." }
      ],
      recommendations: [
        {
          name: "Comuna 13 (San Javier)",
          category: "Culture",
          description: "A neighborhood transformed by street art, outdoor escalators, and community hip-hop projects.",
          whyLocal: "It represents the resilience and creativity of the people. Go with a local to hear the real stories.",
          imageUrl: "/images/place_comuna13_1777852623610.png"
        },
        {
          name: "Provenza & Manila",
          category: "Food",
          description: "Tree-lined streets in Poblado filled with independent coffee shops, craft breweries, and fusion restaurants.",
          whyLocal: "While popular, locals still flock here for the high-quality gastronomic scene and nightlife.",
          imageUrl: "/images/place_provenza_1777852839204.png"
        },
        {
          name: "Parque Arví",
          category: "Nature",
          description: "A massive ecological nature reserve accessible by the Metrocable L-line.",
          whyLocal: "It's the ultimate weekend escape for locals to hike and breathe fresh mountain air.",
          imageUrl: "/images/place_arvi_1777852903356.png"
        },
        {
          name: "Salon Malaga",
          category: "Hidden Gem",
          description: "One of the oldest traditional bars in the city, famous for tango and old-school boleros.",
          whyLocal: "It's like stepping back in time; you'll see elderly locals enjoying coffee and music in a timeless atmosphere.",
          imageUrl: "https://picsum.photos/id/163/800/600"
        }
      ],
      localGuides: [
        {
          name: "Juan P.",
          specialty: "Social Innovation & Comuna 13",
          rating: 4.9,
          bio: "I grew up in the Comunas and have witnessed the city's transformation. I focus on history and social change.",
          pricePerHour: 20,
          avatarColor: "#3B82F6",
          phoneNumber: "+573001234567",
          imageUrl: "/images/guide_juan_1777853035082.png"
        },
        {
          name: "Maria C.",
          specialty: "Coffee & Gastronomy",
          rating: 5.0,
          bio: "Certified barista and food lover. I'll take you to the hidden gems where Paisas actually eat lunch.",
          pricePerHour: 25,
          avatarColor: "#10B981",
          phoneNumber: "+573109876543",
          imageUrl: "/images/guide_maria_1777853114407.png"
        }
      ],
      events: [
        {
          title: "Feria de las Flores",
          date: "August 1 - August 10, 2026",
          startDate: "2026-08-01",
          endDate: "2026-08-10",
          description: "The city's biggest celebration featuring the 'Silleteros' parade with massive flower displays.",
          locationName: "Entire City / Santa Elena",
          imageUrl: "https://picsum.photos/id/152/800/600"
        },
        {
          title: "Alumbrados Navideños",
          date: "December 1, 2026 - January 10, 2027",
          startDate: "2026-12-01",
          endDate: "2027-01-10",
          description: "Spectacular Christmas light displays along the river that attract millions.",
          locationName: "Medellín River / Parques del Río",
          imageUrl: "https://picsum.photos/id/122/800/600"
        },
        {
          title: "Colombiamoda",
          date: "July 28 - July 30, 2026",
          startDate: "2026-07-28",
          endDate: "2026-07-30",
          description: "Colombia's Fashion Week, a major event showcasing local and international designers.",
          locationName: "Plaza Mayor",
          imageUrl: "https://picsum.photos/id/137/800/600"
        },
        {
          title: "Festival de Tango",
          date: "June 24 - June 30, 2026",
          startDate: "2026-06-24",
          endDate: "2026-06-30",
          description: "A cultural festival honoring Carlos Gardel and the city's rich tango history.",
          locationName: "Plaza Gardel",
          imageUrl: "https://picsum.photos/id/175/800/600"
        }
      ]
    }
  },
  es: {
    "medellin": {
      city: "Medellín",
      tagline: "La Ciudad de la Eterna Primavera e Innovación Social.",
      overview: "Ubicada en el Valle de Aburrá, Medellín se ha transformado de un pasado difícil en un modelo global de innovación social. Su vibrante cultura Paisa, su sistema de metro de clase mundial y sus exuberantes vistas montañosas la convierten en un destino magnético para quienes buscan autenticidad.",
      heroImage: "/images/hero_medellin_1777852601236.png",
      tips: [
        { topic: "Cultura", iconName: "HeartHandshake", text: "Los Paisas son excepcionalmente educados. Siempre di 'con gusto' en lugar de solo 'de nada'." },
        { topic: "Idioma", iconName: "Languages", text: "Los locales usan 'Usted' incluso con amigos cercanos y familiares, a diferencia de otras partes de Latinoamérica." },
        { topic: "Transporte", iconName: "Compass", text: "El Metro y el Metrocable son de gran orgullo local. Son limpios, eficientes y ofrecen las mejores vistas." },
        { topic: "Precios", iconName: "Banknote", text: "El efectivo sigue siendo clave para vendedores ambulantes, aunque las tarjetas son aceptadas en casi todos los locales." },
        { topic: "Mejor Época", iconName: "Sun", text: "¡Clima primaveral todo el año! Agosto durante la Feria de las Flores es espectacular pero concurrido." }
      ],
      recommendations: [
        {
          name: "Comuna 13 (San Javier)",
          category: "Culture",
          description: "Un barrio transformado por el arte urbano, escaleras eléctricas al aire libre y proyectos comunitarios de hip-hop.",
          whyLocal: "Representa la resiliencia y creatividad de su gente. Ve con un guía local para escuchar las historias reales.",
          imageUrl: "/images/place_comuna13_1777852623610.png"
        },
        {
          name: "Provenza y Manila",
          category: "Food",
          description: "Calles arboladas en El Poblado llenas de cafés independientes, cervecerías artesanales y restaurantes de fusión.",
          whyLocal: "Aunque es popular, los locales siguen viniendo aquí por la gastronomía de alta calidad y la vida nocturna.",
          imageUrl: "/images/place_provenza_1777852839204.png"
        },
        {
          name: "Parque Arví",
          category: "Nature",
          description: "Una reserva natural ecológica masiva accesible por la línea L del Metrocable.",
          whyLocal: "Es el escape perfecto de fin de semana para los locales para caminar y respirar aire puro de montaña.",
          imageUrl: "/images/place_arvi_1777852903356.png"
        },
        {
          name: "Salón Málaga",
          category: "Hidden Gem",
          description: "Uno de los bares tradicionales más antiguos de la ciudad, famoso por el tango y los boleros clásicos.",
          whyLocal: "Es como retroceder en el tiempo; verás a locales mayores disfrutando de café y música en un ambiente atemporal.",
          imageUrl: "https://picsum.photos/id/163/800/600"
        }
      ],
      localGuides: [
        {
          name: "Juan P.",
          specialty: "Innovación Social y Comuna 13",
          rating: 4.9,
          bio: "Crecí en las comunas y he sido testigo de la transformación de la ciudad. Me enfoco en la historia y el cambio social.",
          pricePerHour: 20,
          avatarColor: "#3B82F6",
          phoneNumber: "+573001234567",
          imageUrl: "/images/guide_juan_1777853035082.png"
        },
        {
          name: "María C.",
          specialty: "Café y Gastronomía",
          rating: 5.0,
          bio: "Barista certificada y amante de la comida. Te llevaré a los tesoros escondidos donde los Paisas realmente almuerzan.",
          pricePerHour: 25,
          avatarColor: "#10B981",
          phoneNumber: "+573109876543",
          imageUrl: "/images/guide_maria_1777853114407.png"
        }
      ],
      events: [
        {
          title: "Feria de las Flores",
          date: "1 al 10 de Agosto, 2026",
          startDate: "2026-08-01",
          endDate: "2026-08-10",
          description: "La celebración más grande de la ciudad que presenta el desfile de Silleteros con enormes arreglos florales.",
          locationName: "Toda la Ciudad / Santa Elena",
          imageUrl: "https://picsum.photos/id/152/800/600"
        },
        {
          title: "Alumbrados Navideños",
          date: "1 de Diciembre, 2026 - 10 de Enero, 2027",
          startDate: "2026-12-01",
          endDate: "2027-01-10",
          description: "Espectaculares exhibiciones de luces navideñas a lo largo del río que atraen a millones.",
          locationName: "Río Medellín / Parques del Río",
          imageUrl: "https://picsum.photos/id/122/800/600"
        },
        {
          title: "Colombiamoda",
          date: "28 al 30 de Julio, 2026",
          startDate: "2026-07-28",
          endDate: "2026-07-30",
          description: "La Semana de la Moda de Colombia, un evento importante que muestra diseñadores locales e internacionales.",
          locationName: "Plaza Mayor",
          imageUrl: "https://picsum.photos/id/137/800/600"
        },
        {
          title: "Festival de Tango",
          date: "24 al 30 de Junio, 2026",
          startDate: "2026-06-24",
          endDate: "2026-06-30",
          description: "Un festival cultural en honor a Carlos Gardel y la rica historia del tango de la ciudad.",
          locationName: "Plaza Gardel",
          imageUrl: "https://picsum.photos/id/175/800/600"
        }
      ]
    }
  }
};