import { InnateTechnique } from "./types";

export const SORCERERS2A_TECHNIQUES: InnateTechnique[] = [
  {
    id: "copia",
    name: "Cópia",
    characterRef: "Yuta Okkotsu",
    category: "Grau Especial",
    suggestedAttribute: "PRE",
    source: "Enciclopédia Amaldiçoada v0.9 / Livro Base v2.5",
    description:
      "Técnica de Yuta Okkotsu ligada à 'Rainha das Maldições' Rika. Permite copiar técnicas inatas de outros feiticeiros e maldições após Rika morder o alvo, além de armazenar feitiços e ferramentas amaldiçoadas.",
    basicFunction:
      "Concede o shikigami autônomo Rika (inicia com 30 PV, Defesa 17, FOR 16, PRE 14 e ataque Mordida +5, 2d8+3). Rika evolui a cada aumento de BT. Quando Rika morde um alvo, o usuário pode copiar 1 feitiço como Ação Bônus ou Reação, podendo memorizar até ⌊BT/2⌋ funcionamentos básicos.",
    domainExpansion: {
      name: "Puro Amor Mútuo",
      type: "Expansão Completa Letal",
      cost: 20,
      description:
        "Cria espaço esférico de 9m repleto de cruzes com infinitas katanas cravadas (duração 3 + Nível de Aptidão em Domínio). Pegar uma katana é Ação Livre repetível; usar o feitiço copiado nela é Ação Comum sem custo de PE! Com Acerto Garantido, qualquer técnica copiada pode ser infundida como acerto automático na área.",
    },
    spells: [
      {
        name: "Comando a Rika: Repor Energia",
        level: 3,
        cost: "0 PE",
        action: "Ação Comum",
        range: "Toque",
        target: "Próprio",
        duration: "Imediata",
        description:
          "Rika canaliza energia vital restaurando PE igual a ⌊Nível/2⌋ do portador (1x por descanso longo).",
      },
      {
        name: "Disparo Concentrado de Rika",
        level: 3,
        cost: "8 PE",
        action: "Ação Comum",
        range: "18 Metros",
        target: "Uma Criatura",
        duration: "Imediata",
        description:
          "Rika dispara feixe puro de energia amaldiçoada condensada. Ataque à distância: causa 4d8 + Mod FOR de Rika em dano de força.",
        rollFormula: "4d8",
      },
      {
        name: "Proteção Apaixonada",
        level: 4,
        cost: "Passiva",
        action: "Reação",
        range: "Próprio",
        target: "Próprio",
        duration: "Imediata",
        description:
          "1x por descanso, se o portador tiver PV reduzidos a 0, Rika intervém anulando o golpe e absorvendo o impacto.",
      },
    ],
  },
  {
    id: "criatura_mistica_ambar",
    name: "Criatura Mística Âmbar",
    characterRef: "Hajime Kashimo",
    category: "Feiticeiro Reencarnado",
    suggestedAttribute: "DEX",
    source: "Enciclopédia Amaldiçoada v0.9 / Livro Base v2.5",
    description:
      "Técnica de Hajime Kashimo que concede à aura propriedades de corrente elétrica contínua, permitindo acumular cargas para descargas sem teste de esquiva e transformar o corpo em fenômenos elétricos.",
    basicFunction:
      "Concede Aura Elemental (Chocante). Ataques acumulam cargas negativas em si e positivas no alvo. A ativação completa reconstrói a carne como fenômenos elétricos com desgaste gradual.",
    spells: [
      {
        name: "Liberação de Raio",
        level: 1,
        cost: "2 PE + 2 Cargas",
        action: "Ação Comum",
        range: "12 Metros",
        target: "Uma Criatura",
        duration: "Imediata",
        description:
          "Consome 2 cargas negativas para descarregar raio no alvo com cargas positivas. Causa 2d8 chocante + 1d8 por carga positiva extra (até +3 dados).",
        rollFormula: "2d8",
      },
      {
        name: "Aprimoramento de Cargas",
        level: 1,
        cost: "Passiva",
        action: "Passiva",
        range: "Próprio",
        target: "Próprio",
        duration: "Permanente",
        description:
          "1x/rodada, ao aplicar carga, adiciona uma carga extra. O limite de dados bônus de Liberação de Raio é dobrado. Reduz PE máximo em 2.",
      },
      {
        name: "Garras Âmbar",
        level: 2,
        cost: "4 PE",
        action: "Ação Bônus",
        range: "Próprio",
        target: "Próprio",
        duration: "Sustentada",
        description:
          "Fenômeno: manifesta garras bioelétricas nos braços. Desarmados ganham Leve e Fineza, causando +3d8 de dano de força ou chocante.",
        rollFormula: "3d8",
      },
      {
        name: "Canhão Vocal",
        level: 2,
        cost: "4 PE",
        action: "Ação Comum",
        range: "6 Metros",
        target: "Criaturas na Área",
        duration: "Imediata",
        description:
          "Fenômeno: dispara onda sônica de alta frequência. TR de Fortitude: 6d8 de dano de força e condição Surdo por 1 rodada.",
        rollFormula: "6d8",
      },
      {
        name: "Visão Raio-X",
        level: 3,
        cost: "6 PE",
        action: "Ação Bônus",
        range: "Próprio",
        target: "Próprio",
        duration: "Sustentada",
        description:
          "Fenômeno: visão eletromagnética completa. Concede +10 Percepção, +4 Reflexos, +4 no acerto e visão através de matéria opaca.",
      },
      {
        name: "Palmas Místicas",
        level: 3,
        cost: "6 PE",
        action: "Ação Comum",
        range: "Linha de 13,5m",
        target: "Criaturas na Linha",
        duration: "Imediata",
        description:
          "Fenômeno: rajada de plasma em linha de 13,5m. TR de Reflexos: 8d12 de dano de força (metade em falha).",
        rollFormula: "8d12",
      },
      {
        name: "Condenação Voltaica",
        level: 4,
        cost: "12 PE + 4 Cargas",
        action: "Ação Comum",
        range: "30 Metros",
        target: "Uma Criatura",
        duration: "Imediata",
        description:
          "Raio ultra-denso (requer 4 cargas). TR de Fortitude: 8d10 dano chocante e condição Paralisado por 1 rodada em caso de falha.",
        rollFormula: "8d10",
      },
      {
        name: "Presa do Deus do Raio",
        level: 4,
        cost: "12 PE + 4 Cargas",
        action: "Ação Comum",
        range: "30 Metros",
        target: "Uma Criatura",
        duration: "Imediata",
        description:
          "Descarga direcionada a membro (requer 4 cargas). Causa 8d10 dano chocante e mutila o membro (TR Fortitude escolhe aleatório em sucesso; usuário escolhe em falha).",
        rollFormula: "8d10",
      },
      {
        name: "Ativação Intracerebral",
        level: 5,
        cost: "10 PE",
        action: "Ação Bônus",
        range: "Próprio",
        target: "Próprio",
        duration: "Sustentada",
        description:
          "Fenômeno supremo: estimulação neural absoluta. DES aumenta em +6, ganha 1 ação de movimento adicional por turno e vantagem em Reflexos e Acrobacia.",
      },
    ],
  },
];
