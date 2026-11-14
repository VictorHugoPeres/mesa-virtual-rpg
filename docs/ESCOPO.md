# Escopo do Projeto: Plataforma Modular de RPG (VTT Híbrido / Presencial)

## 1. Visão Geral
Aplicação web local-first (rodando no computador do mestre, preparada para futura hospedagem em servidor online) voltada inicialmente para mesas presenciais híbridas com suporte a **duas telas**:
- **Tela do Mestre (`/mestre`):** Painel de controle completo no PC/Notebook.
- **Tela da Mesa / Telão (`/telao`):** Visão limpa projetada em TV ou Projetor para os jogadores (sem spoilers).

O design deve ser **simples, funcional, minimalista e em Dark Mode**, com arquitetura modular que separe as ferramentas universais de RPG (Núcleo) das regras específicas de cada sistema (Módulos de Sistema), começando pelo sistema **Feiticeiros e Maldições**.

---

## 2. Arquitetura Técnica (Local -> Servidor)
- **Frontend:** Next.js (App Router) + React + TypeScript + Tailwind CSS.
- **Banco de Dados:** SQLite local (arquivo `.db`) via Prisma ORM ou Drizzle ORM (permitindo fácil migração futura para PostgreSQL em servidor).
- **Sincronização em Tempo Real (PC <-> TV/Projetor):** WebSockets locais (Socket.io) ou Server-Sent Events (SSE), garantindo que alterações no PC apareçam instantaneamente na TV.
- **Multi-sistema (Expansão Futura):**
  - `src/core/`: Mapa, Áudio, Dados, Iniciativa, Notas, Telão (100% agnóstico ao sistema).
  - `src/systems/feiticeiros-e-maldicoes/`: Ficha, cálculos, perícias e regras específicas.

---

## 3. Requisitos Funcionais por Fases

### FASE 1: Estrutura Base, Dados e Ficha (MVP Jogável)
1. **Gerenciamento de Campanhas e Sessões:**
   - Criar/selecionar uma campanha vinculada a um sistema (inicialmente `Feiticeiros e Maldições`).
2. **Módulo de Sistema: Feiticeiros e Maldições:**
   - Ficha completa de Feiticeiro: Dados básicos (Nome, Nível, Grau, Origem, Especialização, Técnica Amaldiçoada, Maestria).
   - 6 Atributos base (FOR, DES, CON, INT, SAB, CAR) com cálculo automático de modificadores.
   - Lista de Perícias vinculadas aos atributos com cálculo automático de bônus (Maestria/Especialização/Outros).
   - Barras editáveis em tempo real: Pontos de Vida (Atuais/Máximos/Temporários), Pontos de Energia Amaldiçoada, Integridade, Classe de Armadura (CA) e Testes de Morte.
   - Aba de Habilidades de Técnica, Características, Pactos/Votos e Inventário/Armas.
3. **Sistema Híbrido de Dados (Físico + Digital):**
   - **Modo Digital:** Clicar em um atributo, perícia ou ataque rola o dado (`1d20` ou dados de dano) com os bônus da ficha e registra no histórico.
   - **Modo Dado Físico (Input Manual):** O jogador ou mestre rola o dado real na mesa, digita o valor puro que caiu no d20 (ex: `17`) ou o dano físico, e o sistema soma automaticamente os modificadores da ficha selecionada, verifica crítico/sucesso e registra o resultado final no histórico (com opção de exibir o destaque na tela da TV).
4. **Compêndio Rápido (Consulta):**
   - Aba lateral pesquisável no painel do mestre com resumo das regras do livro, condições e tabelas rápidas.

### FASE 2: Escudo do Mestre, Áudio e Modo TV
5. **Tela do Telão (`/telao`):**
   - Janela limpa para TV/Projetor sincronizada com o `/mestre`.
   - Botão "Projetar Imagem/Arte" no painel do mestre para mostrar na TV a arte de um NPC, Maldição, local ou documento para os jogadores e ocultar quando quiser.
6. **Escudo do Mestre e Combate:**
   - **Bestiário / Fichas de Ameaças:** Cadastro de Maldições e Inimigos (Grau, PV, CA, Ações, Repertório e Características passivas).
   - **Tracker de Iniciativa:** Ordem de turnos com botão "Avançar Turno", controle rápido de PV/Energia dos participantes e opção de espelhar a ordem de turnos na TV (ocultando a vida exata dos monstros, mostrando apenas estado como "Saudável / Ferido / Crítico").
   - **Bloco de Notas do Mestre:** Anotações rápidas da sessão e lore do mundo (salvas no banco local).
7. **Mesa de Som e Música:**
   - Player de Música Ambiente em loop (com fade/troca suave de faixa) + Soundboard de botões rápidos para Efeitos Sonoros (ex: Expansão de Domínio, Golpe, Impacto, Terror).
   - Controles de volume independentes (Música vs. Efeitos), reproduzindo no áudio principal do PC/TV.

### FASE 3: Mapa Tático e Grid (Substituindo Tabuleiro Físico)
8. **Tabuleiro no `/mestre` e `/telao`:**
   - Upload de imagem de mapa com grid quadrado sobreposto (ajuste de tamanho/escala do grid).
   - **Tokens:** Adicionar imagens para personagens e maldições, mover livremente no `/mestre` com atualização em tempo real no `/telao`.
   - **Medidor de Distância e Área:** Ferramenta simples para medir metros/quadrados entre tokens ou marcar área de alcance (ex: raio de uma técnica ou domínio).
   - **Névoa de Guerra em Blocos:** Máscara escura sobre o mapa que o mestre apaga por células/áreas para revelar salas aos poucos na TV.

---

## 4. Requisitos Não-Funcionais
- Toda a interface em **Português (PT-BR)**.
- Layout funcional, limpo, com alto contraste (ideal para ser lido de longe na TV/Projetor e rápido de operar pelo mestre durante o combate).
- Zero dependência de internet paga para rodar a Fase 1, 2 e 3 localmente.