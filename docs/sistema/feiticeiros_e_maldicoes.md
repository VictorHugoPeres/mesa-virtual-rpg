# Sistema: Feiticeiros e Maldições (F&M v2.0)
**Referência Completa de Regras, Campos de Ficha e Fórmulas de Cálculo**

Este documento detalha todos os componentes do sistema *Feiticeiros e Maldições* (baseado no Livro de Regras v2.0 e modelo oficial de ficha por Setsugiri), estruturado para servir de guia de implementação para a ficha e lógica do módulo `src/systems/feiticeiros-e-maldicoes/`.

---

## 1. Atributos Base e Modificadores

O sistema utiliza **6 atributos principais**, variando normalmente de 1 a 20 (com limite humano comum até 20 e expansível até 30 via talentos, votos ou habilidades de especialização).

| Atributo | Abreviação | Descrição Principal |
| :--- | :---: | :--- |
| **Força** | `FOR` | Potência muscular, dano corpo a corpo bruto, capacidade de carga e saltos. |
| **Destreza** | `DEX` / `DES` | Agilidade, reflexos, iniciativa, esquiva, equilíbrio e ataques leves/à distância. |
| **Constituição** | `CON` | Vigor físico, resistência biológica, pontos de vida e testes de fortitude. |
| **Inteligência** | `INT` | Capacidade analítica, raciocínio tático, feitiçaria teórica e ofícios. |
| **Sabedoria** | `SAB` | Percepção sensorial, intuição, vontade, primeiros socorros e ligação com o ambiente. |
| **Carisma / Presença** | `CAR` / `PRE` | Força de presença, influência social, persuasão, intimidação e enganação. |

### 1.1. Fórmula do Modificador de Atributo
O valor 10 representa a média humana (modificador 0). A cada 2 pontos acima ou abaixo, o modificador varia em 1.

$$\text{Modificador} = \lfloor \frac{\text{Valor} - 10}{2} \rfloor$$

**Tabela de Referência Rápida:**
- 1: `-5`
- 2–3: `-4`
- 4–5: `-3`
- 6–7: `-2`
- 8–9: `-1`
- 10–11: `0`
- 12–13: `+1`
- 14–15: `+2`
- 16–17: `+3`
- 18–19: `+4`
- 20–21: `+5`
- 22–23: `+6`
- 24–25: `+7`
- 26–27: `+8`
- 28–29: `+9`
- 30: `+10`

---

## 2. Progressão, Nível, Graus e Bônus de Treinamento / Maestria

O nível de personagem vai de 1 a 20. O **Bônus de Treinamento** (também chamado de **Maestria**) aumenta conforme o nível do personagem:

| Nível do Personagem | Bônus de Treinamento / Maestria | Grau Típico Jujutsu | XP Acumulado Necessário |
| :---: | :---: | :---: | :---: |
| **1** | `+2` | 4° Grau | 0 |
| **2** | `+2` | 4° Grau | 1.000 |
| **3** | `+2` | 4° Grau | 3.000 |
| **4** | `+2` | 4° Grau | 6.000 |
| **5** | `+3` | 3° Grau | 10.000 |
| **6** | `+3` | 3° Grau | 15.000 |
| **7** | `+3` | 3° Grau | 21.000 |
| **8** | `+3` | 2° Grau | 28.000 |
| **9** | `+4` | 2° Grau | 36.000 |
| **10** | `+4` | 2° Grau *(+1 Especialização em Perícia)* | 45.000 |
| **11** | `+4` | 2° Grau | 55.000 |
| **12** | `+4` | 2° Grau | 66.000 |
| **13** | `+5` | 1° Grau | 78.000 |
| **14** | `+5` | 1° Grau | 91.000 |
| **15** | `+5` | 1° Grau | 105.000 |
| **16** | `+5` | 1° Grau | 120.000 |
| **17** | `+6` | Grau Especial / 1° Grau Especial | 136.000 |
| **18** | `+6` | Grau Especial | 153.000 |
| **19** | `+6` | Grau Especial | 171.000 |
| **20** | `+6` | Grau Especial | 190.000 |

> **Nota:** A cada 4 níveis de personagem (4, 8, 12, 16, 20), o personagem recebe **+2 pontos de atributo** (que podem ser distribuídos entre um atributo ou dois atributos).

---

## 3. Fórmulas de Valores Adicionais e Derivados

### 3.1. Pontos de Vida (PV)
- **Nível 1:**
  $$\text{PV Máximo} = \text{PV Base da Especialização} + \text{Modificador de CON}$$
- **Níveis Subsequentes (por nível ganho):**
  - **Opção Média/Fixa:** Valor fixo da Especialização + Modificador de CON.
  - **Opção Rolagem:** Rolar o Dado de Vida (DV) da Especialização + Modificador de CON.
- **Retroatividade:** Se o Modificador de CON aumentar em níveis futuros, recalcula-se o PV retroativamente para todos os níveis anteriores.
- **Campos da Ficha:**
  - `pvAtual`: Pontos de vida correntes.
  - `pvMaximo`: Total máximo calculado + bônus de itens/talentos.
  - `pvTemporario`: Pontos de vida temporários que absorvem dano antes da vida real.

| Especialização | PV Nível 1 | PV por Nível Subsequente (Fixo) | Dado de Vida (DV) |
| :--- | :---: | :---: | :---: |
| **Lutador** | 12 + CON | 7 + CON | 1d10 |
| **Especialista em Combate** | 12 + CON | 7 + CON | 1d10 |
| **Especialista em Técnica** | 10 + CON | 6 + CON | 1d8 |
| **Controlador** | 10 + CON | 6 + CON | 1d8 |
| **Suporte** | 10 + CON | 6 + CON | 1d8 |
| **Restringido** | 16 + CON | 9 + CON | 1d12 |

### 3.2. Integridade da Alma
Representa a estabilidade metafísica do corpo e alma contra técnicas diretas (como a Transfiguração Ociosa de Mahito).
- **Fórmula:**
  $$\text{Integridade Máxima} = \text{PV Máximo}$$
- **Campos:** `integridadeAtual`, `integridadeMaxima`, `integridadeTemporaria`.

### 3.3. Pontos de Energia Amaldiçoada (PE)
Recurso essencial para alimentar feitiços, aprimoramento corporal e barreiras.
- **Lutador / Especialista em Combate:**
  $$\text{PE Máximo} = \text{Nível} \times 4$$
- **Especialista em Técnica:**
  $$\text{PE Máximo} = (\text{Nível} \times 6) + \text{Modificador do Atributo Chave (INT ou SAB)}$$
- **Controlador / Suporte:**
  $$\text{PE Máximo} = (\text{Nível} \times 5) + \text{Modificador do Atributo Chave (SAB ou CAR)}$$
- **Restringido:**
  Não possui PE amaldiçoado. Utiliza **Pontos de Vigor / Estamina**.
- **Campos:** `peAtual`, `peMaximo`, `peTemporario`.

### 3.4. Defesa / Classe de Armadura (CA)
Fórmula padrão da ficha e livro v2.0:
$$\text{Defesa Total} = \text{Defesa Base (10)} + \text{Modificador de Destreza} + \text{Bônus de Uniforme} + \text{Bônus de Escudo} + \text{Outros Bônus}$$
*(Nota de regra opcional do livro: alguns uniformes ou regras do mestre aplicam metade do nível arredondada para baixo; a ficha padrão v2.0 utiliza Natural 10 + DEX + Uniforme + Escudo + Outros).*

### 3.5. Iniciativa
$$\text{Iniciativa} = \text{Modificador de Destreza} + \text{Outros Bônus}$$
- No combate, rola-se: $1d20 + \text{Iniciativa}$.

### 3.6. Atenção (Percepção Passiva)
Representa a percepção contínua do feiticeiro sem gastar uma ação:
$$\text{Atenção} = 10 + \text{Bônus Total em Percepção} + \text{Outros Bônus}$$

### 3.7. Deslocamento / Movimento
- Padrão humano: **9 metros** (equivalente a 6 quadrados em grid tático de 1,5m).
- Modificado por talentos (ex: Treino de Agilidade), passivas da origem Restringido ou itens.

### 3.8. Testes de Morte (Portas da Morte)
Ao atingir 0 PV, o feiticeiro cai inconsciente e faz testes no início do seu turno:
- **Dado:** $1d20$ puro (sem atributos, a menos que uma habilidade declare o contrário).
- **Sucesso (10 ou mais):** Marca 1 Sucesso (3 sucessos = Estabilizado).
- **Fracasso (9 ou menos):** Marca 1 Fracasso (3 fracassos = Morte).
- **Crítico Natural 20:** Recupera imediatamente 1 PV e acorda.
- **Desastre Natural 1:** Conta como 2 Fracassos imediatos.
- **Campos:** `sucessosMorte` (0 a 3), `fracassosMorte` (0 a 3).

---

## 4. Lista Completa de Perícias e Testes de Resistência

Na versão 2.0 de Feiticeiros e Maldições (modelo oficial da ficha de Setsugiri), os **Testes de Resistência (Fortitude, Reflexos, Vontade e Integridade)** e habilidades marciais essenciais (**Luta** e **Pontaria**) são unificados e integrados à lista de perícias, cada um associado a um Atributo Chave.

Cada perícia possui:
- **Atributo Vinculado:** Fornece o modificador base.
- **Treinado / Maestria (`Mt.`):** Quando marcado, soma o Bônus de Maestria (+2 a +6).
- **Especialização (`Es.`):** Quando marcado, soma o Bônus de Maestria **duas vezes** (dobra a maestria).
- **Outros Bônus:** Campo numérico para bônus circunstanciais, itens amaldiçoados ou talentos.

### Fórmula do Bônus Total da Perícia:
$$\text{Total} = \text{Modificador do Atributo} + (\text{se Mt.: } \text{Maestria}) + (\text{se Es.: } \text{Maestria}) + \text{Outros}$$

### Tabela Oficial de Perícias da Ficha v2.0:

| Perícia | Atributo Chave | Requer Treinamento? | Aplicação Principal |
| :--- | :---: | :---: | :--- |
| **Atletismo** | FOR | Não | Escalar, saltar, nadar, empurrar, corrida de impacto e quebrar amarras. |
| **Luta** | FOR | Não | Ataques corpo a corpo desarmados e com armas marciais de contato. |
| **Acrobacia** | DEX | Não | Equilíbrio, escapar de imobilizações, manobras aéreas e amortecer quedas. |
| **Furtividade** | DEX | Não | Esconder-se, mover-se em silêncio e emboscadas. |
| **Pontaria** | DEX | Não | Disparos com arcos, armas de fogo, arremessos e feitiços que exigem mira física. |
| **Prestidigitação** | DEX | **Sim** | Mãos leves, furtar objetos, destrancar portas e manuseio fino. |
| **Reflexos** | DEX | Não | Teste de resistência para esquivar de explosões, armadilhas e golpes rápidos. |
| **Fortitude** | CON | Não | Teste de resistência para resistir a venenos, fadiga, atordoamento e choque físico. |
| **Integridade** | CON | Não | Teste de resistência para proteger a alma contra distorções e efeitos transcendentais. |
| **Astúcia** | INT | Não | Raciocínio rápido sob pressão, decifrar códigos e contramedidas táticas. |
| **Feitiçaria** | INT | **Sim** | Identificar técnicas, rituais amaldiçoados, teoria da energia e círculos de barreira. |
| **Investigação** | INT | Não | Encontrar pistas, deduzir eventos em cenas de crime e examinar resíduos amaldiçoados. |
| **História** | INT | Não | Conhecimento sobre famílias históricas de feiticeiros, eras antigas e maldições lendárias. |
| **Ofício 1, 2, 3, 4** | INT | **Sim** | Criação e reparo de itens mundanos, kits médicos, culinária, mecânica, etc. |
| **Religião / Teologia** | INT | Não | Conhecimento de cultos, mitologias religiosas e seitas (ex: Culto da Associação do Tempo). |
| **Tecnologia** | INT | Não | Hacking, operação de computadores modernos, câmeras de segurança e eletrônicos. |
| **Intuição** | SAB | Não | Sentir segundas intenções, notar mentiras e pressentir emboscadas. |
| **Medicina** | SAB | **Sim** | Primeiros socorros, estabilização de feridos, diagnósticos e cirurgia. |
| **Percepção** | SAB | Não | Notar sons, cheiros, movimento oculto e flutuações perceptíveis no ambiente. |
| **Ocultismo** | SAB | Não | Identificação intuitiva de maldições, rastreamento de energia residual e presságios. |
| **Vontade** | SAB | Não | Teste de resistência mental contra medo, charme, coerção e loucura. |
| **Persuasão** | CAR | Não | Diplomacia, negociação pacífica e apelos morais. |
| **Enganação** | CAR | Não | Blefar, mentir, fingir intenções e manter disfarces. |
| **Intimidação** | CAR | Não | Coagir pela presença imponente, ameaças e terror psicológico. |
| **Performance** | CAR | Não | Atuação, discursos inspiradores e encenação. |

---

## 5. Perfil Amaldiçoado e Combate Jujutsu

### 5.1. Classe de Dificuldade (CD) de Técnicas e Habilidades
Quando o feiticeiro lança um feitiço que exige teste de resistência dos alvos:
$$\text{CD do Feitiço} = 8 + \text{Bônus de Treinamento/Maestria} + \text{Modificador do Atributo da Técnica} + \text{Outros}$$

### 5.2. Jogada de Ataque Mágico (Acerto de Técnica)
$$\text{Ataque de Técnica} = 1d20 + \text{Bônus de Treinamento/Maestria} + \text{Modificador do Atributo da Técnica} + \text{Outros}$$

### 5.3. Níveis de Aptidão Amaldiçoada
Na aba *Perfil Amaldiçoado*, o feiticeiro desenvolve até 6 categorias principais de aptidões (níveis de 0 a 5):
1. **Aura:** Reforço corporal e fluidez da energia amaldiçoada.
2. **Controle e Leitura:** Detecção sensorial de resíduos, ocultação da própria energia e eficiência de custo.
3. **Barreiras:** Criação de cortinas (*Choari*), casulos e paredes defensivas.
4. **Domínio:** Criação de domínios simples, cestas ocas e expansões de domínio completas.
5. **Energia Reversa (RCT):** Multiplicação de energia negativa para gerar energia positiva (cura biológica e restauração).
6. **Especiais:** Técnicas exclusivas de linhagem e pactos inatos.

### 5.4. Estrutura de Feitiços / Habilidades de Técnica
Os feitiços são divididos por círculos/níveis de liberação (de Nível 0 a Nível 5):
- **Nome do Feitiço**
- **Nível / Custo em PE**
- **Ação:** Ação Padrão, Ação Bônus, Reação, Ação Completa.
- **Alcance / Área:** Toque, Curto (9m), Médio (18m), Longo (36m), Raio, Cone, etc.
- **Duração:** Instantânea, Sustentada (Concentração), Turnos/Cenas.
- **Efeito / Descrição:** Dano, dano de impacto amaldiçoado, condições aplicadas e CD.

---

## 6. Criação de Personagem: Passo a Passo do Livro

1. **Passo 1: Conceito e Aspectos Pessoais**
   - Nome, Idade, Gênero, Aparência (Olhos, Cabelo, Pele, Altura, Peso, Roupas, Aura).
   - Traços de Personalidade, Ideais, Ligações, Complicações / Defeitos.
   - **Domínio Inato:** A representação visual e conceitual do interior da alma do personagem.

2. **Passo 2: Atributos e Origem**
   - **Métodos de Atributos:**
     - *Valores Fixos:* 15, 14, 13, 12, 10, 8 distribuídos livremente.
     - *Compra por Pontos:* 17 pontos com base 10 em todos (valores de 8 a 15).
     - *Rolagem:* $4d6$ mantendo os 3 maiores.
   - **Origem:** (Inato, Herdado/Clãs [Gojo, Zenin, Kamo, Inumaki], Derivado, Restringido, Feto Híbrido, Sem Técnica, Corpo Mutante). Aplica bônus de atributos (+2 em um e +1 em outro, ou similar) e talento/característica inicial.

3. **Passo 3: Especialização**
   - Escolha entre: Lutador, Especialista em Combate, Especialista em Técnica, Controlador, Suporte, Restringido.
   - Define: PV inicial, PE inicial, treinamentos de perícias concedidos, Atributo Chave e habilidades de 1° nível.

4. **Passo 4: Equipamentos Iniciais**
   - 2 equipamentos de custo 1 (armas simples/marciais ou itens especiais).
   - 1 Uniforme Comum (concede a Defesa padrão).
   - 1 Kit de Ferramentas à escolha.
   - Cálculo de capacidade de carga (espaços de inventário baseados em Força).

5. **Passo 5: Técnica Amaldiçoada e Feitiços**
   - Nome e conceito da Técnica Inata (ou técnica padrão da Enciclopédia).
   - 2 feitiços iniciais (ou mais conforme origem/características como *Marca Registrada*).
   - Atributo Principal da Técnica (geralmente INT, SAB ou CAR).

6. **Passo 6: Valores Finais Calculados**
   - Atenção, Defesa, Deslocamento (9m), Iniciativa, Integridade da Alma, PV, PE, Dados de Vida.
   - Caixa de Testes de Morte zerada (0 sucessos, 0 fracassos).

---

## 7. Mapeamento das Abas da Ficha Oficial (Setsugiri v2.0)

Para manter 100% de fidelidade ao modelo que a comunidade utiliza:

1. **Aba 1: Ficha Pessoal (`Ficha Pessoal.html`)**
   - Cabeçalho (Nome, Nível, Origem, Especialização, Jogador, Campanha, Grau, XP, Maestria).
   - Atributos com modificadores.
   - Barras de Recursos: PV (Atual/Max/Temp), Integridade (Atual/Max/Temp), PE (Atual/Max/Temp).
   - Defesa (Natural 10, Uniforme, Escudo, Destreza, Outros, Total).
   - Derivados: Atenção, Iniciativa, Movimento, Dados de Vida.
   - Testes de Morte (3 sucessos, 3 fracassos).
   - Tabela de Perícias Completa (25 perícias com checkboxes de Mt. e Es.).
   - Registro Rápido de Armas (Arma, Bônus, Dano, Crítico, Tipo, Alcance).
   - Habilidades de Especialização e Talentos.

2. **Aba 2: Perfil Amaldiçoado (`Perfil Amaldiçoado.html`)**
   - Dados da Técnica Amaldiçoada (Nome, Descrição, Atributo, CD, Acerto, Perícia).
   - Níveis de Aptidão (0 a 5) em cada categoria.
   - Lista de Feitiços divididos por Nível (0 a 5).
   - Expansão de Domínio (Nome, Tipo, Descrição, Custo).
   - Aptidões Amaldiçoadas adquiridas.

3. **Aba 3: Inventário e Aspectos (`Registro e Inventário.html`)**
   - Aspectos Físicos e Biológicos.
   - Personalidade (Ideais, Ligações, Defeitos, Domínio Inato, História).
   - Tabela de Itens (Nome, Quantidade, Espaços, Custo, Carga Total).

4. **Aba 4: Invocações & Shikigamis (`Invocações.html`)**
   - Fichas de até 5 invocações (Shikigamis, Marionetes ou Corpos Amaldiçoados).
   - Grau, PV, CA, Movimento, Atributos de cada invocação e Ações/Características.

5. **Aba 5: Treinamentos (`Treinamentos.html`)**
   - Progresso das 4 etapas de cada um dos 11 Treinamentos Jujutsu (Agilidade, Barreiras, Compreensão, Controle de Energia, Domínios, Energia Reversa, Luta, Manejo de Arma, Perícia, Potencial Físico, Resistência).
