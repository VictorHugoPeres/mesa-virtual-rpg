# Sistema: Feiticeiros e Maldições (F&M v2.5)
**Referência Completa de Regras, Campos de Ficha, Fórmulas Oficiais e Base de Dados**

Este documento consolida as regras oficiais do **Livro de Regras v2.5** e seus suplementos oficiais (*Guia do Narrador v0.4*, *Grimório das Maldições v0.6* e *Enciclopédia Amaldiçoada v0.9*), servindo como guia canônico de implementação para o módulo `src/systems/feiticeiros-e-maldicoes/`.

---

## 1. Atributos Base e Modificadores

O sistema utiliza **6 atributos principais**, variando normalmente de 1 a 20 (com limite humano comum até 20 e expansível até 30 via talentos, votos, habilidades de especialização ou origens):

| Atributo | Abreviação | Descrição Principal |
| :--- | :---: | :--- |
| **Força** | `FOR` | Potência muscular bruta, dano corpo a corpo, capacidade de carga e saltos. |
| **Destreza** | `DES` / `DEX` | Agilidade, equilíbrio, reflexos, iniciativa, esquiva e ataques leves/à distância. |
| **Constituição** | `CON` | Vigor físico, pontos de vida, integridade biológica e testes de fortitude/integridade. |
| **Inteligência** | `INT` | Capacidade analítica, raciocínio tático, feitiçaria teórica, tecnologia e ofícios. |
| **Sabedoria** | `SAB` | Percepção sensorial, intuição, vontade, primeiros socorros e ligação empírica com o mundo. |
| **Presença** | `PRE` | Força de personalidade, impacto social, persuasão, intimidação, enganação e desempenho. *(Substitui Carisma/CAR)* |

### 1.1. Modificador de Atributo
O valor 10 representa a média humana (modificador 0). A cada 2 pontos acima ou abaixo, o modificador varia em 1:

$$\text{Modificador} = \lfloor \frac{\text{Valor} - 10}{2} \rfloor$$

**Tabela de Referência Rápida:**
- 1: `-5` | 2–3: `-4` | 4–5: `-3` | 6–7: `-2` | 8–9: `-1`
- 10–11: `0` | 12–13: `+1` | 14–15: `+2` | 16–17: `+3` | 18–19: `+4`
- 20–21: `+5` | 22–23: `+6` | 24–25: `+7` | 26–27: `+8` | 28–29: `+9` | 30: `+10`

### 1.2. Métodos de Atribuição de Atributos

1. **Valores Fixos:**
   Distribuir: `15, 14, 13, 12, 10, 8`.
2. **Rolagem:**
   Rolar $4d6$, descartando o menor resultado e somando os 3 maiores para cada um dos 6 atributos.
3. **Compra por Pontos (v2.5 Oficial):**
   - Todos os atributos iniciam em **10**.
   - O jogador possui **17 pontos** para comprar aumentos (máximo 15 antes de bônus de origem).
   - Diminuir para 8 ou 9 gera pontos adicionais:

| Valor Desejado | Custo em Pontos | Efeito no Saldo |
| :---: | :---: | :---: |
| **8** | `+2` | Ganha 2 pontos para distribuir |
| **9** | `+1` | Ganha 1 ponto para distribuir |
| **10** | `0` | Valor base (sem custo) |
| **11** | `2` | Gasta 2 pontos |
| **12** | `3` | Gasta 3 pontos |
| **13** | `4` | Gasta 4 pontos |
| **14** | `5` | Gasta 5 pontos |
| **15** | `7` | Gasta 7 pontos |

---

## 2. Progressão, Bônus de Treinamento (BT) e Fórmulas Consolidadas v2.5

O nível de personagem progride de 1 a 20. Na v2.5, **$\lfloor \text{Nível} / 2 \rfloor$** entra no cálculo de Defesa, Perícias, Testes de Resistência, CD e Ataques.

| Nível | Bônus de Treinamento (BT) | Grau Típico | $\lfloor \text{Nível} / 2 \rfloor$ | XP Necessário |
| :---: | :---: | :---: | :---: | :---: |
| **1** | `+2` | 4° Grau | `0` | 0 |
| **2** | `+2` | 4° Grau | `1` | 1.000 |
| **3** | `+2` | 4° Grau | `1` | 3.000 |
| **4** | `+2` | 4° Grau | `2` | 6.000 |
| **5** | `+3` | 3° Grau | `2` | 10.000 |
| **6** | `+3` | 3° Grau | `3` | 15.000 |
| **7** | `+3` | 3° Grau | `3` | 21.000 |
| **8** | `+3` | 2° Grau | `4` | 28.000 |
| **9** | `+4` | 2° Grau | `4` | 36.000 |
| **10** | `+4` | 2° Grau *(+1 Perícia Mestre)* | `5` | 45.000 |
| **11** | `+4` | 2° Grau | `5` | 55.000 |
| **12** | `+4` | 2° Grau | `6` | 66.000 |
| **13** | `+5` | 1° Grau | `6` | 78.000 |
| **14** | `+5` | 1° Grau | `7` | 91.000 |
| **15** | `+5` | 1° Grau | `7` | 105.000 |
| **16** | `+5` | 1° Grau | `8` | 120.000 |
| **17** | `+6` | Grau Especial | `8` | 136.000 |
| **18** | `+6` | Grau Especial | `9` | 153.000 |
| **19** | `+6` | Grau Especial | `9` | 171.000 |
| **20** | `+6` | Grau Especial | `10` | 190.000 |

> **Incrementos de Atributo:** Nos níveis 4, 8, 12, 16 e 20, o personagem recebe **+2 pontos de atributo** (podendo colocar +2 em um ou +1 em dois).

---

## 3. Fórmulas Oficiais v2.5

Todas as operações de divisão no sistema utilizam piso inteiro (`Math.floor`):

### 3.1. Defesa
$$\text{Defesa} = 10 + \text{Mod. DES} + \lfloor \frac{\text{Nível}}{2} \rfloor + \text{Uniforme} + \text{Escudo} + \text{Outros}$$

### 3.2. Perícias e Testes de Resistência (TR)
$$\text{Bônus} = \text{Mod. Atributo} + \lfloor \frac{\text{Nível}}{2} \rfloor + \text{BônusTreino} + \text{Outros}$$
- Se **Não Treinado:** $\text{BônusTreino} = 0$.
- Se **Treinado:** $\text{BônusTreino} = \text{BT}$.
- Se **Mestre:** $\text{BônusTreino} = \text{BT} + \lfloor \frac{\text{BT}}{2} \rfloor$.
- *Exceção Restringido (Nv 10+):* Em testes de FOR, DES ou CON onde é Mestre, o bônus de treino é dobrado ($2 \times \text{BT}$).

### 3.3. Classe de Dificuldade (CD) de Técnicas e Especializações
$$\text{CD} = 10 + \lfloor \frac{\text{Nível}}{2} \rfloor + \text{Mod. Atributo Chave} + \text{BT} + \text{Outros}$$

### 3.4. Jogadas de Ataque (Armas e Técnicas)
$$\text{Ataque} = \text{Mod. Atributo} + \lfloor \frac{\text{Nível}}{2} \rfloor + (\text{se Treinado/Proficiente: } \text{BT}) + \text{Outros}$$
*(Não existem mais as perícias Luta e Pontaria; o ataque calcula diretamente o modificador de Força/Destreza + metade do nível + proficiência com a categoria da arma).*

### 3.5. Pontos de Vida (PV) e Dados de Vida (DV)
- **Nível 1:** $\text{PV Base} + \text{Mod. CON}$
- **Níveis Subsequentes:** Soma $(\text{PV por Nível} + \text{Mod. CON})$ por nível ganho.
- *Clã Kamo:* Recebe $+1\text{ PV por nível}$ após o 1º nível.
- *Retroatividade:* Se o Mod. CON aumentar no futuro, o PV máximo recalcula retroativamente para todos os níveis passados.

| Especialização | PV Nível 1 | PV Subsequente (Fixo) | Dado de Vida (DV) |
| :--- | :---: | :---: | :---: |
| **Lutador** | 12 + CON | 7 + CON | 1d10 |
| **Especialista em Combate** | 12 + CON | 7 + CON | 1d10 |
| **Especialista em Técnica** | 10 + CON | 6 + CON | 1d8 |
| **Controlador** | 10 + CON | 6 + CON | 1d8 |
| **Suporte** | 10 + CON | 6 + CON | 1d8 |
| **Restringido** | 16 + CON | 9 + CON | 1d12 |

### 3.6. Pontos de Energia Amaldiçoada (PE) e Estamina
- **Lutador / Especialista em Combate:** $\text{PE Máximo} = \text{Nível} \times 4$
- **Especialista em Técnica:** $\text{PE Máximo} = (\text{Nível} \times 6) + \text{Mod. Atributo Chave}$
- **Controlador / Suporte:** $\text{PE Máximo} = (\text{Nível} \times 5) + \text{Mod. Atributo Chave}$
- **Restringido (Estamina):** Não possui PE. Possui $\text{Estamina} = \text{Nível} \times 4$.
- **Modificadores Especiais de Origem:**
  - *Maldição:* $+1\text{ PE por nível}$.
  - *Clã Gojo (Seis Olhos / Eficiência):* $+1\text{ PE em níveis pares}$ (2, 4, 6, 8, 10, 12, 14, 16, 18, 20).

---

## 4. Integridade da Alma e Estados da Alma

A Integridade Máxima da Alma equivale ao PV Máximo. À medida que é reduzida, o personagem entra em estados progressivos de declínio:

| Estado da Alma | Faixa de Integridade | Penalidade em Testes/Rolagens | Custo Adicional PE/Estamina | Condições Aplicadas |
| :--- | :---: | :---: | :---: | :--- |
| **Estável** | $> 75\%$ | Nenhuma | 0 | Normal |
| **Danificado** | $26\% \text{ a } 75\%$ ($< 75\%$) | `-3` | `+2` PE | Perturbação inicial |
| **Instável** | $26\% \text{ a } 50\%$ ($< 50\%$) | `-6` | `+3` PE | **Exposto** |
| **Crítico** | $1\% \text{ a } 25\%$ ($< 25\%$) | `-8` e **Desvantagem** | `+5` PE | **Exposto** e **Fragilizado** |
| **Morto / Destruído** | $0\%$ | Morte imediata | — | Alma distorcida; corpo desmancha |

---

## 5. Lista Canônica de 20 Perícias + 5 Testes de Resistência (TR) + 7 Ofícios

### 5.1. As 20 Perícias Oficiais
*(Marcadas com `*` as que exigem treinamento prévio para poder realizar o teste):*

| Perícia | Atributo Chave | Requer Treino? | Descrição e Aplicações |
| :--- | :---: | :---: | :--- |
| **Atletismo** | FOR | Não | Escalar, saltar, nadar, empurrar, forçar portas e proezas de força. |
| **Acrobacia** | DES | Não | Equilíbrio, manobras aéreas, amortecer quedas e escapar de agarrões. |
| **Furtividade** | DES | Não | Mover-se silenciosamente, ocultar-se e emboscadas. |
| **Prestidigitação** | DES | **Sim\*** | Agilidade manual fina, arrombar fechaduras, surrupiar e sabotar objetos. |
| **Feitiçaria** | INT | **Sim\*** | Teoria da energia amaldiçoada, reconhecimento de técnicas, resíduos e rituais. |
| **História** | INT | Não | Lembranças de eras passadas, linhagens de clãs, guerras e figuras históricas. |
| **Investigação** | INT | Não | Busca minuciosa por pistas, deduções lógicas e interrogatórios. |
| **Ofício** | INT | **Sim\*** | Fabricação, manutenção e perícia técnica em uma das 7 subcategorias oficiais. |
| **Tecnologia** | INT | Não | Hacking, operação de sistemas digitais, redes e engenharia reversa. |
| **Teologia** | INT | Não | Filosofias, cultos, mitos sagrados, escrituras antigas e ritos religiosos. |
| **Direção** | SAB | Não | Condução e pilotagem de veículos, manobras evasivas e perseguições. |
| **Intuição** | SAB | Não | Sentir intenções ocultas, desmascarar mentiras e pressentimentos. |
| **Medicina** | SAB | **Sim\*** | Tratamento de doenças, diagnósticos e autópsias (primeiros socorros livres). |
| **Ocultismo** | SAB | Não | Identificação de lendas urbanas, folclore sombrio e tabus amaldiçoados. |
| **Percepção** | SAB | Não | Detectar presenças sutis, ruídos distantes e notar detalhes ambientais. |
| **Sobrevivência** | SAB | Não | Rastreamento, forrageamento, orientação selvagem e identificação de fauna/flora. |
| **Enganação** | PRE | Não | Passar mentiras de forma convincente, disfarces e blefes. |
| **Intimidação** | PRE | Não | Coagir pela presença agressiva, ameaças e imposição de medo. |
| **Performance** | PRE | Não | Atuação, canto, dança, discursos públicos e artes dramáticas. |
| **Persuasão** | PRE | Não | Negociação diplomática, etiqueta, lábia e apelos sinceros. |

### 5.2. Os 5 Testes de Resistência (TR)
1. **Astúcia (INT):** Resistir a sobrecarga de informações, ilusões cognitivas e defender a mente.
2. **Fortitude (CON):** Resistir a venenos, toxinas, paralisia biológica e desgaste físico severo.
3. **Integridade (CON):** Defender a alma contra transfigurações e danos diretos à essência espiritual.
4. **Reflexos (DES):** Desviar rapidamente de explosões, raios em área, desabamentos e armadilhas.
5. **Vontade (SAB):** Resistir a medo, coerção mental, loucura, possessão e abalo espiritual.

### 5.3. As 7 Subcategorias Oficiais de Ofício
Ao adquirir treinamento em Ofício, escolhe-se uma subcategoria:
1. **Alfaiate:** Confecção de vestimentas, uniformes e tecidos reforçados.
2. **Alquimia:** Preparação de compostos, óleos, solventes e substâncias reativas.
3. **Canalizador:** Trabalho com condutores de energia, selos e circuitos ritualísticos.
4. **Cozinheiro:** Refeições nutritivas que conferem bônus de descanso e recuperação.
5. **Entalhador:** Escultura em madeira, pedra e ossos para fetiches e relíquias.
6. **Farmacêutico:** Criação de medicamentos, antitoxinas e elixires curativos.
7. **Ferreiro:** Forja e reparo de armas de metal, armaduras, lâminas e escudos.

---

## 6. As 10 Origens v2.5

### 6.1. Origens Padrão (Livro Básico)
1. **Inato:** Talentos naturais inatos. Bônus em Atributo (+2/+1 ou +1/+1/+1), Talento Natural no 1° nível, Marca Registrada (+1 feitiço com custo reduzido em 1 PE).
2. **Herdado:** Linhagem nobre dos Grandes Clãs. Bônus de Atributo (+2/+1). Escolha de 1 dos 4 Clãs:
   - *Clã Gojo:* Eficiência amaldiçoada (+1 PE em níveis pares).
   - *Clã Zenin:* Tradição marcial e treino com armas (proficiência marcial e manobra).
   - *Clã Kamo:* Vigor sanguíneo (+1 PV/nível após o 1º nível).
   - *Clã Inumaki:* Elo com a fala amaldiçoada e garganta fortificada.
3. **Derivado:** Origem anômala ligada a acidentes ou experimentos. Resistência adaptativa e técnica derivada.
4. **Restringido:** Voto celestial de restrição física total. 0 PE, utiliza Estamina (Nvl x 4). Grande vigor físico, sentidos aguçados e imunidade a detecção sensorial de energia.
5. **Feto Amaldiçoado Híbrido:** União biológica entre humano e maldição. Sangue venenoso, recuperação especial e opções de anatomia aberrante (braços extras, carapaça, etc.).
6. **Sem Técnica:** Feiticeiro sem técnica inata. Desenvolve maestria marcial extrema, arsenal de ferramentas amaldiçoadas e talentos marciais adicionais.
7. **Corpo Amaldiçoado Mutante:** Criação autônoma (como Panda) com múltiplos núcleos e formas corporais mutáveis.

### 6.2. Origens Opcionais / Suplementos
8. **Feiticeiro Reencarnado** (*Guia do Narrador*): Feiticeiro antigo despertado na era moderna em um receptáculo. Conhecimentos Passados (rolagens de História com vantagem e perícias extras) e Experiência do Reencarnado.
9. **Maldição** (*Grimório das Maldições*): Espírito amaldiçoado senciente jogável. Existência Metafísica (imune a dano não mágico, vulnerável a energia reversa) e $+1\text{ PE por nível}$.
10. **Fantoche Definitivo** (*Enciclopédia Amaldiçoada*): Fantoche robótico/mecânico controlado remotamente por um mestre distante. Imune a veneno e dano na alma; modificações corporais modulares.

---

## 7. As 6 Especializações v2.5

1. **Lutador:** Especialista em artes marciais corpo a corpo e manobras de combo (PV 12, DV d10, PE 4).
2. **Especialista em Combate:** Estrategista tático versátil no uso de todas as armas e escudos (PV 12, DV d10, PE 4).
3. **Especialista em Técnica:** Mestre supremo da manipulação e eficiência da técnica amaldiçoada (PV 10, DV d8, PE 6 + Mod. Chave).
4. **Controlador:** Comandante de Shikigamis e Marionetes em campo (PV 10, DV d8, PE 5 + Mod. Chave).
5. **Suporte:** Guardião tático focado em cura, barreiras, buffs e proteção de aliados (PV 10, DV d8, PE 5 + Mod. Chave).
6. **Restringido:** Portador da Restrição Celestial física suprema (PV 16, DV d12, Estamina 4/nível).
