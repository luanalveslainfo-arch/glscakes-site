export const configuracao = {
  marca: {
    nome: "Glscakes",
    slogan: "Confeitaria artesanal",
    whatsapp: "5521964999184",
    whatsappExibicao: "(21) 96499-9184",
    logo: "/glscakes/logo.png",
  },
  massas: [
    "Chocolate",
    "Baunilha",
    "Red Velvet",
    "Limão Siciliano",
    "Cenoura",
    "Nozes",
    "Laranja",
  ],
  recheios: [
    "Caramelo salgado",
    "Brigadeiro Branco",
    "Brigadeiro de Chocolate",
    "Beijinho",
    "Brigadeiro de Ninho",
    "Doce de Leite",
    "Paçoca",
    "Maracujá",
    "Brigadeiro de Nozes",
  ],
  bento: [
    { id: "bento-chantininho", nome: "Bentô Cake — Chantininho", detalhe: "10 cm · 3 a 4 fatias", preco: 45, imagem: "/images/bentos/bento-chantininho.jpg" },
    { id: "bento-buttercream", nome: "Bentô Cake — Buttercream", detalhe: "10 cm · 3 a 4 fatias", preco: 55, imagem: "/images/bentos/bento-buttercream.jpg" },
    { id: "box-bento", nome: "Box Bentô Cake", detalhe: "1 bentô + 6 docinhos + vela", preco: 75, imagem: "/images/bentos/box-bento.jpg" },
  ],
  bolos: [
    { id: "pp", diametro: "13 cm", tamanho: "PP", fatias: "10 fatias", naked: 160, decorado: 180 },
    { id: "p", diametro: "15 cm", tamanho: "P", fatias: "15 fatias", naked: 205, decorado: 230 },
    { id: "m", diametro: "17 cm", tamanho: "M", fatias: "20 fatias", naked: 245, decorado: 280 },
    { id: "g", diametro: "20 cm", tamanho: "G", fatias: "30 fatias", naked: 295, decorado: 340 },
    { id: "gg", diametro: "25 cm", tamanho: "GG", fatias: "45 a 50 fatias", naked: 385, decorado: 400 },
  ],
  adicionais: [
    { nome: "Nutella", precos: { pp: 15, p: 15, m: 25, g: 30, gg: 45 } },
    { nome: "Crocante de Amendoim", precos: { pp: 10, p: 10, m: 20, g: 25, gg: 30 } },
    { nome: "Morango", precos: { pp: 10, p: 10, m: 15, g: 20, gg: 30 } },
    { nome: "Geleia", precos: { pp: 10, p: 10, m: 15, g: 20, gg: 30 } },
    { nome: "Crocante de Oreo", precos: { pp: 15, p: 15, m: 20, g: 25, gg: null } },
  ],
  kits: [
    { id: "kit-p", nome: "Kit P", detalhe: "Bolo 15 fatias + 25 docinhos + 6 mini cupcakes", preco: 290, imagem: "/images/kits/kit-p.jpg" },
    { id: "kit-m", nome: "Kit M", detalhe: "Bolo 20 fatias + 40 docinhos + 8 mini cupcakes", preco: 330, imagem: "/images/kits/kit-m.jpg" },
    { id: "kit-g", nome: "Kit G", detalhe: "Bolo 30 fatias + 60 docinhos + 12 mini cupcakes", preco: 470, imagem: "/images/kits/kit-g.jpg" },
    { id: "kit-gg", nome: "Kit GG", detalhe: "Bolo 50 fatias + 100 docinhos + 16 mini cupcakes", preco: 580, imagem: "/images/kits/kit-gg.jpg" },
  ],
  docinhos: {
    tradicionais: {
      nome: "Tradicionais",
      precos: { 25: 50, 50: 95, 100: 180 },
      sabores: ["Brigadeiro de Chocolate", "Brigadeiro Branco", "Beijinho", "Moranguinho", "Casadinho"],
    },
    gourmet: {
      nome: "Gourmet",
      precos: { 25: 60, 50: 120, 100: 230 },
      sabores: ["Brigadeiro Meio Amargo", "Ferreiro", "Ninho com Nutella", "Cajuzinho", "Oreo", "Churros", "Romeu e Julieta", "Surpresa de Uva"],
    },
  },
  docesPersonalizados: [
    { id: "bolo-palito", nome: "Bolo no Palito", preco: 15, imagem: "/images/personalizados/bolo-palito.jpg" },
    { id: "popsicle", nome: "Popsicle (Picolé)", preco: 15, imagem: "/images/personalizados/popsicle-sonic.jpg" },
    { id: "pao-de-mel-3d", nome: "Pão de Mel 3D", preco: 15, imagem: "/images/personalizados/pao-mel-3d.jpg" },
    { id: "pao-de-mel-simples", nome: "Pão de Mel Simples", preco: 7, imagem: "/images/personalizados/pao-mel-simples.jpg" },
    { id: "mini-cupcakes", nome: "Mini Cupcakes", preco: 4, imagem: "/images/personalizados/mini-cupcakes.jpg" },
    { id: "pirulito-chocolate", nome: "Pirulito de Chocolate", preco: 10, imagem: "/images/personalizados/pirulito-chocolate.jpg" },
    { id: "biscoito-decorado", nome: "Biscoito Decorado", preco: 10, imagem: "/images/personalizados/biscoito-decorado.jpg" },
    { id: "mini-trufinha-decorada", nome: "Mini Trufinha Decorada", preco: 4, imagem: "/images/personalizados/mini-trufinha.jpg" },
  ],
} as const;

export type TamanhoId = (typeof configuracao.bolos)[number]["id"];
export type TipoDocinho = keyof typeof configuracao.docinhos;
export type DocePersonalizadoId = (typeof configuracao.docesPersonalizados)[number]["id"];
