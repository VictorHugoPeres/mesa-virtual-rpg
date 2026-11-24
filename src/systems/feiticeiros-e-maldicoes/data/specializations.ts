import { Specialization, AttributeKey } from "../constants";

export interface SpecLevel1Feature {
  name: string;
  type: "passiva" | "acao" | "reacao";
  description: string;
}

export interface SpecializationDetails {
  id: string;
  name: Specialization;
  summary: string;
  hpBase: number;
  hpPerLevel: number;
  hitDie: string;
  pePerLevel: number;
  addsAttributeToPE: boolean;
  keyAttributes: AttributeKey[];
  savingThrowChoices: string[];
  mandatorySkills: string[];
  freeSkillCount: number;
  forbiddenSkills?: string[];
  weaponProficiencies: string[];
  shieldProficiencies: string[];
  multiclassRequirements: string;
  level1Features: SpecLevel1Feature[];
}

export const SPECIALIZATIONS_DATA: SpecializationDetails[] = [
  {
    id: "lutador",
    name: "Lutador",
    summary: "Mestre no combate corporal direto, ágil e letal em combos marciais.",
    hpBase: 12,
    hpPerLevel: 7,
    hitDie: "d10",
    pePerLevel: 4,
    addsAttributeToPE: false,
    keyAttributes: ["FOR", "DEX"],
    savingThrowChoices: ["Fortitude", "Reflexos"],
    mandatorySkills: ["Atletismo"],
    freeSkillCount: 3,
    weaponProficiencies: ["Simples", "Marcial"],
    shieldProficiencies: ["Escudo Leve"],
    multiclassRequirements: "Força 13 ou Destreza 13",
    level1Features: [
      {
        name: "Artes Marciais & Pugilato",
        type: "passiva",
        description: "Seus ataques desarmados causam 1d6 de dano e você pode usar Destreza no lugar de Força para atacar.",
      },
      {
        name: "Sequência de Golpes",
        type: "acao",
        description: "Ao acertar um ataque corporal, pode gastar 1 PE para desferir um golpe secundário imediato.",
      },
    ],
  },
  {
    id: "especialista_combate",
    name: "Especialista em Combate",
    summary: "Guerreiro versátil e estrategista que domina todo o arsenal bélico.",
    hpBase: 12,
    hpPerLevel: 7,
    hitDie: "d10",
    pePerLevel: 4,
    addsAttributeToPE: false,
    keyAttributes: ["FOR", "DEX", "SAB"],
    savingThrowChoices: ["Fortitude", "Reflexos"],
    mandatorySkills: ["Ofício", "Atletismo"],
    freeSkillCount: 3,
    weaponProficiencies: ["Simples", "Marcial", "Distância", "Fogo", "Arremesso"],
    shieldProficiencies: ["Escudo Leve", "Escudo Pequeno", "Escudo Médio", "Escudo Pesado"],
    multiclassRequirements: "Força 13, Destreza 13 ou Sabedoria 13",
    level1Features: [
      {
        name: "Repertório do Especialista",
        type: "passiva",
        description: "Escolha um estilo de combate (Duelista, Arquearia, Empunhadura Dupla, Defensivo ou Armas Pesadas).",
      },
      {
        name: "Artes do Combate",
        type: "acao",
        description: "Gera e consome Pontos de Preparo para manobras táticas avançadas durante o combate.",
      },
    ],
  },
  {
    id: "especialista_tecnica",
    name: "Especialista em Técnica",
    summary: "Estudioso supremo da energia amaldiçoada e refinamento dos feitiços.",
    hpBase: 10,
    hpPerLevel: 6,
    hitDie: "d8",
    pePerLevel: 6,
    addsAttributeToPE: true,
    keyAttributes: ["INT", "SAB"],
    savingThrowChoices: ["Astúcia", "Vontade"],
    mandatorySkills: ["Feitiçaria", "Ocultismo"],
    freeSkillCount: 2,
    weaponProficiencies: ["Simples", "Distância"],
    shieldProficiencies: [],
    multiclassRequirements: "Inteligência 13 ou Sabedoria 13",
    level1Features: [
      {
        name: "Manipulação Aprimorada",
        type: "passiva",
        description: "Soma o modificador do Atributo Chave ao seu máximo de PE e reduz o custo de feitiços básicos.",
      },
      {
        name: "Fundamentos Avançados",
        type: "passiva",
        description: "Ganha +1 na CD de todas as suas técnicas e feitiços inatos.",
      },
    ],
  },
  {
    id: "controlador",
    name: "Controlador",
    summary: "Comandante tático de Shikigamis e Marionetes amaldiçoadas em campo.",
    hpBase: 10,
    hpPerLevel: 6,
    hitDie: "d8",
    pePerLevel: 5,
    addsAttributeToPE: true,
    keyAttributes: ["PRE", "SAB"],
    savingThrowChoices: ["Astúcia", "Vontade"],
    mandatorySkills: ["Percepção", "Persuasão"],
    freeSkillCount: 2,
    weaponProficiencies: ["Simples", "Distância"],
    shieldProficiencies: [],
    multiclassRequirements: "Presença 13 ou Sabedoria 13",
    level1Features: [
      {
        name: "Elo de Invocação",
        type: "acao",
        description: "Pode materializar e controlar remotamente até 2 invocações ativas simultâneas sem perder ação.",
      },
      {
        name: "Comando Tático",
        type: "reacao",
        description: "Pode ordenar que sua invocação intercepte um ataque direcionado a você ou um aliado.",
      },
    ],
  },
  {
    id: "suporte",
    name: "Suporte",
    summary: "Guardião da integridade do grupo, especialista em cura, barreiras e auxílio.",
    hpBase: 10,
    hpPerLevel: 6,
    hitDie: "d8",
    pePerLevel: 5,
    addsAttributeToPE: true,
    keyAttributes: ["PRE", "SAB"],
    savingThrowChoices: ["Astúcia", "Vontade"],
    mandatorySkills: ["Medicina", "Prestidigitação"],
    freeSkillCount: 3,
    weaponProficiencies: ["Simples"],
    shieldProficiencies: ["Escudo Leve", "Escudo Pequeno", "Escudo Médio"],
    multiclassRequirements: "Presença 13 ou Sabedoria 13",
    level1Features: [
      {
        name: "Socorro Imediato",
        type: "acao",
        description: "Como ação bônus, estabiliza aliados caídos ou restaura PV temporários em alcance curto.",
      },
      {
        name: "Campo Protetor",
        type: "reacao",
        description: "Gasta 1 PE para conceder +2 na Defesa de um aliado próximo como reação a um ataque.",
      },
    ],
  },
  {
    id: "restringido",
    name: "Restringido",
    summary: "Corpo divino sob a Restrição Celestial absoluta, transcendendo os limites humanos.",
    hpBase: 16,
    hpPerLevel: 9,
    hitDie: "d12",
    pePerLevel: 0,
    addsAttributeToPE: false,
    keyAttributes: ["FOR", "DEX", "CON"],
    savingThrowChoices: ["Fortitude", "Reflexos"],
    mandatorySkills: [],
    freeSkillCount: 4,
    forbiddenSkills: ["Feitiçaria"],
    weaponProficiencies: ["Simples", "Marcial", "Distância", "Fogo", "Arremesso"],
    shieldProficiencies: ["Escudo Leve", "Escudo Pequeno", "Escudo Médio", "Escudo Pesado"],
    multiclassRequirements: "Incapaz de realizar Multiclasse.",
    level1Features: [
      {
        name: "Físico Celestial & Estamina",
        type: "passiva",
        description: "Não possui PE. Possui Estamina = 4x nível. Imune à leitura de energia amaldiçoada.",
      },
      {
        name: "Sentidos Sobre-humanos",
        type: "passiva",
        description: "Soma metade do nível na Atenção passiva e detecta correntes de ar e densidade corporal.",
      },
    ],
  },
];
