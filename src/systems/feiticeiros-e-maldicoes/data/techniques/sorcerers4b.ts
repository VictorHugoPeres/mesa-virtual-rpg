import { InnateTechnique } from "./types";

export const SORCERERS4B_TECHNIQUES: InnateTechnique[] = [
  {
    id: "sentenca_mortal",
    name: "Sentença Mortal",
    characterRef: "Hiromi Higuruma",
    category: "Feiticeiro Desperto",
    suggestedAttribute: "INT",
    source: "Enciclopédia Amaldiçoada v0.9 / Livro Base v2.5",
    description:
      "Técnica de Hiromi Higuruma baseada na lei e na justiça. Permite manifestar o martelo do juiz com geometria variável e invocar o shikigami Juiz em um tribunal de regras de não-violência.",
    basicFunction:
      "Recebe o shikigami Juiz (Defesa 14, 15 PV, Astúcia +5, Intuição +5, PRE 12) e a arma Martelo da Justiça. No 4º nível recebe Expansão de Domínio Completa por custo reduzido de 10 PE.",
    domainExpansion: {
      name: "Sentença de Morte",
      type: "Expansão Completa Não-Letal",
      cost: 10,
      description:
        "Cria tribunal de 9m com o shikigami Juiz e guilhotinas de fundo (duração 3 + Nível de Aptidão em Domínio). Força não-violência absoluta. Conduz julgamento com evidência em envelope selado. Veredito de culpado impõe Confisco (perda da técnica ou energia) ou Pena de Morte (concede a Espada do Carrasco de acerto letal instantâneo).",
    },
    spells: [
      {
        name: "Martelo da Justiça",
        level: 0,
        cost: "0 PE",
        action: "Ação Bônus",
        range: "Próprio",
        target: "Próprio",
        duration: "Imediata",
        description:
          "Manifesta martelo de madeira judiciário versátil. Pode alternar para qualquer outra arma corpo a corpo de custo 1 como Ação Bônus.",
      },
      {
        name: "Laçar",
        level: 1,
        cost: "2 PE",
        action: "Ação Comum",
        range: "12 Metros",
        target: "Uma Criatura",
        duration: "Imediata",
        description:
          "Estende o cabo do martelo em formato de gancho flexível. TR de Reflexos: condição Agarrado em caso de falha.",
      },
      {
        name: "Esmagar",
        level: 2,
        cost: "5 PE",
        action: "Ação Comum",
        range: "3 Metros",
        target: "Uma Criatura",
        duration: "Imediata",
        description:
          "Agiganta o martelo para esmagamento. TR de Reflexos: 4d8 dano de impacto e Caído (impossibilitado de levantar, sofrendo 3d8/rodada em falha de Fortitude).",
        rollFormula: "4d8",
      },
      {
        name: "Controle Superior",
        level: 2,
        cost: "Passiva",
        action: "Passiva",
        range: "Próprio",
        target: "Próprio",
        duration: "Permanente",
        description:
          "Invocar e trocar a forma do martelo torna-se Ação Livre e alcança armas de custo 2. Conta como ferramenta amaldiçoada de grau equivalente (até 1º grau). Reduz PE máximo em 4.",
      },
    ],
  },
  {
    id: "trem_do_puro_amor",
    name: "Trem do Puro Amor",
    characterRef: "Kinji Hakari",
    category: "Feiticeiro Notável",
    suggestedAttribute: "PRE",
    source: "Enciclopédia Amaldiçoada v0.9 / Livro Base v2.5",
    description:
      "Técnica de Kinji Hakari inspirada em máquinas de pachinko temáticas de romance. Desencadeia eventos de aposta dentro de sua expansão em busca do Jackpot para alcançar energia amaldiçoada infinita.",
    basicFunction:
      "Manifesta portas de metrô e bolas de pachinko. No nível 4, ganha Expansão de Domínio Completa por custo de 10 PE com velocidade de ativação em 0.2s que vence qualquer confronto de barreiras.",
    domainExpansion: {
      name: "Aposta Mortal Indolente",
      type: "Expansão Completa Rápida (0.2s)",
      cost: 10,
      description:
        "Cria estação de metrô pachinko de 9m (ativação ultrarrápida em 0.2s). Oponentes aprendem as regras instantaneamente. Dispara eventos riichi (1d100) com rolagens de 3d6 no final da rodada. Conseguir 3 números iguais ativa o Jackpot de energia infinita e reconstituição física automática.",
    },
    spells: [
      {
        name: "Indicador: Bola",
        level: 1,
        cost: "2 PE",
        action: "Ação Comum",
        range: "12 Metros",
        target: "Uma Criatura",
        duration: "Imediata",
        description:
          "Dispara bola pesada de pachinko. Ataque à distância: 4d8 dano de impacto. No domínio, rola 1d20 para gerar expectativa.",
        rollFormula: "4d8",
      },
      {
        name: "Indicador: Portas",
        level: 1,
        cost: "2 PE",
        action: "Ação Comum",
        range: "12 Metros",
        target: "Uma Criatura",
        duration: "Imediata",
        description:
          "Duas portas de metrô se fecham comprimindo o alvo. TR de Reflexos: condição Agarrado em falha. No domínio, rola 1d20 para gerar expectativa.",
      },
      {
        name: "Estado de Jackpot",
        level: 5,
        cost: "0 PE (Condicional)",
        action: "Efeito do Domínio",
        range: "Próprio",
        target: "Próprio",
        duration: "5 Rodadas",
        description:
          "Conquista de 3 números iguais no domínio: 5 rodadas com energia amaldiçoada infinita! PE restaura ao máximo no início de cada turno, concede Energia Reversa, Regeneração Aprimorada e Fluxo Constante automático sem gastar reação.",
      },
    ],
  },
  {
    id: "love_rendezvous",
    name: "Love Rendezvous",
    characterRef: "Kirara Hoshi",
    category: "Feiticeiro Notável",
    suggestedAttribute: "DEX",
    source: "Enciclopédia Amaldiçoada v0.9 / Livro Base v2.5",
    description:
      "Técnica de Kirara Hoshi que marca alvos e objetos com as 5 estrelas da constelação Cruzeiro do Sul, forçando atração e restrição de aproximação que só permite seguir a ordem cósmica estrita.",
    basicFunction:
      "Marca energias com as estrelas: Imai → Acrux → Mimosa → Ginan → Gracrux. Qualquer tentativa de se aproximar fora da ordem gera repulsão magnética e aprisionamento inquebrável.",
    spells: [
      {
        name: "Imbuir Objeto",
        level: 0,
        cost: "0 PE",
        action: "Variável",
        range: "Toque",
        target: "Objetos",
        duration: "Imediata",
        description:
          "Imbui objetos com estrelas marcadas. 1 objeto como Ação Livre, 2 como Bônus, 3 como Comum. Alvos fora da ordem são atraídos aos objetos inevitavelmente.",
      },
      {
        name: "Marcação Rápida",
        level: 0,
        cost: "Passiva",
        action: "Reação",
        range: "Toque",
        target: "Uma Criatura",
        duration: "Imediata",
        description:
          "Permite utilizar a habilidade de marcar energia como Reação imediata ao tocar ou ser tocado por um inimigo.",
      },
      {
        name: "Agilidade com Estrelas",
        level: 1,
        cost: "Passiva",
        action: "Passiva",
        range: "Próprio",
        target: "Próprio",
        duration: "Permanente",
        description:
          "Aumenta a quantidade de energias marcáveis em +1 (3 com Ação Comum, 2 com Bônus). Reduz PE máximo em 2.",
      },
      {
        name: "Marcas Ocultas",
        level: 1,
        cost: "Passiva",
        action: "Passiva",
        range: "Próprio",
        target: "Próprio",
        duration: "Permanente",
        description:
          "A estrela fica oculta no corpo do alvo, exigindo que ele gaste uma Ação Bônus para identificar qual marca possui. Reduz PE máximo em 2.",
      },
    ],
  },
];
