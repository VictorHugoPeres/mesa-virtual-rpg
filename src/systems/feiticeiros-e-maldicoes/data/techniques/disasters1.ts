import { InnateTechnique } from "./types";

export const DISASTERS1_TECHNIQUES: InnateTechnique[] = [
  {
    id: "chamas_do_desastre",
    name: "Chamas do Desastre",
    characterRef: "Jogo",
    category: "Maldição do Desastre",
    suggestedAttribute: "INT",
    source: "Enciclopédia Amaldiçoada v0.9 / Livro Base v2.5",
    description:
      "Técnica da Maldição do Desastre Jogo que manifesta e controla fogo e rocha vulcânica incandescente, atuando corpo a corpo e à distância.",
    basicFunction:
      "Gera e manipula fogo e lava física ou telepaticamente para destruição em área ou alvos pontuais.",
    domainExpansion: {
      name: "Caixão da Montanha de Ferro",
      type: "Expansão Completa Letal",
      cost: 20,
      description:
        "Cria interior de um vulcão de 9m (duração 3 + Nível de Aptidão em Domínio). Inimigos no interior sofrem 1d10+5 de dano queimante no início do turno. Suas habilidades causam +1 dado e +5 de dano, negando 3 de RD. Compatível com Acerto Garantido.",
    },
    spells: [
      {
        name: "Disparo Ardente",
        level: 0,
        cost: "0 PE",
        action: "Ação Comum",
        range: "9 Metros",
        target: "Uma Criatura",
        duration: "Imediata",
        description:
          "Dispara fagulha flamejante. Teste de ataque à distância: causa 1d10 de dano queimante.",
        rollFormula: "1d10",
      },
      {
        name: "Revestimento Abrasador",
        level: 0,
        cost: "Passiva",
        action: "Passiva",
        range: "Próprio",
        target: "Próprio",
        duration: "Permanente",
        description:
          "Reveste o corpo com fina camada de calor vulcânico, concedendo resistência a dano Congelante.",
      },
      {
        name: "Orbe de Fogo",
        level: 1,
        cost: "2 PE",
        action: "Ação Comum",
        range: "12 Metros",
        target: "Uma Criatura",
        duration: "Imediata",
        description:
          "Orbe condensado explosivo. TR de Reflexos: 3d8 de dano queimante (metade em sucesso).",
        rollFormula: "3d8",
      },
      {
        name: "Toque Queimante",
        level: 1,
        cost: "2 PE",
        action: "Ação Bônus",
        range: "Próprio",
        target: "Próprio",
        duration: "Sustentada",
        description:
          "Cobre mãos ou armas com chamas. Ataques corpo a corpo causam +1d10 dano queimante. 1 PE/rodada para sustentar.",
        rollFormula: "1d10",
      },
      {
        name: "Combustão Imediata",
        level: 2,
        cost: "5 PE",
        action: "Ação Comum",
        range: "18 Metros",
        target: "Uma Criatura",
        duration: "Imediata",
        description:
          "Incendeia o alvo telepaticamente. TR de Fortitude: 4d8 dano queimante e condição Incendiado (3d8 no início do turno).",
        rollFormula: "4d8",
      },
      {
        name: "Explosão Flamejante",
        level: 2,
        cost: "5 PE",
        action: "Ação Comum",
        range: "Esfera de 4,5m",
        target: "Área ao Redor",
        duration: "Imediata",
        description:
          "Detona explosão ao redor de si. Criaturas na área fazem TR de Fortitude: 4d8 dano queimante (metade em sucesso).",
        rollFormula: "4d8",
      },
      {
        name: "Fogo Verdadeiro",
        level: 2,
        cost: "Passiva",
        action: "Passiva",
        range: "Próprio",
        target: "Próprio",
        duration: "Permanente",
        description:
          "Aumenta a temperatura ígnea. Sempre que causar dano queimante com a técnica, ignora RD igual ao dobro do BT. Reduz PE máximo em 4.",
      },
      {
        name: "Insetos de Brasa",
        level: 2,
        cost: "5 PE",
        action: "Ação Comum",
        range: "9 Metros",
        target: "Até 4 Insetos",
        duration: "Imediata",
        description:
          "Dispara enxame de insetos explosivos. Cada inseto ferroa (1d8 perfurante) e explode em seguida (TR Reflexos: 2d8 queimante).",
        rollFormula: "1d8",
      },
      {
        name: "Raio de Chamas",
        level: 2,
        cost: "5 PE",
        action: "Ação Comum",
        range: "Cone de 4,5m",
        target: "Criaturas na Área",
        duration: "Imediata",
        description:
          "Cone vulcânico a partir das mãos. TR de Fortitude: 4d8 dano queimante e condição Incendiado (2d8/rodada).",
        rollFormula: "4d8",
      },
      {
        name: "Incinerar",
        level: 5,
        cost: "20 PE",
        action: "Ação Comum",
        range: "6 Metros",
        target: "Uma Criatura",
        duration: "Imediata",
        description:
          "Liberação máxima de chamas inextinguíveis. TR de Fortitude: 16d12 dano queimante e incendeia por 6d12/rodada.",
        rollFormula: "16d12",
      },
      {
        name: "Técnica Máxima: Meteoro",
        level: 5,
        cost: "25 PE",
        action: "Ação Completa",
        range: "48 Metros",
        target: "Esfera de 50m",
        duration: "1 Rodada",
        description:
          "Invoca um colossal meteoro flamejante que colide após 1 rodada. Criaturas na área fazem TR de Fortitude com desvantagem: 30d10 dano queimante (metade em sucesso). Devasta terreno num raio de 50m.",
        rollFormula: "30d10",
      },
    ],
  },
];
