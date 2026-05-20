---
name: fluxalloy-release
description: FluxAlloy Windows release workflow. Use for check release, release win, engines doctor, packaged smoke, docs RELEASE.md, electron-builder packaging.
---

# Релиз (FluxAlloy)

## Канон

[`docs/RELEASE.md`](../../../docs/RELEASE.md) — полный checklist.

## Типичная цепочка Windows

```powershell
npm run check
npm run engines:prepare:win
npm run engines:doctor
npm run check:release
```

Повтор локально (bin уже есть): `npm run check:release:local`.

Установщик: `npm run release:win` или `release:win:force`.

## Заметки

- `trusted_hashes.json` не ослаблять.
- Bundled: `resources/bin`; dev: `npm run engines:prepare:win`.
- CI: workflow `ci` на GitHub — см. RELEASE.

## J и Git

При diff — **Cadence Git** в `fluxalloy-agent.mdc` (`NNN % 5` commit, `NNN % 10` push; любой чат).
