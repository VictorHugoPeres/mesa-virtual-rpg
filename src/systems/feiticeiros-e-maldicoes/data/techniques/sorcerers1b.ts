import { InnateTechnique } from "./types";

export const SORCERERS1B_TECHNIQUES: InnateTechnique[] = [
  {
    id: "proporcoes",
    name: "Proporções",
    characterRef: "Kento Nanami",
    category: "Feiticeiro Notável",
    suggestedAttribute: "FOR",
    source: "Enciclopédia Amaldiçoada v0.9 / Livro Base v2.5",
    description:
      "Técnica de Kento Nanami que divide qualquer alvo em uma proporção de 7:3, criando um ponto fraco artificial que converte ataques comuns em golpes críticos devastadores.",
    basicFunction:
      "Divide o alvo ou membro em 10 partes, gerando ponto fraco em 7:3. Acertos no ponto fraco ativam dano crítico forçado e ignoram defesas.",
    spells: [
      {
        name: "Dividir Proporção",
        level: 0,
        cost: "0 PE",
        action: "Ação Bônus",
        range: "9 Metros",
        target: "Uma Criatura",
        duration: "Um Ataque",
        description:
          "Divide o alvo em 10 linhas. Pode sofrer -2 no acerto visando a linha 7:3 para causar +1d8+2 de dano adicional.",
        rollFormula: "1d8",
      },
      {
        name: "Proporção Destruidora",
        level: 1,
        cost: "2 PE",
        action: "Ação Bônus",
        range: "12 Metros",
        target: "Uma Criatura",
        duration: "Dois Ataques",
        description:
          "Pode sofrer -4 no acerto para causar +2d6+4 de dano no ponto fraco e margem de crítico -1 nos próximos dois ataques.",
        rollFormula: "2d6",
      },
      {
        name: "Proporção Letal",
        level: 2,
        cost: "5 PE",
        action: "Ação Bônus",
        range: "12 Metros",
        target: "Uma Criatura",
        duration: "Dois Ataques",
        description:
          "Pode sofrer -6 no acerto para causar +3d8+6 de dano e margem de crítico -1 nos próximos dois ataques.",
        rollFormula: "3d8",
      },
      {
        name: "Letalidade Proporcional",
        level: 2,
        cost: "Passiva",
        action: "Passiva",
        range: "Próprio",
        target: "Próprio",
        duration: "Permanente",
        description:
          "Acertos no ponto fraco 7:3 ignoram RD igual ao dobro do BT. Reduz o PE máximo em 4.",
      },
      {
        name: "Proporção Específica",
        level: 3,
        cost: "8 PE",
        action: "Ação Bônus",
        range: "12 Metros",
        target: "Um Membro",
        duration: "Um Ataque",
        description:
          "Cria ponto fraco em membro específico. -8 no acerto: se acertar, causa +2d10 dano e destrói ou amputa o membro.",
        rollFormula: "2d10",
      },
      {
        name: "Colapso",
        level: 3,
        cost: "8 PE",
        action: "Ação Comum",
        range: "Corpo a Corpo",
        target: "Esfera de 9m",
        duration: "Imediata",
        description:
          "Golpeia estrutura no ponto fraco causando colapso do terreno. TR de Reflexos: 12d8 de dano de impacto e terreno difícil.",
        rollFormula: "12d8",
      },
    ],
  },
  {
    id: "colera_das_estrelas",
    name: "Cólera das Estrelas",
    characterRef: "Yuki Tsukumo",
    category: "Grau Especial",
    suggestedAttribute: "FOR",
    source: "Enciclopédia Amaldiçoada v0.9 / Livro Base v2.5",
    description:
      "Técnica de Yuki Tsukumo que infunde massa imaginária virtual em seu corpo e no shikigami Garuda, gerando impactos cinéticos colossais sem alterar sua própria densidade.",
    basicFunction:
      "Infunde massa imaginária virtual aumentando a potência dos golpes corpo a corpo. Concede o shikigami Garuda (Defesa 17, 35 PV, FOR 16) que atua como chicote ou projétil massivo.",
    spells: [
      {
        name: "Punho Pesado",
        level: 0,
        cost: "0 PE",
        action: "Ação Bônus",
        range: "Próprio",
        target: "Próprio",
        duration: "Sustentada",
        description:
          "Aumenta levemente a massa virtual. Ataques corpo a corpo causam +1 dado de dano. Sustentar com 1 PE/rodada.",
      },
      {
        name: "Transformar Garuda",
        level: 0,
        cost: "0 PE",
        action: "Ação Bônus",
        range: "Toque",
        target: "Garuda",
        duration: "Ilimitada",
        description:
          "Transforma Garuda em chicote pesado (dano 1d8, Estendida e Pesada). Reverter é Ação Livre.",
        rollFormula: "1d8",
      },
      {
        name: "Laço Pesado",
        level: 1,
        cost: "2 PE",
        action: "Ação Comum",
        range: "12 Metros",
        target: "Uma Criatura",
        duration: "Imediata",
        description:
          "Garuda laça o alvo com massa avassaladora. TR de Reflexos: condições Agarrado e Caído (escapa com TR no início do turno).",
      },
      {
        name: "Punho Pesado: Amplificação",
        level: 1,
        cost: "2 PE",
        action: "Ação Bônus",
        range: "Próprio",
        target: "Próprio",
        duration: "Sustentada",
        description:
          "Massa virtual ampliada: ataques corpo a corpo causam +1 dado de dano e +2 no total. Sustentar por 1 PE/rodada.",
      },
      {
        name: "Esmagamento",
        level: 2,
        cost: "5 PE",
        action: "Ação Comum",
        range: "12 Metros",
        target: "Uma Criatura",
        duration: "Imediata",
        description:
          "Chicoteia com Garuda sobrecarregado. Ataque corpo a corpo: causa 8d8 dano de impacto e TR Fortitude ou derrubado.",
        rollFormula: "8d8",
      },
      {
        name: "Punho Imparável",
        level: 2,
        cost: "Passiva",
        action: "Passiva",
        range: "Próprio",
        target: "Próprio",
        duration: "Permanente",
        description:
          "Com Punho Pesado ativo, ataques corpo a corpo ignoram RD igual ao dobro do BT. Reduz PE máximo em 4.",
      },
      {
        name: "Punho Pesado: Amplificação Dupla",
        level: 2,
        cost: "5 PE",
        action: "Ação Bônus",
        range: "Próprio",
        target: "Próprio",
        duration: "Sustentada",
        description:
          "Massa de alto calibre: ataques corpo a corpo causam +2 dados de dano. Sustentar por 1 PE/rodada.",
      },
      {
        name: "Chute Devastador",
        level: 3,
        cost: "8 PE",
        action: "Ação Comum",
        range: "24 Metros",
        target: "Uma Criatura",
        duration: "Imediata",
        description:
          "Chuta Garuda como projétil massivo de alta densidade. TR de Reflexos: 12d8 de dano de impacto (metade em sucesso).",
        rollFormula: "12d8",
      },
      {
        name: "Destruição Absoluta",
        level: 4,
        cost: "12 PE",
        action: "Ação Comum",
        range: "Linha de 18m",
        target: "Criaturas na Linha",
        duration: "Imediata",
        description:
          "Arremesso sísmico em linha de 18m. TR de Reflexos: 10d10 dano de impacto e converte a área em terreno difícil.",
        rollFormula: "10d10",
      },
    ],
  },
];
