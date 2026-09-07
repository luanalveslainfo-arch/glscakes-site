export const configuracao = {
  marca: {
    nome: "Home Treats",
    subtitulo: "by Narmatha",
    slogan: "Handcrafted Custom Cakes & Desserts for Every Occasion",
    telefone: "4696606156",
    telefoneExibicao: "(469) 660-6156",
    whatsapp: "14696606156",
    whatsappExibicao: "(469) 660-6156",
    instagram: "home_treats_bynarmatha",
    instagramUrl: "https://instagram.com/home_treats_bynarmatha",
    local: "Serving Frisco, TX & Surrounding Areas",
    tagline: "Home Treats LLC — Your Local Custom Cake Specialist",
    logo: "/hometreats/logo.png",
  },
  diasAntecedenciaMinima: 3,

  // Cake Sponges & Fillings
  massas: [
    "Signature Vanilla Bean",
    "Decadent Chocolate Fudge",
    "Velvety Red Velvet",
    "Lemon Zest & Cream",
    "Spiced Carrot & Walnut",
    "Funfetti Celebration",
    "Classic Marble",
    "Almond Blossom",
  ],
  recheios: [
    "Vanilla Bean Buttercream",
    "Belgian Chocolate Ganache",
    "Salted Caramel Cream",
    "Whipped Cream Cheese",
    "White Chocolate Mousse",
    "Fresh Strawberry Compote",
    "Lotus Biscoff Crunch",
    "Nutella Hazelnut Swirl",
    "Mango Passionfruit Curd",
  ],

  // 1. Custom Cakes Sizes & Base Prices
  bolos: [
    { id: "6in", diametro: '6" Round', tamanho: "Mini Tier", fatias: "8 to 10 servings", naked: 85, decorado: 100 },
    { id: "8in", diametro: '8" Round', tamanho: "Classic Tier", fatias: "15 to 20 servings", naked: 125, decorado: 145 },
    { id: "10in", diametro: '10" Round', tamanho: "Party Tier", fatias: "25 to 30 servings", naked: 175, decorado: 195 },
    { id: "2tier-sm", diametro: '6" + 8" Tiers', tamanho: "2-Tier Celebration", fatias: "35 to 45 servings", naked: 240, decorado: 275 },
    { id: "2tier-lg", diametro: '8" + 10" Tiers', tamanho: "2-Tier Grand Event", fatias: "50 to 65 servings", naked: 320, decorado: 360 },
  ],

  // Cake Finishes / Themes (Featuring Narmatha's real custom cakes!)
  acabamentos: [
    {
      id: "Floral & Gold Anniversary",
      nome: "Elegant Floral & Gold Pearls",
      detalhe: "Multi-tier silky finish with deep red roses, delicate baby's breath & golden accents",
      imagem: "/hometreats/cake-anniversary.png",
      extra: 0,
    },
    {
      id: "Winnie the Pooh Theme",
      nome: "Whimsical Pooh & Honey",
      detalhe: "Storybook pastel finish with sculpted honey pot, lush greenery & Winnie the Pooh plaques",
      imagem: "/hometreats/cake-pooh.png",
      extra: 15,
    },
    {
      id: "Toy Story Theme",
      nome: "Playful Toy Story Celebration",
      detalhe: "Sky blue buttercream, fluffy clouds, custom name & 3D Toy Story emblem",
      imagem: "/hometreats/cake-toystory.png",
      extra: 15,
    },
    {
      id: "Hot Air Balloon & Bear",
      nome: "Teddy Bear & Balloon Dream",
      detalhe: "Gentle pastel clouds, handmade pilot bear in plane, ladder & gold metallic details",
      imagem: "/hometreats/cake-balloon.png",
      extra: 20,
    },
  ],

  // Custom Cakes Add-ons & Dietary Choices
  adicionais: [
    { nome: "Gluten-Free Sponge", precos: { "6in": 15, "8in": 20, "10in": 25, "2tier-sm": 35, "2tier-lg": 45 } },
    { nome: "Eggless Option Available", precos: { "6in": 10, "8in": 15, "10in": 20, "2tier-sm": 25, "2tier-lg": 30 } },
    { nome: "Custom Acrylic Name Topper", precos: { "6in": 15, "8in": 15, "10in": 15, "2tier-sm": 18, "2tier-lg": 18 } },
    { nome: "Fresh Berries & Macaron Garnish", precos: { "6in": 18, "8in": 22, "10in": 26, "2tier-sm": 32, "2tier-lg": 40 } },
    { nome: "24k Edible Gold Leaf Accents", precos: { "6in": 12, "8in": 15, "10in": 18, "2tier-sm": 22, "2tier-lg": 25 } },
  ],

  // 2. Cupcakes
  cupcakes: [
    {
      id: "cupcake-12",
      nome: "1 Dozen Gourmet Cupcakes (12 pcs)",
      detalhe: "Choose your favorite flavor with signature swirl frosting and pearl sprinkles",
      preco: 35,
      imagem: "/images/personalizados/mini-cupcakes.jpg",
    },
    {
      id: "cupcake-24",
      nome: "2 Dozen Gourmet Cupcakes (24 pcs)",
      detalhe: "Great for birthday parties, school events, and celebrations (mix up to 2 flavors)",
      preco: 68,
      imagem: "/hometreats/flyer-desserts.png",
    },
    {
      id: "cupcake-36",
      nome: "3 Dozen Party Tower Set (36 pcs)",
      detalhe: "Showstopping cupcake tower with optional custom floral piping and themed colors",
      preco: 99,
      imagem: "/hometreats/flyer-cakes.png",
    },
  ],
  saboresCupcake: [
    "Classic Vanilla Bean",
    "Double Rich Chocolate",
    "Red Velvet & Whipped Cream Cheese",
    "Salted Caramel Swirl",
    "Lemon Blossom Curd",
    "Strawberry Chantilly",
    "Lotus Biscoff Crunch",
    "Cookies & Cream Oreo",
  ],

  // 3. Brownies & Bars
  brownies: [
    {
      id: "brownies-half",
      nome: "Half Batch Artisan Brownies & Bars (12 squares)",
      detalhe: "Ultra-fudgy, made from scratch with premium chocolate and crisp crinkle top",
      preco: 30,
      imagem: "/hometreats/flyer-desserts.png",
    },
    {
      id: "brownies-full",
      nome: "Full Batch Artisan Brownies & Bars (24 squares)",
      detalhe: "Indulgent party tray, freshly baked to order for events, meetings or gifting",
      preco: 55,
      imagem: "/hometreats/flyer-desserts.png",
    },
  ],
  saboresBrownies: [
    "Signature Fudge Dark Chocolate",
    "Salted Caramel Brookies (Brownie + Cookie)",
    "Nutella Swirl Hazelnut Brownies",
    "Lotus Biscoff Butter Blondies",
    "Lemon Shortbread Crumb Bars",
    "Peanut Butter Swirl Brownies",
  ],

  // 4. Cakesicles
  cakesicles: [
    {
      id: "cakesicles-12",
      nome: "1 Dozen Artisan Cakesicles (12 pcs)",
      detalhe: "Cake popsicles enveloped in smooth Belgian chocolate with lovely drizzle and pearls",
      preco: 40,
      imagem: "/images/personalizados/popsicle-sonic.jpg",
    },
    {
      id: "cakesicles-24",
      nome: "2 Dozen Celebration Cakesicles (24 pcs)",
      detalhe: "Perfect dessert table centerpiece with coordinated colors, sprinkles, and gold dust",
      preco: 75,
      imagem: "/images/personalizados/popsicle-sonic.jpg",
    },
  ],
  estilosCakesicles: [
    "Pastel Watercolor & Gold Drizzle",
    "Floral Buttercream & Pearl Dust",
    "Custom Themed Character Accents",
    "Cookies & Cream White Chocolate",
    "Dark Chocolate Gold Splatter",
  ],

  // 5. Dessert Cups & Mini Treats
  dessertCups: {
    nome: "Dessert Cups & Shooters",
    detalhe: "Individual mini shooter glasses with mini spoons — elegant & mess-free for guests",
    precos: { 12: 45, 24: 85, 36: 120 },
    sabores: [
      "Tiramisu Espresso Cream",
      "Mango Cheesecake Shooters",
      "Strawberry Shortcake Delight",
      "Oreo Cookies & Cream Mousse",
      "Lotus Biscoff Crumble",
      "Velvety Chocolate Ganache Trifle",
      "Passionfruit & White Chocolate",
    ],
    imagem: "/hometreats/flyer-desserts.png",
  },

  // 6. Themed & Personalized Desserts (À la carte / Steppers)
  docesPersonalizados: [
    { id: "custom-sugar-cookies", nome: "Decorated Sugar Cookies (per piece)", preco: 4.5, imagem: "/images/personalizados/biscoito-decorado.jpg", detalhe: "Custom royal icing matching your theme" },
    { id: "gourmet-cake-pops", nome: "Gourmet Decorated Cake Pops", preco: 3.5, imagem: "/images/personalizados/bolo-palito.jpg", detalhe: "Moist cake balls on sticks dipped in chocolate" },
    { id: "chocolate-pretzels-oreos", nome: "Chocolate Dipped Oreos / Pretzels", preco: 3.0, imagem: "/images/personalizados/pirulito-chocolate.jpg", detalhe: "Dipped in premium chocolate with sprinkles" },
    { id: "french-macarons", nome: "Handcrafted French Macarons", preco: 3.0, imagem: "/hometreats/flyer-desserts.png", detalhe: "Delicate almond shells filled with silky ganache" },
    { id: "3d-cakesicles", nome: "3D Themed Sculpted Cakesicles", preco: 5.0, imagem: "/images/personalizados/popsicle-sonic.jpg", detalhe: "Detailed character or floral 3D topper" },
    { id: "mini-cupcakes-batch", nome: "Mini Cupcakes (Box of 12)", preco: 20.0, imagem: "/images/personalizados/mini-cupcakes.jpg", detalhe: "Bite-sized moist cupcakes with swirl frosting" },
    { id: "mini-treat-truffles", nome: "Decorated Mini Truffles & Bonbons", preco: 2.5, imagem: "/images/personalizados/mini-trufinha.jpg", detalhe: "Gourmet filled chocolate bonbon gems" },
  ],
} as const;

export type TamanhoId = (typeof configuracao.bolos)[number]["id"];
export type DocePersonalizadoId = (typeof configuracao.docesPersonalizados)[number]["id"];
