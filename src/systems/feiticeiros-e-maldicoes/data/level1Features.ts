export interface Level1Feat {
  id: string;
  name: string;
  category: "Geral" | "Marcial" | "Jujutsu" | "Origem";
  prerequisite?: string;
  description: string;
  benefit: string;
}

export const LEVEL_1_TALENTS: Level1Feat[] = [
  {
    id: "incremento_atributo",
    name: "Incremento de Atributo",
    category: "Geral",
    description: "Dedicação e treinamento contínuo fortalecem suas bases fundamentais.",
    benefit: "Aumente um atributo em +2 ou dois atributos distintos em +1 (respeitando o limite atual).",
  },
  {
    id: "atleta_nato",
    name: "Atleta Nato",
    category: "Marcial",
    prerequisite: "Força 13 ou Destreza 13",
    description: "Você possui condicionamento físico superior para esforços explosivos.",
    benefit: "+3m de Deslocamento e vantagem em testes de Atletismo para saltar e escalar.",
  },
  {
    id: "mente_focada",
    name: "Mente Focada",
    category: "Geral",
    prerequisite: "Inteligência 13 ou Sabedoria 13",
    description: "Sua concentração é sólida mesmo sob fogo cerrado ou ameaça iminente.",
    benefit: "+2 em testes de resistência de Astúcia e Vontade.",
  },
  {
    id: "reflexos_rapidos",
    name: "Reflexos Rápidos",
    category: "Marcial",
    prerequisite: "Destreza 13",
    description: "Sua resposta motora ao perigo é instantânea.",
    benefit: "+3 na Iniciativa e não pode ser pego desprevenido na primeira rodada.",
  },
  {
    id: "especialista_pericia",
    name: "Especialista em Perícia",
    category: "Geral",
    description: "Aprofundou o estudo em habilidades fundamentais.",
    benefit: "Torna-se Treinado em 2 perícias à escolha, ou Mestre em uma perícia onde já é Treinado.",
  },
  {
    id: "tolerancia_dor",
    name: "Tolerância à Dor",
    category: "Geral",
    prerequisite: "Constituição 13",
    description: "Seu corpo suporta castigo extremo sem quebrar o ritmo.",
    benefit: "+5 PV máximos e vantagem em testes de Fortitude contra atordoamento.",
  },
  {
    id: "olhos_atentos",
    name: "Olhos Atentos",
    category: "Geral",
    prerequisite: "Sabedoria 13",
    description: "Nada escapa à sua visão periférica e percepção dos detalhes.",
    benefit: "+5 na Atenção passiva e ignora penalidades de camuflagem leve.",
  },
  {
    id: "presenca_imponente",
    name: "Presença Imponente",
    category: "Geral",
    prerequisite: "Presença 13",
    description: "Sua chegada altera o clima da sala e atrai todas as atenções.",
    benefit: "+2 em testes de Intimidação e Persuasão; pode usar Presença em Iniciativa 1x/descanso.",
  },
  {
    id: "conexoes_jujutsu",
    name: "Conexões Jujutsu",
    category: "Jujutsu",
    description: "Você possui contatos com superiores do Colégio, ferreiros ou informantes.",
    benefit: "Recebe 1 item adicional de custo 1 no início da campanha e desconto de 20% em requisições.",
  },
];

export interface Level1Aptitude {
  id: string;
  name: string;
  tree: "Aura" | "Controle" | "Barreira" | "Domínio" | "Reversa";
  costPE: number;
  description: string;
}

export const LEVEL_1_APTITUDES: Level1Aptitude[] = [
  {
    id: "reforco_basico",
    name: "Reforço Básico de Energia",
    tree: "Aura",
    costPE: 1,
    description: "Cobre os punhos ou arma com energia pura: seus golpes causam dano amaldiçoado.",
  },
  {
    id: "deteccao_residuos",
    name: "Detecção de Resíduos",
    tree: "Controle",
    costPE: 1,
    description: "Sintoniza a visão com vestígios amaldiçoados deixados no ambiente nas últimas 24 horas.",
  },
  {
    id: "cortina_basica",
    name: "Cortina Simples (Choari)",
    tree: "Barreira",
    costPE: 2,
    description: "Ergue uma barreira de ocultação visual para isolar a área de combate dos civis comuns.",
  },
  {
    id: "esquiva_amaldicoada",
    name: "Impulso de Esquiva",
    tree: "Aura",
    costPE: 1,
    description: "Gasta 1 PE como reação para somar +2 na Defesa contra um ataque específico.",
  },
];
