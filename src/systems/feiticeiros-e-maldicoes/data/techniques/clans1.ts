import { InnateTechnique } from "./types";

export const CLANS1_TECHNIQUES: InnateTechnique[] = [
  {
    id: "ilimitado",
    name: "Ilimitado",
    characterRef: "Satoru Gojo",
    category: "Clã Tradicional",
    suggestedAttribute: "INT",
    source: "Enciclopédia Amaldiçoada v0.9 / Livro Base v2.5",
    description:
      "Ilimitado é a técnica herdada do Clã Gojo, trazendo para a realidade o conceito de 'Infinito' e manipulando o espaço. Seu potencial pleno requer os Seis Olhos para controle atômico da energia.",
    basicFunction:
      "O conceito básico e neutro é o Infinito (parar). Concede: 1) Anular dano de um ataque uma quantidade de vezes igual ao BT por descanso; 2) Imunidade a dano de ameaças cujo ND ≤ ⌊Nível/2⌋; 3) +2 na Defesa e 2 de RD geral (aumenta em +2 nos níveis 5, 9, 13 e 17).",
    domainExpansion: {
      name: "Vazio Imensurável",
      type: "Expansão Completa Letal",
      cost: 20,
      description:
        "Cria um espaço esférico de 9m (duração 3 + Nível de Aptidão em Domínio). Despeja fluxo infinito de informações: criatura que inicie o turno deve fazer TR de Astúcia; em falha, atributos mentais caem para 0, sofrendo 1d10+5 dano psíquico/rodada e condição Paralisado. A CD contra habilidades aumenta em +2.",
    },
    spells: [
      {
        name: "Azul: Atração",
        level: 1,
        cost: "2 PE",
        action: "Ação Comum",
        range: "12 Metros",
        target: "Uma Criatura",
        duration: "Imediata",
        description:
          "Atrai uma criatura com força gravitacional. TR de Fortitude, recebendo 2d10 de dano de força (metade em sucesso). Se falhar, é puxada 6m em sua direção.",
        rollFormula: "2d10",
      },
      {
        name: "Movimento Imediato",
        level: 1,
        cost: "2 PE",
        action: "Ação Bônus",
        range: "9 Metros",
        target: "Um Espaço Desocupado",
        duration: "Imediata",
        description:
          "Distorce o espaço para realizar um teleporte tático rápido até 9m. Não provoca ataques de oportunidade.",
      },
      {
        name: "Azul: Atração Constante",
        level: 1,
        cost: "2 PE",
        action: "Ação Bônus",
        range: "Próprio",
        target: "Próprio",
        duration: "Sustentada",
        description:
          "Concentra o azul nos punhos. Ataques desarmados causam +1d10 de dano de força adicional. Custo de 1 PE por rodada para sustentar.",
        rollFormula: "1d10",
      },
      {
        name: "Amplificação do Infinito",
        level: 1,
        cost: "2 PE",
        action: "Reação",
        range: "Próprio",
        target: "Próprio",
        duration: "Imediata",
        description:
          "Como reação a ser atacado, dobra o bônus de Defesa e de RD concedido pelo Infinito até o final do turno atual.",
      },
      {
        name: "Voar",
        level: 1,
        cost: "Passiva",
        action: "Passiva",
        range: "Próprio",
        target: "Próprio",
        duration: "Permanente",
        description:
          "Permite pairar e voar com 9m de deslocamento de voo, podendo parar no ar. Reduz o PE máximo em 2.",
      },
      {
        name: "Azul: Compressão",
        level: 2,
        cost: "5 PE",
        action: "Ação Comum",
        range: "18 Metros",
        target: "Uma Criatura",
        duration: "Imediata",
        description:
          "Comprime o espaço ao redor do alvo. TR de Fortitude: 7d8 de dano de força (metade em sucesso).",
        rollFormula: "7d8",
      },
      {
        name: "Azul: Colisão",
        level: 2,
        cost: "5 PE",
        action: "Ação Completa",
        range: "18 Metros",
        target: "Duas Criaturas",
        duration: "Imediata",
        description:
          "Força colisão entre dois alvos. Ambos fazem TR de Fortitude, sofrendo 2d8 de dano de força + 1d8 por categoria de tamanho acima de minúsculo, colidindo no ponto médio.",
        rollFormula: "2d8",
      },
      {
        name: "Desvio Imediato",
        level: 2,
        cost: "5 PE",
        action: "Reação",
        range: "Próprio",
        target: "Próprio",
        duration: "Imediata",
        description:
          "Puxa o corpo fora do rumo de ataque corpo a corpo. Teste de Reflexos contra o acerto: se superar, nega o ataque e move 3m; se falhar, reduz o dano à metade.",
      },
      {
        name: "Ponto de Atração",
        level: 3,
        cost: "8 PE",
        action: "Ação Comum",
        range: "24 Metros",
        target: "Área de 6m",
        duration: "Sustentada",
        description:
          "Cria vórtice atrativo esférico de 6m. Alvos na área fazem TR de Fortitude: 4d12 dano de força (metade em sucesso) e puxados ao centro (Imóvel por 1 rodada). 2 PE/rodada.",
        rollFormula: "4d12",
      },
      {
        name: "Teleporte de Longa Distância",
        level: 3,
        cost: "8 PE",
        action: "Ação Comum",
        range: "Ilimitado",
        target: "Próprio e Tocados",
        duration: "Imediata",
        description:
          "Comprime o espaço para teleportar a si mesmo e criaturas tocadas a qualquer local conhecido previamente visitado.",
      },
      {
        name: "Vermelho: Repulsão",
        level: 3,
        cost: "8 PE",
        action: "Ação Comum",
        range: "24 Metros",
        target: "Uma Criatura",
        duration: "Imediata",
        description:
          "Reversão de Técnica (RCT): esfera de repulsão explosiva. TR de Fortitude: 10d8 de dano de força e empurrado 12m (metade e 6m em sucesso). Requer Reversão de Técnica.",
        rollFormula: "10d8",
      },
      {
        name: "Azul: Implosão Absoluta",
        level: 4,
        cost: "12 PE",
        action: "Ação Completa",
        range: "6 Metros",
        target: "Uma Criatura",
        duration: "Imediata",
        description:
          "Implosão espacial devastadora. TR de Fortitude: 3d10 de dano de força e perde braços ou pernas à escolha em uma falha.",
        rollFormula: "3d10",
      },
      {
        name: "Criação de Imagens",
        level: 4,
        cost: "12 PE",
        action: "Ação Comum",
        range: "Próprio",
        target: "Próprio",
        duration: "Imediata",
        description:
          "Cria 2 pós-imagens residuais ultrarrápidas. Ataques contra você forçam TR de Astúcia ou dissipam uma imagem. Concede vantagem ou +5 em jogadas de ataque.",
      },
      {
        name: "Disparo Carmesim",
        level: 4,
        cost: "12 PE",
        action: "Ação Comum",
        range: "30 Metros",
        target: "Uma Criatura",
        duration: "Imediata",
        description:
          "Disparo concentrado em feixe de repulsão. TR de Reflexos: 12d10 dano de força e empurrado 18m (metade e 9m em sucesso). Requer Reversão de Técnica.",
        rollFormula: "12d10",
      },
      {
        name: "Vazio Roxo",
        level: 5,
        cost: "20 PE",
        action: "Ação Completa",
        range: "36 Metros",
        target: "Linha de 36m",
        duration: "Imediata",
        description:
          "Colisão de Azul e Vermelho criando massa imaginária que apaga matéria. TR de Reflexos com desvantagem: 20d12 de dano de força, desintegrando estruturas.",
        rollFormula: "20d12",
      },
      {
        name: "Técnica Máxima: Vazio Roxo Irrestrito",
        level: 5,
        cost: "25 PE",
        action: "Ação Completa",
        range: "9 Metros",
        target: "Esfera de 50m",
        duration: "Imediata",
        description:
          "Combina Azul e Vermelho em explosão onidirecional maciça de 50m. Todas as criaturas (incluindo você) sofrem 26d10 dano de força (TR Fortitude desvantagem reduz metade). Ignora imunidade, resistência e RD.",
        rollFormula: "26d10",
      },
    ],
  },
];
