import { CompendiumEntry } from "./compendiumData";

export const INICIANTES_ENTRIES: CompendiumEntry[] = [
  {
    id: "d20-como-funciona",
    category: "iniciantes",
    title: "O Dado d20 e Sucesso nos Testes",
    summary: "Como o dado d20 define se sua ação foi bem-sucedida ou falhou.",
    details: [
      "Fórmula Geral: Resultado = 1d20 + Bônus de Atributo/Perícia.",
      "Comparação: Se o total for igual ou maior que a Classe de Dificuldade (CD) ou Defesa do inimigo, sua ação tem SUCESSO.",
      "20 Natural (Crítico): Se tirar 20 no dado (sem bônus), é um Sucesso Crítico automático! Em ataques, dobra os dados de dano.",
      "1 Natural (Falha Crítica): Se tirar 1 no dado, é uma Falha Crítica automática, errando independentemente dos seus bônus.",
      "Vantagem: Role dois dados d20 e fique com o MAIOR resultado.",
      "Desvantagem: Role dois dados d20 e fique com o MENOR resultado.",
    ],
  },
  {
    id: "atributos-e-pericias",
    category: "iniciantes",
    title: "Os 6 Atributos e Perícias",
    summary: "O papel de cada atributo e como perícias somam bônus.",
    details: [
      "FOR (Força): Potência muscular, dano de armas corpo a corpo pesadas, saltos, atletismo e agarrões.",
      "DES (Destreza): Agilidade, reflexos, iniciativa no combate, esquiva e ataques com armas leves ou à distância.",
      "CON (Constituição): Vigor físico, resistência a toxinas e doenças, e base para seus Pontos de Vida (PV).",
      "INT (Inteligência): Raciocínio lógico, estudo teórico de feitiçaria, rituais, pistas e conhecimentos gerais.",
      "SAB (Sabedoria): Percepção dos arredores, intuição para sentir mentiras, primeiros socorros e força de vontade.",
      "CAR (Carisma/Presença): Força da personalidade, intimidação, persuasão, encenação e liderança de aliados.",
      "Modificador: Valor 10 é neutro (+0). A cada 2 pontos acima ou abaixo, o bônus muda em +1 ou -1 (ex: 14 = +2, 16 = +3).",
      "Perícias Treinadas (Mt.): Ao treinar uma perícia, você soma seu Bônus de Maestria (+2 no nível 1) aos seus testes.",
    ],
  },
  {
    id: "recursos-pv-pe-alma",
    category: "iniciantes",
    title: "Pontos de Vida, Energia e Alma",
    summary: "Para que serve cada uma das 3 barras de recursos vitais.",
    details: [
      "Pontos de Vida (PV): Representam sua integridade física. Ao chegar a 0 PV, você desmaia e entra em Testes de Morte.",
      "Pontos de Energia Amaldiçoada (PE): O combustível jujutsu gasto para conjurar feitiços, aprimorar socos e erguer barreiras.",
      "Integridade da Alma: A estabilidade metafísica do seu espírito (seu máximo é igual ao seu PV máximo). Só é atingida por ataques diretos à alma (ex: Mahito) e ignora armaduras comuns.",
      "Pontos Temporários: Escudos extras de vida ou energia que absorvem o impacto antes de ferir seus pontos reais.",
    ],
  },
  {
    id: "estrutura-do-turno",
    category: "iniciantes",
    title: "Estrutura de um Turno de Combate",
    summary: "O que você pode fazer quando chegar a sua vez na rodada.",
    details: [
      "Iniciativa: No início da luta, todos rolam 1d20 + Iniciativa para determinar a ordem de quem joga primeiro.",
      "Movimento (9 metros): Você pode se deslocar até 9m (6 quadrados de grid), podendo dividir o passo antes e depois da sua ação.",
      "Ação Padrão (1 por turno): Sua ação principal — desferir um golpe, conjurar um feitiço de ação padrão, Esquivar ou Desengajar.",
      "Ação Bônus (1 por turno): Ação rápida secundária — feitiços velozes, posturas marciais ou golpes com arma secundária.",
      "Ação Livre: Gestos rápidos sem custo de tempo — falar algumas palavras, soltar um objeto ou abrir uma porta destrancada.",
      "Reação (1 por rodada): Resposta imediata fora da sua vez — ataque de oportunidade quando um inimigo foge de perto de você, ou Domínio Simples.",
    ],
  },
  {
    id: "tecnicas-feiticos-cd",
    category: "iniciantes",
    title: "Feitiços, Técnicas e Classe de Dificuldade (CD)",
    summary: "Como conjurar seus poderes jujutsu e como os inimigos resistem.",
    details: [
      "Técnica Inata: O dom hereditário ou exclusivo da sua alma (ex: Ilimitado de Gojo, Dez Sombras de Megumi, 7:3 de Nanami).",
      "Feitiços (Liberações): As formas práticas de manifestar sua técnica gastando Pontos de Energia Amaldiçoada (PE).",
      "Jogada de Acerto de Técnica: Feitiços de arremesso ou impacto rolam 1d20 + Maestria + Modificador de Atributo contra a Defesa do alvo.",
      "Classe de Dificuldade (CD): Feitiços que impõem efeitos na área ou na mente forçam os alvos a rolar um Teste de Resistência.",
      "Fórmula da sua CD: 8 + Bônus de Maestria (+2 no nível 1) + Modificador do Atributo da sua Técnica (INT, SAB ou CAR).",
    ],
  },
];
