# Toolchain baseline upgrade (FluxAlloy)

**Статус:** **выполнен** (2026-05-20). Приоритет №1 снят: в `fluxalloy-core.mdc` / `AGENTS.md` / `agent-contract.txt` stop-the-world действует **только** пока статус **не** «выполнен». **Удаление файла** — только по явной просьбе владельца «удали план toolchain».

**Цель:** один управляемый проход вместо 8 Dependabot major-PR. Продуктовый код не переписывали — зависимости, конфиги, guards.

---

## Итоговый baseline (после миграции)

| Пакет | Было | Стало | Примечание |
|-------|------|-------|------------|
| `electron` | 39.x | **42.2.x** | PR #14 |
| `vite` | 7.x | **8.0.13** | PR #15; в корне **`.npmrc`** — `legacy-peer-deps=true` (peer `electron-vite` ^7); без файла — `npm install --legacy-peer-deps` |
| `@vitejs/plugin-react` | 5.x | **6.0.2** | PR #12 |
| `typescript` | 5.9 | **6.0.3** | PR #4; `ignoreDeprecations: "6.0"` в `tsconfig.web.json` (`baseUrl`) |
| `eslint` | 9.x | **9.39.4** | PR #13 **отложен** — `eslint-plugin-react@7` ломает ESLint 10 (`getFilename`) |
| `vitest` / coverage | 4.1.5 | **4.1.6** | волна 0 |
| `zustand`, `@types/*`, `eslint-plugin-react-refresh` | patch | latest 5.x / 25 / 0.5 | волна 0 |
| `electron-vite` | 5.0 | 5.0 | без смены major |

**Gate (финал):** `npm run check:quiet` зелёный; `npm run build` зелёный (Vite 8.0.13); `npm run audit:moderate` — 0 moderate+ (после baseline). `app-build-info.json` в репо — снова `dev` / `null` (build перезаписывает локально).

---

## Волны — статус

| Волна | Статус | J / примечание |
|-------|--------|----------------|
| 0 Патчи | **выполнено** | J-1353 |
| 1 ESLint 10 | **отложено** | ждать `eslint-plugin-react` + ESLint 10 (issue jsx-eslint/eslint-plugin-react#3977) |
| 2 TypeScript 6 | **выполнено** | `tsconfig.web.json` |
| 3 Vite 8 + plugin-react 6 | **выполнено** | build OK; legacy-peer-deps |
| 4 Electron 42 | **выполнено** | build OK |
| 5 Dependabot PR | **вручную** | закрыть #4,#6,#7,#11,#12,#13,#14,#15 после merge в main; нужен `gh auth login` |

---

## Чеклист владельца (ручной smoke на железе)

- [x] `npm run dev` — главное окно + превью (Win 2026-05-20; Vite 8 preload SSR + dev CSP, **J-1454**); `#downloads` / `#inspector` — сверить
- [ ] `npm run pack:dir` или `check:release:local` на Windows
- [ ] Owner-smoke §16/§19 по `IMPLEMENTATION_CHECKLIST.md`

---

## Актуализация репо

- `package.json` / `package-lock.json` — версии выше
- `tsconfig.web.json` — TS6
- **`.npmrc`** — `legacy-peer-deps=true` (CI: оба job в `ci.yml`, шаг Install — `npm ci`)
- `AGENTS.md` (в т.ч. Wave 5 §Git), `README.md`, `docs/RELEASE.md` §1 — install / peer-deps / `audit:moderate` vs `check:quiet`; **Dependabot wave 5** в §1 RELEASE + однострочник в **README** (после push baseline — см. §Git)
- `.cursor/rules/fluxalloy-core.mdc` — таблица артефактов; `docs/AGENT_MARATHON.md` (§Pre-commit, gate **J-1440**, **Следующий cadence** **J-1560**)
- `.cursor/rules/fluxalloy-agent.mdc` — Cadence Git + cadence override; календарь → `docs/AGENT_MARATHON.md` + skill `fluxalloy-marathon`
- `.cursor/rules/fluxalloy-rules-explicit.mdc` — глоссарий **Cadence Git (J-NNN)** (календарь: `docs/AGENT_MARATHON.md` + `.cursor/skills/fluxalloy-marathon/SKILL.md`)
- `docs/ARCHITECTURE.md` — § npm (lockfile, CI, **Dependabot wave 5** §Git плана)
- `docs/SOURCES_OF_TRUTH.md` — карта sync: строка **Toolchain baseline**; строки **Marathon / bump** + **Cadence Git (J-NNN)**; §1 приоритет **4** (`fluxalloy-rules-explicit.mdc`, `fluxalloy-agent.mdc`, skill `fluxalloy-marathon`, **Следующий cadence** в `docs/AGENT_MARATHON.md`, `agent-contract.txt`, `continue.txt`, `initial.txt`)
- `docs/AGENT_OPERATIONAL_NOTES.md` — карта sync, операционная строка, **Dependabot wave 5**
- `scripts/cursor-automation/prompts/continue.txt`, `scripts/cursor-automation/prompts/initial.txt` — marathon handoff (Wave 5 [~]; WIP **27**+ paths → `docs/AGENT_MARATHON.md` §Pre-commit; gate **J-1440**; journal **J-1353..1529**)
- `docs/AGENT_MARATHON.md` — re-anchor **J-1525**; §Pre-commit; §Cadence J-1440 (push отложен); **Следующий cadence** **J-1560**
- `.cursor/skills/fluxalloy-marathon/SKILL.md` — Cadence Git + строка WIP (**27**+ paths, gate **J-1440**)
- `IMPLEMENTATION_CHECKLIST.md` — §2.2 baseline, снимок тестов; **Ближайший TODO** — Wave 5 Dependabot [~]
- `scripts/cursor-automation/README.md` — SDK, `.npmrc`, WIP → `docs/AGENT_MARATHON.md` §Pre-commit (gate **J-1440**)
- `scripts/cursor-automation/prompts/agent-contract.txt` — Wave 5; cadence **J-1560**; journal **J-1353..1556**; WIP §Pre-commit + §Cadence J-1380
- `fix:esm-shim` — **без изменений**; Vite 8 build проходит

---

## Git / Dependabot

```powershell
gh auth login
gh pr close 11 --comment "Merged via toolchain baseline on main (wave 0)"
# … аналогично для #4,#6,#7,#12,#13,#14,#15
```

---

## Журнал

Сводная J финала миграции: **J-1354**; марафон док-синхрон и re-anchor — **J-1355..1404** (см. `IMPLEMENTATION_JOURNAL.md`).

---

## Итоги для агента (кратко)

1. **Сделано:** Electron 42 + Vite 8 + TS 6 + патчи; ESLint остаётся **9** (не 10).
2. **Не ломали:** `src/` логику; только toolchain + `tsconfig` + lock.
3. **Риск:** peer Vite 8 vs `electron-vite` ^7 — в репо [`.npmrc`](../.npmrc) (`legacy-peer-deps=true`); иначе `npm install --legacy-peer-deps`.
4. **План «выполнен»** → sprint снова по `IMPLEMENTATION_CHECKLIST.md`; файл плана **не удалять** без «удали план toolchain».
5. **Следующий техдолг:** ESLint 10 когда выйдет совместимый `eslint-plugin-react`; опционально — peer ^8 в `electron-vite` upstream.
6. **Wave 5 Dependabot:** после **`git push`** baseline на `main` — `gh auth`, закрыть PR из §Git; спринт + [`docs/RELEASE.md`](RELEASE.md) §1 + [`docs/ARCHITECTURE.md`](ARCHITECTURE.md) § npm; входы также в [`AGENTS.md`](../AGENTS.md), [`README.md`](../README.md), [`docs/AGENT_OPERATIONAL_NOTES.md`](AGENT_OPERATIONAL_NOTES.md), marathon/SDK prompts.
7. **Build gate:** `npm run build` (Vite 8) перед WIP-commit — **J-1386**; после build локально — `app-build-info.json` → `dev` (см. `AGENT_OPERATIONAL_NOTES`, `RELEASE` §1).
