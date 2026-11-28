import { Origin } from "../constants";

export interface ClanOption {
  id: string;
  name: string;
  trait: string;
  description: string;
}

export interface AnatomyOption {
  id: string;
  name: string;
  effect: string;
}

export interface OriginFeature {
  name: string;
  description: string;
}

export interface OriginDefinition {
  id: string;
  name: Origin;
  isOptional: boolean;
  source: string;
  summary: string;
  attributeBonusText: string;
  hasInnateTechnique: boolean;
  features: OriginFeature[];
  clans?: ClanOption[];
  anatomyOptions?: AnatomyOption[];
}

export const ORIGINS_DATA: OriginDefinition[] = [
  // ── 7 Origens Padrão (Livro Básico v2.5) ──
  {
    id: "inato",
    name: "Inato",
    isOptional: false,
    source: "Livro Básico v2.5",
    summary: "Feiticeiro comum que despertou uma técnica amaldiçoada única espontaneamente.",
    attributeBonusText: "+2 em um atributo e +1 em outro (ou +1 em três atributos distintos).",
    hasInnateTechnique: true,
    features: [
      {
        name: "Talento Natural",
        description: "Recebe um talento à sua escolha no 1° nível (conforme pré-requisitos).",
      },
      {
        name: "Marca Registrada",
        description: "Concede 1 feitiço adicional de sua técnica, cujo custo em PE é reduzido em 1 (mínimo 1).",
      },
    ],
  },
  {
    id: "herdado",
    name: "Herdado",
    isOptional: false,
    source: "Livro Básico v2.5",
    summary: "Descendente de uma das linhagens nobres e históricas do Jujutsu japonês.",
    attributeBonusText: "+2 em um atributo e +1 em outro.",
    hasInnateTechnique: true,
    clans: [
      {
        id: "gojo",
        name: "Clã Gojo",
        trait: "Eficiência Amaldiçoada / Seis Olhos",
        description: "Bônus +2 em INT ou SAB, e +1 no outro. Recebe +1 PE máximo em todos os níveis pares (2, 4, 6, 8, etc.).",
      },
      {
        id: "zenin",
        name: "Clã Zenin",
        trait: "Tradição Armada e Marcial",
        description: "Bônus +2 em qualquer atributo, e +1 em outro. Proficiência com todas as armas marciais e +1 de dano corporal com armas.",
      },
      {
        id: "kamo",
        name: "Clã Kamo",
        trait: "Vigor Sanguíneo",
        description: "Bônus +2 em CON ou SAB, e +1 no outro. Manipulação de sangue: recebe +1 PV por nível a partir do 2° nível.",
      },
      {
        id: "inumaki",
        name: "Clã Inumaki",
        trait: "Fala Amaldiçoada",
        description: "Bônus +2 em INT ou PRE, e +1 no outro. Garganta e cordas vocais rituais fortificadas contra o desgaste sonoro.",
      },
    ],
    features: [
      {
        name: "Linhagem Antiga",
        description: "Acesso aos conhecimentos arcanos, herança política e feitiços de clã.",
      },
    ],
  },
  {
    id: "derivado",
    name: "Derivado",
    isOptional: false,
    source: "Livro Básico v2.5",
    summary: "Manifestou energia e técnica através de experimentos, acidentes ou influência externa.",
    attributeBonusText: "+2 em um atributo e +1 em outro.",
    hasInnateTechnique: true,
    features: [
      {
        name: "Resistência Adaptativa",
        description: "Soma metade do modificador de Constituição em testes de resistência de Astúcia ou Vontade.",
      },
      {
        name: "Técnica Derivada",
        description: "Acesso a variações instáveis de custo flexível e efeitos colaterais adaptativos.",
      },
    ],
  },
  {
    id: "restringido",
    name: "Restringido",
    isOptional: false,
    source: "Livro Básico v2.5",
    summary: "Portador de uma Restrição Celestial que suprime 100% da energia em troca de proezas físicas divinas.",
    attributeBonusText: "+2 em FOR e +2 em DES (ou CON).",
    hasInnateTechnique: false,
    features: [
      {
        name: "Físico Divino / Estamina",
        description: "0 PE. Possui Estamina = Nvl x 4. Sentidos hiperaguçados e imunidade à detecção de energia.",
      },
      {
        name: "Mestria Celestial",
        description: "No nível 10+, dobra o bônus de treino (2x BT) em perícias físicas onde é Mestre.",
      },
    ],
  },
  {
    id: "feto_hibrido",
    name: "Feto Amaldiçoado Híbrido",
    isOptional: false,
    source: "Livro Básico v2.5",
    summary: "Híbrido de carne humana e essência maldita, portador de sangue cáustico e anatomia aberrante.",
    attributeBonusText: "+2 em Constituição e +1 em outro atributo.",
    hasInnateTechnique: true,
    anatomyOptions: [
      { id: "bracos_extras", name: "Braços Extras", effect: "+1 ataque corpo a corpo desarmado ou empunhadura dupla sem penalidade." },
      { id: "carapaca", name: "Carapaça Óssea", effect: "+1 na Defesa natural e resistência a dano cortante/perfurante." },
      { id: "sangue_venenoso", name: "Sangue Corrosivo", effect: "Inimigos que causarem dano corpo a corpo sofrem dano de veneno igual ao mod. CON." },
    ],
    features: [
      {
        name: "Sangue Tóxico",
        description: "Imunidade a venenos e capacidade de regenerar membros através do consumo de carne ou descanso.",
      },
    ],
  },
  {
    id: "sem_tecnica",
    name: "Sem Técnica",
    isOptional: false,
    source: "Livro Básico v2.5",
    summary: "Feiticeiro capaz de manipular energia amaldiçoada pura, mas desprovido de técnica inata.",
    attributeBonusText: "+2 em um atributo e +1 em outro, ou +1 em três atributos.",
    hasInnateTechnique: false,
    features: [
      {
        name: "Maestria em Ferramentas",
        description: "Empunha qualquer ferramenta amaldiçoada somando +1 na margem de crítico.",
      },
      {
        name: "Versatilidade Tática",
        description: "Ganha 2 talentos adicionais ao longo da progressão para compensar a ausência de técnica.",
      },
    ],
  },
  {
    id: "corpo_mutante",
    name: "Corpo Amaldiçoado Mutante",
    isOptional: false,
    source: "Livro Básico v2.5",
    summary: "Forma de vida autônoma criada com múltiplos núcleos de alma (como Panda).",
    attributeBonusText: "+2 em Constituição e +1 em Força ou Destreza.",
    hasInnateTechnique: true,
    features: [
      {
        name: "Três Núcleos",
        description: "Possui formas corporais distintas com atributos alternáveis em combate.",
      },
      {
        name: "Reserva de Núcleo",
        description: "Quando um núcleo cai a 0 PV, pode alternar para o núcleo secundário como reação.",
      },
    ],
  },

  // ── 3 Origens Opcionais / Suplementos ──
  {
    id: "reencarnado",
    name: "Feiticeiro Reencarnado",
    isOptional: true,
    source: "Guia do Narrador v0.4",
    summary: "Feiticeiro ancestral da Era Heian ou eras passadas despertado em um receptáculo moderno.",
    attributeBonusText: "+3 pontos adicionais para distribuir livremente entre seus atributos.",
    hasInnateTechnique: true,
    features: [
      {
        name: "Conhecimentos Passados",
        description: "Treinado em 2 perícias extras, Mestre em 1 perícia e vantagem em testes de História da sua era.",
      },
      {
        name: "Experiência do Reencarnado",
        description: "1x por cena, como ação bônus, pode emular uma habilidade de especialização por 1 rodada.",
      },
    ],
  },
  {
    id: "maldicao",
    name: "Maldição",
    isOptional: true,
    source: "Grimório das Maldições v0.6",
    summary: "Espírito amaldiçoado senciente jogável formado puramente de sentimentos negativos humanos.",
    attributeBonusText: "+4 pontos para distribuir entre atributos (máximo +3 no mesmo atributo).",
    hasInnateTechnique: true,
    features: [
      {
        name: "Existência Metafísica",
        description: "Imune a dano não mágico/não amaldiçoado. Vulnerável a energia reversa (RCT).",
      },
      {
        name: "Natureza Amaldiçoada",
        description: "Recebe +1 PE máximo por nível de personagem.",
      },
    ],
  },
  {
    id: "fantoche_definitivo",
    name: "Fantoche Definitivo",
    isOptional: true,
    source: "Enciclopédia Amaldiçoada v0.9",
    summary: "Corpo mecânico/sintético de combate operado remotamente por um mestre com restrição.",
    attributeBonusText: "+3 pontos para distribuir livremente entre seus atributos.",
    hasInnateTechnique: false,
    features: [
      {
        name: "Ligado ao Mestre",
        description: "Visão compartilhada e estoque de PE compartilhado com o mestre.",
      },
      {
        name: "Fantoche Amaldiçoado",
        description: "Imune a venenos e dano direto à alma; não se beneficia de itens do tipo Medicina.",
      },
    ],
  },
];
