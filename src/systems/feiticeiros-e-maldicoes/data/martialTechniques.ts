/**
 * Catálogo Oficial de Técnicas Marciais para o Restringido
 * Livro Base v2.5 (p. 124–126, 247–251) / Enciclopédia Amaldiçoada (p. 206–208)
 */

export interface MartialTechnique {
  id: string;
  name: string;
  level: 1 | 2 | 3 | 4;
  staminaCost: number;
  action: "Ação Comum" | "Ação Bônus" | "Ação Completa" | "Reação" | "Ação Livre" | "Passiva";
  category: "Manobra" | "Ofensiva" | "Defensiva" | "Arte de Avanço" | "Arte de Força" | "Arte de Saque" | "Passiva";
  range: string;
  target: string;
  duration: string;
  prerequisite?: string;
  description: string;
  rollFormula?: string;
}

export const READY_MARTIAL_TECHNIQUES: MartialTechnique[] = [
  // --- NÍVEL 1 (2 Pontos de Estamina) ---
  {
    id: "atacar_e_agarrar",
    name: "Atacar e Agarrar",
    level: 1,
    staminaCost: 2,
    action: "Ação Comum",
    category: "Manobra",
    range: "Corpo a Corpo",
    target: "Uma Criatura",
    duration: "Imediata",
    description:
      "Desfere um ataque contra um inimigo e, logo após, realiza a ação de Agarrar. Se acertou o ataque, o alvo sofre -5 no teste para resistir ao agarrão.",
  },
  {
    id: "contra_ataque",
    name: "Contra-Ataque",
    level: 1,
    staminaCost: 2,
    action: "Reação",
    category: "Defensiva",
    range: "Corpo a Corpo",
    target: "O Atacante",
    duration: "Imediata",
    description:
      "1x/rodada, ao ser alvo de ataque corpo a corpo, usa reação para tentar o impedir: teste de Atletismo contra o ataque do inimigo. Se superar, apara o golpe e desfere um contra-ataque imediato.",
  },
  {
    id: "estado_de_atencao",
    name: "Estado de Atenção",
    level: 1,
    staminaCost: 0,
    action: "Passiva",
    category: "Passiva",
    range: "Próprio",
    target: "Próprio",
    duration: "Permanente",
    description:
      "Estado de constante vigilância e prontidão em batalha. Concede +2 em Percepção e Reflexos. Reduz o total de Pontos de Estamina máximos em 2.",
  },
  {
    id: "golpear_e_desarmar",
    name: "Golpear e Desarmar",
    level: 1,
    staminaCost: 2,
    action: "Ação Comum",
    category: "Manobra",
    range: "Corpo a Corpo",
    target: "Uma Criatura",
    duration: "Imediata",
    description:
      "Realiza um golpe rápido contra um inimigo e, logo após, realiza a ação de Desarmar. Se acertou o ataque, o alvo sofre -5 no teste para evitar ser desarmado.",
  },
  {
    id: "arte_de_avanco_investida",
    name: "Arte de Avanço: Investida",
    level: 1,
    staminaCost: 2,
    action: "Ação Bônus",
    category: "Arte de Avanço",
    range: "Metade do Deslocamento",
    target: "Uma Criatura",
    duration: "Imediata",
    description:
      "Investe rapidamente em linha reta fechando a distância sem provocar ataques de oportunidade no trajeto, recebendo +2 no próximo teste de ataque ou manobra contra o alvo.",
  },
  {
    id: "arte_de_forca_impacto_brutal",
    name: "Arte de Força: Impacto Brutal",
    level: 1,
    staminaCost: 2,
    action: "Ação Livre",
    category: "Arte de Força",
    range: "Corpo a Corpo",
    target: "O Alvo Atingido",
    duration: "Imediata",
    description:
      "Ao acertar um ataque físico desarmado ou com arma pesada, adiciona o dobro do modificador de Força ao dano do golpe ou empurra o alvo 4,5m adicionais.",
  },
  {
    id: "arte_de_saque_golpe_subito",
    name: "Arte de Saque: Golpe Súdito",
    level: 1,
    staminaCost: 2,
    action: "Ação Bônus",
    category: "Arte de Saque",
    range: "Corpo a Corpo",
    target: "Uma Criatura",
    duration: "Imediata",
    description:
      "Alterna instantaneamente para uma arma do Arsenal Amaldiçoado e desfere um golpe de saque surpresa; o alvo realiza TR de Reflexos ou fica Desprevenido contra o ataque.",
  },

  // --- NÍVEL 2 (5 Pontos de Estamina) ---
  {
    id: "corpo_de_ferro",
    name: "Corpo de Ferro",
    level: 2,
    staminaCost: 0,
    action: "Passiva",
    category: "Passiva",
    range: "Próprio",
    target: "Próprio",
    duration: "Permanente",
    description:
      "Sacrifica vigor para reforçar a carcaça física. Concede 4 de Redução de Dano (RD) contra todos os tipos físicos e elementais (exceto na alma). Reduz a Estamina máxima em 4.",
  },
  {
    id: "golpe_giratorio",
    name: "Golpe Giratório",
    level: 2,
    staminaCost: 5,
    action: "Ação Completa",
    category: "Ofensiva",
    range: "Alcance da Arma (360°)",
    target: "Todas as Criaturas Adjacentes",
    duration: "Imediata",
    description:
      "Gira o corpo varrendo o perímetro com uma arma corpo a corpo. Realiza duas rolagens de ataque separadas contra todas as criaturas dentro do alcance cuja Defesa seja superada.",
  },
  {
    id: "arte_de_avanco_passo_fantasma",
    name: "Arte de Avanço: Passo Fantasma",
    level: 2,
    staminaCost: 5,
    action: "Reação",
    category: "Arte de Avanço",
    range: "Deslocamento Total",
    target: "Próprio",
    duration: "Imediata",
    description:
      "Ao ser alvo de um ataque ou efeito de área, evade instantaneamente deslocando-se todo o seu movimento terrestre ignorando terreno difícil e reduzindo qualquer dano à metade.",
  },
  {
    id: "arte_de_forca_quebra_defesa",
    name: "Arte de Força: Quebra de Defesa",
    level: 2,
    staminaCost: 5,
    action: "Ação Comum",
    category: "Arte de Força",
    range: "Corpo a Corpo",
    target: "Uma Criatura",
    duration: "Imediata",
    description:
      "Golpe esmagador de alta potência. O ataque ignora 12 pontos de Redução de Dano (RD) e o alvo deve realizar TR de Fortitude ou recebe a condição Caído e Atordoado por 1 rodada.",
  },
  {
    id: "arte_de_saque_batto_marcial",
    name: "Arte de Saque Veloz: Batto Marcial",
    level: 2,
    staminaCost: 5,
    action: "Ação Comum",
    category: "Arte de Saque",
    range: "Corpo a Corpo",
    target: "Uma Criatura",
    duration: "Imediata",
    description:
      "Saque em velocidade supersônica com espada ou lâmina. Concede +2 na jogada de ataque, margem de crítico 18 e multiplica o dano do ataque por 2 em acerto crítico.",
  },

  // --- NÍVEL 3 (8 Pontos de Estamina) ---
  {
    id: "sequencia_devastadora",
    name: "Sequência Devastadora",
    level: 3,
    staminaCost: 8,
    action: "Ação Completa",
    category: "Ofensiva",
    range: "Corpo a Corpo",
    target: "1 a 3 Criaturas",
    duration: "Imediata",
    description:
      "Desfere 3 ataques corporais sucessivos e impiedosos. Cada ataque recebe +12 de dano adicional e ignora 16 de Redução de Dano (RD).",
  },
  {
    id: "arremesso_sismico",
    name: "Arremesso Sísmico",
    level: 3,
    staminaCost: 8,
    action: "Ação Comum",
    category: "Manobra",
    range: "12 Metros",
    target: "Uma Criatura ou Objeto",
    duration: "Imediata",
    description:
      "Ergue criatura agarrada ou objeto de grande massa e o arremessa com força devastadora contra o solo ou outro alvo. Causa 8d10 de impacto em área de 3m (TR Reflexos metade).",
    rollFormula: "8d10",
  },

  // --- NÍVEL 4 (12 Pontos de Estamina) ---
  {
    id: "frenesi_do_apice_fisico",
    name: "Frenesi do Ápice Físico",
    level: 4,
    staminaCost: 12,
    action: "Ação Completa",
    category: "Ofensiva",
    range: "Corpo a Corpo",
    target: "Criaturas no Alcance",
    duration: "Imediata",
    description:
      "Manifestação extrema do corpo que rejeitou a energia amaldiçoada. Realiza 4 ataques brutais contínuos com +4 no acerto, +16 de dano e 20 de RD ignorada em cada golpe. Se acertar 3 ou mais, o alvo faz TR de Fortitude ou fica Incapacitado por 1 rodada.",
  },
];

export function getMartialTechniqueById(id: string): MartialTechnique | undefined {
  return READY_MARTIAL_TECHNIQUES.find((t) => t.id === id);
}

export function getMartialTechniquesByLevel(level: number): MartialTechnique[] {
  return READY_MARTIAL_TECHNIQUES.filter((t) => t.level === level);
}

export function getMartialTechniquesByCategory(category: string): MartialTechnique[] {
  return READY_MARTIAL_TECHNIQUES.filter((t) => t.category === category);
}
