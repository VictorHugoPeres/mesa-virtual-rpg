# D20 — Mesa Digital de RPG

> **Virtual Tabletop (VTT) Híbrido Local-First para Mesas Presenciais de RPG com Suporte a Telão & Celulares via Wi-Fi.**

![Next.js](https://img.shields.io/badge/Next.js-16.4-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.3-38bdf8?logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-SQLite-2D3748?logo=prisma)
![License](https://img.shields.io/badge/License-MIT-emerald)

---

## 🎲 Visão Geral

O **D20** é uma plataforma moderna desenvolvida especificamente para transformar mesas presenciais de RPG em experiências audiovisuais imersivas e cinematográficas. 

Diferente dos VTTs tradicionais focados apenas em sessões 100% remotas, o **D20** adota o conceito de **Mesa Híbrida em Três Telas simultâneas**:
1. **Painel do Mestre (`/mestre`):** Interface de comando completa no notebook do narrador, com acesso a fichas abertas, mapa tático, bestiário, som e diário de campanha.
2. **Telão dos Jogadores (`/telao`):** Tela limpa projetada na TV ou Projetor da sala, exibindo o grid tático, artes de cenários/NPCs, ordem de iniciativa sem spoilers e banners de rolagem em tempo real com destaque dramático para acertos críticos e falhas.
3. **Portal Mobile do Jogador (`/jogador`):** Cada jogador acessa sua própria ficha diretamente do seu smartphone conectado ao Wi-Fi da casa, escaneando um QR Code gerado pelo sistema — sem necessidade de instalar aplicativos ou criar contas externas.

A plataforma é **100% Local-First e Offline-First**: roda localmente no computador do mestre com banco SQLite embutido, sem custos de assinatura, sem travamentos por lentidão de servidores remotos e sem dependência de internet.

---

## ⚡ Funcionalidades Implementadas

### 🧙‍♂️ Ficha Oficial v2.0 & Criador Guiado (Wizard)
- **Módulo Nativo:** Sistema *Feiticeiros e Maldições (Jujutsu Kaisen RPG v2.0)*.
- **Cálculo Automático:** Modificadores de 6 atributos (FOR, DES, CON, INT, SAB, CAR), Perícias com maestria e graduação, Defesa (CA), Deslocamento e Iniciativa.
- **Gerenciamento de Recursos:** Pontos de Vida (atuais/máximos/temporários), Pontos de Energia Amaldiçoada (PE), Integridade da Alma e Testes de Morte.
- **Sistema de Descanso:** Modal interativo para Descanso Curto (gastando Dados de Vida com rolagem automática) e Descanso Longo (recuperação completa de PV/PE e metade dos DV).
- **Criador Passo a Passo:** Wizard guiado em 7 etapas com regras oficiais (alocação única dos valores fixos `[15, 14, 13, 12, 10, 8]` ou geração 4d6, seleção de Origens, Especializações, Técnicas Inatas e Equipamentos).

### 🎯 Rolagens Híbridas, Alvo & Dano Automático
- **Modo Digital (2D):** Rolador integrado com seleção de dados (`d4`, `d6`, `d8`, `d10`, `d12`, `d20`, `d100`), modificadores rápidos e histórico de rolagens.
- **Modo Dado Físico Real:** O jogador rola o dado físico na mesa e digita o valor puro que caiu na face; o sistema soma os bônus da ficha, valida críticos/falhas e envia o resultado para a TV.
- **Combate com Alvo Automático:** Durante combates ativos, o rolador permite selecionar o combatente alvo. O sistema compara automaticamente o teste de Ataque contra a Defesa do alvo (`Acertou!`, `Crítico!` ou `Errou!`).
- **Desconto de Dano Direto:** Em rolagens de dano, com o toggle de aplicação direta ativado, o dano rolado desconta automaticamente os PVs do alvo selecionado em tempo real.

### 📺 Telão do Jogador (Modo TV sem Spoilers)
- **Modo Standby Minimalista:** Projeção limpa de standby com o logotipo oficial D20 e status da mesa enquanto o mestre prepara o cenário.
- **Banners de Rolagem em Tempo Real:** Exibição destacada na tela de quem rolou, fórmula e resultado, com efeitos visuais dourados para 20 Natural (Crítico!) e carmesim para 1 Natural (Falha!).
- **Iniciativa Pública:** Espelhamento da trilha de combate sem revelar a vida numérica de monstros e ameaças (apresentando apenas indicadores visuais como *Saudável*, *Ferido* ou *Crítico*).
- **Projeção de Cenas & Mídia:** O mestre pode enviar com um clique qualquer imagem de monstro, mapa ou arte conceitual para a TV e recolher a qualquer momento.

### 💀 Bestiário & Rastreador de Iniciativa Sincronizado
- **Catálogo de Ameaças:** Cadastro rápido de maldições e NPCs com grau de perigo, ficha compacta, ataques e ações especiais.
- **Clonagem Dinâmica:** Permite clonar uma mesma ameaça várias vezes para o combate com numeração sequencial automática (ex: *Maldição #1*, *Maldição #2*).
- **Iniciativa Precisa:** Botões para rolagem individual de iniciativa por monstro/personagem, ou rolagem global apenas para combatentes pendentes (sem nunca sobrescrever dados já rolados pelos jogadores em seus celulares).
- **Sincronização Bidirecional:** Qualquer alteração de PV/PE na ficha do personagem ou na barra de iniciativa reflete instantaneamente em ambos os lados via SSE.

### 🎵 Mesa de Som & Efeitos Sonoros (Web Audio)
- **Player de Áudio Local:** Suporte a arquivos de áudio locais (upload direto) ou links externos para trilha sonora ambiente (BGM) e efeitos (SFX).
- **Músicas em Loop Suave:** Troca de músicas com transição agradável para criar atmosfera durante explorações, tensão ou batalhas.
- **Soundboard de Efeitos Rápidos:** Botões de disparo instantâneo para efeitos marcantes (Golpe, Impacto, Expansão de Domínio, Terror).
- **Sincronização Telão/Mestre:** O áudio pode ser reproduzido diretamente no som conectado à TV ou no próprio computador do mestre.

### 🗺️ Tabuleiro Tático & Grid Map
- **Grid Customizável:** Suporte a upload de mapas de batalha com ajuste dinâmico de tamanho de grade, opacidade, cor e escala métrica (ex: 1,5m por célula).
- **Camadas de Elementos:** Suporte a Tokens de personagens/inimigos e Props de cenário com controle de profundidade (frente/trás), escala e rotação.
- **Tela Dividida (Mestrar às Cegas):** O mestre pode editar o mapa em tela dividida, vendo exatamente o que está sendo projetado no Telão enquanto manipula elementos em segundo plano.
- **Névoa de Guerra (Fog of War):** Máscara escura em blocos que o mestre revela pincelando conforme os heróis avançam pelas salas.
- **Régua de Medição:** Ferramenta interativa de régua e raio para calcular distâncias e alcances de magias/técnicas na grade.

### 📖 Gestão de Sessões & Diário de Campanha
- **Anotações Permanentes vs. Sessão:** Bloco dedicado a notas gerais da campanha (lore, NPCs, pistas) separado das anotações rápidas da sessão atual.
- **Ciclo de Vida da Sessão:** Botão para concluir sessão ativa com resumo gerado e arquivamento no histórico.
- **Histórico Filtrável:** Histórico de rolagens com filtro por sessão para auditoria de combates passados.

### 📱 Portal Mobile do Jogador (Wi-Fi Local)
- **Acesso por QR Code:** O mestre abre o modal "Celulares", e qualquer jogador na mesma rede Wi-Fi aponta a câmera e entra na hora.
- **Interface Mobile-First:** Navegação rápida por abas inferiores (*Ficha*, *Rolador*, *Diário*, *Combate*), botões táteis projetados para o polegar e prevenção de zoom involuntário.
- **Isolamento de Segredos:** Acesso estrito apenas à ficha do jogador, histórico público e trilha de combate, sem acesso ao bestiário, notas ocultas do mestre ou mapa coberto por névoa.

---

## 🏗️ Arquitetura do Projeto

O projeto adota uma arquitetura modular inspirada nos melhores padrões de engenharia de software, separando rigorosamente o **Núcleo Universal da Mesa (Core)** dos **Módulos de Regra de Sistemas de RPG (Systems)**:

```text
mesa-virtual-rpg/
├── prisma/
│   ├── schema.prisma          # Modelagem do banco SQLite (Campanhas, Personagens, Sessões, etc.)
│   └── seed.ts                # Sementes iniciais com regras e fichas de exemplo
├── public/
│   ├── uploads/               # Armazenamento local de imagens e áudios enviados pelo mestre
│   └── favicon.ico / icon.svg # Identidade visual minimalista 'D20'
├── src/
│   ├── app/                   # Next.js App Router (Páginas e Endpoints de API)
│   │   ├── api/               # Rotas REST e canal de tempo real (/api/sync SSE)
│   │   ├── mestre/            # Painel do Mestre e Fichas
│   │   ├── telao/             # Visualização da TV / Telão
│   │   └── jogador/           # Portal Mobile dos Jogadores
│   ├── components/            # Componentes globais de UI, toolbar do mestre e formulários
│   ├── core/                  # NÚCLEO UNIVERSAL (Agnóstico a qualquer sistema de RPG)
│   │   ├── audio/             # Player de áudio, soundboard e sincronização sonora
│   │   ├── compendium/        # Gaveta de regras rápidas e pesquisa
│   │   ├── dice/              # Rolador digital 2D, parser de dados e histórico
│   │   ├── initiative/        # Rastreador de turnos e participantes de combate
│   │   ├── map/               # Tabuleiro tático, tokens, props, névoa e régua
│   │   ├── player/            # Componentes do Portal Mobile e QR Code LAN
│   │   ├── projection/        # Gerenciamento de exibição na TV
│   │   ├── sessions/          # Diário de sessões, anotações e resumos
│   │   ├── telao/             # Componentes visuais do Telão (Standby, Banner de Dados)
│   │   └── ui/                # Componentes base (Portal, Modais, Toasts estilizados)
│   └── systems/               # MÓDULOS DE REGRAS ESPECÍFICAS
│       └── feiticeiros-e-maldicoes/ # Sistema Oficial Feiticeiros & Maldições (F&M v2.0)
│           ├── components/    # Abas da ficha (Pessoal, Amaldiçoado, Treino, etc.) e Wizard
│           ├── constants.ts   # Tabelas de bônus, perícias e progressão
│           ├── formulas.ts    # Fórmulas de cálculo de atributos e PV/PE
│           ├── schemas.ts     # Validação de dados via Zod
│           └── types.ts       # Definições TypeScript dos personagens
└── docs/                      # Documentação técnica e regras de apoio
```

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologia | Descrição |
| :--- | :--- | :--- |
| **Framework Web** | [Next.js](https://nextjs.org/) (v16 App Router) | Renderização híbrida React 19 com compilador Turbopack ultrarrápido. |
| **Linguagem** | [TypeScript](https://www.typescriptlang.org/) | Tipagem estrita de ponta a ponta para maior robustez e segurança de código. |
| **Estilização** | [Tailwind CSS](https://tailwindcss.com/) (v4) | Dark Mode nativo de alto contraste, estilização tátil e design responsivo. |
| **Banco de Dados** | [Prisma ORM](https://www.prisma.io/) + SQLite | Persistência local em arquivo `.db`, com zero configuração de servidor de banco. |
| **Tempo Real** | Server-Sent Events (SSE) + BroadcastChannel | Sincronização instantânea e contínua entre PC, Telão e Celulares na rede local. |
| **Áudio** | Web Audio API / HTML5 Audio | Reprodução de áudio sem travamentos ou latência perceptível. |
| **Ícones & QR Code** | Lucide Icons + qrcode.react | Conjunto consistente de ícones vetoriais e geração instantânea de QR Code LAN. |

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- [Node.js](https://nodejs.org/) versão 18.18 ou superior instalada no computador.
- Gerenciador de pacotes `npm`.

### 1. Clonar o repositório e instalar dependências
```bash
git clone https://github.com/SEU_USUARIO/mesa-virtual-rpg.git
cd mesa-virtual-rpg
npm install
```

### 2. Configurar o banco de dados local
Crie o arquivo de ambiente a partir do exemplo fornecido:
```bash
cp .env.example .env
```
Execute o push do schema Prisma para criar o banco SQLite local (`prisma/dev.db`):
```bash
npx prisma db push
```
*(Opcional)* Popule o banco com dados iniciais de demonstração:
```bash
npm run db:seed
```

### 3. Rodar em Modo de Desenvolvimento (Rede Local Wi-Fi)
Para permitir que seus jogadores acessem pelo celular na mesma rede Wi-Fi:
```bash
npm run dev:lan
```
O console exibirá as URLs de acesso:
- **No computador do mestre:** `http://localhost:3000`
- **Na TV / Telão:** `http://localhost:3000/telao/<id-da-campanha>`
- **No celular dos jogadores:** `http://<SEU_IP_LOCAL>:3000/jogador/<id-da-campanha>` *(ou escaneie o QR Code no topo do painel do mestre)*

### 4. Rodar em Modo de Produção (Otimizado)
Para máxima performance e estabilidade durante as sessões:
```bash
npm run build
npm run start:lan
```

---

## 🛡️ Licença e Créditos

- Desenvolvido com foco na comunidade de RPG de mesa e em narrativas híbridas inovadoras.
- O sistema de regras do módulo padrão é baseado no cenário e mecânicas de **Feiticeiros e Maldições** (inspirado no universo de Jujutsu Kaisen).
- Código aberto sob a licença [MIT](LICENSE).
