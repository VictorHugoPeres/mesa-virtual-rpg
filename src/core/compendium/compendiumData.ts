export interface CompendiumEntry {
  id: string;
  category: "combate" | "testes" | "morte" | "condicoes" | "dominios";
  title: string;
  summary: string;
  details: string[];
}

export const COMPENDIUM_CATEGORIES = [
  { id: "combate", label: "Combate & Ações" },
  { id: "testes", label: "Testes & Resistências" },
  { id: "condicoes", label: "Condições Jujutsu" },
  { id: "dominios", label: "Domínios & Barreiras" },
  { id: "morte", label: "Morte & Descansos" },
] as const;

export const COMPENDIUM_ENTRIES: CompendiumEntry[] = [
  // COMBATE & AÇÕES
  {
    id: "acao-padrao",
    category: "combate",
    title: "Ação Padrão",
    summary: "A principal ação ofensiva ou mágica no seu turno.",
    details: [
      "Realizar um ataque corpo a corpo ou à distância.",
      "Conjurar um feitiço ou técnica amaldiçoada que demande ação padrão.",
      "Usar certas manobras marciais, talentos ou ativar itens especiais.",
    ],
  },
  {
    id: "acao-bonus",
    category: "combate",
    title: "Ação Bônus",
    summary: "Ação rápida e complementar no turno.",
    details: [
      "Usar feitiços rápidos ou aptidões amaldiçoadas de ativação veloz.",
      "Atacar com arma secundária no combate com duas armas.",
      "Ativar certas posturas ou manobras marciais.",
    ],
  },
  {
    id: "acao-movimento",
    category: "combate",
    title: "Movimento & Posicionamento",
    summary: "Deslocar-se até o seu limite de metros na rodada.",
    details: [
      "Deslocamento padrão: 9 metros (6 quadrados de 1,5m no grid).",
      "Pode ser dividido antes e depois de uma ação padrão.",
      "Levantar-se do chão custa metade do seu deslocamento total.",
    ],
  },
  {
    id: "reacao",
    category: "combate",
    title: "Reação",
    summary: "Resposta instantânea a um gatilho fora ou dentro do seu turno.",
    details: [
      "Ataque de Oportunidade quando um inimigo sai do seu alcance sem desengajar.",
      "Técnicas defensivas e contra-medidas amaldiçoadas (ex: Domínio Simples como reação).",
      "Você possui apenas 1 reação por rodada.",
    ],
  },
  {
    id: "esquiva-desengajar",
    category: "combate",
    title: "Esquivar & Desengajar",
    summary: "Manobras defensivas cruciais de sobrevivência.",
    details: [
      "Esquivar (Ação Padrão): Ataques contra você têm Desvantagem até o início do seu próximo turno, e você tem Vantagem em TR de Reflexos.",
      "Desengajar (Ação Padrão): Seu movimento não provoca ataques de oportunidade pelo resto do turno.",
    ],
  },

  // TESTES & RESISTÊNCIAS
  {
    id: "tr-fortitude",
    category: "testes",
    title: "Fortitude (CON)",
    summary: "Resistência a males biológicos, venenos e impactos físicos maciços.",
    details: [
      "Cálculo: Modificador de Constituição + Maestria (se treinado) + Outros.",
      "Usado contra venenos, atordoamento, congelamento, doenças e choque térmico.",
    ],
  },
  {
    id: "tr-reflexos",
    category: "testes",
    title: "Reflexos (DEX)",
    summary: "Capacidade de desviar rapidamente de explosões, armadilhas e projéteis.",
    details: [
      "Cálculo: Modificador de Destreza + Maestria (se treinado) + Outros.",
      "Em caso de sucesso contra efeitos em área, normalmente reduz o dano pela metade.",
    ],
  },
  {
    id: "tr-vontade",
    category: "testes",
    title: "Vontade (SAB)",
    summary: "Firmeza mental e psíquica contra medo, charme e coerção mental.",
    details: [
      "Cálculo: Modificador de Sabedoria + Maestria (se treinado) + Outros.",
      "Usado para resistir a ilusões, terror amaldiçoado e comandos da fala amaldiçoada.",
    ],
  },
  {
    id: "tr-integridade",
    category: "testes",
    title: "Integridade (CON)",
    summary: "Proteção metafísica da alma contra alterações forçadas.",
    details: [
      "Cálculo: Modificador de Constituição + Maestria (se treinado) + Outros.",
      "Essencial contra técnicas que atacam o formato da alma (ex: Mahito / Transfiguração Ociosa).",
    ],
  },

  // CONDIÇÕES JUJUTSU
  {
    id: "cond-atordoado",
    category: "condicoes",
    title: "Atordoado",
    summary: "Incapaz de agir e defesa enfraquecida.",
    details: [
      "O personagem fica incapacitado (não pode realizar ações nem reações).",
      "Falha automaticamente em testes de resistência de Força e Destreza.",
      "Jogadas de ataque contra o personagem têm Vantagem.",
    ],
  },
  {
    id: "cond-caido",
    category: "condicoes",
    title: "Caído (Prone)",
    summary: "No chão, vulnerável a golpes corpo a corpo.",
    details: [
      "Só pode rastejar (custa o dobro de movimento) ou gastar metade do deslocamento para se levantar.",
      "Ataques corpo a corpo contra o personagem têm Vantagem.",
      "Ataques à distância contra o personagem têm Desvantagem.",
    ],
  },
  {
    id: "cond-envenenado",
    category: "condicoes",
    title: "Envenenado",
    summary: "Toxinas no organismo prejudicando o desempenho físico.",
    details: [
      "Desvantagem em jogadas de ataque e em testes de perícia.",
      "Pode sofrer dano contínuo de veneno no início de cada turno conforme a gravidade.",
    ],
  },
  {
    id: "cond-imobilizado",
    category: "condicoes",
    title: "Agarrado / Imobilizado",
    summary: "Movimento reduzido a zero e controle restrito.",
    details: [
      "Deslocamento se torna 0 metros.",
      "Pode tentar escapar como ação padrão rolando Atletismo ou Acrobacia contra o Atletismo do agressor.",
    ],
  },
  {
    id: "cond-exaustao",
    category: "condicoes",
    title: "Exausto",
    summary: "Esgotamento físico e amaldiçoado severo.",
    details: [
      "Nível 1: Desvantagem em testes de perícia.",
      "Nível 2: Deslocamento reduzido à metade.",
      "Nível 3: Desvantagem em jogadas de ataque e testes de resistência.",
      "Nível 4: Pontos de vida máximos reduzidos à metade.",
      "Nível 5: Deslocamento reduzido a 0. Nível 6: Morte.",
    ],
  },

  // DOMÍNIOS & BARREIRAS
  {
    id: "cortina-choari",
    category: "dominios",
    title: "Cortina (Choari)",
    summary: "Barreira básica para ocultar o mundo jujutsu dos não-feiticeiros.",
    details: [
      "Canto tradicional: 'Emerja das trevas, mais escuro do que o negro. Purifique aquilo que é impuro.'",
      "Oculta visivelmente e espiritualmente o interior em relação ao exterior.",
      "Pode ter condições específicas (ex: impedir a entrada ou saída de certas pessoas).",
    ],
  },
  {
    id: "dominio-simples",
    category: "dominios",
    title: "Domínio Simples (Novo Estilo da Sombra)",
    summary: "Barreira pessoal para anular o acerto garantido de um domínio.",
    details: [
      "Cria uma pequena esfera defensiva ao redor do usuário.",
      "Anula a regra de acerto garantido (*Sure-hit*) de uma Expansão de Domínio inimiga.",
      "Dura turnos limitados antes de ser erodida por domínios refinados.",
    ],
  },
  {
    id: "expansao-dominio",
    category: "dominios",
    title: "Expansão de Domínio (Ryōiki Tenkai)",
    summary: "O ápice da feitiçaria jujutsu — materialização do domínio inato.",
    details: [
      "Custo padrão: 10 Pontos de Energia Amaldiçoada.",
      "Acerto Garantido (*Sure-hit*): Toda técnica do usuário atinge os alvos sem necessidade de teste de acerto.",
      "Buff de Ambiente: Todas as técnicas do usuário recebem bônus numérico.",
      "Exaustão de Técnica pós-domínio: O usuário fica incapaz de usar sua técnica inata por várias rodadas.",
    ],
  },

  // MORTE & DESCANSOS
  {
    id: "portas-morte",
    category: "morte",
    title: "As Portas da Morte (0 PV)",
    summary: "Regras quando a vida chega a zero.",
    details: [
      "Ao cair a 0 PV, o personagem cai Inconsciente e começa a fazer Testes de Morte.",
      "No início de cada turno, rola 1d20 puro:",
      "10 ou mais: 1 Sucesso (3 sucessos = Estabilizado).",
      "9 ou menos: 1 Fracasso (3 fracassos = Morte).",
      "20 Natural: Recupera imediatamente 1 PV e acorda.",
      "1 Natural: Conta como 2 Fracassos imediatos.",
      "Dano sofrido a 0 PV: Conta como 1 Fracasso automático (dano crítico conta como 2).",
    ],
  },
  {
    id: "descansos",
    category: "morte",
    title: "Descansos Curto e Longo",
    summary: "Recuperação de vida, vigor e energia amaldiçoada.",
    details: [
      "Descanso Curto (1 hora): Pode gastar Dados de Vida (DV) rolados + Mod CON para recuperar PV.",
      "Descanso Longo (8 horas): Recupera todos os PV máximos, metade dos Dados de Vida totais e recupera totalmente os Pontos de Energia (PE).",
    ],
  },
];
