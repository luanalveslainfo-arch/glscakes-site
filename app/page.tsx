"use client";

import { useEffect, useMemo, useState } from "react";
import {
  configuracao,
  type DocePersonalizadoId,
  type TamanhoId,
} from "./configuracao";

type Categoria = "cakes" | "cupcakes" | "brownies" | "cakesicles" | "cups" | "treats";

type OrderItem = {
  id: string;
  title: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

const categories: { id: Categoria; number: string; name: string; summary: string; startingAt: string }[] = [
  { id: "cakes", number: "01", name: "Custom Cakes", summary: "Starting at $85.00", startingAt: "from $85.00" },
  { id: "cupcakes", number: "02", name: "Cupcakes", summary: "Starting at $35.00/dozen", startingAt: "from $35.00" },
  { id: "brownies", number: "03", name: "Brownies & Bars", summary: "Starting at $30.00/batch", startingAt: "from $30.00" },
  { id: "cakesicles", number: "04", name: "Cakesicles", summary: "Starting at $40.00/dozen", startingAt: "from $40.00" },
  { id: "cups", number: "05", name: "Dessert Cups", summary: "Starting at $45.00", startingAt: "from $45.00" },
  { id: "treats", number: "06", name: "Themed Treats", summary: "Starting at $50.00", startingAt: "from $50.00" },
];

function formatCurrency(val: number): string {
  return val.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function getMinOrderDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + configuracao.diasAntecedenciaMinima);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<Categoria>("cakes");
  const [quantity, setQuantity] = useState(1);

  // 1. Custom Cakes State
  const [cakeSizeId, setCakeSizeId] = useState<TamanhoId>("6in");
  const [cakeFinishId, setCakeFinishId] = useState<string>(configuracao.acabamentos[0].id);
  const [cakeSponge, setCakeSponge] = useState<string>(configuracao.massas[0]);
  const [cakeFilling, setCakeFilling] = useState<string>(configuracao.recheios[0]);
  const [cakeFilling2, setCakeFilling2] = useState<string>("");
  const [cakeExtras, setCakeExtras] = useState<string[]>([]);

  // 2. Cupcakes State
  const [cupcakePackId, setCupcakePackId] = useState<string>(configuracao.cupcakes[0].id);
  const [cupcakeFlavor, setCupcakeFlavor] = useState<string>(configuracao.saboresCupcake[0]);
  const [cupcakeFlavor2, setCupcakeFlavor2] = useState<string>("");
  const [cupcakeFondantDiscs, setCupcakeFondantDiscs] = useState(false);

  // 3. Brownies & Bars State
  const [browniePackId, setBrowniePackId] = useState<string>(configuracao.brownies[0].id);
  const [brownieFlavor, setBrownieFlavor] = useState<string>(configuracao.saboresBrownies[0]);
  const [brownieFlavor2, setBrownieFlavor2] = useState<string>("");

  // 4. Cakesicles State
  const [cakesiclePackId, setCakesiclePackId] = useState<string>(configuracao.cakesicles[0].id);
  const [cakesicleStyle, setCakesicleStyle] = useState<string>(configuracao.estilosCakesicles[0]);
  const [cakesicleFlavor, setCakesicleFlavor] = useState<string>("Signature Vanilla");

  // 5. Dessert Cups State
  const [cupCount, setCupCount] = useState<12 | 24 | 36>(12);
  const [cupFlavor, setCupFlavor] = useState<string>(configuracao.dessertCups.sabores[0]);
  const [cupFlavor2, setCupFlavor2] = useState<string>("");

  // 6. Themed Desserts / Treats State
  const [treatId, setTreatId] = useState<DocePersonalizadoId>(configuracao.docesPersonalizados[0].id);

  // Cart & Customer Details
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventOccasion, setEventOccasion] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");
  const [userNotice, setUserNotice] = useState("");
  const [modalImage, setModalImage] = useState<{ src: string; alt: string; title: string } | null>(null);

  // Modal ESC listener & scroll lock
  useEffect(() => {
    if (!modalImage) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalImage(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [modalImage]);

  // Cake Price Calculation
  const selectedSize = configuracao.bolos.find((b) => b.id === cakeSizeId)!;
  const selectedFinish = configuracao.acabamentos.find((f) => f.id === cakeFinishId)!;
  const cakeBasePrice = selectedSize.decorado + (selectedFinish?.extra ?? 0);
  const cakeExtrasPrice = configuracao.adicionais
    .filter((extra) => cakeExtras.includes(extra.nome))
    .reduce((sum, extra) => sum + (extra.precos[cakeSizeId] ?? 0), 0);
  const totalCakePrice = cakeBasePrice + cakeExtrasPrice;

  // Total cart calculation
  const cartTotal = useMemo(() => cartItems.reduce((sum, item) => sum + item.total, 0), [cartItems]);

  function switchCategory(cat: Categoria) {
    setActiveCategory(cat);
    setQuantity(1);
    setUserNotice("");
  }

  function toggleCakeExtra(extraName: string) {
    setCakeExtras((current) =>
      current.includes(extraName) ? current.filter((e) => e !== extraName) : [...current, extraName]
    );
  }

  function createOrderItem(): OrderItem {
    const id = `${activeCategory}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

    if (activeCategory === "cakes") {
      const finishDesc = `Style: ${selectedFinish.nome}`;
      const fillingsDesc = cakeFilling2
        ? `Fillings: ${cakeFilling} & ${cakeFilling2}`
        : `Filling: ${cakeFilling}`;
      const extrasDesc = cakeExtras.length ? ` · Add-ons: ${cakeExtras.join(", ")}` : "";
      return {
        id,
        title: `Custom Cake — ${selectedSize.tamanho} (${selectedSize.diametro})`,
        description: `${selectedSize.fatias} · ${finishDesc} · Sponge: ${cakeSponge} · ${fillingsDesc}${extrasDesc}`,
        quantity,
        unitPrice: totalCakePrice,
        total: totalCakePrice * quantity,
      };
    }

    if (activeCategory === "cupcakes") {
      const pack = configuracao.cupcakes.find((c) => c.id === cupcakePackId)!;
      const extraDiscPrice = cupcakeFondantDiscs ? 10 : 0;
      const unit = pack.preco + extraDiscPrice;
      const flavors = cupcakeFlavor2 ? `Flavors: ${cupcakeFlavor} & ${cupcakeFlavor2}` : `Flavor: ${cupcakeFlavor}`;
      const topperDesc = cupcakeFondantDiscs ? " · Custom Fondant Disc Toppers Included" : "";
      return {
        id,
        title: pack.nome,
        description: `${flavors}${topperDesc}`,
        quantity,
        unitPrice: unit,
        total: unit * quantity,
      };
    }

    if (activeCategory === "brownies") {
      const pack = configuracao.brownies.find((b) => b.id === browniePackId)!;
      const flavors = brownieFlavor2 ? `Flavors: ${brownieFlavor} & ${brownieFlavor2}` : `Flavor: ${brownieFlavor}`;
      return {
        id,
        title: pack.nome,
        description: flavors,
        quantity,
        unitPrice: pack.preco,
        total: pack.preco * quantity,
      };
    }

    if (activeCategory === "cakesicles") {
      const pack = configuracao.cakesicles.find((c) => c.id === cakesiclePackId)!;
      return {
        id,
        title: pack.nome,
        description: `Style: ${cakesicleStyle} · Cake Flavor: ${cakesicleFlavor}`,
        quantity,
        unitPrice: pack.preco,
        total: pack.preco * quantity,
      };
    }

    if (activeCategory === "cups") {
      const price = configuracao.dessertCups.precos[cupCount];
      const flavors = cupFlavor2 ? `Flavors: ${cupFlavor} & ${cupFlavor2}` : `Flavor: ${cupFlavor}`;
      return {
        id,
        title: `Dessert Cups & Shooters — ${cupCount} pcs`,
        description: `${flavors} · Includes mini dessert spoons`,
        quantity,
        unitPrice: price,
        total: price * quantity,
      };
    }

    const treat = configuracao.docesPersonalizados.find((t) => t.id === treatId)!;
    return {
      id,
      title: treat.nome,
      description: treat.detalhe,
      quantity,
      unitPrice: treat.preco,
      total: treat.preco * quantity,
    };
  }

  function handleAddToCart() {
    const item = createOrderItem();
    setCartItems((curr) => [...curr, item]);
    setUserNotice(`"${item.title}" added to your order!`);
    setTimeout(() => setUserNotice(""), 3500);
  }

  function handleStepperChange(product: (typeof configuracao.docesPersonalizados)[number], delta: number) {
    setCartItems((curr) => {
      const idx = curr.findIndex((it) => it.title === product.nome);
      if (idx === -1) {
        if (delta <= 0) return curr;
        const newItem: OrderItem = {
          id: `treat-${product.id}-${Date.now()}`,
          title: product.nome,
          description: product.detalhe,
          quantity: delta,
          unitPrice: product.preco,
          total: product.preco * delta,
        };
        setUserNotice(`"${product.nome}" added to your order!`);
        setTimeout(() => setUserNotice(""), 3200);
        return [...curr, newItem];
      }

      const existing = curr[idx];
      const newQty = existing.quantity + delta;

      if (newQty <= 0) {
        setUserNotice(`"${product.nome}" removed from your order.`);
        setTimeout(() => setUserNotice(""), 3200);
        return curr.filter((_, i) => i !== idx);
      }

      const updated: OrderItem = {
        ...existing,
        quantity: newQty,
        total: existing.unitPrice * newQty,
      };
      const clone = [...curr];
      clone[idx] = updated;
      return clone;
    });
  }

  function handleSendWhatsApp() {
    if (!cartItems.length) {
      setUserNotice("Please add at least one item to your order before proceeding.");
      document.querySelector("#build-order")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (!customerName.trim() || !eventDate || !eventTime) {
      setUserNotice("Please fill in your name, event date, and desired pickup/delivery time.");
      document.querySelector("#checkout-section")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (eventDate < getMinOrderDate()) {
      setUserNotice(`Orders require at least ${configuracao.diasAntecedenciaMinima} days advance notice. Please select a later date.`);
      document.querySelector("#checkout-section")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    const itemLines = cartItems.flatMap((item, idx) => [
      `*${idx + 1}. ${item.title}*`,
      item.description,
      `Qty: ${item.quantity} · ${formatCurrency(item.total)}`,
      "",
    ]);

    const deposit = cartTotal / 2;
    const balance = cartTotal - deposit;
    const formattedDate = new Date(`${eventDate}T12:00:00`).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    const messageLines = [
      "Hi Narmatha! I'd like to place an order from your interactive menu:",
      "",
      `*Customer Name:* ${customerName.trim()}`,
      `*Event / Delivery Date:* ${formattedDate}`,
      `*Time:* ${eventTime}`,
      eventOccasion.trim() ? `*Occasion / Theme:* ${eventOccasion.trim()}` : "",
      "",
      "*SELECTED ITEMS:*",
      ...itemLines,
      `*ESTIMATED TOTAL: ${formatCurrency(cartTotal)}*`,
      `*50% Deposit to Reserve: ${formatCurrency(deposit)}*`,
      `*50% Balance on Delivery: ${formatCurrency(balance)}*`,
      "",
      specialNotes.trim() ? `*Design Notes / Dietary Requests:* ${specialNotes.trim()}` : "",
      "",
      "I understand that custom orders are confirmed once the 50% deposit is completed.",
      "Thank you! Looking forward to celebrating with Home Treats by Narmatha. ✨",
    ].filter(Boolean);

    const messageText = messageLines.join("\n");
    const waUrl = `https://wa.me/${configuracao.marca.whatsapp}?text=${encodeURIComponent(messageText)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <main>
      {/* ----------------- TOPBAR ----------------- */}
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Home Treats by Narmatha — Home">
          <img src={configuracao.marca.logo} alt="Home Treats by Narmatha Logo" />
          <span>
            <strong>
              Home Treats<span>by Narmatha</span>
            </strong>
            <small>{configuracao.marca.local}</small>
          </span>
        </a>

        <div className="top-actions">
          <a
            className="top-instagram"
            href={configuracao.marca.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Follow on Instagram"
          >
            <span>📷</span>
            <span>@{configuracao.marca.instagram}</span>
          </a>
          <a
            className="top-whatsapp"
            href={`https://wa.me/${configuracao.marca.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>💬</span>
            <span>{configuracao.marca.telefoneExibicao}</span>
          </a>
        </div>
      </header>

      {/* ----------------- HERO ----------------- */}
      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="eyebrow-badge">✨ Handcrafted in Frisco, TX</span>
          </div>
          <h1>
            Custom Cakes for<br />
            <em>Every Occasion!</em>
          </h1>
          <p className="hero-text">
            Made Fresh · Made with Love · Fully Customizable. From intimate birthday cakes to breathtaking multi-tiered
            celebration centerpieces and dessert stations for Frisco & surrounding areas.
          </p>

          <div className="hero-actions">
            <a className="button primary" href="#build-order">
              Build Your Order <span>→</span>
            </a>
            <a className="button ghost" href="#dessert-options">
              View Dessert Options
            </a>
          </div>

          <div className="payment-pill">
            <span>◆</span>
            <p>
              <strong>50% Deposit to Reserve Your Date</strong>
              <small>Remaining 50% balance paid upon delivery or pickup</small>
            </p>
          </div>
        </div>

        <div className="hero-gallery" aria-label="Home Treats Custom Cakes Showcase">
          <figure
            className="hero-photo hero-photo-main cursor-pointer"
            onClick={() =>
              setModalImage({
                src: "/hometreats/cake-anniversary.png",
                alt: "10th Anniversary Custom Cake with Red Roses and Gold Hearts",
                title: "10th Anniversary Custom Cake with Red Roses & Gold Details",
              })
            }
            title="Click to view full photo"
          >
            <img
              src="/hometreats/cake-anniversary.png"
              alt="10th Anniversary Custom Cake by Home Treats"
            />
          </figure>

          <figure
            className="hero-photo hero-photo-small cursor-pointer"
            onClick={() =>
              setModalImage({
                src: "/hometreats/cake-pooh.png",
                alt: "Winnie the Pooh Custom Baby Shower Cake",
                title: 'Winnie the Pooh 2-Tier Cake — "Our Little Honey is on the Way"',
              })
            }
            title="Click to view full photo"
          >
            <img
              src="/hometreats/cake-pooh.png"
              alt="Winnie the Pooh themed custom cake by Home Treats"
            />
          </figure>

          <span className="hero-seal">
            Baked with<br />
            <strong>Love</strong> ♡
          </span>
        </div>
      </section>

      {/* ----------------- PILLARS BAR ----------------- */}
      <div className="pillars-bar">
        <div className="pillar-card">
          <div className="pillar-icon">🎂</div>
          <div className="pillar-text">
            <strong>Custom Designs & Themes</strong>
            <small>Personalized to your unique vision</small>
          </div>
        </div>
        <div className="pillar-card">
          <div className="pillar-icon">✨</div>
          <div className="pillar-text">
            <strong>Freshly Baked to Order</strong>
            <small>100% premium ingredients</small>
          </div>
        </div>
        <div className="pillar-card">
          <div className="pillar-icon">🌿</div>
          <div className="pillar-text">
            <strong>Gluten-Free & Eggless</strong>
            <small>Dietary options gladly accommodated</small>
          </div>
        </div>
        <div className="pillar-card">
          <div className="pillar-icon">📍</div>
          <div className="pillar-text">
            <strong>Frisco & Surrounding Areas</strong>
            <small>Local custom cake specialist</small>
          </div>
        </div>
      </div>

      {/* ----------------- DESSERT SHOWCASE ----------------- */}
      <section className="catalog-intro" id="dessert-options">
        <div>
          <p className="eyebrow">Interactive Menu</p>
          <h2>
            Dessert Options &<br />
            <em>Custom Stations</em>
          </h2>
        </div>
        <p>
          Explore Narmatha&apos;s specialty offerings. Select your favorite category below to customize flavors, sizes, fillings, and decorative themes.
        </p>
      </section>

      <section className="showcase-grid">
        <article
          className="showcase-card"
          onClick={() => {
            switchCategory("cakes");
            document.querySelector("#build-order")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <div>
            <span>01 · SIGNATURE</span>
            <h3>Custom Cakes</h3>
            <p>Starting at <strong>$85.00</strong></p>
          </div>
          <img src="/hometreats/cake-balloon.png" alt="Hot Air Balloon and Teddy Bear Custom 1st Birthday Cake" />
        </article>

        <article
          className="showcase-card"
          onClick={() => {
            switchCategory("cupcakes");
            document.querySelector("#build-order")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <div>
            <span>02 · GOURMET</span>
            <h3>Cupcakes</h3>
            <p>Starting at <strong>$35.00 / doz</strong></p>
          </div>
          <img src="/images/personalizados/mini-cupcakes.jpg" alt="Artisan Cupcakes with Buttercream Swirls" />
        </article>

        <article
          className="showcase-card"
          onClick={() => {
            switchCategory("cakesicles");
            document.querySelector("#build-order")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <div>
            <span>03 · ARTISAN</span>
            <h3>Cakesicles</h3>
            <p>Starting at <strong>$40.00 / doz</strong></p>
          </div>
          <img src="/images/personalizados/popsicle-sonic.jpg" alt="Chocolate Dipped Cakesicles" />
        </article>

        <article
          className="showcase-card"
          onClick={() => {
            switchCategory("cups");
            document.querySelector("#build-order")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <div>
            <span>04 · STATIONS</span>
            <h3>Dessert Cups</h3>
            <p>Starting at <strong>$45.00</strong></p>
          </div>
          <img src="/hometreats/flyer-desserts.png" alt="Dessert Station Treat Cups and Macarons" />
        </article>
      </section>

      {/* ----------------- BUILD YOUR ORDER SECTION ----------------- */}
      <section className="builder-section" id="build-order">
        <div className="section-title">
          <p className="eyebrow">Custom Order Builder</p>
          <h2>Build Your Order</h2>
          <p>
            Choose your dessert category, pick your favorite style and flavors, and add as many items as you would like for your event.
          </p>
        </div>

        <div className="builder-layout">
          {/* Builder Card */}
          <div className="builder-card">
            {/* 6 Category Tabs */}
            <nav className="category-tabs" aria-label="Dessert Categories">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={activeCategory === cat.id ? "active" : ""}
                  onClick={() => switchCategory(cat.id)}
                >
                  <span>{cat.number}</span>
                  <strong>{cat.name}</strong>
                  <small>{cat.summary}</small>
                </button>
              ))}
            </nav>

            <div className="config-panel">
              {/* CATEGORY 1: CUSTOM CAKES */}
              {activeCategory === "cakes" && (
                <>
                  <div className="panel-heading">
                    <span>01</span>
                    <div>
                      <h3>Design Your Custom Cake</h3>
                      <p>Select size, signature finish style, sponge flavor, fillings, and special dietary add-ons.</p>
                    </div>
                  </div>

                  {/* 1. Size Selection */}
                  <fieldset>
                    <legend>1. Select Cake Size & Tier</legend>
                    <div className="size-options">
                      {configuracao.bolos.map((size) => (
                        <button
                          key={size.id}
                          type="button"
                          className={cakeSizeId === size.id ? "size selected" : "size"}
                          onClick={() => setCakeSizeId(size.id)}
                        >
                          <strong>{size.tamanho}</strong>
                          <span>{size.diametro}</span>
                          <small>{size.fatias}</small>
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  {/* 2. Signature Finishes & Themes with Real Photos */}
                  <fieldset>
                    <legend>2. Cake Style & Theme</legend>
                    <div className="acabamento-list">
                      {configuracao.acabamentos.map((finish) => {
                        const isSelected = cakeFinishId === finish.id;
                        return (
                          <div
                            key={finish.id}
                            className={`acabamento-card ${isSelected ? "active" : ""}`}
                            onClick={() => setCakeFinishId(finish.id)}
                            role="radio"
                            aria-checked={isSelected}
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                setCakeFinishId(finish.id);
                              }
                            }}
                          >
                            <div className="bento-info">
                              <div
                                className="bento-thumb-container"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setModalImage({
                                    src: finish.imagem,
                                    alt: finish.nome,
                                    title: finish.nome,
                                  });
                                }}
                                title="Click to view larger photo"
                                aria-label={`View larger photo of ${finish.nome}`}
                              >
                                <img
                                  src={finish.imagem}
                                  alt={finish.nome}
                                  width={64}
                                  height={64}
                                  loading="lazy"
                                />
                                <span className="zoom-badge">
                                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                  </svg>
                                </span>
                              </div>

                              <div className="bento-text">
                                <strong className="bento-title">{finish.nome}</strong>
                                <small className="bento-detail">{finish.detalhe}</small>
                              </div>
                            </div>

                            <div className="bento-right">
                              <b className="bento-price">
                                {formatCurrency(selectedSize.decorado + finish.extra)}
                              </b>
                              <span className={`radio ${isSelected ? "selected" : ""}`} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </fieldset>

                  {/* 3 & 4. Cake Flavors & Fillings */}
                  <div className="form-grid">
                    <label>
                      3. Sponge Flavor
                      <select value={cakeSponge} onChange={(e) => setCakeSponge(e.target.value)}>
                        {configuracao.massas.map((sponge) => (
                          <option key={sponge} value={sponge}>{sponge}</option>
                        ))}
                      </select>
                    </label>

                    <label>
                      4. Primary Filling
                      <select value={cakeFilling} onChange={(e) => setCakeFilling(e.target.value)}>
                        {configuracao.recheios.map((filling) => (
                          <option key={filling} value={filling}>{filling}</option>
                        ))}
                      </select>
                    </label>

                    <label>
                      Second Filling <small>(optional complementary flavor)</small>
                      <select value={cakeFilling2} onChange={(e) => setCakeFilling2(e.target.value)}>
                        <option value="">None (Single Filling)</option>
                        {configuracao.recheios
                          .filter((f) => f !== cakeFilling)
                          .map((f) => (
                            <option key={f} value={f}>{f}</option>
                          ))}
                      </select>
                    </label>
                  </div>

                  {/* 5. Dietary & Custom Add-ons */}
                  <fieldset>
                    <legend>5. Special Add-ons & Dietary Choices <small>(optional)</small></legend>
                    <div className="extras-options">
                      {configuracao.adicionais.map((extra) => {
                        const price = extra.precos[cakeSizeId];
                        const isSelected = cakeExtras.includes(extra.nome);
                        return (
                          <button
                            key={extra.nome}
                            type="button"
                            className={isSelected ? "selected" : ""}
                            onClick={() => toggleCakeExtra(extra.nome)}
                          >
                            <span className="check">✓</span>
                            <span>
                              <strong>{extra.nome}</strong>
                              <small>+ {formatCurrency(price)}</small>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>

                  <div className="live-price">
                    <span>Configured Cake Price</span>
                    <strong>{formatCurrency(totalCakePrice)}</strong>
                  </div>
                </>
              )}

              {/* CATEGORY 2: CUPCAKES */}
              {activeCategory === "cupcakes" && (
                <>
                  <div className="panel-heading">
                    <span>02</span>
                    <div>
                      <h3>Artisan Cupcake Sets</h3>
                      <p>Starting at $35.00/dozen. Freshly piped swirl frosting with signature toppings.</p>
                    </div>
                  </div>

                  <fieldset>
                    <legend>1. Select Batch Size</legend>
                    <div className="kit-list">
                      {configuracao.cupcakes.map((pack) => {
                        const isSelected = cupcakePackId === pack.id;
                        return (
                          <div
                            key={pack.id}
                            className={`kit-card ${isSelected ? "active" : ""}`}
                            onClick={() => setCupcakePackId(pack.id)}
                            role="radio"
                            aria-checked={isSelected}
                          >
                            <div className="bento-info">
                              <div
                                className="bento-thumb-container"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setModalImage({ src: pack.imagem, alt: pack.nome, title: pack.nome });
                                }}
                              >
                                <img src={pack.imagem} alt={pack.nome} width={64} height={64} />
                                <span className="zoom-badge">🔍</span>
                              </div>
                              <div className="bento-text">
                                <strong className="bento-title">{pack.nome}</strong>
                                <small className="bento-detail">{pack.detalhe}</small>
                              </div>
                            </div>
                            <div className="bento-right">
                              <b className="bento-price">{formatCurrency(pack.preco)}</b>
                              <span className={`radio ${isSelected ? "selected" : ""}`} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </fieldset>

                  <div className="form-grid">
                    <label>
                      2. Primary Flavor
                      <select value={cupcakeFlavor} onChange={(e) => setCupcakeFlavor(e.target.value)}>
                        {configuracao.saboresCupcake.map((flavor) => (
                          <option key={flavor} value={flavor}>{flavor}</option>
                        ))}
                      </select>
                    </label>

                    <label>
                      Second Flavor <small>(available for 2+ dozen orders)</small>
                      <select value={cupcakeFlavor2} onChange={(e) => setCupcakeFlavor2(e.target.value)}>
                        <option value="">None (All same flavor)</option>
                        {configuracao.saboresCupcake
                          .filter((f) => f !== cupcakeFlavor)
                          .map((f) => (
                            <option key={f} value={f}>{f}</option>
                          ))}
                      </select>
                    </label>
                  </div>

                  <fieldset>
                    <legend>3. Cupcake Decorations <small>(optional)</small></legend>
                    <div className="extras-options">
                      <button
                        type="button"
                        className={cupcakeFondantDiscs ? "selected" : ""}
                        onClick={() => setCupcakeFondantDiscs(!cupcakeFondantDiscs)}
                      >
                        <span className="check">✓</span>
                        <span>
                          <strong>Custom Fondant Disc Toppers</strong>
                          <small>+ $10.00 / dozen (Themed text, initials or ages)</small>
                        </span>
                      </button>
                    </div>
                  </fieldset>
                </>
              )}

              {/* CATEGORY 3: BROWNIES & BARS */}
              {activeCategory === "brownies" && (
                <>
                  <div className="panel-heading">
                    <span>03</span>
                    <div>
                      <h3>Brownies & Artisan Bars</h3>
                      <p>Starting at $30.00/batch. Rich, decadent fudge brownies and dessert bars baked fresh to order.</p>
                    </div>
                  </div>

                  <fieldset>
                    <legend>1. Select Batch Size</legend>
                    <div className="kit-list">
                      {configuracao.brownies.map((pack) => {
                        const isSelected = browniePackId === pack.id;
                        return (
                          <div
                            key={pack.id}
                            className={`kit-card ${isSelected ? "active" : ""}`}
                            onClick={() => setBrowniePackId(pack.id)}
                            role="radio"
                            aria-checked={isSelected}
                          >
                            <div className="bento-info">
                              <div
                                className="bento-thumb-container"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setModalImage({ src: pack.imagem, alt: pack.nome, title: pack.nome });
                                }}
                              >
                                <img src={pack.imagem} alt={pack.nome} width={64} height={64} />
                                <span className="zoom-badge">🔍</span>
                              </div>
                              <div className="bento-text">
                                <strong className="bento-title">{pack.nome}</strong>
                                <small className="bento-detail">{pack.detalhe}</small>
                              </div>
                            </div>
                            <div className="bento-right">
                              <b className="bento-price">{formatCurrency(pack.preco)}</b>
                              <span className={`radio ${isSelected ? "selected" : ""}`} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </fieldset>

                  <div className="form-grid">
                    <label>
                      2. Flavor Variety
                      <select value={brownieFlavor} onChange={(e) => setBrownieFlavor(e.target.value)}>
                        {configuracao.saboresBrownies.map((flavor) => (
                          <option key={flavor} value={flavor}>{flavor}</option>
                        ))}
                      </select>
                    </label>

                    <label>
                      Second Variety <small>(for Full Batch tray orders)</small>
                      <select value={brownieFlavor2} onChange={(e) => setBrownieFlavor2(e.target.value)}>
                        <option value="">None (Single variety)</option>
                        {configuracao.saboresBrownies
                          .filter((f) => f !== brownieFlavor)
                          .map((f) => (
                            <option key={f} value={f}>{f}</option>
                          ))}
                      </select>
                    </label>
                  </div>
                </>
              )}

              {/* CATEGORY 4: CAKESICLES */}
              {activeCategory === "cakesicles" && (
                <>
                  <div className="panel-heading">
                    <span>04</span>
                    <div>
                      <h3>Artisan Cakesicles</h3>
                      <p>Starting at $40.00/dozen. Gourmet cake popsicles dipped in Belgian chocolate with decorative details.</p>
                    </div>
                  </div>

                  <fieldset>
                    <legend>1. Select Batch Quantity</legend>
                    <div className="kit-list">
                      {configuracao.cakesicles.map((pack) => {
                        const isSelected = cakesiclePackId === pack.id;
                        return (
                          <div
                            key={pack.id}
                            className={`kit-card ${isSelected ? "active" : ""}`}
                            onClick={() => setCakesiclePackId(pack.id)}
                            role="radio"
                            aria-checked={isSelected}
                          >
                            <div className="bento-info">
                              <div
                                className="bento-thumb-container"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setModalImage({ src: pack.imagem, alt: pack.nome, title: pack.nome });
                                }}
                              >
                                <img src={pack.imagem} alt={pack.nome} width={64} height={64} />
                                <span className="zoom-badge">🔍</span>
                              </div>
                              <div className="bento-text">
                                <strong className="bento-title">{pack.nome}</strong>
                                <small className="bento-detail">{pack.detalhe}</small>
                              </div>
                            </div>
                            <div className="bento-right">
                              <b className="bento-price">{formatCurrency(pack.preco)}</b>
                              <span className={`radio ${isSelected ? "selected" : ""}`} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </fieldset>

                  <div className="form-grid">
                    <label>
                      2. Design & Finishing Style
                      <select value={cakesicleStyle} onChange={(e) => setCakesicleStyle(e.target.value)}>
                        {configuracao.estilosCakesicles.map((style) => (
                          <option key={style} value={style}>{style}</option>
                        ))}
                      </select>
                    </label>

                    <label>
                      3. Cake Base Flavor
                      <select value={cakesicleFlavor} onChange={(e) => setCakesicleFlavor(e.target.value)}>
                        <option value="Signature Vanilla">Signature Vanilla</option>
                        <option value="Double Chocolate Fudge">Double Chocolate Fudge</option>
                        <option value="Red Velvet">Red Velvet</option>
                        <option value="Funfetti Birthday Cake">Funfetti Birthday Cake</option>
                      </select>
                    </label>
                  </div>
                </>
              )}

              {/* CATEGORY 5: DESSERT CUPS & MINI TREATS */}
              {activeCategory === "cups" && (
                <>
                  <div className="panel-heading">
                    <span>05</span>
                    <div>
                      <h3>Dessert Cups & Mini Treats</h3>
                      <p>Starting at $45.00. Individual gourmet shooters in clear cups with mini spoons. Perfect for dessert tables!</p>
                    </div>
                  </div>

                  <fieldset>
                    <legend>1. Select Quantity</legend>
                    <div className="finish-options three">
                      {([12, 24, 36] as const).map((cnt) => (
                        <button
                          key={cnt}
                          type="button"
                          className={cupCount === cnt ? "selected" : ""}
                          onClick={() => setCupCount(cnt)}
                        >
                          <strong>{cnt} Dessert Cups</strong>
                          <small>{formatCurrency(configuracao.dessertCups.precos[cnt])}</small>
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <div className="form-grid">
                    <label>
                      2. Primary Flavor
                      <select value={cupFlavor} onChange={(e) => setCupFlavor(e.target.value)}>
                        {configuracao.dessertCups.sabores.map((flavor) => (
                          <option key={flavor} value={flavor}>{flavor}</option>
                        ))}
                      </select>
                    </label>

                    <label>
                      Second Flavor <small>(for 24 or 36 cup orders)</small>
                      <select value={cupFlavor2} onChange={(e) => setCupFlavor2(e.target.value)}>
                        <option value="">None (All same flavor)</option>
                        {configuracao.dessertCups.sabores
                          .filter((f) => f !== cupFlavor)
                          .map((f) => (
                            <option key={f} value={f}>{f}</option>
                          ))}
                      </select>
                    </label>
                  </div>
                </>
              )}

              {/* CATEGORY 6: THEMED & PERSONALIZED DESSERTS */}
              {activeCategory === "treats" && (
                <>
                  <div className="panel-heading">
                    <span>06</span>
                    <div>
                      <h3>Themed & Personalized Desserts</h3>
                      <p>Starting at $50.00. Individually crafted sugar cookies, cake pops, macarons, and specialty treats for your event.</p>
                    </div>
                  </div>

                  <div className="personalizados-list">
                    {configuracao.docesPersonalizados.map((item) => {
                      const itemInCart = cartItems.find((it) => it.title === item.nome);
                      const qty = itemInCart?.quantity ?? 0;
                      return (
                        <article
                          key={item.id}
                          className={`personalizado-card ${qty > 0 || treatId === item.id ? "active" : ""}`}
                          onClick={() => setTreatId(item.id)}
                        >
                          <div className="personalizado-info">
                            <div
                              className="bento-thumb-container"
                              onClick={() => setModalImage({ src: item.imagem, alt: item.nome, title: item.nome })}
                              title="Click to view full photo"
                            >
                              <img src={item.imagem} alt={item.nome} width={64} height={64} loading="lazy" />
                              <span className="zoom-badge">🔍</span>
                            </div>
                            <div className="personalizado-text">
                              <strong className="personalizado-title">{item.nome}</strong>
                              <span className="personalizado-price">
                                {formatCurrency(item.preco)} <small>each / batch</small>
                              </span>
                            </div>
                          </div>

                          <div className="personalizado-qty">
                            <button
                              type="button"
                              className="qty-btn"
                              onClick={() => handleStepperChange(item, -1)}
                              disabled={qty === 0}
                              aria-label={`Decrease quantity of ${item.nome}`}
                            >
                              －
                            </button>
                            <span className="qty-value" aria-live="polite">
                              {qty}
                            </span>
                            <button
                              type="button"
                              className="qty-btn add"
                              onClick={() => handleStepperChange(item, 1)}
                              aria-label={`Increase quantity of ${item.nome}`}
                            >
                              ＋
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                  <p className="personalizados-hint">
                    Use the ＋ and － controls above to adjust treat quantities directly into your order summary.
                  </p>
                </>
              )}

              {/* Add to order row for categories 1 to 5 */}
              {activeCategory !== "treats" && (
                <div className="add-row">
                  <label>
                    Quantity
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Math.min(20, Number(e.target.value) || 1)))}
                    />
                  </label>
                  <button className="button primary add-button" onClick={handleAddToCart}>
                    Add to Order <span>＋</span>
                  </button>
                </div>
              )}

              {userNotice && (
                <p className="notice" role="status">
                  {userNotice}
                </p>
              )}
            </div>
          </div>

          {/* ----------------- ORDER SUMMARY / CHECKOUT ASIDE ----------------- */}
          <aside className="order-summary" id="checkout-section">
            <div className="summary-head">
              <span>Your Order</span>
              <b>
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
              </b>
            </div>

            {cartItems.length === 0 ? (
              <div className="empty-cart">
                <span>♡</span>
                <p>Your order is currently empty.</p>
                <small>Select a dessert category to begin customizing.</small>
              </div>
            ) : (
              <div className="cart-list">
                {cartItems.map((item) => (
                  <article key={item.id}>
                    <div>
                      <strong>
                        {item.quantity}× {item.title}
                      </strong>
                      <small>{item.description}</small>
                    </div>
                    <span>{formatCurrency(item.total)}</span>
                    <button
                      className="cart-remove-btn"
                      onClick={() => setCartItems((curr) => curr.filter((c) => c.id !== item.id))}
                      aria-label={`Remove ${item.title}`}
                    >
                      ✕ Remove
                    </button>
                  </article>
                ))}
              </div>
            )}

            {/* Totals & 50% Deposit Split Card */}
            <div className="totals-card">
              <div className="totals-header">
                <div>
                  <span className="totals-title">Estimated Total</span>
                  <small className="totals-subtitle">Based on selected dessert items</small>
                </div>
                <strong className="totals-amount">{formatCurrency(cartTotal)}</strong>
              </div>

              <div className="payment-split-grid">
                <div className="split-pill split-deposit">
                  <div className="split-badge-row">
                    <span className="split-badge deposit-badge">50% Deposit</span>
                    <span className="split-tag">To Reserve</span>
                  </div>
                  <strong className="split-value">{formatCurrency(cartTotal / 2)}</strong>
                  <p className="split-caption">Payable to secure your event date</p>
                </div>

                <div className="split-pill split-delivery">
                  <div className="split-badge-row">
                    <span className="split-badge delivery-badge">Remaining 50%</span>
                    <span className="split-tag">Upon Delivery</span>
                  </div>
                  <strong className="split-value">{formatCurrency(cartTotal / 2)}</strong>
                  <p className="split-caption">Due at pickup or delivery</p>
                </div>
              </div>
            </div>

            {/* Customer Details Form */}
            <div className="customer-fields">
              <h3>Order Details</h3>

              <label>
                Client Name
                <input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </label>

              <div className="form-grid">
                <label>
                  Event / Delivery Date <small>(min. {configuracao.diasAntecedenciaMinima} days)</small>
                  <input
                    type="date"
                    min={getMinOrderDate()}
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    required
                  />
                </label>

                <label>
                  Preferred Time
                  <input
                    type="time"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    required
                  />
                </label>
              </div>

              <label>
                Occasion or Theme <small>(e.g. Birthday, Baby Shower, Roses & Gold)</small>
                <input
                  value={eventOccasion}
                  onChange={(e) => setEventOccasion(e.target.value)}
                  placeholder="e.g. 1st Birthday, Winnie the Pooh, 10th Anniversary"
                />
              </label>

              <label>
                Design Requests, Color Palette & Dietary Notes <small>(optional)</small>
                <textarea
                  rows={3}
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="Specify custom wording, color scheme, dietary allergies, or delivery address..."
                />
              </label>
            </div>

            {/* WhatsApp Conversion CTA */}
            <button className="whatsapp-button" onClick={handleSendWhatsApp}>
              <span>💬</span>
              <span>
                <strong>Send Order via WhatsApp</strong>
                <small>{configuracao.marca.whatsappExibicao} · Direct to Narmatha</small>
              </span>
              <b>→</b>
            </button>

            <p className="confirmation-note">
              Orders are reviewed and confirmed by Home Treats LLC upon receiving your order details and 50% reservation deposit.
            </p>
          </aside>
        </div>
      </section>

      {/* ----------------- BANNER SECTION ----------------- */}
      <section className="payment-banner">
        <span className="big-heart">♡</span>
        <div>
          <p className="eyebrow">Seamless Experience</p>
          <h2>
            50% to reserve.<br />
            <em>50% on delivery.</em>
          </h2>
          <p>
            When you complete your selection, your full order specification is sent directly to Narmatha via WhatsApp, ensuring prompt personal attention and custom consultation for your celebration.
          </p>
        </div>
        <a className="button light" href="#build-order">
          Start Your Order →
        </a>
      </section>

      {/* ----------------- FOOTER ----------------- */}
      <footer>
        <a className="footer-brand" href="#top">
          <img src={configuracao.marca.logo} alt="Home Treats Logo" />
          <span>
            <strong>
              Home Treats<span>by Narmatha</span>
            </strong>
            <small>{configuracao.marca.tagline}</small>
          </span>
        </a>
        <p>Serving Frisco, Plano, McKinney, Allen & surrounding Texas areas.</p>
        <a
          href={`https://wa.me/${configuracao.marca.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {configuracao.marca.whatsappExibicao}
        </a>
      </footer>

      {/* ----------------- LIGHTBOX MODAL ----------------- */}
      {modalImage && (
        <div
          className="lightbox-overlay"
          onClick={() => setModalImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Enlarged photo: ${modalImage.title}`}
        >
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="lightbox-close"
              onClick={() => setModalImage(null)}
              aria-label="Close enlarged photo"
            >
              ✕
            </button>
            <div className="lightbox-image-box">
              <img
                src={modalImage.src}
                alt={modalImage.alt}
                className="lightbox-img"
              />
              <div className="lightbox-caption">
                <h4>{modalImage.title}</h4>
                <p>Press ESC or click anywhere outside to close</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
