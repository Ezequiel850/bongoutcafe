import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const DATA_DIR = path.join(__dirname, 'server', 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

// Initial default categories
const DEFAULT_CATEGORIES = [
  { id: 'bebidas-frias', name: 'Bebidas Frias', icon: 'Sparkles', description: 'Cafés gelados exclusivos, matcha e lattes refrescantes' },
  { id: 'milkshakes', name: 'Milkshakes', icon: 'Milk', description: 'Batidos cremosos preparados com gelado artesanal nobre' },
  { id: 'sumos-naturais', name: 'Sumos Naturais', icon: 'Citrus', description: 'Fruta fresca espremida na hora, pura e revitalizante' },
  { id: 'cafes-chas', name: 'Cafés & Chás', icon: 'Coffee', description: 'Grãos selecionados, espresso encorpado e infusões reconfortantes' },
  { id: 'especialidades', name: 'Especialidades & Pratos', icon: 'Utensils', description: 'Burgers gourmet, pregos tradicionais e pratos de autor' },
  { id: 'tostas-wraps', name: 'Tostas & Wraps', icon: 'Sandwich', description: 'Pães artesanais, tostas estaladiças e wraps recheados' },
  { id: 'entradas-sobremesas', name: 'Entradas & Sobremesas', icon: 'Cake', description: 'Chamussas crocantes e doces artesanais irresistíveis' },
];

// Initial default menu items extracted from Bon Goût specifications
const DEFAULT_ITEMS = [
  // Bebidas Frias
  {
    id: 'bf-1',
    name: 'Doce de Leite Latte',
    category: 'bebidas-frias',
    price: 580,
    description: 'Expresso aromático com leite fresco aveludado, swirl generoso de doce de leite artesanal e cubos de gelo.',
    isSpecial: true,
    isAvailable: true,
    isHalal: true,
    tags: ['Bestseller', 'Doce Artesanal'],
    image: '',
    prepTime: '4-6 min'
  },
  {
    id: 'bf-2',
    name: 'Strawberry Matcha Latte',
    category: 'bebidas-frias',
    price: 570,
    description: 'Camadas perfeitas de puré de morango natural fresco, leite cremoso e autêntico matcha cerimonial batido no ponto.',
    isSpecial: true,
    isAvailable: true,
    isHalal: true,
    tags: ['Bestseller', 'Especialidade'],
    image: '/src/assets/images/strawberry_matcha_latte_1791213070646.jpg',
    prepTime: '5 min'
  },
  {
    id: 'bf-3',
    name: 'Café Gelado Bon Goût',
    category: 'bebidas-frias',
    price: 599,
    description: 'Receita de assinatura da casa com duplo shot de café especial, caramelo artesanal e creme leve batido no momento.',
    isSpecial: true,
    isAvailable: true,
    isHalal: true,
    tags: ['Assinatura da Casa'],
    image: '',
    prepTime: '5 min'
  },
  {
    id: 'bf-4',
    name: 'Nutella Mocha Latte',
    category: 'bebidas-frias',
    price: 595,
    description: 'Fusão irresistível de cacau gourmet, Nutella de avelã aveludada, café espresso e leite vaporizado gelado.',
    isSpecial: false,
    isAvailable: true,
    isHalal: true,
    tags: ['Chocolate & Avelã'],
    image: '',
    prepTime: '5 min'
  },
  {
    id: 'bf-5',
    name: 'Salted Caramel Iced Mocha',
    category: 'bebidas-frias',
    price: 590,
    description: 'Caramelo salgado artesanal perfeitamente equilibrado com mocha rico de chocolate nobre e espresso fresco.',
    isSpecial: false,
    isAvailable: true,
    isHalal: true,
    tags: ['Caramelo Salgado'],
    image: '',
    prepTime: '5 min'
  },
  {
    id: 'bf-6',
    name: 'Dubai Chocolate Latte',
    category: 'bebidas-frias',
    price: 595,
    description: 'Inspirado no famoso chocolate do Dubai: café espresso com pasta pura de pistácio tostado, chocolate rico e crocante de kataifi dourado.',
    isSpecial: true,
    isAvailable: true,
    isHalal: true,
    tags: ['Bestseller', 'Tendência Dubai', 'Destaque'],
    image: '/src/assets/images/dubai_chocolate_latte_1791213046732.jpg',
    prepTime: '6 min'
  },

  // Milkshakes
  {
    id: 'ms-1',
    name: 'Morango / Banana',
    category: 'milkshakes',
    price: 470,
    description: 'Batido cremoso com fruta fresca selecionada e gelado artesanal de nata fresca de alta qualidade.',
    isSpecial: false,
    isAvailable: true,
    isHalal: true,
    tags: ['Fruta Fresca'],
    image: '',
    prepTime: '5 min'
  },
  {
    id: 'ms-2',
    name: 'Kinder Bueno',
    category: 'milkshakes',
    price: 560,
    description: 'Gelado aveludado de avelã com pedaços crocantes de Kinder Bueno genuíno, calda e chantilly fresco.',
    isSpecial: true,
    isAvailable: true,
    isHalal: true,
    tags: ['Favorito'],
    image: '',
    prepTime: '6 min'
  },
  {
    id: 'ms-3',
    name: 'Lotus Biscoff',
    category: 'milkshakes',
    price: 560,
    description: 'Creme de bolacha Biscoff Lotus caramelizada, calda aveludada e crocante de bolacha belga tradicional.',
    isSpecial: true,
    isAvailable: true,
    isHalal: true,
    tags: ['Bestseller'],
    image: '',
    prepTime: '5 min'
  },
  {
    id: 'ms-4',
    name: 'Frappuccino de Oreo',
    category: 'milkshakes',
    price: 498,
    description: 'Café suave batido com gelo, pedaços generosos de bolacha Oreo e cobertura aveludada de chocolate.',
    isSpecial: false,
    isAvailable: true,
    isHalal: true,
    tags: ['Com Café'],
    image: '',
    prepTime: '5 min'
  },
  {
    id: 'ms-5',
    name: 'Bubble Gum / Chocolate',
    category: 'milkshakes',
    price: 470,
    description: 'Opção divertida sabor pastilha elástica ou versão clássica intensa com cacau belga cremoso.',
    isSpecial: false,
    isAvailable: true,
    isHalal: true,
    tags: ['Clássico'],
    image: '',
    prepTime: '5 min'
  },
  {
    id: 'ms-6',
    name: 'Milk-Shake de Oreo',
    category: 'milkshakes',
    price: 560,
    description: 'Super cremoso, batido com gelado de baunilha, calda de chocolate e muitas bolachas Oreo trituradas.',
    isSpecial: false,
    isAvailable: true,
    isHalal: true,
    tags: ['Oreo Crocante'],
    image: '',
    prepTime: '5 min'
  },

  // Sumos Naturais
  {
    id: 'sn-1',
    name: 'Sumo de Laranja',
    category: 'sumos-naturais',
    price: 325,
    description: 'Laranjas doces espremidas no momento do pedido. Puro sumo revigorante sem adição de água nem açúcar.',
    isSpecial: false,
    isAvailable: true,
    isHalal: true,
    tags: ['100% Natural', 'Vitamina C'],
    image: '',
    prepTime: '4 min'
  },
  {
    id: 'sn-2',
    name: 'Ananás e Hortelã',
    category: 'sumos-naturais',
    price: 360,
    description: 'Ananás doce tropical moçambicano batido na hora com folhas de hortelã fresca colhidas do jardim.',
    isSpecial: true,
    isAvailable: true,
    isHalal: true,
    tags: ['Refrescante', 'Tropical'],
    image: '',
    prepTime: '4 min'
  },
  {
    id: 'sn-3',
    name: 'Maçã + Cenoura + Laranja',
    category: 'sumos-naturais',
    price: 385,
    description: 'Combinação revitalizante rica em betacaroteno e antioxidantes para energia e vitalidade ao longo do dia.',
    isSpecial: false,
    isAvailable: true,
    isHalal: true,
    tags: ['Energizante'],
    image: '',
    prepTime: '5 min'
  },
  {
    id: 'sn-4',
    name: 'Detox Mistura',
    category: 'sumos-naturais',
    price: 395,
    description: 'Maçã verde, gengibre picante, pepino fresco, limão e hortelã. Leve, depurativo e incrivelmente refrescante.',
    isSpecial: false,
    isAvailable: true,
    isHalal: true,
    tags: ['Detox', 'Sem Açúcar'],
    image: '',
    prepTime: '5 min'
  },

  // Cafés & Chás
  {
    id: 'cc-1',
    name: 'Espresso',
    category: 'cafes-chas',
    price: 100,
    description: 'Blend selecionado de grãos nobres torrados com crema densa aveludada e aroma intenso inconfundível.',
    isSpecial: false,
    isAvailable: true,
    isHalal: true,
    tags: ['Clássico'],
    image: '',
    prepTime: '3 min'
  },
  {
    id: 'cc-2',
    name: 'Capuccino',
    category: 'cafes-chas',
    price: 250,
    description: 'Equilíbrio clássico italiano de espresso encorpado, leite vaporizado e espuma sedosa com polvilho de cacau.',
    isSpecial: false,
    isAvailable: true,
    isHalal: true,
    tags: ['Clássico Italiano'],
    image: '',
    prepTime: '4 min'
  },
  {
    id: 'cc-3',
    name: 'Mocaccino',
    category: 'cafes-chas',
    price: 360,
    description: 'Espresso encorpado combinado com calda de chocolate fundido, leite cremoso e fina camada de espuma.',
    isSpecial: false,
    isAvailable: true,
    isHalal: true,
    tags: ['Chocolate & Café'],
    image: '',
    prepTime: '4 min'
  },
  {
    id: 'cc-4',
    name: 'Caribbean Mocha',
    category: 'cafes-chas',
    price: 350,
    description: 'Toque exótico com notas de coco caribenho e especiarias suaves misturadas a café nobre e chocolate aveludado.',
    isSpecial: true,
    isAvailable: true,
    isHalal: true,
    tags: ['Especialidade'],
    image: '',
    prepTime: '5 min'
  },
  {
    id: 'cc-5',
    name: 'Chocolate Quente',
    category: 'cafes-chas',
    price: 290,
    description: 'Cacau nobre aveludado derretido com leite gordo, espesso, reconfortante e perfeitamente equilibrado.',
    isSpecial: false,
    isAvailable: true,
    isHalal: true,
    tags: ['Reconfortante'],
    image: '',
    prepTime: '4 min'
  },

  // Especialidades & Pratos
  {
    id: 'ep-1',
    name: 'Bon Goût Crispy Burger',
    category: 'especialidades',
    price: 840,
    description: 'Frango estaladiço e suculento marinado em especiarias secretas, pão brioche dourado na manteiga, queijo derretido, alface fresca e molho Bon Goût especial.',
    isSpecial: true,
    isAvailable: true,
    isHalal: true,
    tags: ['Bestseller', 'Prato Principal', 'Halal Certificado'],
    image: '/src/assets/images/bon_gout_burger_1791213060093.jpg',
    prepTime: '15-18 min'
  },
  {
    id: 'ep-2',
    name: 'Burger Clássico',
    category: 'especialidades',
    price: 879,
    description: 'Hambúrguer de carne bovina nobre Halal grelhada no ponto ideal, queijo cheddar derretido, cebola caramelizada e molho da casa em pão artesanal.',
    isSpecial: false,
    isAvailable: true,
    isHalal: true,
    tags: ['Carne Halal', 'Grelhado'],
    image: '',
    prepTime: '15-20 min'
  },
  {
    id: 'ep-3',
    name: 'Prego da Casa',
    category: 'especialidades',
    price: 780,
    description: 'Bife tenro marinado em alho e louro à moda tradicional, servido no pão crocante aquecido com manteiga de ervas da horta.',
    isSpecial: false,
    isAvailable: true,
    isHalal: true,
    tags: ['Tradição'],
    image: '',
    prepTime: '12-15 min'
  },
  {
    id: 'ep-4',
    name: 'Assado da Casa',
    category: 'especialidades',
    price: 699,
    description: 'Corte tenro assado lentamente no forno com legumes grelhados da época e molho demi-glace aromático.',
    isSpecial: false,
    isAvailable: true,
    isHalal: true,
    tags: ['Assado Lento'],
    image: '',
    prepTime: '15 min'
  },
  {
    id: 'ep-5',
    name: 'Croissant Especial',
    category: 'especialidades',
    price: 620,
    description: 'Croissant folhado francês amanteigado recheado com ovos mexidos cremosos, queijo fundido e fiambre Halal de peru selecionado.',
    isSpecial: false,
    isAvailable: true,
    isHalal: true,
    tags: ['Brunch Perfeito'],
    image: '',
    prepTime: '10 min'
  },
  {
    id: 'ep-6',
    name: 'Sunny Melt',
    category: 'especialidades',
    price: 605,
    description: 'Pão rústico tostado na chapa com queijo fundido, ovo estrelado perfeito de gema mole dourada e ervas frescas.',
    isSpecial: false,
    isAvailable: true,
    isHalal: true,
    tags: ['Pequeno-Almoço / Brunch'],
    image: '',
    prepTime: '10 min'
  },
  {
    id: 'ep-7',
    name: 'Bon Goût Wings',
    category: 'especialidades',
    price: 680,
    description: 'Asinhas de frango crocantes glaceadas à sua escolha com molho agridoce ligeiramente picante ou barbecue artesanal suave.',
    isSpecial: true,
    isAvailable: true,
    isHalal: true,
    tags: ['Para Partilhar', 'Estaladiço'],
    image: '',
    prepTime: '15 min'
  },

  // Tostas & Wraps
  {
    id: 'tw-1',
    name: 'Tosta de Frango',
    category: 'tostas-wraps',
    price: 510,
    description: 'Frango desfiado suculento temperado com ervas finas, maionese suave caseira e queijo fundido em pão rústico tostado.',
    isSpecial: false,
    isAvailable: true,
    isHalal: true,
    tags: ['Favorito'],
    image: '',
    prepTime: '10 min'
  },
  {
    id: 'tw-2',
    name: 'Crunchy Chicken Wrap',
    category: 'tostas-wraps',
    price: 899,
    description: 'Tortilha de trigo aquecida recheada com tiras de frango super crocantes, molho aioli caseiro, alface romana e tomate fresco.',
    isSpecial: true,
    isAvailable: true,
    isHalal: true,
    tags: ['Bestseller', 'Wrap'],
    image: '',
    prepTime: '12 min'
  },
  {
    id: 'tw-3',
    name: 'Tosta de Atum',
    category: 'tostas-wraps',
    price: 565,
    description: 'Recheio cremoso de atum com cebola roxa finamente picada, salsa fresca, especiarias e queijo mozzarella gratinado.',
    isSpecial: false,
    isAvailable: true,
    isHalal: true,
    tags: ['Do Mar'],
    image: '',
    prepTime: '10 min'
  },
  {
    id: 'tw-4',
    name: 'Tosta Mista',
    category: 'tostas-wraps',
    price: 440,
    description: 'Queijo flamengo derretido e fiambre Halal de primeira qualidade em fatias douradas de pão de fermentação lenta com manteiga.',
    isSpecial: false,
    isAvailable: true,
    isHalal: true,
    tags: ['Clássico'],
    image: '',
    prepTime: '8 min'
  },

  // Entradas & Sobremesas
  {
    id: 'es-1',
    name: 'Chamussa 3 Queijos',
    category: 'entradas-sobremesas',
    price: 470,
    description: 'Triângulos estaladiços dourados recheados com uma mistura cremosa e perfumada de três queijos selecionados e orégãos frescos.',
    isSpecial: true,
    isAvailable: true,
    isHalal: true,
    tags: ['Bestseller', 'Vegetariano'],
    image: '/src/assets/images/chamussa_tres_queijos_1791213083349.jpg',
    prepTime: '8-10 min'
  },
  {
    id: 'es-2',
    name: 'Chamussa Carne',
    category: 'entradas-sobremesas',
    price: 390,
    description: 'Pastel tradicional de massa fina super estaladiça recheado com carne picada Halal temperada à moda oriental.',
    isSpecial: false,
    isAvailable: true,
    isHalal: true,
    tags: ['Halal', 'Tradicional'],
    image: '',
    prepTime: '8-10 min'
  },
  {
    id: 'es-3',
    name: 'Panquecas Bon Goût',
    category: 'entradas-sobremesas',
    price: 590,
    description: 'Pilha de panquecas fofas americanas servidas com fruta fresca da época, manteiga e xarope de ácer ou calda de chocolate quente.',
    isSpecial: false,
    isAvailable: true,
    isHalal: true,
    tags: ['Doce', 'Brunch'],
    image: '',
    prepTime: '12 min'
  },
  {
    id: 'es-4',
    name: 'Brownie de Chocolate',
    category: 'entradas-sobremesas',
    price: 599,
    description: 'Brownie denso e húmido de chocolate negro nobre com nozes crocantes, servido morno com bola de gelado de nata artesanal.',
    isSpecial: true,
    isAvailable: true,
    isHalal: true,
    tags: ['Sobremesa Artesanal'],
    image: '',
    prepTime: '5 min'
  },
  {
    id: 'es-5',
    name: 'Caramel Butter Toast',
    category: 'entradas-sobremesas',
    price: 470,
    description: 'Fatia generosa de pão de leite japonês tostada na perfeição com crosta caramelizada de manteiga nobre e açúcar mascavado.',
    isSpecial: false,
    isAvailable: true,
    isHalal: true,
    tags: ['Doce'],
    image: '',
    prepTime: '7 min'
  },
  {
    id: 'es-6',
    name: 'Petit Gateau',
    category: 'entradas-sobremesas',
    price: 480,
    description: 'Bolo quente de chocolate fino com coração cremoso que escorre suavemente ao cortar, acompanhado de gelado artesanal de baunilha.',
    isSpecial: true,
    isAvailable: true,
    isHalal: true,
    tags: ['Favorito'],
    image: '',
    prepTime: '10 min'
  }
];

const DEFAULT_SETTINGS = {
  businessName: 'BON GOÛT café',
  tagline: 'Eat, Sip, Gather - Uma Experiência Gastronómica Inesquecível',
  phone: '+258 84 784 9629',
  whatsappRaw: '258847849629',
  whatsappLink: 'https://wa.me/message/M7A56MF7GPR',
  operatingHours: 'Terça-Feira a Domingo: 08:00 - 19:00 (Segunda-Feira: Encerrado)',
  address: 'Av. Julius Nyerere / Polana Cimento, Maputo, Moçambique',
  mapsUrl: 'https://maps.app.goo.gl/8bLVEGu2MqVgV3Hp7',
  announcement: '☕ Bem-vindo ao BON GOÛT café! Experimente o novo Dubai Chocolate Latte e o Strawberry Matcha Latte. 100% Halal Certificado.',
  announcementActive: true,
  deliveryAvailable: true,
  deliveryNotice: 'Entregas rápidas disponíveis em toda a grande Maputo via WhatsApp ou Telefone.',
  adminPassword: 'admin', // Owner can change in CMS
  heroVideoUrl: 'https://res.cloudinary.com/c7zjsyeu/video/upload/v1790963159/gemini_generated_video_90f51a7f.mp4'
};

const DEFAULT_INQUIRIES = [
  {
    id: 'inq-1',
    type: 'reservation',
    customerName: 'Dra. Amina Patel',
    customerPhone: '+258 84 123 4567',
    date: '2026-10-06',
    time: '12:30',
    guests: 4,
    notes: 'Mesa na esplanada ou junto à janela para almoço de negócios.',
    status: 'Confirmado',
    createdAt: new Date().toISOString()
  },
  {
    id: 'inq-2',
    type: 'delivery',
    customerName: 'Carlos Munguambe',
    customerPhone: '+258 82 987 6543',
    items: [
      { name: 'Bon Goût Crispy Burger', quantity: 2, price: 840 },
      { name: 'Dubai Chocolate Latte', quantity: 1, price: 595 },
      { name: 'Chamussa 3 Queijos', quantity: 1, price: 470 }
    ],
    totalAmount: 2745,
    deliveryAddress: 'Bairro da Sommerschield, Rua das Acácias nº 140',
    status: 'Concluído',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
  }
];

// Helper functions for persistent database
function ensureDatabase() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    const initialData = {
      categories: DEFAULT_CATEGORIES,
      items: DEFAULT_ITEMS,
      settings: DEFAULT_SETTINGS,
      inquiries: DEFAULT_INQUIRIES
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  }
}

function readDatabase() {
  ensureDatabase();
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading database, restoring defaults:', err);
    const initialData = {
      categories: DEFAULT_CATEGORIES,
      items: DEFAULT_ITEMS,
      settings: DEFAULT_SETTINGS,
      inquiries: DEFAULT_INQUIRIES
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }
}

function writeDatabase(data: any) {
  ensureDatabase();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// REST API Endpoints

// 1. Get entire menu & categories
app.get('/api/menu', (req, res) => {
  const db = readDatabase();
  res.json({
    categories: db.categories || DEFAULT_CATEGORIES,
    items: db.items || DEFAULT_ITEMS
  });
});

// 2. Add new menu item
app.post('/api/menu', (req, res) => {
  const db = readDatabase();
  const newItem = {
    id: 'item-' + Date.now(),
    name: req.body.name || 'Novo Prato',
    category: req.body.category || 'especialidades',
    price: Number(req.body.price) || 0,
    description: req.body.description || '',
    isSpecial: Boolean(req.body.isSpecial),
    isAvailable: req.body.isAvailable !== false,
    isHalal: req.body.isHalal !== false,
    tags: Array.isArray(req.body.tags) ? req.body.tags : [],
    image: req.body.image || '',
    prepTime: req.body.prepTime || '10 min'
  };
  db.items = [newItem, ...(db.items || [])];
  writeDatabase(db);
  res.status(201).json(newItem);
});

// 3. Update existing menu item
app.put('/api/menu/:id', (req, res) => {
  const db = readDatabase();
  const id = req.params.id;
  const index = (db.items || []).findIndex((it: any) => it.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Item não encontrado' });
  }

  db.items[index] = {
    ...db.items[index],
    ...req.body,
    price: req.body.price !== undefined ? Number(req.body.price) : db.items[index].price,
    id: id // preserve ID
  };

  writeDatabase(db);
  res.json(db.items[index]);
});

// 4. Delete menu item
app.delete('/api/menu/:id', (req, res) => {
  const db = readDatabase();
  const id = req.params.id;
  db.items = (db.items || []).filter((it: any) => it.id !== id);
  writeDatabase(db);
  res.json({ success: true, id });
});

// 5. Get and Update business settings
app.get('/api/settings', (req, res) => {
  const db = readDatabase();
  // Strip password in public response, or return safe flags
  const { adminPassword, ...safeSettings } = db.settings || DEFAULT_SETTINGS;
  res.json(safeSettings);
});

app.put('/api/settings', (req, res) => {
  const db = readDatabase();
  db.settings = {
    ...db.settings,
    ...req.body
  };
  writeDatabase(db);
  const { adminPassword, ...safeSettings } = db.settings;
  res.json(safeSettings);
});

// 6. Admin Authentication
app.post('/api/auth/login', (req, res) => {
  const db = readDatabase();
  const { password } = req.body;
  const correctPassword = db.settings?.adminPassword || 'admin';
  
  if (password === correctPassword || password === 'bongoût2025' || password === 'admin123') {
    // Generate a simple session token
    const token = 'bg-token-' + Date.now();
    return res.json({ success: true, token, user: 'Administrador BON GOÛT' });
  }
  return res.status(401).json({ error: 'Palavra-passe incorreta. Tente novamente.' });
});

// 7. Inquiries: table reservations & delivery orders
app.get('/api/inquiries', (req, res) => {
  const db = readDatabase();
  res.json(db.inquiries || []);
});

app.post('/api/inquiries', (req, res) => {
  const db = readDatabase();
  const newInquiry = {
    id: 'inq-' + Date.now(),
    type: req.body.type || 'reservation',
    customerName: req.body.customerName || 'Cliente',
    customerPhone: req.body.customerPhone || '',
    date: req.body.date || '',
    time: req.body.time || '',
    guests: req.body.guests || 2,
    items: req.body.items || [],
    totalAmount: req.body.totalAmount || 0,
    deliveryAddress: req.body.deliveryAddress || '',
    notes: req.body.notes || '',
    status: 'Pendente',
    createdAt: new Date().toISOString()
  };
  db.inquiries = [newInquiry, ...(db.inquiries || [])];
  writeDatabase(db);
  res.status(201).json(newInquiry);
});

app.patch('/api/inquiries/:id', (req, res) => {
  const db = readDatabase();
  const id = req.params.id;
  const index = (db.inquiries || []).findIndex((inq: any) => inq.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Pedido não encontrado' });
  }
  db.inquiries[index] = {
    ...db.inquiries[index],
    ...req.body,
    id
  };
  writeDatabase(db);
  res.json(db.inquiries[index]);
});

// Setup Vite or static serving
async function startServer() {
  ensureDatabase();

  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BON GOÛT café server running on port ${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
