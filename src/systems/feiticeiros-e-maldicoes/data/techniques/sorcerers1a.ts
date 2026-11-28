import { InnateTechnique } from "./types";

export const SORCERERS1A_TECHNIQUES: InnateTechnique[] = [
  {
    id: "boneco_de_palha",
    name: "Boneco de Palha",
    characterRef: "Nobara Kugisaki",
    category: "Feiticeiro Notável",
    suggestedAttribute: "CON",
    source: "Enciclopédia Amaldiçoada v0.9 / Livro Base v2.5",
    description:
      "Técnica de Nobara Kugisaki que utiliza martelo, pregos e boneco de palha para desferir ataques perfurantes, explosões de energia e ressonância com partes arrancadas do alvo.",
    basicFunction:
      "Recebe martelo, boneco de palha e pregos (inicia com BT × 5 pregos). Permite transferir dano à distância através de partes ou sangue do alvo fixados no boneco de palha.",
    spells: [
      {
        name: "Disparo de Pregos",
        level: 0,
        cost: "0 PE",
        action: "Ação Comum",
        range: "9 Metros",
        target: "Uma Criatura",
        duration: "Imediata",
        description:
          "Dispara até BT pregos (1 PE por prego além do primeiro). Ataque à distância: causa 1d8 dano perfurante por prego. TR Fortitude para evitar que pregos fiquem cravados.",
        rollFormula: "1d8",
      },
      {
        name: "Redirecionamento Constante",
        level: 0,
        cost: "Passiva",
        action: "Passiva",
        range: "Próprio",
        target: "Próprio",
        duration: "Permanente",
        description:
          "Após Disparo de Pregos, fixa até BT pregos que erraram em superfícies dentro de 3m para futuras detonações de Grampo de Cabelo.",
      },
      {
        name: "Grampo de Cabelo",
        level: 1,
        cost: "2 PE",
        action: "Ação Comum",
        range: "12 Metros",
        target: "Pregos Cravados",
        duration: "Imediata",
        description:
          "Detona um prego cravado. Criaturas em 4,5m fazem TR de Reflexos (ou Fortitude se no corpo): sofrem 2d8 de dano de força (metade em sucesso).",
        rollFormula: "2d8",
      },
      {
        name: "Ressonância",
        level: 1,
        cost: "2 PE",
        action: "Ação Comum",
        range: "Ilimitado",
        target: "Boneco de Palha",
        duration: "Imediata",
        description:
          "Golpeia o boneco com vestígio do alvo. O dano do ataque é refletido diretamente no alvo à distância + 3d6 dano de força (alvo fica desprevenido se não puder ver).",
        rollFormula: "3d6",
      },
      {
        name: "Explosão Repentina",
        level: 2,
        cost: "5 PE",
        action: "Reação",
        range: "Ilimitado",
        target: "Boneco de Palha",
        duration: "Imediata",
        description:
          "Quando aliado for atacar alvo com vestígio, golpeia o boneco como reação. Alvo faz TR de Astúcia ou fica desprevenido contra o ataque do aliado.",
      },
      {
        name: "Decepar",
        level: 3,
        cost: "8 PE",
        action: "Ação Comum",
        range: "12 Metros",
        target: "Uma Criatura",
        duration: "Imediata",
        description:
          "Dispara prego reforçado no alvo. Ataque à distância: 15d8 dano perfurante e TR de Fortitude para não ter pequeno pedaço arrancado.",
        rollFormula: "15d8",
      },
    ],
  },
  {
    id: "boogie_woogie",
    name: "Boogie Woogie",
    characterRef: "Aoi Todo",
    category: "Feiticeiro Notável",
    suggestedAttribute: "FOR",
    source: "Enciclopédia Amaldiçoada v0.9 / Livro Base v2.5",
    description:
      "Técnica de Aoi Todo que troca instantaneamente de posição entre duas pessoas ou objetos com certo nível de energia amaldiçoada ao bater palmas.",
    basicFunction:
      "Ao bater palmas, troca de posição com qualquer criatura/objeto imbuído de energia amaldiçoada, ou permuta dois alvos entre si.",
    spells: [
      {
        name: "Troca de Posição",
        level: 0,
        cost: "0 PE",
        action: "Ação Bônus",
        range: "9 Metros",
        target: "2 Alvos",
        duration: "Imediata",
        description:
          "Bate palmas e permuta a posição de dois alvos no alcance (incluindo você). Não provoca ataque de oportunidade. Alvo faz TR de Reflexos ou fica desprevenido.",
      },
      {
        name: "Troca Emergencial",
        level: 0,
        cost: "0 PE",
        action: "Reação",
        range: "6 Metros",
        target: "Um Aliado",
        duration: "Imediata",
        description:
          "Reação a ataque contra aliado: teste de Reflexos contra o acerto. Se superar, troca o aliado de lugar com outro alvo, que recebe o ataque.",
      },
      {
        name: "Ajuste de Alvo",
        level: 1,
        cost: "2 PE",
        action: "Reação",
        range: "12 Metros",
        target: "Um Inimigo",
        duration: "Imediata",
        description:
          "Ao ser alvo de ataque de aliado, troca-se com inimigo dentro de 12m, redirecionando o golpe do aliado nele com vantagem no acerto.",
      },
      {
        name: "Combo Surpresa",
        level: 1,
        cost: "2 PE",
        action: "Ação Comum",
        range: "Alcance da Arma",
        target: "Uma Criatura",
        duration: "Imediata",
        description:
          "Arremessa arma ou pedra imbuída e troca com ela perto do alvo, desferindo ataque corpo a corpo como reação (TR Astúcia ou desprevenido).",
      },
      {
        name: "Troca com Objeto Imbuído",
        level: 2,
        cost: "5 PE",
        action: "Ação Comum",
        range: "12 Metros",
        target: "Um Objeto",
        duration: "Imediata",
        description:
          "Arremessa pequeno objeto com energia e troca com ele adjacente ao alvo, atacando com vantagem, margem de crítico -1 e alvo desprevenido.",
      },
      {
        name: "Sequência Imprevisível",
        level: 3,
        cost: "8 PE",
        action: "Ação Completa",
        range: "12 Metros",
        target: "Uma Criatura",
        duration: "Imediata",
        description:
          "Você e um aliado (gastando reação) avançam trocando de posição sucessivamente, realizando 2 ataques corpo a corpo cada contra o alvo desprevenido.",
      },
    ],
  },
];
