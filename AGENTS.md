<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->


## Regras de Arquitetura e Modularização do Projeto

1. **Arquivos Pequenos e Focados:**
   - Nenhum arquivo de componente ou lógica deve ultrapassar ~250-300 linhas de código.
   - Componentes grandes devem ser imediatamente divididos em subcomponentes menores, coesos e bem nomeados dentro de pastas dedicadas (ex: `components/tabs/personal/`, `components/tabs/cursed/`, etc.).

2. **Separação de Camadas:**
   - **Abas da Ficha:** Ficam em `src/systems/feiticeiros-e-maldicoes/components/tabs/` com seus respectivos subcomponentes em subdiretórios se necessário.
   - **Modais e Diálogos:** Ficam em arquivos próprios em `src/components/`.
   - **Persistência / Banco:** Ficam exclusivamente em rotas de API (`src/app/api/`) ou Server Actions (`src/actions/`), nunca misturadas diretamente dentro dos componentes visuais da ficha.
   - **Tipos e Constantes:** Divididos logicamente (ex: `constants/`, `types/`, `schemas/`).

3. **Fluxo de Trabalho e Git:**
   - Não execute `git commit` nem `git push` automaticamente; o usuário testa e commita após cada etapa.
   - Preserve integralmente o `.gitignore` (especialmente `referencias/`, `*.db`, `.env`).
