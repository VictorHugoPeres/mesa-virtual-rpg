import { InnateTechnique } from "./types";

export const SORCERERS3A_TECHNIQUES: InnateTechnique[] = [
  {
    id: "manipulacao_de_maldicoes",
    name: "Manipulação de Maldições",
    characterRef: "Suguru Geto / Kenjaku",
    category: "Grau Especial",
    suggestedAttribute: "PRE",
    source: "Enciclopédia Amaldiçoada v0.9 / Livro Base v2.5",
    description:
      "Técnica de Grau Especial de Suguru Geto que absorve espíritos amaldiçoados derrotados na forma de orbes negros, comandando-os como invocações fiéis sem limite máximo e extraindo suas técnicas inatas com o Uzumaki.",
    basicFunction:
      "Absorve maldições derrotadas como orbes negros para uso como invocações. Maldições 2 graus abaixo são absorvidas livremente (TR Vontade em combate). Permite usar feitiços de maldições absorvidas.",
    spells: [
      {
        name: "Invocação Emergencial",
        level: 0,
        cost: "0 PE",
        action: "Reação",
        range: "Próprio",
        target: "Próprio",
        duration: "Imediata",
        description:
          "Invoca maldição do estoque como reação para absorver ataque: paga metade do custo de invocação e reduz o dano em 5× o custo pago.",
      },
      {
        name: "Invocação Explosiva",
        level: 0,
        cost: "Variável",
        action: "Ação Completa",
        range: "9 Metros",
        target: "Espaços Livres",
        duration: "Imediata",
        description:
          "Invoca até 1 + ⌊BT/2⌋ maldições de uma só vez, comandando cada uma a realizar uma Ação Complexa imediata como parte do feitiço.",
      },
      {
        name: "Invocação Rápida",
        level: 0,
        cost: "Variável",
        action: "Ação Comum",
        range: "9 Metros",
        target: "Espaços Livres",
        duration: "Imediata",
        description:
          "Traz ao campo todas as maldições até o limite máximo que pode manter simultaneamente em espaços a até 9m.",
      },
      {
        name: "Técnica Máxima: Uzumaki",
        level: 5,
        cost: "25 PE",
        action: "Ação Completa",
        range: "36 Metros",
        target: "Uma Criatura",
        duration: "Imediata",
        description:
          "Condensa maldições do estoque em um turbilhão espiral de energia destrutiva pura. TR de Reflexos (metade em sucesso). Cada maldição soma 2d12 de dano (+2d12 por grau acima do 4º). Extrai a técnica inata de maldições de 1º grau ou especial consumidas para uso único posterior.",
        rollFormula: "2d12",
      },
    ],
  },
  {
    id: "manipulacao_de_passaros_negros",
    name: "Manipulação de Pássaros Negros",
    characterRef: "Mei Mei",
    category: "Feiticeiro Notável",
    suggestedAttribute: "INT",
    source: "Enciclopédia Amaldiçoada v0.9 / Livro Base v2.5",
    description:
      "Técnica de Mei Mei que imbui corvos com energia amaldiçoada para vigilância tática, compartilhamento visual e ataques suicidas devastadores com Voto de Morte (Bird Strike).",
    basicFunction:
      "Controla corvos telepaticamente. Inicia missões com BT × 2 pássaros (Defesa 12, 5 PV cada). Permite enxergar através dos olhos dos corvos num raio de até 100m.",
    spells: [
      {
        name: "Conexão Telepática",
        level: 0,
        cost: "0 PE",
        action: "Ação Bônus",
        range: "9 Metros",
        target: "Corvos",
        duration: "Ilimitada",
        description:
          "Conecta a visão com os corvos até 100m, ficando com a condição Cego no corpo físico. Encerrar é Ação Livre.",
      },
      {
        name: "Rasante Energético",
        level: 1,
        cost: "2 PE",
        action: "Ação Comum",
        range: "12 Metros",
        target: "Uma Criatura",
        duration: "Imediata",
        description:
          "Comanda 1 a 4 corvos em rasante. TR de Reflexos: 1d8 de dano de força por corvo (metade em sucesso).",
        rollFormula: "1d8",
      },
      {
        name: "Nuvem de Corvos",
        level: 1,
        cost: "2 PE",
        action: "Ação Comum",
        range: "12 Metros",
        target: "Um Aliado",
        duration: "Sustentada",
        description:
          "Corvos circundam o aliado em enxame protetor: Defesa aumenta em +1 por corvo na nuvem. Retornar é Ação Livre.",
      },
      {
        name: "Avanço Coletivo",
        level: 2,
        cost: "5 PE",
        action: "Ação Comum",
        range: "18 Metros",
        target: "Uma Criatura",
        duration: "Imediata",
        description:
          "1 a 4 corvos avançam em investida. TR de Reflexos: 2d8 dano de força por corvo e condição Desprevenido em falha.",
        rollFormula: "2d8",
      },
      {
        name: "Sacrifício Defensivo",
        level: 2,
        cost: "5 PE",
        action: "Reação",
        range: "Próprio",
        target: "Próprio",
        duration: "Imediata",
        description:
          "Reação a ataque: sacrifica corvos próximos para absorver o impacto, reduzindo o dano em 10 por corvo sacrificado.",
      },
      {
        name: "Festim dos Corvos",
        level: 3,
        cost: "8 PE",
        action: "Ação Comum",
        range: "24 Metros",
        target: "Uma Criatura",
        duration: "Sustentada",
        description:
          "1 a 5 corvos atacam continuamente. TR de Fortitude: 3d8 dano de força por corvo no turno de conjuração e repete metade a cada rodada.",
        rollFormula: "3d8",
      },
      {
        name: "Descarga Devastadora",
        level: 4,
        cost: "12 PE",
        action: "Ação Comum",
        range: "30 Metros",
        target: "Uma Criatura",
        duration: "Imediata",
        description:
          "1 a 6 corvos sobrecarregados atacam (3d10 dano de força cada, Desprevenido e Desorientado em falha de TR Reflexos). 50% de chance de morte por pássaro.",
        rollFormula: "3d10",
      },
      {
        name: "Ataque do Corvo Kamikaze (Bird Strike)",
        level: 5,
        cost: "20 PE",
        action: "Ação Comum",
        range: "48 Metros",
        target: "Uma Criatura",
        duration: "Imediata",
        description:
          "Impõe um Voto de Morte ao corvo em troca de poder supremo. Comanda até 6 corvos que morrem no impacto. TR de Reflexos: 3d12 dano de força por corvo, Desprevenido e Desorientado (se 6 corvos, aplica Atordoado por 1 rodada).",
        rollFormula: "3d12",
      },
    ],
  },
];
