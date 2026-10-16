
/* by FN — FUNCIONALIDADES AUTOMÁTICAS
   Produtos e coleções são carregados exclusivamente do Google Sheets.
*/

(() => {
  'use strict';

  let data = window.BYFN;
  const app = document.querySelector('#app');

  if (!data) {
    app.textContent = 'Não foi possível carregar conteudo.js.';
    return;
  }

  const escapeHTML = value =>
    String(value ?? '').replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[char]));

  const allowedUrl = (value, local = false) => {
    if (!value || typeof value !== 'string') return '';

    try {
      const url = new URL(value, location.href);

      if (!['http:', 'https:'].includes(url.protocol)) return '';
      if (!local && !/^https?:\/\//i.test(value.trim())) return '';

      return escapeHTML(
        local && !/^https?:\/\//i.test(value.trim())
          ? value.trim()
          : url.href
      );
    } catch {
      return '';
    }
  };

  const picture = (path, alt = 'Produto by FN') => {
    const url = allowedUrl(path, true);

    return url
      ? `<img src="${url}" alt="${escapeHTML(alt)}" loading="lazy">`
      : '<div class="image-placeholder">Imagem em breve</div>';
  };

  const price = value =>
    value === null ||
    value === undefined ||
    value === '' ||
    !Number.isFinite(Number(value))
      ? 'Consultar na Shopee'
      : Number(value).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        });

  const all = () =>
    [...(data.produtos || [])]
      .filter(p => p.disponivel !== false)
      .sort((a, b) => (a.ordem ?? 999) - (b.ordem ?? 999));

  const button = (url, label, outline = false) => {
    const href = allowedUrl(url);

    return href
      ? `<a class="btn${outline ? ' outline' : ''}"
           href="${href}"
           target="_blank"
           rel="noopener noreferrer">
           ${escapeHTML(label)}
         </a>`
      : '';
  };

  const whatsapp = () => {
    const n = String(data.redes.whatsapp || '').replace(/\D/g, '');

    return n
      ? `https://wa.me/${n}?text=${encodeURIComponent(
          'Olá! Gostaria de falar com a equipe da by FN.'
        )}`
      : '';
  };

  const collections = () =>
    [...(data.colecoes || [])]
      .filter(c => c.ativa !== false && c.id && c.nome)
      .sort((a, b) => (a.ordem ?? 999) - (b.ordem ?? 999));

  const collectionById = id =>
    collections().find(c => c.id === id);

  const productCollection = p =>
    collectionById(p.colecao);

  const collectionName = p =>
    productCollection(p)?.nome || 'Outros';

  const productsIn = id =>
    all().filter(p => p.colecao === id);

  // COLEÇÕES

  function collectionsSection() {
    const list = collections();

    if (!list.length) return '';

    return `
      <section class="section collection-section">
        <div class="wrap">
          <div class="section-title">
            <div>
              <span class="eyebrow">EXPLORE A BY FN</span>
              <h2>Nossas coleções.</h2>
            </div>
            <a class="underlink" href="#/produtos">
              Ver todos os produtos
            </a>
          </div>

          <div class="collection-grid">
            ${list.map(c => `
              <a class="collection-card"
                 href="#/colecao/${encodeURIComponent(c.id)}">

                <div class="collection-image">
                  ${picture(c.imagem, c.nome)}
                </div>

                <div class="collection-info">
                  <div>
                    <h3>${escapeHTML(c.nome)}</h3>
                    <p>${escapeHTML(c.descricao || '')}</p>
                  </div>
                </div>
              </a>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }

  // PRODUTOS

  function card(p) {
    return `
      <a class="card"
         href="#/produto/${encodeURIComponent(p.id)}">

        <div class="product-img">
          ${picture(p.imagens?.[0], p.nome)}

          ${p.destaque
            ? '<span class="chip">Destaque</span>'
            : ''}
        </div>

        <div class="card-foot">
          <div>
            <h3>${escapeHTML(p.nome)}</h3>
            <small>${escapeHTML(collectionName(p))}</small>
          </div>

          <span class="price">
            ${price(p.preco)}
          </span>
        </div>
      </a>
    `;
  }

  const grid = items =>
    items.length
      ? items.map(card).join('')
      : '<p class="empty">Nenhum produto encontrado.</p>';

  // SOBRE A MARCA

  function aboutSection(brief = true) {
    const s = data.sobre;

    return `
      <section class="section">
        <div class="wrap about-grid">

          <div class="about-photo">
            ${picture(
              data.marca.imagemSobre,
              'Sobre a by FN'
            )}
          </div>

          <div class="about-copy">
            <span class="eyebrow">
              ${escapeHTML(s.etiqueta)}
            </span>

            <h2>${escapeHTML(s.titulo)}</h2>

            <p>${escapeHTML(s.texto1)}</p>
            <p>${escapeHTML(s.texto2)}</p>

            ${brief
              ? `<a class="btn outline" href="#/sobre">
                   Conheça nossa história
                 </a>`
              : `<p>${escapeHTML(s.texto3)}</p>`
            }
          </div>
        </div>
      </section>
    `;
  }

  function benefits() {
  return `
    <section class="wrap">
      <div class="benefits">
        ${(data.diferenciais || []).map(x => `
          <div class="benefit">
            <h3>${escapeHTML(x.titulo)}</h3>
            <p>${escapeHTML(x.texto)}</p>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

  // INSTAGRAM

  function social() {
    return `
      <section class="social-banner">
        <div class="wrap social-layout">

          <div>
            <span class="eyebrow">
              ${escapeHTML(
                data.instagram?.etiqueta ||
                'ACOMPANHE A BY FN'
              )}
            </span>

            <h2>
              ${escapeHTML(
                data.instagram?.titulo ||
                'Inspiração em cada detalhe.'
              )}
            </h2>

            <p>
              ${escapeHTML(data.instagram?.descricao || '')}
            </p>

            ${button(
              data.redes.instagram,
              'Seguir ' + (
                data.redes.usuarioInstagram || 'a by FN'
              )
            )}
          </div>

          <div class="social-icon">◎</div>
        </div>
      </section>
    `;
  }

  // PÁGINA INICIAL
  // Seção "NOSSO OLHAR" removida.

  function home() {
    const items = all();
    const feat = items.filter(p => p.destaque);
    const selected = (feat.length ? feat : items).slice(0, 6);

    return `
      <section class="hero wrap">

        <div class="hero-copy">
          <span class="eyebrow">
            ${escapeHTML(data.inicio.etiqueta)}
          </span>

          <h1>${escapeHTML(data.inicio.titulo)}</h1>

          <p>${escapeHTML(data.inicio.subtitulo)}</p>

          <a href="#/produtos" class="btn">
            ${escapeHTML(
              data.inicio.botao || 'Explorar coleção'
            )}
          </a>
        </div>

        <div class="hero-media">
          ${picture(
            data.marca.imagemPrincipal,
            'Design by FN'
          )}
        </div>
      </section>

      ${collectionsSection()}

      <section class="section featured-section">
        <div class="wrap">

          <div class="section-title">
            <div>
              <span class="eyebrow">SELEÇÃO BY FN</span>
              <h2>Peças em destaque.</h2>
            </div>

            <a href="#/produtos" class="underlink">
              Explorar coleção
            </a>
          </div>

          <div class="grid">
            ${grid(selected)}
          </div>
        </div>
      </section>

      ${aboutSection()}
      ${benefits()}

      <div class="section-spacer"></div>

      ${social()}
    `;
  }

  // CATÁLOGO

  let selectedCollection = 'Todos';

  function catalog(initialCollection = 'Todos') {
    selectedCollection = initialCollection;

    const list = collections();
    const current = collectionById(initialCollection);

    return `
      <div class="wrap">
        <div class="page-title">

          <span class="eyebrow">
            ${escapeHTML(
              current
                ? 'COLEÇÃO BY FN'
                : data.catalogo?.etiqueta || 'COLEÇÕES BY FN'
            )}
          </span>

          <h1>
            ${escapeHTML(
              current?.nome ||
              data.catalogo?.titulo ||
              'Nossas coleções'
            )}
          </h1>

          <p>
            ${escapeHTML(
              current?.descricao ||
              data.catalogo?.descricao ||
              ''
            )}
          </p>
        </div>

        <section class="catalog-body">
          <div class="filters">

            <div class="filter-list">
              <button
                class="filter ${initialCollection === 'Todos' ? 'active' : ''}"
                data-collection="Todos">
                Todos
              </button>

              ${list.map(c => `
                <button
                  class="filter ${initialCollection === c.id ? 'active' : ''}"
                  data-collection="${escapeHTML(c.id)}">
                  ${escapeHTML(c.nome)}
                </button>
              `).join('')}
            </div>

            <input
              class="search"
              id="search"
              type="search"
              placeholder="Buscar produtos..."
              aria-label="Buscar produtos">
          </div>

          <div class="grid" id="catalogGrid"></div>
        </section>
      </div>
    `;
  }

  function filterCatalog() {
    const el = document.querySelector('#catalogGrid');
    if (!el) return;

    const term = (
      document.querySelector('#search')?.value || ''
    ).toLocaleLowerCase('pt-BR').trim();

    const matching = all().filter(p =>
      (selectedCollection === 'Todos' ||
       p.colecao === selectedCollection) &&

      [
        p.nome,
        collectionName(p),
        p.descricaoCurta,
        p.descricao
      ].join(' ').toLocaleLowerCase('pt-BR').includes(term)
    );

    el.innerHTML = matching.length
      ? grid(matching)
      : `<p class="empty">
          ${term
            ? 'Nenhum produto encontrado.'
            : selectedCollection === 'Todos'
              ? 'Nenhum produto disponível no momento.'
              : 'Novidades em breve nesta coleção.'
          }
        </p>`;
  }

  // DETALHES DO PRODUTO

  function detail(id) {
    const p = all().find(p => p.id === id);

    if (!p) return missing();

    const photos = (
      p.imagens && p.imagens.length
        ? p.imagens
        : [null]
    ).map(path => picture(path, p.nome)).join('');

    return `
      <div class="wrap detail">

        <div>
          <a class="back" href="#/produtos">
            ← Voltar à coleção
          </a>

          <div class="gallery">
            ${photos}
          </div>
        </div>

        <div class="detail-info">
          <span class="eyebrow">
            ${escapeHTML(collectionName(p))}
          </span>

          <h1>${escapeHTML(p.nome)}</h1>

          <div class="detail-price">
            ${price(p.preco)}
          </div>

          <p>
            ${escapeHTML(p.descricao || p.descricaoCurta)}
          </p>

          <div class="actions">
            ${button(p.shopee, 'Comprar na Shopee')}
            ${button(
              p.instagram,
              'Ver vídeo no Instagram',
              true
            )}

            ${!p.shopee
              ? '<p>Link de compra em breve.</p>'
              : ''}
          </div>

          <div class="specs">

            <div class="spec">
              <strong>Material</strong>
              <span>
                ${escapeHTML(p.material || 'Sob consulta')}
              </span>
            </div>

            <div class="spec">
              <strong>Dimensões</strong>
              <span>
                ${escapeHTML(p.dimensoes || 'Sob consulta')}
              </span>
            </div>

            <div class="spec">
              <strong>Cores</strong>
              <span>
                ${escapeHTML(p.cores || 'Sob consulta')}
              </span>
            </div>

          </div>
        </div>
      </div>
    `;
  }

  // PÁGINA SOBRE

  function about() {
    return `
      <div class="wrap page-title">
        <span class="eyebrow">QUEM SOMOS</span>

        <h1>Uma marca feita de histórias.</h1>

        <p>${escapeHTML(data.marca.descricao)}</p>
      </div>

      ${aboutSection(false)}
      ${benefits()}

      <div class="section-spacer"></div>

      ${social()}
    `;
  }

  // CONTATO E SUPORTE

  function contact() {
    const mail = String(data.redes.email || '').trim();

    const emailLink =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)
        ? `<a class="underlink"
              href="mailto:${escapeHTML(mail)}">
             Enviar e-mail
           </a>`
        : '';

    return `
      <div class="wrap">

        <div class="page-title">
          <span class="eyebrow">FALE COM A GENTE</span>

          <h1>
            ${escapeHTML(data.atendimento.titulo)}
          </h1>

          <p>
            ${escapeHTML(data.atendimento.descricao)}
          </p>
        </div>

        <section class="contact-grid">

          <div>
            <h2>Vamos conversar?</h2>

            <p>
              Para dúvidas sobre pedidos, tenha o número
              da compra em mãos e utilize também o chat
              do pedido na Shopee.
            </p>

            <div class="contact-links">
              ${button(
                whatsapp(),
                'Conversar pelo WhatsApp'
              )}

              ${emailLink}

              ${button(
                data.redes.instagram,
                'Nosso Instagram',
                true
              )}

              ${button(
                data.redes.shopee,
                'Nossa loja na Shopee',
                true
              )}
            </div>

            <p>
              ${escapeHTML(data.atendimento.horario)}
            </p>
          </div>

          <div>
            <h2>Perguntas frequentes.</h2>

            ${(data.perguntas || []).map(x => `
              <details class="faq">
                <summary>
                  ${escapeHTML(x.pergunta)}
                </summary>

                <p>${escapeHTML(x.resposta)}</p>
              </details>
            `).join('')}
          </div>

        </section>
      </div>
    `;
  }

  const missing = () => `
    <div class="wrap not-found">
      <h1>Página não encontrada.</h1>
      <p>Não encontramos este conteúdo.</p>
      <a class="btn" href="#/">Voltar ao início</a>
    </div>
  `;

  // NAVEGAÇÃO

  function render() {
    let path = '/';

    try {
      path = decodeURIComponent(location.hash.slice(1) || '/');
    } catch {}

    const parts = path.split('/').filter(Boolean);

    if (!parts.length) {
      app.innerHTML = home();
    } else if (
      parts[0] === 'produtos' &&
      parts.length === 1
    ) {
      app.innerHTML = catalog();
      filterCatalog();
    } else if (
      parts[0] === 'colecao' &&
      parts.length === 2 &&
      collectionById(parts[1])
    ) {
      app.innerHTML = catalog(parts[1]);
      filterCatalog();
    } else if (
      parts[0] === 'produto' &&
      parts.length === 2
    ) {
      app.innerHTML = detail(parts[1]);
    } else if (
      parts[0] === 'sobre' &&
      parts.length === 1
    ) {
      app.innerHTML = about();
    } else if (
      parts[0] === 'contato' &&
      parts.length === 1
    ) {
      app.innerHTML = contact();
    } else {
      app.innerHTML = missing();
    }

    document.querySelector('#nav').classList.remove('open');

    document.querySelector('#mobileToggle')
      .setAttribute('aria-expanded', 'false');

    window.scrollTo(0, 0);
  }

  // INICIALIZAÇÃO DA INTERFACE

  function initializeUI() {
    document.querySelector('#announcement').textContent =
      data.marca.avisoTopo || data.marca.aviso || '';

    document.querySelector('#footerDescription').textContent =
      data.marca.assinatura || data.marca.slogan || '';

    document.querySelector('#year').textContent =
      new Date().getFullYear();

    const ig = allowedUrl(data.redes.instagram);
    const shop = allowedUrl(data.redes.shopee);

    if (ig) {
      const link = document.querySelector('#headerInstagram');
      link.href = ig;
      link.hidden = false;
    }

    // LOGOTIPO

    const logoUrl = allowedUrl(data.marca.logo, true);

    if (logoUrl) {
      document.querySelectorAll('.brand, .footer-logo')
        .forEach(link => {
          link.innerHTML = `
            <img class="brand-image"
                 src="${logoUrl}"
                 alt="by FN">
          `;
        });
    }

    // REDES SOCIAIS NO RODAPÉ

    const socialLinks = document.querySelector('#footerSocial');

    if (ig) {
      socialLinks.insertAdjacentHTML(
        'beforeend',
        `<a href="${ig}"
            target="_blank"
            rel="noopener noreferrer">
            Instagram
         </a>`
      );
    }

    if (shop) {
      socialLinks.insertAdjacentHTML(
        'beforeend',
        `<a href="${shop}"
            target="_blank"
            rel="noopener noreferrer">
            Shopee
         </a>`
      );
    }

    // MENU MOBILE

    const toggle = document.querySelector('#mobileToggle');

    toggle.addEventListener('click', () => {
      const open = document.querySelector('#nav')
        .classList.toggle('open');

      toggle.setAttribute('aria-expanded', String(open));
    });

    // FILTROS DE COLEÇÕES

    document.addEventListener('click', event => {
      const btn = event.target.closest('[data-collection]');

      if (!btn) return;

      selectedCollection = btn.dataset.collection;

      document.querySelectorAll('[data-collection]')
        .forEach(item => {
          item.classList.toggle('active', item === btn);
        });

      filterCatalog();
    });

    // BUSCA DE PRODUTOS

    document.addEventListener('input', event => {
      if (event.target.id === 'search') {
        filterCatalog();
      }
    });

    window.addEventListener('hashchange', render);

    render();
  }

  // INTEGRAÇÃO COM GOOGLE SHEETS

  const endpoint = String(data.integracao?.url || '').trim();

  function getJSONP(url, timeoutMs = 12000) {
    return new Promise((resolve, reject) => {
      const callback =
        'byfnCallback_' + Math.random().toString(36).slice(2);

      const tag = document.createElement('script');
      let done = false;

      const finish = (error, payload) => {
        if (done) return;

        done = true;
        clearTimeout(timer);
        delete window[callback];
        tag.remove();

        error ? reject(error) : resolve(payload);
      };

      const timer = setTimeout(
        () => finish(new Error('Tempo limite da planilha')),
        timeoutMs
      );

      window[callback] = payload =>
        finish(null, payload);

      tag.onerror = () =>
        finish(new Error('Falha ao carregar a planilha'));

      tag.src =
        url +
        (url.includes('?') ? '&' : '?') +
        'callback=' + encodeURIComponent(callback) +
        '&_=' + Date.now();

      document.head.appendChild(tag);
    });
  }

  // CONVERSÃO DOS DADOS DA PLANILHA

  function convertSheet(payload) {
    if (
      !payload ||
      payload.sucesso !== true ||
      !Array.isArray(payload.produtos) ||
      !Array.isArray(payload.colecoes)
    ) {
      throw new Error('Resposta inesperada da integração');
    }

    const cfg = payload.configuracoes || {};

    return {
      ...data,

      marca: {
        ...data.marca,
        nome: cfg.nome_marca || data.marca.nome,
        assinatura: cfg.slogan || data.marca.assinatura
      },

      redes: {
        ...data.redes,
        shopee: cfg.shopee_url || data.redes.shopee,
        instagram: cfg.instagram_url || '',
        whatsapp: cfg.whatsapp || '',
        email: cfg.email_suporte || ''
      },

      inicio: {
        ...data.inicio,
        titulo: cfg.hero_titulo || data.inicio.titulo,
        subtitulo: cfg.hero_descricao || data.inicio.subtitulo
      },

      sobre: {
        ...data.sobre,
        titulo: cfg.sobre_titulo || data.sobre.titulo,
        texto1: cfg.sobre_texto || data.sobre.texto1
      },

      colecoes: payload.colecoes.map(c => ({
        id: String(c.id || '').trim(),
        nome: c.nome || '',
        descricao: c.descricao || '',
        imagem: c.imagem_url || '',
        ordem: Number(c.ordem) || 999,
        ativa: c.ativa === true
      })),

      produtos: payload.produtos.map(p => ({
        id: String(p.id || '').trim(),
        nome: p.nome || '',
        colecao: String(p.colecao_id || '').trim(),

        preco:
          p.preco_brl === '' ||
          p.preco_brl === null ||
          p.preco_brl === undefined
            ? null
            : Number(
                String(p.preco_brl).replace(',', '.')
              ),

        descricaoCurta: p.descricao_curta || '',
        descricao: p.descricao_completa || '',

        imagens: Array.isArray(p.imagens)
          ? p.imagens.filter(Boolean)
          : [],

        material: p.material || '',
        dimensoes: p.dimensoes || '',
        cores: p.cores || '',

        shopee: p.shopee_url || '',
        instagram: p.instagram_url || '',

        destaque: p.destaque === true,
        disponivel: p.disponivel === true,
        ordem: Number(p.ordem) || 999
      })).filter(p => p.id && p.nome)
    };
  }

  // INICIAR SITE

  async function boot() {
    // O Google Sheets continua sendo a única fonte do catálogo.
    data = {
      ...data,
      colecoes: [],
      produtos: []
    };

    // Exibe a interface imediatamente, sem depender da conexão.
    initializeUI();

    const banner = document.querySelector('#integrationStatus');

    if (!endpoint) {
      if (banner) {
        banner.textContent = 'Integração com Google Sheets não configurada.';
        banner.hidden = false;
      }
      return;
    }

    // Até três tentativas, permitindo conexões mais lentas.
    for (let tentativa = 1; tentativa <= 3; tentativa++) {
      try {
        const resposta = await getJSONP(endpoint, 25000);

        data = convertSheet(resposta);

        render();

        if (banner) {
          banner.hidden = true;
        }

        console.info('by FN: catálogo carregado do Google Sheets');
        return;

      } catch (erro) {
        console.warn(
          `by FN: falha na tentativa ${tentativa}`,
          erro
        );

        if (tentativa < 3) {
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
      }
    }

    if (banner) {
      banner.textContent =
        'Não foi possível carregar o catálogo. Atualize a página para tentar novamente.';
      banner.hidden = false;
    }
  }

  boot();
})();