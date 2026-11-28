import { InnateTechnique } from "./types";

export const CLANS3A_TECHNIQUES: InnateTechnique[] = [
  {
    id: "manipulacao_sanguinea_kamo",
    name: "Manipulação Sanguínea (Kamo)",
    characterRef: "Noritoshi Kamo",
    category: "Clã Tradicional",
    suggestedAttribute: "CON",
    source: "Enciclopédia Amaldiçoada v0.9 / Livro Base v2.5",
    description:
      "Técnica herdada do Clã Kamo que permite manipular e moldar o próprio sangue interno e externo como arma, projétil ou reforço biológico.",
    basicFunction:
      "Moldagem sanguínea para ataques e defesas. Habilidades custam PV adicional (Nív 0: 1 PV, Nív 1: 3 PV, Nív 2: 5 PV, Nív 3: 8 PV, Nív 4: 12 PV, Nív 5: 20 PV), contornável com bolsas de sangue. Sangue tóxico para maldições (dano Venenoso opcional).",
    spells: [
      {
        name: "Cobrir com Sangue",
        level: 0,
        cost: "0 PE + 1 PV",
        action: "Ação Bônus",
        range: "Próprio",
        target: "Uma Arma ou Projétil",
        duration: "Sustentada",
        description:
          "Cobre arma ou projétil com sangue amaldiçoado, causando +1d10 de dano adicional. Custa 1 PE e 1 PV por rodada para sustentar.",
        rollFormula: "1d10",
      },
      {
        name: "Fluxo Contido",
        level: 0,
        cost: "Passiva",
        action: "Passiva",
        range: "Próprio",
        target: "Próprio",
        duration: "Permanente",
        description:
          "Controla o fluxo interno evitando hemorragias. Concede vantagem em testes contra a morte e imunidade à condição Sangramento.",
      },
      {
        name: "Flecha de Sangue",
        level: 1,
        cost: "2 PE + 3 PV",
        action: "Reação",
        range: "Próprio",
        target: "Um Projétil",
        duration: "Imediata",
        description:
          "Em um ataque à distância, cobre o projétil com sangue causando +2d10 dano. Permite rerrolar o teste de ataque se errar.",
        rollFormula: "2d10",
      },
      {
        name: "Restrição Carmesim",
        level: 1,
        cost: "2 PE + 3 PV",
        action: "Ação Comum",
        range: "12 Metros",
        target: "Uma Criatura",
        duration: "Imediata",
        description:
          "Rede de sangue que restringe o alvo. TR de Reflexos com CD aumentada em +2: Imóvel em falha; Enredado em sucesso. Escapa com Atletismo.",
      },
      {
        name: "Bloqueio Rápido",
        level: 2,
        cost: "5 PE",
        action: "Reação",
        range: "Próprio",
        target: "Próprio",
        duration: "Imediata",
        description:
          "Concentra barreira de sangue como reação ao sofrer dano. Pode gastar até BT × 5 PV, reduzindo o dano em 2 para cada PV gasto.",
      },
      {
        name: "Ciclagem Sanguínea",
        level: 2,
        cost: "Passiva",
        action: "Passiva",
        range: "Próprio",
        target: "Próprio",
        duration: "Permanente",
        description:
          "Recicla sangue externo. Ao usar habilidade, TR Fortitude CD 10 + 4×Nível recupera metade dos PV gastos. Reduz PE máximo em 4.",
      },
      {
        name: "Sangue Perfurante",
        level: 2,
        cost: "5 PE + 5 PV",
        action: "Ação Comum",
        range: "24 Metros",
        target: "Uma Criatura",
        duration: "Imediata",
        description:
          "Disparo em alta velocidade comprimido entre as mãos. Ataque à distância com +2 no acerto, causando 9d8 de dano perfurante.",
        rollFormula: "9d8",
      },
      {
        name: "Convergência",
        level: 3,
        cost: "8 PE + 8 PV",
        action: "Ação Comum",
        range: "30 Metros",
        target: "Uma Criatura",
        duration: "Imediata",
        description:
          "Comprime sangue ao limite absoluto em orbe denso. Ataque com +4 de acerto, causando 15d8 de dano perfurante.",
        rollFormula: "15d8",
      },
      {
        name: "Exorcismo Cortante",
        level: 3,
        cost: "8 PE + 8 PV",
        action: "Ação Comum",
        range: "24 Metros",
        target: "Uma Criatura",
        duration: "Imediata",
        description:
          "Disco de sangue giratório cortante. TR de Reflexos: 9d8 de dano cortante e TR de Fortitude para evitar Sangramento Forte (4d12/rodada).",
        rollFormula: "9d8",
      },
      {
        name: "Fluxo das Escamas Vermelhas",
        level: 3,
        cost: "8 PE",
        action: "Ação Bônus",
        range: "Próprio",
        target: "Próprio",
        duration: "Sustentada",
        description:
          "Doping sanguíneo interno: FOR e DES aumentam em +2, deslocamento +3m e +4 em Reflexos. Não consome PV. Sustentar por 2 PE/rodada.",
      },
    ],
  },
];
