"use client";

import { useMemo, useState } from "react";
import { configuracao, type DocePersonalizadoId, type TamanhoId, type TipoDocinho } from "./configuracao";

type Categoria = "bento" | "bolo" | "kit" | "docinhos" | "personalizados";

type ItemPedido = {
  id: string;
  titulo: string;
  descricao: string;
  quantidade: number;
  unitario: number;
  total: number;
};

const categorias: { id: Categoria; numero: string; nome: string; resumo: string }[] = [
  { id: "bento", numero: "01", nome: "Bentô Cakes", resumo: "Pequenos no tamanho, enormes no carinho" },
  { id: "bolo", numero: "02", nome: "Bolos", resumo: "Monte cada detalhe do seu bolo" },
  { id: "kit", numero: "03", nome: "Kit Festa", resumo: "A comemoração completa em um pedido" },
  { id: "docinhos", numero: "04", nome: "Docinhos", resumo: "Tradicionais e gourmet" },
  { id: "personalizados", numero: "05", nome: "Doces Personalizados", resumo: "Unidades decoradas do seu jeito" },
];

const acabamentos = ["Naked", "Chantininho", "Buttercream"] as const;

function moeda(valor: number) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function hoje() {
  const agora = new Date();
  agora.setMinutes(agora.getMinutes() - agora.getTimezoneOffset());
  return agora.toISOString().slice(0, 10);
}

export default function Home() {
  const [categoria, setCategoria] = useState<Categoria>("bento");
  const [quantidade, setQuantidade] = useState(1);
  const [bentoId, setBentoId] = useState<string>(configuracao.bento[0].id);
  const [kitId, setKitId] = useState<string>(configuracao.kits[0].id);
  const [tamanhoId, setTamanhoId] = useState<TamanhoId>("pp");
  const [acabamento, setAcabamento] = useState<(typeof acabamentos)[number]>("Chantininho");
  const [massa, setMassa] = useState<string>(configuracao.massas[0]);
  const [recheio, setRecheio] = useState<string>(configuracao.recheios[0]);
  const [recheio2, setRecheio2] = useState("");
  const [adicionais, setAdicionais] = useState<string[]>([]);
  const [tipoDocinho, setTipoDocinho] = useState<TipoDocinho>("tradicionais");
  const [qtdDocinhos, setQtdDocinhos] = useState<25 | 50 | 100>(25);
  const [saborDocinho, setSaborDocinho] = useState<string>(configuracao.docinhos.tradicionais.sabores[0]);
  const [docePersonalizadoId, setDocePersonalizadoId] = useState<DocePersonalizadoId>(configuracao.docesPersonalizados[0].id);
  const [itens, setItens] = useState<ItemPedido[]>([]);
  const [nome, setNome] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [ocasiao, setOcasiao] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [aviso, setAviso] = useState("");

  const tamanho = configuracao.bolos.find((item) => item.id === tamanhoId)!;
  const precoBaseBolo = acabamento === "Naked" ? tamanho.naked : tamanho.decorado;
  const valorAdicionais = configuracao.adicionais
    .filter((item) => adicionais.includes(item.nome))
    .reduce((total, item) => total + (item.precos[tamanhoId] ?? 0), 0);
  const precoBolo = precoBaseBolo + valorAdicionais;
  const total = useMemo(() => itens.reduce((soma, item) => soma + item.total, 0), [itens]);

  function trocarCategoria(nova: Categoria) {
    setCategoria(nova);
    setQuantidade(1);
    setAviso("");
  }

  function alternarAdicional(nomeAdicional: string) {
    setAdicionais((atuais) =>
      atuais.includes(nomeAdicional)
        ? atuais.filter((item) => item !== nomeAdicional)
        : [...atuais, nomeAdicional],
    );
  }

  function criarItem(): ItemPedido {
    const id = `${categoria}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

    if (categoria === "bento") {
      const produto = configuracao.bento.find((item) => item.id === bentoId)!;
      return { id, titulo: produto.nome, descricao: produto.detalhe, quantidade, unitario: produto.preco, total: produto.preco * quantidade };
    }

    if (categoria === "kit") {
      const produto = configuracao.kits.find((item) => item.id === kitId)!;
      return { id, titulo: produto.nome, descricao: produto.detalhe, quantidade, unitario: produto.preco, total: produto.preco * quantidade };
    }

    if (categoria === "docinhos") {
      const linha = configuracao.docinhos[tipoDocinho];
      const preco = linha.precos[qtdDocinhos];
      return {
        id,
        titulo: `Docinhos ${linha.nome} — ${qtdDocinhos} un`,
        descricao: `Sabor: ${saborDocinho}`,
        quantidade,
        unitario: preco,
        total: preco * quantidade,
      };
    }

    if (categoria === "personalizados") {
      const produto = configuracao.docesPersonalizados.find((item) => item.id === docePersonalizadoId)!;
      return {
        id,
        titulo: produto.nome,
        descricao: "Doce personalizado por unidade",
        quantidade,
        unitario: produto.preco,
        total: produto.preco * quantidade,
      };
    }

    const extras = adicionais.length ? ` · Adicionais: ${adicionais.join(", ")}` : "";
    const segundo = recheio2 ? ` + ${recheio2}` : "";
    return {
      id,
      titulo: `Bolo ${tamanho.tamanho} — ${tamanho.diametro}`,
      descricao: `${tamanho.fatias} · ${acabamento} · Massa ${massa} · Recheio ${recheio}${segundo}${extras}`,
      quantidade,
      unitario: precoBolo,
      total: precoBolo * quantidade,
    };
  }

  function adicionar() {
    const item = criarItem();
    setItens((atuais) => [...atuais, item]);
    setAviso(`${item.titulo} foi adicionado ao pedido.`);
    window.setTimeout(() => setAviso(""), 3200);
  }

  function alterarQtdPersonalizado(produto: (typeof configuracao.docesPersonalizados)[number], delta: number) {
    setItens((atuais) => {
      const index = atuais.findIndex((it) => it.titulo === produto.nome);
      if (index === -1) {
        if (delta <= 0) return atuais;
        const novoItem: ItemPedido = {
          id: `personalizado-${produto.id}-${Date.now()}`,
          titulo: produto.nome,
          descricao: "Doce personalizado por unidade",
          quantidade: delta,
          unitario: produto.preco,
          total: produto.preco * delta,
        };
        setAviso(`${produto.nome} foi adicionado ao pedido.`);
        window.setTimeout(() => setAviso(""), 3200);
        return [...atuais, novoItem];
      }

      const itemAtual = atuais[index];
      const novaQtd = itemAtual.quantidade + delta;

      if (novaQtd <= 0) {
        setAviso(`${produto.nome} foi removido do pedido.`);
        window.setTimeout(() => setAviso(""), 3200);
        return atuais.filter((_, i) => i !== index);
      }

      const atualizado: ItemPedido = {
        ...itemAtual,
        quantidade: novaQtd,
        total: itemAtual.unitario * novaQtd,
      };

      const novos = [...atuais];
      novos[index] = atualizado;
      return novos;
    });
  }

  function mudarTipoDocinho(tipo: TipoDocinho) {
    setTipoDocinho(tipo);
    setSaborDocinho(configuracao.docinhos[tipo].sabores[0]);
  }

  function enviarWhatsApp() {
    if (!itens.length) {
      setAviso("Adicione pelo menos um item ao pedido.");
      document.querySelector("#monte-seu-pedido")?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (!nome.trim() || !data || !horario) {
      setAviso("Preencha seu nome, a data e o horário desejados.");
      document.querySelector("#finalizar")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    const linhas = itens.flatMap((item, index) => [
      `*${index + 1}. ${item.titulo}*`,
      item.descricao,
      `Quantidade: ${item.quantidade} · ${moeda(item.total)}`,
      "",
    ]);
    const sinal = total / 2;
    const mensagem = [
      "*NOVO PEDIDO — GLSCAKES* 🎂",
      "",
      `*Cliente:* ${nome.trim()}`,
      `*Data desejada:* ${new Date(`${data}T12:00:00`).toLocaleDateString("pt-BR")}`,
      `*Horário:* ${horario}`,
      ocasiao.trim() ? `*Ocasião/tema:* ${ocasiao.trim()}` : "",
      "",
      "*ITENS DO PEDIDO*",
      ...linhas,
      `*TOTAL ESTIMADO: ${moeda(total)}*`,
      `*Sinal via Pix (50%): ${moeda(sinal)}*`,
      `*Saldo na entrega (50%): ${moeda(sinal)}*`,
      "",
      observacoes.trim() ? `*Observações:* ${observacoes.trim()}` : "",
      "",
      "Entendo que a encomenda será confirmada após o pagamento do sinal de 50%.",
    ].filter(Boolean).join("\n");

    window.open(`https://wa.me/${configuracao.marca.whatsapp}?text=${encodeURIComponent(mensagem)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="Glscakes — início">
          <img src={configuracao.marca.logo} alt="Logo Glscakes" />
          <span><strong>Glscakes</strong><small>Confeitaria artesanal</small></span>
        </a>
        <a className="top-whatsapp" href={`https://wa.me/${configuracao.marca.whatsapp}`} target="_blank" rel="noreferrer">Falar no WhatsApp</a>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-copy">
          <p className="eyebrow">Feito à mão no Rio de Janeiro</p>
          <h1>Doces momentos,<br /><em>feitos para você.</em></h1>
          <p className="hero-text">Bentôs, bolos personalizados, kits festa e docinhos preparados com carinho para deixar sua celebração ainda mais especial.</p>
          <div className="hero-actions">
            <a className="button primary" href="#monte-seu-pedido">Montar meu pedido <span>→</span></a>
            <a className="button ghost" href="#cardapio">Ver cardápio</a>
          </div>
          <div className="payment-pill"><span>◆</span><p><strong>Reserva com 50% via Pix</strong><small>Os outros 50% são pagos na entrega</small></p></div>
        </div>
        <div className="hero-gallery" aria-label="Produtos Glscakes">
          <figure className="hero-photo hero-photo-main"><img src="/glscakes/bolo-personalizado.png" alt="Bolo personalizado Glscakes com tema Homem-Aranha" /></figure>
          <figure className="hero-photo hero-photo-small"><img src="/glscakes/bento.png" alt="Bentô cake personalizado Glscakes" /></figure>
          <span className="hero-seal">feito com<br /><strong>amor</strong> ♡</span>
        </div>
      </section>

      <section className="catalog-intro" id="cardapio">
        <div><p className="eyebrow">Nosso cardápio</p><h2>Escolha o doce<br />do seu momento</h2></div>
        <p>Produtos artesanais, montados do seu jeito. Escolha uma categoria e personalize seu pedido em poucos passos.</p>
      </section>

      <section className="showcase-grid">
        <article className="showcase-card showcase-bento"><div><span>01</span><h3>Bentô Cakes</h3><p>A partir de <strong>R$ 45</strong></p></div><img src="/glscakes/bento.png" alt="Bentô cake branco decorado" /></article>
        <article className="showcase-card showcase-cake"><div><span>02</span><h3>Bolos</h3><p>A partir de <strong>R$ 160</strong></p></div><img src="/glscakes/bolo-personalizado.png" alt="Bolo personalizado em dois andares" /></article>
        <article className="showcase-card showcase-sweets"><div><span>03</span><h3>Docinhos</h3><p>A partir de <strong>R$ 50</strong></p></div><img src="/glscakes/docinhos.png" alt="Caixas com docinhos Glscakes" /></article>
      </section>

      <section className="builder-section" id="monte-seu-pedido">
        <div className="section-title"><p className="eyebrow">Do seu jeito</p><h2>Monte seu pedido</h2><p>Escolha a categoria, personalize e adicione quantos itens quiser.</p></div>

        <div className="builder-layout">
          <div className="builder-card">
            <nav className="category-tabs" aria-label="Categorias do cardápio">
              {categorias.map((item) => (
                <button key={item.id} className={categoria === item.id ? "active" : ""} onClick={() => trocarCategoria(item.id)}>
                  <span>{item.numero}</span><strong>{item.nome}</strong><small>{item.resumo}</small>
                </button>
              ))}
            </nav>

            <div className="config-panel">
              {categoria === "bento" && (
                <>
                  <div className="panel-heading"><span>01</span><div><h3>Escolha seu Bentô</h3><p>Ideal para presentear ou comemorar de um jeito íntimo.</p></div></div>
                  <div className="option-cards">
                    {configuracao.bento.map((item) => (
                      <button key={item.id} className={bentoId === item.id ? "option selected" : "option"} onClick={() => setBentoId(item.id)}>
                        <span className="radio" /><span><strong>{item.nome}</strong><small>{item.detalhe}</small></span><b>{moeda(item.preco)}</b>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {categoria === "bolo" && (
                <>
                  <div className="panel-heading"><span>02</span><div><h3>Monte seu bolo</h3><p>Escolha tamanho, acabamento, massa, recheio e adicionais.</p></div></div>
                  <fieldset><legend>1. Tamanho</legend><div className="size-options">
                    {configuracao.bolos.map((item) => (
                      <button key={item.id} className={tamanhoId === item.id ? "size selected" : "size"} onClick={() => { setTamanhoId(item.id); setAdicionais((atuais) => atuais.filter((nomeExtra) => configuracao.adicionais.find((extra) => extra.nome === nomeExtra)?.precos[item.id] != null)); }}>
                        <strong>{item.tamanho}</strong><span>{item.diametro}</span><small>{item.fatias}</small>
                      </button>
                    ))}
                  </div></fieldset>
                  <fieldset><legend>2. Acabamento</legend><div className="finish-options">
                    {acabamentos.map((item) => <button key={item} className={acabamento === item ? "selected" : ""} onClick={() => setAcabamento(item)}><strong>{item}</strong><small>{moeda(item === "Naked" ? tamanho.naked : tamanho.decorado)}</small></button>)}
                  </div></fieldset>
                  <div className="form-grid">
                    <label>3. Massa<select value={massa} onChange={(e) => setMassa(e.target.value)}>{configuracao.massas.map((item) => <option key={item}>{item}</option>)}</select></label>
                    <label>4. Recheio principal<select value={recheio} onChange={(e) => setRecheio(e.target.value)}>{configuracao.recheios.map((item) => <option key={item}>{item}</option>)}</select></label>
                    <label>Segundo recheio <small>opcional</small><select value={recheio2} onChange={(e) => setRecheio2(e.target.value)}><option value="">Não adicionar</option>{configuracao.recheios.filter((item) => item !== recheio).map((item) => <option key={item}>{item}</option>)}</select></label>
                  </div>
                  <fieldset><legend>5. Adicionais <small>opcional</small></legend><div className="extras-options">
                    {configuracao.adicionais.map((item) => {
                      const preco = item.precos[tamanhoId];
                      const indisponivel = preco == null;
                      return <button key={item.nome} disabled={indisponivel} className={adicionais.includes(item.nome) ? "selected" : ""} onClick={() => alternarAdicional(item.nome)}><span className="check">✓</span><span><strong>{item.nome}</strong><small>{indisponivel ? "Indisponível para GG" : `+ ${moeda(preco)}`}</small></span></button>;
                    })}
                  </div></fieldset>
                  <div className="live-price"><span>Valor deste bolo</span><strong>{moeda(precoBolo)}</strong></div>
                </>
              )}

              {categoria === "kit" && (
                <>
                  <div className="panel-heading"><span>03</span><div><h3>Kit Festa Personalizado</h3><p>Bolo, docinhos e mini cupcakes para sua comemoração.</p></div></div>
                  <div className="option-cards">
                    {configuracao.kits.map((item) => (
                      <button key={item.id} className={kitId === item.id ? "option selected" : "option"} onClick={() => setKitId(item.id)}>
                        <span className="radio" /><span><strong>{item.nome}</strong><small>{item.detalhe}</small></span><b>{moeda(item.preco)}</b>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {categoria === "docinhos" && (
                <>
                  <div className="panel-heading"><span>04</span><div><h3>Docinhos</h3><p>Escolha a linha, a quantidade e o sabor.</p></div></div>
                  <fieldset><legend>1. Linha</legend><div className="finish-options two">
                    {(Object.keys(configuracao.docinhos) as TipoDocinho[]).map((tipo) => <button key={tipo} className={tipoDocinho === tipo ? "selected" : ""} onClick={() => mudarTipoDocinho(tipo)}><strong>{configuracao.docinhos[tipo].nome}</strong><small>a partir de {moeda(configuracao.docinhos[tipo].precos[25])}</small></button>)}
                  </div></fieldset>
                  <fieldset><legend>2. Quantidade</legend><div className="finish-options three">
                    {([25, 50, 100] as const).map((qtd) => <button key={qtd} className={qtdDocinhos === qtd ? "selected" : ""} onClick={() => setQtdDocinhos(qtd)}><strong>{qtd} un</strong><small>{moeda(configuracao.docinhos[tipoDocinho].precos[qtd])}</small></button>)}
                  </div></fieldset>
                  <label>3. Sabor<select value={saborDocinho} onChange={(e) => setSaborDocinho(e.target.value)}>{configuracao.docinhos[tipoDocinho].sabores.map((item) => <option key={item}>{item}</option>)}</select></label>
                </>
              )}

              {categoria === "personalizados" && (
                <>
                  <div className="panel-heading"><span>05</span><div><h3>Doces Personalizados</h3><p>Escolha os itens e informe quantas unidades deseja de cada um.</p></div></div>
                  <div className="personalizados-list">
                    {configuracao.docesPersonalizados.map((item) => {
                      const itemNoCarrinho = itens.find((it) => it.titulo === item.nome);
                      const qtdNoCarrinho = itemNoCarrinho?.quantidade ?? 0;
                      return (
                        <article
                          key={item.id}
                          className={`personalizado-card flex items-center justify-between gap-3 p-3 rounded-2xl border transition-all ${
                            qtdNoCarrinho > 0 ? "active border-[var(--rose)] bg-[#fff5f7]" : "border-[var(--line)] bg-[var(--paper)]"
                          }`}
                        >
                          <div className="personalizado-info flex items-center gap-3 min-w-0 flex-1">
                            <img
                              src={item.imagem}
                              alt={item.nome}
                              className="personalizado-thumb w-16 h-16 rounded-xl object-cover flex-shrink-0 shadow-sm"
                              width={64}
                              height={64}
                              loading="lazy"
                            />
                            <div className="personalizado-text flex flex-col justify-center min-w-0 flex-1">
                              <strong className="personalizado-title text-sm md:text-base font-bold text-[var(--ink)] truncate block">
                                {item.nome}
                              </strong>
                              <span className="personalizado-price text-xs md:text-sm font-semibold text-[var(--rose-dark)]">
                                {moeda(item.preco)} <small className="text-[var(--muted)] font-normal">cada</small>
                              </span>
                            </div>
                          </div>

                          <div className="personalizado-qty flex items-center gap-1.5 flex-shrink-0 whitespace-nowrap">
                            <button
                              type="button"
                              className="qty-btn"
                              onClick={() => alterarQtdPersonalizado(item, -1)}
                              disabled={qtdNoCarrinho === 0}
                              aria-label={`Diminuir quantidade de ${item.nome}`}
                            >
                              －
                            </button>
                            <span className="qty-value font-bold text-sm min-w-[24px] text-center" aria-live="polite">
                              {qtdNoCarrinho}
                            </span>
                            <button
                              type="button"
                              className="qty-btn add"
                              onClick={() => alterarQtdPersonalizado(item, 1)}
                              aria-label={`Aumentar quantidade de ${item.nome}`}
                            >
                              ＋
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                  <p className="personalizados-hint">Use os botões de ＋ e － ao lado de cada doce para montar sua quantidade.</p>
                </>
              )}

              {categoria !== "personalizados" && (
                <div className="add-row">
                  <label>Quantidade<input type="number" min="1" max="20" value={quantidade} onChange={(e) => setQuantidade(Math.max(1, Math.min(20, Number(e.target.value) || 1)))} /></label>
                  <button className="button primary add-button" onClick={adicionar}>Adicionar ao pedido <span>＋</span></button>
                </div>
              )}
              {aviso && <p className="notice" role="status">{aviso}</p>}
            </div>
          </div>

          <aside className="order-summary" id="finalizar">
            <div className="summary-head"><span>Seu pedido</span><b>{itens.length} {itens.length === 1 ? "item" : "itens"}</b></div>
            {itens.length === 0 ? (
              <div className="empty-cart"><span>♡</span><p>Seu pedido está vazio.</p><small>Escolha um produto ao lado para começar.</small></div>
            ) : (
              <div className="cart-list">{itens.map((item) => <article key={item.id}><div><strong>{item.quantidade}× {item.titulo}</strong><small>{item.descricao}</small></div><span>{moeda(item.total)}</span><button onClick={() => setItens((atuais) => atuais.filter((atual) => atual.id !== item.id))} aria-label={`Remover ${item.titulo}`}>remover</button></article>)}</div>
            )}

            <div className="totals">
              <div><span>Total estimado</span><strong>{moeda(total)}</strong></div>
              <p><span>Sinal via Pix · 50%</span><b>{moeda(total / 2)}</b></p>
              <p><span>Na entrega · 50%</span><b>{moeda(total / 2)}</b></p>
            </div>

            <div className="customer-fields">
              <h3>Dados para a encomenda</h3>
              <label>Seu nome<input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Como podemos te chamar?" /></label>
              <div className="form-grid"><label>Data desejada<input type="date" min={hoje()} value={data} onChange={(e) => setData(e.target.value)} /></label><label>Horário<input type="time" value={horario} onChange={(e) => setHorario(e.target.value)} /></label></div>
              <label>Ocasião ou tema <small>opcional</small><input value={ocasiao} onChange={(e) => setOcasiao(e.target.value)} placeholder="Ex.: aniversário, flores rosa..." /></label>
              <label>Observações <small>opcional</small><textarea rows={3} value={observacoes} onChange={(e) => setObservacoes(e.target.value)} placeholder="Escreva detalhes importantes" /></label>
            </div>

            <button className="whatsapp-button" onClick={enviarWhatsApp}><span>◉</span><span><strong>Enviar pedido no WhatsApp</strong><small>{configuracao.marca.whatsappExibicao}</small></span><b>→</b></button>
            <p className="confirmation-note">O pedido será confirmado pela Glscakes após o pagamento do sinal.</p>
          </aside>
        </div>
      </section>

      <section className="payment-banner">
        <span className="big-heart">♡</span><div><p className="eyebrow">Tudo combinado</p><h2>50% para reservar.<br /><em>50% na entrega.</em></h2><p>Ao finalizar, seu pedido chega organizado no WhatsApp com itens, valores e data desejada.</p></div><a className="button light" href="#monte-seu-pedido">Fazer meu pedido →</a>
      </section>

      <footer><a className="footer-brand" href="#inicio"><img src={configuracao.marca.logo} alt="" /><span><strong>Glscakes</strong><small>Confeitaria artesanal</small></span></a><p>Realizando sonhos com amor e doçuras.</p><a href={`https://wa.me/${configuracao.marca.whatsapp}`} target="_blank" rel="noreferrer">{configuracao.marca.whatsappExibicao}</a></footer>
    </main>
  );
}
