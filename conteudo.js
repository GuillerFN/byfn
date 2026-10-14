/* by FN — configurações e textos institucionais.
   Coleções, produtos, preços e imagens de produtos são gerenciados SOMENTE no Google Sheets.
   Endpoint público: somente leitura. */
window.BYFN = {
  // Dados de coleções/produtos são carregados automaticamente do Google Sheets.
  integracao: {
    url: "https://script.google.com/macros/s/AKfycbzJWrVQ9Nnp5nUUsIoPFaGEwPdeaHj40cWPHSMFpEm1xkE-jzO_eB8wGUcpocDpkKuX/exec"
  },
  marca: {
    nome: "by FN",
    assinatura: "Design para viver cada detalhe.",
    avisoTopo: "DESIGN, DECORAÇÃO E CUIDADO EM CADA PEÇA",
    descricao: "Uma marca familiar de objetos de decoração e peças funcionais, produzidos com atenção aos materiais e acabamentos.",
    logo: "imagens/logo.png",
    imagemPrincipal: "imagens/capa.png",
    imagemSobre: "imagens/familia.jpg"
  },
  redes: {
    instagram: "", // endereço real do perfil
    usuarioInstagram: "@byfn", // ajuste para o arroba real
    shopee: "https://shopee.com.br/carlosnishiyama?entryPoint=ShopBySearch&searchKeyword=by%20fn",
    whatsapp: "", // 55 + DDD + número
    email: ""
  },
  inicio: {
    etiqueta: "BY FN • DESIGN & DECORAÇÃO",
    titulo: "Design para viver cada detalhe.",
    subtitulo: "Coleções de objetos decorativos para diferentes momentos, estilos e ambientes. Feitos em família, com cuidado e atenção aos detalhes.",
    botao: "Explorar coleção"
    // ,
    // destaqueTitulo: "Peças para cada história.",
    // destaqueTexto: "Do Natal à decoração do cotidiano: criações que dão personalidade aos ambientes."
  },
  catalogo: {
    etiqueta: "COLEÇÕES BY FN",
    titulo: "Objetos para transformar espaços.",
    descricao: "Explore nossas coleções e encontre objetos com design, personalidade e cuidado em cada acabamento."
  },
  instagram: {
    etiqueta: "ACOMPANHE NOSSO UNIVERSO",
    titulo: "Mais inspiração. Mais by FN.",
    descricao: "Acompanhe novidades, bastidores, coleções e ideias de decoração no Instagram."
  },
  sobre: {
    etiqueta: "NOSSA HISTÓRIA",
    titulo: "Feito em família. Pensado em cada detalhe.",
    texto1: "A by FN é uma marca familiar que nasceu da vontade de criar objetos de decoração e peças funcionais com estética própria, cuidado e personalidade.",
    texto2: "Produzimos nossas peças com impressão 3D, utilizando filamentos selecionados e atenção ao processo e ao acabamento. Valorizamos os detalhes que fazem cada objeto especial.",
    texto3: "Começamos com peças de decoração natalina e seguimos criando objetos que possam fazer parte da sua casa em diferentes momentos do ano."
  },
  diferenciais: [
    { simbolo: "♡", titulo: "Feito em família", texto: "Dedicação e proximidade em cada etapa." },
    { simbolo: "◇", titulo: "Filamentos selecionados", texto: "Escolha cuidadosa de matéria-prima e materiais." },
    { simbolo: "✧", titulo: "Atenção aos detalhes", texto: "Design e acabamento pensados com cuidado." }
  ],
  atendimento: {
    titulo: "Estamos aqui para ajudar.",
    descricao: "Tem dúvidas sobre um produto ou precisa de suporte? Nossa loja na Shopee é o canal mais direto para mensagens sobre pedidos.",
    horario: "Fale conosco pelo chat da nossa loja na Shopee."
  },
  perguntas: [
    { pergunta: "Onde posso comprar?", resposta: "As compras são feitas pela Shopee. Entre na página do produto e clique em Comprar na Shopee." },
    { pergunta: "Como as peças são produzidas?", resposta: "Usamos impressão 3D, com filamentos selecionados e atenção aos acabamentos." },
    { pergunta: "Como resolvo dúvidas ou problemas com meu pedido?", resposta: "Abra a compra no aplicativo da Shopee e use o chat ou as opções de ajuda do pedido. Você também pode acessar nossa loja pelo link de contato." }
  ]
};
