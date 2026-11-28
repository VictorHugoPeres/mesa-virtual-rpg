/**
 * Novo Estilo da Sombra (New Shadow Style)
 * Regras Oficiais - Livro Base v2.5 (p. 38, 252–254)
 */

export interface SimpleDomainModification {
  id: string;
  name: string;
  type: "Modificação de Domínio Simples" | "Técnica de Estilo Especial";
  cost: string;
  action: "Ação Livre" | "Ação Comum" | "Ação Bônus" | "Reação";
  duration: "Enquanto o Domínio Simples estiver ativo" | "Imediata" | "Sustentada";
  stackable: boolean;
  description: string;
}

export const NEW_SHADOW_STYLE_BASIC_FUNCTION = {
  name: "Funcionamento Básico – Novo Estilo da Sombra",
  source: "Livro Base v2.5 (p. 38, 252)",
  unlockedAtLevel: 4,
  description:
    "Você se versou no Domínio Simples e na sua customização através do Novo Estilo da Sombra. Sempre que utilizar a aptidão amaldiçoada Domínio Simples você pode escolher o imbuir com uma Técnica de Estilo. No começo de todo turno seu, caso esteja com o Domínio Simples ativo, você pode alterar a Técnica de Estilo em uso. Recebe 2 Técnicas de Estilo no nível 4, e mais uma nos níveis 7, 10, 13, 16 e 19.",
};

export const SIMPLE_DOMAIN_MODIFICATIONS: SimpleDomainModification[] = [
  {
    id: "ataque_com_gatilho",
    name: "Ataque com Gatilho",
    type: "Modificação de Domínio Simples",
    cost: "Incluso no Domínio Simples",
    action: "Ação Livre",
    duration: "Enquanto o Domínio Simples estiver ativo",
    stackable: true,
    description:
      "O Domínio Simples pode realizar um ataque por rodada como Ação Livre ao atender um gatilho específico pré-determinado (como uma criatura inimiga adentrar na área do seu Domínio Simples). Este efeito pode ser colocado mais de uma vez, aumentando a quantidade de ataques reflexos automáticos por rodada.",
  },
  {
    id: "aumento_de_defesa",
    name: "Aumento de Defesa",
    type: "Modificação de Domínio Simples",
    cost: "Incluso no Domínio Simples",
    action: "Ação Livre",
    duration: "Enquanto o Domínio Simples estiver ativo",
    stackable: true,
    description:
      "O usuário do Domínio Simples recebe um aumento em sua Defesa igual a metade do seu Bônus de Treinamento (⌊BT/2⌋) enquanto a barreira estiver ativa. Este efeito pode ser colocado uma segunda vez, passando a conceder o mesmo aumento de Defesa também para todos os aliados dentro do Domínio Simples.",
  },
  {
    id: "bonus_de_acerto",
    name: "Bônus de Acerto",
    type: "Modificação de Domínio Simples",
    cost: "Incluso no Domínio Simples",
    action: "Ação Livre",
    duration: "Enquanto o Domínio Simples estiver ativo",
    stackable: true,
    description:
      "O usuário do Domínio Simples recebe um bônus igual a metade do seu Bônus de Treinamento (⌊BT/2⌋) em todas as jogadas de ataque que realizar enquanto o Domínio Simples estiver ativo. Pode ser colocado múltiplas vezes, acumulando o bônus de acerto.",
  },
  {
    id: "dano_adicional",
    name: "Dano Adicional",
    type: "Modificação de Domínio Simples",
    cost: "Incluso no Domínio Simples",
    action: "Ação Livre",
    duration: "Enquanto o Domínio Simples estiver ativo",
    stackable: true,
    description:
      "Os ataques do usuário do Domínio Simples têm o seu dano aumentado em 2 níveis (passos de dado) enquanto a barreira estiver ativa. Este dano é considerado Durante Ataque e pode ser colocado mais de uma vez, aumentando +2 níveis adicionais para cada seleção.",
  },
  {
    id: "efeito_especial_alcance",
    name: "Efeito Especial: Campo Tático Ampliado",
    type: "Modificação de Domínio Simples",
    cost: "Incluso no Domínio Simples",
    action: "Ação Livre",
    duration: "Enquanto o Domínio Simples estiver ativo",
    stackable: false,
    description:
      "O Domínio Simples possui um efeito único customizado: o alcance dos seus ataques corpo a corpo passa a ser igual a todo o raio do seu Domínio Simples, ou transforma a área do domínio em terreno difícil exclusivo para inimigos.",
  },
  {
    id: "lua_nebulosa_saque_batto",
    name: "Lua Nebulosa: Saque Batto",
    type: "Técnica de Estilo Especial",
    cost: "2 PE",
    action: "Reação",
    duration: "Imediata",
    stackable: false,
    description:
      "A lendária técnica secreta do Novo Estilo da Sombra (usada por Kasumi Miwa e Atsuya Kusakabe). Enquanto em postura desembainhadora (Iai) com Domínio Simples ativo, qualquer inimigo que pisar no perímetro da barreira engatilha um contra-ataque relâmpago de reação com acerto automático e dano crítico, podendo manifestar lâmina de pura energia amaldiçoada se a arma física estiver quebrada.",
  },
  {
    id: "aura_anuladora_de_estilo",
    name: "Aura Anuladora de Estilo",
    type: "Técnica de Estilo Especial",
    cost: "2 PE",
    action: "Ação Bônus",
    duration: "Enquanto o Domínio Simples estiver ativo",
    stackable: false,
    description:
      "Imbui os preceitos de Barreira e Leitura no Domínio Simples, concedendo a todos os aliados sob a cúpula resistência a feitiços e anulando o efeito de Acerto Garantido de expansões de domínio adversárias durante o confronto.",
  },
  {
    id: "estilo_sombra_fio_cortante",
    name: "Estilo da Sombra: Fio Cortante",
    type: "Técnica de Estilo Especial",
    cost: "2 PE",
    action: "Ação Livre",
    duration: "Imediata",
    stackable: false,
    description:
      "Ao realizar um ataque com a espada durante o Domínio Simples, projeta um fio de energia amaldiçoada comprimida estendendo o alcance do golpe para até 6 metros e causando dano de corte energético.",
  },
];

export function getShadowModificationById(id: string): SimpleDomainModification | undefined {
  return SIMPLE_DOMAIN_MODIFICATIONS.find((m) => m.id === id);
}

export function getShadowModificationsByType(
  type: SimpleDomainModification["type"]
): SimpleDomainModification[] {
  return SIMPLE_DOMAIN_MODIFICATIONS.filter((m) => m.type === type);
}
