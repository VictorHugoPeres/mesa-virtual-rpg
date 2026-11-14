import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Ficha de exemplo: Kento Nanami (Especialista em Combate, nível 1)
const nanamiSheet = {
  level: 1,
  xp: 0,
  origin: "Inato",
  specialization: "Especialista em Combate",
  technique: "Proporções",
  grade: "4° Grau",
  player: "Jogador Exemplo",
  campaign: "Campanha Exemplo",

  attributes: {
    FOR: 18,
    DEX: 12,
    CON: 16,
    INT: 13,
    SAB: 10,
    CAR: 8,
  },

  keyAttribute: "FOR",

  hp: { current: 15, max: 15, temp: 0 },
  energy: { current: 4, max: 4, temp: 0 },
  integrity: { current: 15, max: 15, temp: 0 },

  defense: {
    natural: 10,
    uniform: 0,
    shield: 0,
    dexMod: 1,
    other: 0,
    total: 11,
  },

  attention: 10,
  initiative: 1,
  movement: 9,

  deathSaves: { successes: 0, failures: 0 },

  hitDice: { die: "d10", total: 1, spent: 0 },

  skills: {
    Atletismo: { trained: true, expert: false, otherBonus: 0 },
    Luta: { trained: true, expert: false, otherBonus: 0 },
    Acrobacia: { trained: false, expert: false, otherBonus: 0 },
    Furtividade: { trained: false, expert: false, otherBonus: 0 },
    Pontaria: { trained: false, expert: false, otherBonus: 0 },
    Prestidigitação: { trained: false, expert: false, otherBonus: 0 },
    Reflexos: { trained: true, expert: false, otherBonus: 0 },
    Fortitude: { trained: false, expert: false, otherBonus: 0 },
    Integridade: { trained: false, expert: false, otherBonus: 0 },
    Astúcia: { trained: false, expert: false, otherBonus: 0 },
    Feitiçaria: { trained: false, expert: false, otherBonus: 0 },
    Investigação: { trained: true, expert: false, otherBonus: 0 },
    História: { trained: true, expert: false, otherBonus: 0 },
    "Ofício 1": { trained: true, expert: false, otherBonus: 0 },
    "Ofício 2": { trained: true, expert: false, otherBonus: 0 },
    "Ofício 3": { trained: false, expert: false, otherBonus: 0 },
    "Ofício 4": { trained: false, expert: false, otherBonus: 0 },
    Religião: { trained: false, expert: false, otherBonus: 0 },
    Tecnologia: { trained: false, expert: false, otherBonus: 0 },
    Intuição: { trained: false, expert: false, otherBonus: 0 },
    Medicina: { trained: false, expert: false, otherBonus: 0 },
    Percepção: { trained: false, expert: false, otherBonus: 0 },
    Ocultismo: { trained: false, expert: false, otherBonus: 0 },
    Vontade: { trained: false, expert: false, otherBonus: 0 },
    Persuasão: { trained: false, expert: false, otherBonus: 0 },
    Enganação: { trained: false, expert: false, otherBonus: 0 },
    Intimidação: { trained: false, expert: false, otherBonus: 0 },
    Performance: { trained: false, expert: false, otherBonus: 0 },
  },

  weapons: [
    {
      name: "Espada Curta (Cutelo Cego)",
      attackBonus: 6,
      damage: "1d6+4",
      critical: "20",
      damageType: "Cortante",
      range: "Corpo a corpo",
    },
  ],

  notes: "",
};

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // Limpa dados antigos (idempotente)
  await prisma.diceLog.deleteMany();
  await prisma.character.deleteMany();
  await prisma.session.deleteMany();
  await prisma.campaign.deleteMany();

  // Cria campanha de exemplo
  const campaign = await prisma.campaign.create({
    data: {
      name: "A Maldição de Shibuya",
      systemId: "feiticeiros-e-maldicoes",
    },
  });
  console.log(`✅ Campanha criada: "${campaign.name}" (${campaign.id})`);

  // Cria personagem de exemplo com ficha JSON serializada
  const character = await prisma.character.create({
    data: {
      name: "Kento Nanami",
      type: "PC",
      campaignId: campaign.id,
      data: JSON.stringify(nanamiSheet),
    },
  });
  console.log(`✅ Personagem criado: "${character.name}" (${character.id})`);

  // Cria sessão 1 da campanha
  const session = await prisma.session.create({
    data: {
      number: 1,
      campaignId: campaign.id,
      notes: "Sessão 0 — Criação de personagens e introdução ao cenário.",
    },
  });
  console.log(`✅ Sessão criada: #${session.number} (${session.id})`);

  console.log("\n🎲 Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
