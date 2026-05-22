---
name: Velorix-release
description: Velorix Windows release workflow. Use for check release, release win, engines doctor, packaged smoke, docs RELEASE.md, electron-builder packaging.
---

# Релиз (VELORIX)

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

При diff — **Git по J-NNN** в `velorix-agent.mdc` (`NNN % 5` commit, `NNN % 10` push; любой чат).
