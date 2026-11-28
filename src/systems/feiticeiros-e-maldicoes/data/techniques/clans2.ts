import { InnateTechnique } from "./types";

export const CLANS2_TECHNIQUES: InnateTechnique[] = [
  {
    id: "dez_sombras",
    name: "Dez Sombras",
    characterRef: "Megumi Fushiguro",
    category: "Clã Tradicional",
    suggestedAttribute: "SAB",
    source: "Enciclopédia Amaldiçoada v0.9 / Livro Base v2.5",
    description:
      "Técnica herdada do Clã Zenin que manifesta dez shikigamis a partir de sombras através de rituais de exorcismo, além de manipular sombras para mobilidade e armazenamento.",
    basicFunction:
      "Máximo de 10 invocações. Inicia com dois Cães Divinos (Branco e Negro). Permite Ritual de Exorcismo (Ação Comum, área de 18m) para domar novos shikigamis. Herança das Sombras: shikigami destruído transfere seu poder para outro (Totalidade).",
    domainExpansion: {
      name: "Jardim das Sombras Sobrepostas",
      type: "Expansão Incompleta",
      cost: 15,
      description:
        "Espalha sombras fluidas em área de 4,5m × BT (duração 1 + Nível de Aptidão em Domínio). Todas as sombras domadas contam como ativas sem custo de PE ou ação. Manifesta clones (⌊BT/2⌋) que agem e podem absorver ataques como reação. Se fechar barreira em espaço fechado, alvos sem reforço de 1 PE caem no abismo de sombras.",
    },
    spells: [
      {
        name: "Ocultação Sombria",
        level: 1,
        cost: "2 PE",
        action: "Ação Bônus",
        range: "4,5 Metros",
        target: "Uma Sombra",
        duration: "Variável",
        description:
          "Mergulha na sombra de uma criatura ou objeto dentro de 4,5m. Fica indetectável e invisível. Ao sair e atacar o portador da sombra, o alvo fica desprevenido.",
      },
      {
        name: "Passo Sombrio",
        level: 1,
        cost: "2 PE",
        action: "Ação Bônus",
        range: "9 Metros",
        target: "Uma Sombra",
        duration: "Imediata",
        description:
          "Teleporta instantaneamente para a sombra de uma criatura voluntária dentro de 9m sem causar ataques de oportunidade.",
      },
      {
        name: "Armazenamento nas Sombras",
        level: 1,
        cost: "2 PE",
        action: "Ação Bônus",
        range: "Próprio",
        target: "Próprio",
        duration: "Sustentada",
        description:
          "Permite guardar ferramentas e armas dentro da própria sombra, acessando-as livremente como Ação Bônus ou Reação.",
      },
      {
        name: "Fuga do Coelho",
        level: 3,
        cost: "8 PE",
        action: "Reação",
        range: "Próprio",
        target: "Próprio",
        duration: "Imediata",
        description:
          "Invoca enxame massivo de coelhos para negar um ataque recebido e teleportar até 9m para espaço desocupado.",
      },
    ],
  },
  {
    id: "projecao",
    name: "Projeção",
    characterRef: "Naobito Zenin / Naoya Zenin",
    category: "Clã Tradicional",
    suggestedAttribute: "DEX",
    source: "Enciclopédia Amaldiçoada v0.9 / Livro Base v2.5",
    description:
      "Técnica do Clã Zenin que divide 1 segundo em 24 quadros de animação visual, permitindo aceleração e movimentos pré-programados com congelamento temporal de oponentes.",
    basicFunction:
      "O usuário planeja 24 quadros de ação por rodada. Criaturas tocadas que violem as leis de trajetória da animação ficam congeladas em um quadro sólido de vidro por 1 segundo.",
    spells: [
      {
        name: "Conjunto de Movimentos Rápidos",
        level: 1,
        cost: "2 PE",
        action: "Ação Completa",
        range: "Próprio",
        target: "Próprio",
        duration: "Imediata",
        description:
          "Executa sequência de movimentos nos 24 quadros com deslocamento total. Alvos atacados devem passar em TR de Reflexos ou ficam desprevenidos.",
      },
      {
        name: "Acúmulo de Velocidade",
        level: 1,
        cost: "2 PE",
        action: "Reação",
        range: "Próprio",
        target: "Próprio",
        duration: "Sustentada",
        description:
          "Aumenta deslocamento em +3m e +1,5m por turno sustentado (1 PE/rodada) até um limite de DES vezes, acumulando aceleração cinética.",
      },
      {
        name: "Congelamento Defensivo",
        level: 2,
        cost: "5 PE",
        action: "Reação",
        range: "Próprio",
        target: "Próprio",
        duration: "Imediata",
        description:
          "Toca o atacante como reação. Teste de Reflexos contra o acerto: se superar, anula o golpe e congela o agressor por 1 rodada.",
      },
      {
        name: "Congelamento Destrutivo",
        level: 3,
        cost: "8 PE",
        action: "Ação Bônus",
        range: "Próprio",
        target: "Próprio",
        duration: "Sustentada",
        description:
          "Ataques contra oponentes exigem TR de Reflexos. Em falha, acerto garantido e condição Paralisado (quadro congelado) no impacto (até BT vezes por cena).",
      },
    ],
  },
];
