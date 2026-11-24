# Design System — D20 Mesa Digital (Superfície Neutra Grafite & Acentos Semânticos)

Este documento estabelece as diretrizes visuais da plataforma **D20 Mesa Digital**, equilibrando elegância sóbria com excelente contraste visual, leitura rápida e hierarquia funcional.

---

## 1. Princípios de Design

1. **Superfície Neutra Grafite (Equilíbrio Sofisticado):**
   - Elimina o visual "preto chapado ou morto": base em grafite profundo (`#0B0C0E`), cards e painéis em `#14161A`, bordas em `#23272F` e estados de hover em `#1A1D24`.
2. **Ícones Sutis com Cores Funcionais:**
   - Botões utilitários mantêm fundo neutro sóbrio, mas trazem cores suaves aos ícones (ex: Verde para Mapa, Rosa para Som, Vermelho para Ameaças, Azul para Dados, Roxo para Histórico, Âmbar para Compêndio/Diário, Índigo para Mobile). Isso permite escaneamento visual instantâneo pelo Mestre.
3. **Cores Semânticas Translúcidas:**
   - Badges e tags usam fundos translúcidos sutis (10% de opacidade com bordas em 20%) para diferenciar categorias sem poluir visualmente (ex: Jogador em `sky-500/10`, Ameaça em `rose-500/10`).
4. **Marca D20 (Carmim/Rose-600):**
   - Reservada para a logo, botão de ação primária (+ Criar), botão de ação principal do combate (Iniciar) e destaques essenciais (aba ativa de notas, barra de progresso do som).

---

## 2. Paleta de Cores e Tokens

### 2.1 Base Neutra Grafite
| Token | Hex / Classe | Aplicação |
|---|---|---|
| Background Geral | `#0B0C0E` / `var(--bg-primary)` | Fundo principal da aplicação |
| Card / Container | `#14161A` / `var(--bg-secondary)` | Cards de campanha, fichas, drawers e modais |
| Superfície Interativa | `#14161A` (hover `#1A1D24`) | Botões secundários e controles de toolbar |
| Borda Padrão | `#23272F` / `var(--border-default)` | Divisores de seção e contornos de cards |
| Borda Destaque | `border-white/20` ou `border-rose-500/40` | Elementos em foco ou selecionados |
| Texto Primário | `text-zinc-100` / `text-white` | Títulos, nomes, números de atributos vitais |
| Texto Secundário | `text-zinc-400` | Subtítulos, labels de campos, descrições |
| Texto Muted | `text-zinc-500` | Datas, rodapés, dicas contextuais |

### 2.2 Cor Primária da Marca (Carmim)
- **Tom:** `rose-600` (`#E11D48`) / hover: `rose-500` (`#F43F5E`).
- **Aplicações:** Logo D20, botões `+ Nova Campanha` / `+ Novo Personagem`, botão "Iniciar Combate", acentos ativos.

### 2.3 Cores Semânticas do RPG (Uso Restrito aos Dados do Jogo)
| Recurso | Tom | Aplicação |
|---|---|---|
| **PV (Pontos de Vida)** | `rose-500` (`#F43F5E`) | Barra e números de Vida/HP |
| **PE (Pontos de Energia)** | `sky-400` (`#38BDF8`) | Barra e números de Energia Amaldiçoada / Vigor |
| **Defesa (CA)** | `zinc-300` / `zinc-400` | Barra e valor de Defesa (metálico sóbrio) |
| **Turno Ativo / Online** | `emerald-500` / `emerald-400` | Borda/glow do combatente ativo, TV ON |
| **Modificadores Positivos** | `emerald-400` (`+X`) | Bônus de atributos em fichas e cards |
| **Modificadores Negativos** | `rose-400` (`-X`) | Penalidades de atributos |

---

## 3. Padrão de Componentes

### 3.1 Botão de Ação Primária (+ Criar)
```tsx
className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-sm shadow-rose-950/30 transition-all cursor-pointer select-none active:scale-95"
```

### 3.2 Botão Utilitário / Toolbar
```tsx
className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-medium bg-[#14161A] hover:bg-[#1A1D24] border border-[#23272F] hover:border-white/20 text-zinc-200 hover:text-white transition-all shadow-xs cursor-pointer select-none"
```
*Ícones com cores funcionais suaves (ex: `text-emerald-400`, `text-sky-400`, `text-pink-400`).*

### 3.3 Badges Translúcidos
- **Jogador (PC):** `bg-sky-500/10 text-sky-400 border border-sky-500/20`
- **Ameaça (NPC/Threat):** `bg-rose-500/10 text-rose-400 border border-rose-500/20`
- **Aba de Notas Ativa:** `border-rose-500/60 text-white bg-white/[0.05]`
