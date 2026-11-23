export interface KitItem {
  id: string;
  name: string;
  cost: number;
  slots: number;
  isToolKit: boolean;
  utility: string;
  description: string;
}

export interface GeneralGearItem {
  id: string;
  name: string;
  cost: number;
  slots: number;
  utility: string;
  description: string;
}

export const TOOL_KITS_CATALOG: KitItem[] = [
  {
    id: "kit-primeiros-socorros",
    name: "Kit de Primeiros Socorros",
    cost: 1,
    slots: 1,
    isToolKit: true,
    utility: "Estabilização e Primeiros Socorros",
    description: "Bandagens estéreis, torniquetes, antissépticos e pomadas para estabilizar aliados moribundos e curar ferimentos leves.",
  },
  {
    id: "kit-ladrao",
    name: "Kit de Ferramentas de Ladrão",
    cost: 1,
    slots: 1,
    isToolKit: true,
    utility: "Arrombamento e Sabotagem",
    description: "Gazúas, alicates finos, chave mestra e pequenas brocas para desarmar armadilhas e abrir fechaduras mecânicas.",
  },
  {
    id: "kit-sobrevivencia",
    name: "Kit de Sobrevivência",
    cost: 1,
    slots: 2,
    isToolKit: true,
    utility: "Rastreio e Subsistência",
    description: "Bússola, pederneira, faca multiuso, pastilhas de purificação de água e linhas de pesca para ambientes selvagens.",
  },
  {
    id: "kit-alquimia",
    name: "Kit de Alquimia",
    cost: 1,
    slots: 2,
    isToolKit: true,
    utility: "Análise de Substâncias e Reagentes",
    description: "Frascos graduados, tubos de ensaio, almofariz com pilão e pós catalisadores para manipular compostos químicos.",
  },
  {
    id: "kit-farmaceutico",
    name: "Kit de Farmacêutico",
    cost: 1,
    slots: 2,
    isToolKit: true,
    utility: "Preparo de Medicamentos e Antídotos",
    description: "Extratos herbais, seringas graduadas, solventes e substâncias ativas para sintetizar remédios de campo.",
  },
  {
    id: "kit-ferreiro",
    name: "Kit de Ferramentas de Ferreiro",
    cost: 1,
    slots: 2,
    isToolKit: true,
    utility: "Reparo e Manutenção de Armas",
    description: "Martelo de forja portátil, tenazes, limas de ferro e pedra de amolar para manter e reparar equipamentos metálicos.",
  },
  {
    id: "kit-alfaiate",
    name: "Kit de Alfaiate",
    cost: 1,
    slots: 1,
    isToolKit: true,
    utility: "Costura e Ajuste de Uniformes",
    description: "Agulhas de diversos calibres, fios trançados reforçados e retalhos táticos para reparo de vestimentas e mochilas.",
  },
  {
    id: "kit-disfarce",
    name: "Kit de Disfarce",
    cost: 1,
    slots: 1,
    isToolKit: true,
    utility: "Infiltração e Enganação",
    description: "Cosméticos cênicos, próteses de látex, perucas básicas e lentes para mudar a aparência facial rapidamente.",
  },
  {
    id: "kit-cozinheiro",
    name: "Kit de Cozinheiro",
    cost: 1,
    slots: 1,
    isToolKit: true,
    utility: "Preparo de Refeições e Vigor",
    description: "Panelas dobráveis de titânio, condimentos selados e utensílios compactos para manter o grupo nutrido.",
  },
];

export const GENERAL_GEAR_CATALOG: GeneralGearItem[] = [
  {
    id: "mochila-tatica",
    name: "Mochila Tática de Assalto",
    cost: 1,
    slots: 0,
    utility: "+5 Espaços de Carga",
    description: "Mochila com compartimentos modulares e fitas MOLLE que aumenta a capacidade de carga do personagem em 5 espaços.",
  },
  {
    id: "lanterna-tatica",
    name: "Lanterna Tática de Alta Potência",
    cost: 1,
    slots: 1,
    utility: "Iluminação 12m",
    description: "Lanterna de LED resistente a impacto e água com foco ajustável de cone de 12 metros.",
  },
  {
    id: "corda-com-gancho",
    name: "Corda Tática com Gancho (15m)",
    cost: 1,
    slots: 1,
    utility: "Escalada e Travessia",
    description: "Corda de polímero ultrarresistente com gancho de ancoragem que suporta até 300 kg.",
  },
  {
    id: "comunicador-tatico",
    name: "Comunicador Tático de Orelha",
    cost: 1,
    slots: 0.5,
    utility: "Comunicação a 2km",
    description: "Ponto eletrônico com cancelamento de ruído e canais criptografados para comunicação sem fio imediata.",
  },
  {
    id: "algemas-reforcadas",
    name: "Algemas Reforçadas",
    cost: 1,
    slots: 0.5,
    utility: "Contenção de Alvos",
    description: "Algemas de aço temperado com chave de segurança quádrupla para conter suspeitos ou cultistas.",
  },
  {
    id: "municao-extra",
    name: "Munição Extra / Aljava",
    cost: 1,
    slots: 1,
    utility: "Recarga de Armas",
    description: "Pente extra com 30 cartuchos de bala ou aljava reforçada contendo 20 flechas ou virotes.",
  },
];
