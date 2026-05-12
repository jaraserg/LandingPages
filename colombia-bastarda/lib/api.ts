// lib/api.ts
export interface Article {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  author: string;
  content: string[];
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  image: string;
  description: string[];
  excerpt?: string;
}

export interface Edition {
  id: string;
  title: string;
  date: string;
  image: string;
  description: string;
  articles: Article[];
}

const LOREM_P = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
  "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.",
  "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae.",
  "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident."
];

export const getArticles = async (): Promise<Article[]> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  const mainArticles = [
    {
      id: '1',
      title: 'La evolución del street art en Bogotá',
      excerpt: 'Exploramos cómo el arte urbano ha transformado las calles de la ciudad, desde los grafitis políticos hasta las intervenciones contemporáneas.',
      image: 'https://images.unsplash.com/photo-1549888834-3ec93abae044?auto=format&fit=crop&q=80',
      date: '2026-05-01',
      author: 'María López',
      content: LOREM_P
    },
    {
      id: '2',
      title: 'Música tradicional con un twist electrónico',
      excerpt: 'Descubre cómo los jóvenes músicos están fusionando lo ancestral con lo moderno, creando nuevos sonidos que respetan las raíces.',
      image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80',
      date: '2026-04-15',
      author: 'Carlos Ruiz',
      content: LOREM_P
    },
    {
      id: '3',
      title: 'Gastronomía de las regiones: sabores que cuentan historias',
      excerpt: 'Un viaje culinario por los platillos más representativos de Colombia, desde la bandeja paisa hasta el sancocho de pescado.',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80',
      date: '2026-04-01',
      author: 'Ana Martínez',
      content: LOREM_P
    },
    {
      id: '4',
      title: 'Mujeres que transforman la escena artística',
      excerpt: 'Perfil de cuatro artistas mujeres cuyas obras desafían estereotipos y abren nuevos espacios para la expresión femenina.',
      image: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?auto=format&fit=crop&q=80',
      date: '2026-03-20',
      author: 'Sofia García',
      content: LOREM_P
    },
    {
      id: '5',
      title: 'El futuro de los espacios públicos',
      excerpt: 'Analizamos cómo el diseño de plazas, parques y centros culturales puede contribuir a la reconciliación y reconstrucción social.',
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80',
      date: '2026-03-05',
      author: 'Diego Morales',
      content: LOREM_P
    },
    {
      id: '6',
      title: 'Literatura indigena en la era digital',
      excerpt: 'Cómo los pueblos indígenas están usando la tecnología para preservar y difundir sus tradiciones literarias y conocimientos.',
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80',
      date: '2026-02-15',
      author: 'Isabella Torres',
      content: LOREM_P
    }
  ];

  // Also include articles from editions so they are "globally" accessible
  const editions = await getEditions();
  const editionArticles = editions.flatMap(e => e.articles);
  
  return [...mainArticles, ...editionArticles];
};

export const getArticleById = async (id: string): Promise<Article | null> => {
  const articles = await getArticles();
  return articles.find(a => a.id === id) || null;
};

export const getEvents = async (): Promise<Event[]> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return [
    {
      id: '1',
      title: 'Festival de Cine Independiente',
      date: '2026-07-15',
      location: 'Centro Cultural García Márquez, Bogotá',
      image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80',
      description: LOREM_P,
      excerpt: 'Una semana de cine nacional e internacional con enfoque en obras independientes.'
    },
    {
      id: '2',
      title: 'Feria del Libro Alternativo',
      date: '2026-08-01',
      location: 'Plaza Bolívar, Bogotá',
      image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80',
      description: LOREM_P,
      excerpt: 'Encuentro de editoriales independientes, lecturas en vivo y talleres de escritura.'
    },
    {
      id: '3',
      title: 'Concierto de Música Experimental',
      date: '2026-08-10',
      location: 'Teatro Libre, Bogotá',
      image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80',
      description: LOREM_P,
      excerpt: 'Noche de sonidos vanguardistas con artistas locales e internacionales.'
    },
    {
      id: '4',
      title: 'Taller de Graffiti y Muralismo',
      date: '2026-09-05',
      location: 'Casa Cultural del Barrio, Medellín',
      image: 'https://images.unsplash.com/photo-1493514789931-586cb221d7a7?auto=format&fit=crop&q=80',
      description: LOREM_P,
      excerpt: 'Aprende técnicas de muralismo con artistas reconocidos del street art.'
    },
    {
      id: '5',
      title: 'Poesía en Voz Alta: Slam Nacional',
      date: '2026-09-20',
      location: 'Auditorio León de Greiff, Bogotá',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80',
      description: LOREM_P,
      excerpt: 'Competencia nacional de slam poetry que reúne a los mejores exponentes.'
    },
    {
      id: '6',
      title: 'Festival de Teatro Experimental',
      date: '2026-10-15',
      location: 'Teatro Nacional, Bogotá',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80',
      description: LOREM_P,
      excerpt: 'Tres días de teatro que desafía las convenciones y explora temas contemporáneos.'
    }
  ];
};

export const getEventById = async (id: string): Promise<Event | null> => {
  const events = await getEvents();
  return events.find(e => e.id === id) || null;
};

export const getEditions = async (): Promise<Edition[]> => {
  await new Promise(resolve => setTimeout(resolve, 100));
  return [
    {
      id: 'julio-2026',
      title: 'Edición de Julio: Resistencia y Cultura',
      date: 'Julio 2026',
      image: 'https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?q=80&w=2000&auto=format&fit=crop',
      description: 'Sumérgete en nuestra edición especial que explora las manifestaciones de resistencia cultural a través del arte, la música y la palabra.',
      articles: [
        {
          id: 'julio-1',
          title: 'Los grafitos de la memoria',
          excerpt: 'Exploramos cómo los murales se han convertido en espacios de memoria y denuncia.',
          image: 'https://images.unsplash.com/photo-1549888834-3ec93abae044?auto=format&fit=crop&q=80',
          author: 'María López',
          date: '2026-07-05',
          content: LOREM_P
        },
        {
          id: 'julio-2',
          title: 'Canto a la Tierra: Voces del Pacífico',
          excerpt: 'La música como herramienta de sanación en los territorios.',
          image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80',
          author: 'Carlos Ruiz',
          date: '2026-07-10',
          content: LOREM_P
        }
      ]
    },
    {
      id: 'junio-2026',
      title: 'Edición de junio: Voces del Pacífico',
      date: 'Junio 2026',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80',
      description: 'Exploramos la riqueza cultural de la región pacífica colombiana: su música, gastronomía y tradiciones.',
      articles: [
        {
          id: 'junio-1',
          title: 'La marimba de chonta: corazón del Pacífico',
          excerpt: 'Historia y presente del instrumento emblemático de la región.',
          image: 'https://images.unsplash.com/photo-1514525253361-bee8a48740ad?auto=format&fit=crop&q=80',
          author: 'Carlos Ruiz',
          date: '2026-06-05',
          content: LOREM_P
        }
      ]
    },
    {
      id: 'mayo-2026',
      title: 'Edición de mayo: Memoria y Reconciliación',
      date: 'Mayo 2026',
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80',
      description: 'Reflexiones sobre los procesos de memoria histórica y los caminos hacia la reconciliación.',
      articles: [
        {
          id: 'mayo-1',
          title: 'Museos de la memoria: sanación colectiva',
          excerpt: 'Cómo los museos dedicados al conflicto contribuyen a la reconciliación.',
          image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80',
          author: 'Ana Martínez',
          date: '2026-05-15',
          content: LOREM_P
        }
      ]
    },
    {
      id: 'abril-2026',
      title: 'Edición de abril: Jóvenes que Transforman',
      date: 'Abril 2026',
      image: 'https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?auto=format&fit=crop&q=80',
      description: 'Perfiles de líderes comunitarios, artistas y activistas que están cambiando sus comunidades.',
      articles: [
        {
          id: 'abril-1',
          title: 'Líderes juveniles: la generación que no espera',
          excerpt: 'Historias de jóvenes activistas que transforman sus comunidades con innovación.',
          image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80',
          author: 'Sofia García',
          date: '2026-04-10',
          content: LOREM_P
        }
      ]
    }
  ];
};

export const getEditionById = async (id: string): Promise<Edition | null> => {
  const editions = await getEditions();
  return editions.find(e => e.id === id) || null;
};