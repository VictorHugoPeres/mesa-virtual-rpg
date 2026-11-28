import { InnateTechnique } from "./types";

export const DISASTERS2_TECHNIQUES: InnateTechnique[] = [
  {
    id: "mares_do_desastre",
    name: "Marés do Desastre",
    characterRef: "Dagon",
    category: "Maldição do Desastre",
    suggestedAttribute: "CON",
    source: "Enciclopédia Amaldiçoada v0.9 / Livro Base v2.5",
    description:
      "Técnica da Maldição do Desastre Dagon, que produz e controla imensas torrentes de água e invocações marinhas através da energia amaldiçoada.",
    basicFunction:
      "Produz água a partir da energia, controlando-a mentalmente. Toda a água criada torna-se água real. Com Ação Bônus, pode puxar a água na sua direção arrastando todos os que estiverem nela.",
    domainExpansion: {
      name: "Horizonte Cativante",
      type: "Expansão Completa Letal",
      cost: 20,
      description:
        "Cria uma ilha tropical e paradisíaca com mar de 100m de extensão (duração 3 + Nível de Aptidão em Domínio). Inimigos no mar sofrem -3m de deslocamento. Com Acerto Garantido (Enxame Mortal), cria no início de cada rodada 6 criaturas marinhas (1d10+5 dano físico cada) que atacam alvos à sua escolha; ações criam mais criaturas.",
    },
    spells: [
      {
        name: "Bala Áquea",
        level: 0,
        cost: "0 PE",
        action: "Ação Comum",
        range: "9 Metros",
        target: "Uma Criatura",
        duration: "Imediata",
        description:
          "Projétil de água comprimida. Teste de ataque à distância: causa 1d10 de dano de impacto em um acerto.",
        rollFormula: "1d10",
      },
      {
        name: "Criar Água",
        level: 0,
        cost: "0 PE",
        action: "Variável",
        range: "9 Metros",
        target: "Área",
        duration: "Imediata",
        description:
          "Cria água do ambiente. Ação Comum cobre área de 1,5m; Ação Completa cobre área esférica de 3m.",
      },
      {
        name: "Laços d'Água",
        level: 1,
        cost: "2 PE",
        action: "Ação Comum",
        range: "12 Metros",
        target: "Uma Criatura",
        duration: "Imediata",
        description:
          "Laços aquáticos prendem o alvo. TR de Reflexos: condição Agarrado em caso de falha. Escapa com Atletismo.",
      },
      {
        name: "Chicote da Maré",
        level: 2,
        cost: "5 PE",
        action: "Ação Comum",
        range: "12 Metros",
        target: "Uma Criatura",
        duration: "Imediata",
        description:
          "Chicote de alta pressão. TR de Fortitude: 6d8 de dano de impacto e Caído (metade do dano em sucesso).",
        rollFormula: "6d8",
      },
      {
        name: "Onda de Varredura",
        level: 2,
        cost: "5 PE",
        action: "Ação Comum",
        range: "Cone de 6m",
        target: "Área à Frente",
        duration: "Imediata",
        description:
          "Onda intensa em cone de 6m. TR de Fortitude: 4d8 de dano de força e inunda todo o terreno afetado.",
        rollFormula: "4d8",
      },
      {
        name: "Bolha Sufocante",
        level: 3,
        cost: "8 PE",
        action: "Ação Comum",
        range: "9 Metros",
        target: "Uma Criatura",
        duration: "Concentração",
        description:
          "Encapsula o alvo em esfera de água. TR de Reflexos (CD +4): se falhar, fica preso e começa a sufocar (regras de Segurando o Ar).",
      },
      {
        name: "Escudo de Água",
        level: 3,
        cost: "8 PE",
        action: "Ação Comum",
        range: "Próprio",
        target: "Próprio",
        duration: "Sustentada",
        description:
          "Anel rotativo de água que apara ataques individuais automaticamente. 2 PE/rodada para sustentar.",
      },
      {
        name: "Compressão Total",
        level: 4,
        cost: "12 PE",
        action: "Ação Comum",
        range: "18 Metros",
        target: "Uma Criatura",
        duration: "Imediata",
        description:
          "Pressão oceânica extrema. TR de Fortitude: 10d10 de dano de força, Desorientado por 4 rodadas e Confuso por 3 rodadas.",
        rollFormula: "10d10",
      },
      {
        name: "Domo Aquoso",
        level: 4,
        cost: "12 PE",
        action: "Reação",
        range: "Próprio",
        target: "Próprio",
        duration: "Imediata",
        description:
          "Ergue domo impenetrável de água com 120 PV como reação a ser atacado, anulando o dano recebido.",
      },
    ],
  },
  {
    id: "plantas_do_desastre",
    name: "Plantas do Desastre",
    characterRef: "Hanami",
    category: "Maldição do Desastre",
    suggestedAttribute: "SAB",
    source: "Enciclopédia Amaldiçoada v0.9 / Livro Base v2.5",
    description:
      "Técnica da Maldição do Desastre Hanami que manipula flora amaldiçoada de raízes resistentes, flores pacificadoras e brotos parasitas devoradores de energia.",
    basicFunction:
      "Forma e controla flora amaldiçoada física e telepaticamente a partir de seu corpo ou do solo.",
    spells: [
      {
        name: "Disparo de Ramo",
        level: 1,
        cost: "2 PE",
        action: "Ação Comum",
        range: "12 Metros",
        target: "Uma Criatura",
        duration: "Imediata",
        description:
          "Disparo de estaca de madeira afiada. Ataque à distância: causa 4d8 de dano perfurante em um acerto.",
        rollFormula: "4d8",
      },
      {
        name: "Revestimento de Espinhos",
        level: 1,
        cost: "2 PE",
        action: "Ação Comum",
        range: "3 Metros",
        target: "Um Equipamento",
        duration: "Sustentada",
        description:
          "Reveste arma (+1d10 perfurante) ou armadura (atacantes corpo a corpo sofrem 2d6 perfurante). 1 PE/rodada.",
        rollFormula: "1d10",
      },
      {
        name: "Prisão de Raízes",
        level: 2,
        cost: "5 PE",
        action: "Ação Comum",
        range: "12 Metros",
        target: "Uma Criatura",
        duration: "Imediata",
        description:
          "Raízes brotam do solo. TR de Fortitude: 5d8 de dano perfurante e condição Agarrado (metade do dano em sucesso).",
        rollFormula: "5d8",
      },
      {
        name: "Brotos Malditos",
        level: 3,
        cost: "8 PE",
        action: "Ação Comum",
        range: "12 Metros",
        target: "Duas Criaturas",
        duration: "Imediata",
        description:
          "Brotos parasitas que cravam na carne (TR Reflexos). Para cada PE gasto pela criatura afetada, ela perde 1d8 de PV.",
        rollFormula: "1d8",
      },
      {
        name: "Campo Florido",
        level: 3,
        cost: "8 PE",
        action: "Ação Comum",
        range: "18 Metros",
        target: "Esfera de 9m",
        duration: "Sustentada",
        description:
          "Floresce campo de flores inebriantes. Qualquer criatura na área que tente realizar ação agressiva deve fazer TR de Vontade ou é pacificada, perdendo a ação. 2 PE/rodada para sustentar.",
      },
    ],
  },
];
