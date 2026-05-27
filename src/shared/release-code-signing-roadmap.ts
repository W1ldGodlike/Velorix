/**
 * §19 — roadmap подписи дистрибутивов (канон: docs/RELEASE.md §4 / §4.1 / §4.2).
 */

export type ReleaseCodeSigningRoadmapLocale = 'ru' | 'en'

export function formatWindowsReleaseCodeSigningRoadmapHelpClause(
  locale: ReleaseCodeSigningRoadmapLocale
): string {
  const releaseRef =
    locale === 'en'
      ? '[`docs/RELEASE.md`](../docs/RELEASE.md) §4'
      : '[`docs/RELEASE.md`](../docs/RELEASE.md) §4'
  return locale === 'en'
    ? `**Distribution beyond dev:** Authenticode signing via \`signtool.exe\`/CSC (\`CSC_LINK\`, \`WIN_CSC_LINK\`) — roadmap in ${releaseRef}; \`pack:dir\` may omit signing (\`CSC_IDENTITY_AUTO_DISCOVERY=false\`) until publish.`
    : `**Публикация вне dev:** подпись Authenticode через \`signtool.exe\`/CSC (\`CSC_LINK\`, \`WIN_CSC_LINK\`) — roadmap в ${releaseRef}; \`pack:dir\` может обходиться без подписи (\`CSC_IDENTITY_AUTO_DISCOVERY=false\`) до релиза.`
}

export function formatWindowsReleaseCodeSigningRoadmapDiagnosticLine(): string {
  return 'Windows publish: docs/RELEASE.md §4 — Authenticode/signtool + CSC (roadmap; pack:dir may skip via CSC_IDENTITY_AUTO_DISCOVERY=false)'
}

export function formatMacosReleaseCodeSigningRoadmapHelpClause(
  locale: ReleaseCodeSigningRoadmapLocale
): string {
  const releaseRef =
    locale === 'en'
      ? '[`docs/RELEASE.md`](../../docs/RELEASE.md) §4.2'
      : '[`docs/RELEASE.md`](../docs/RELEASE.md) §4.2'
  return locale === 'en'
    ? `**Distribution beyond dev:** Developer ID signing, hardened runtime, notarization (\`notarytool\`, \`stapler staple\`) — roadmap in ${releaseRef}; \`pack:mac:dir\` may omit signing until publish.`
    : `**Публикация вне dev:** подпись Developer ID, hardened runtime, notarization (\`notarytool\`, \`stapler staple\`) — roadmap в ${releaseRef}; \`pack:mac:dir\` может обходиться без подписи до релиза.`
}

export function formatMacosReleaseCodeSigningRoadmapDiagnosticLine(): string {
  return 'macOS publish: docs/RELEASE.md §4.2 — Developer ID + notarytool + stapler staple (roadmap; pack:mac:dir may skip)'
}

export function formatLinuxReleaseCodeSigningRoadmapHelpClause(
  locale: ReleaseCodeSigningRoadmapLocale
): string {
  const releaseRef =
    locale === 'en'
      ? '[`docs/RELEASE.md`](../../docs/RELEASE.md) §4.1'
      : '[`docs/RELEASE.md`](../docs/RELEASE.md) §4.1'
  return locale === 'en'
    ? `**Distribution beyond dev:** artifact signing (GPG for deb/AppImage per release channel) — roadmap in ${releaseRef}; \`pack:linux:dir\` may omit signing until publish.`
    : `**Публикация вне dev:** подпись артефактов (GPG для deb/AppImage по каналу дистрибуции) — roadmap в ${releaseRef}; \`pack:linux:dir\` может обходиться без подписи до релиза.`
}

export function formatLinuxReleaseCodeSigningRoadmapDiagnosticLine(): string {
  return 'Linux publish: docs/RELEASE.md §4.1 — GPG deb/AppImage signing (roadmap; pack:linux:dir may skip)'
}

/** Shared Help §15 hub + guards tail (ops/bin/docs index). */
function formatReleaseCodeSigningRoadmapHelpGuardsMarkdownTail(): string {
  return 'Help packaged win/linux/macos + §15 hub — `check:help-packaged-smoke-docs`, `check:help-owner-hardware-checklist-docs`, strict signing in `check:help-workflow-smoke-crosslinks`.'
}

/** Plain-text Help guards tail (SDK / diagnostics). */
function formatReleaseCodeSigningRoadmapHelpGuardsPlainTail(): string {
  return 'Help check:help-packaged-smoke-docs + check:help-owner-hardware-checklist-docs + strict signing (check:help-workflow-smoke-crosslinks).'
}

/** `docs/ARCHITECTURE.md` — §19 publish signing roadmaps (win/linux/mac). */
export function formatReleaseCodeSigningRoadmapArchitectureClause(): string {
  return `§19 publish signing roadmaps (dev \`pack:*:dir\` may skip): [\`release-code-signing-roadmap.ts\`](../src/shared/release-code-signing-roadmap.ts) + [\`docs/RELEASE.md\`](RELEASE.md) §4 (Windows Authenticode/CSC), §4.1 (Linux GPG), §4.2 (macOS notarization); ${formatReleaseCodeSigningRoadmapHelpGuardsMarkdownTail()}`
}

/** §19 packaging indexed tail (electron-builder.yml; J-1520..1539) — ARCHITECTURE / long docs. */
function formatReleaseCodeSigningRoadmapSigningIndexedPackagingIndexedTail(): string {
  const count = getReleaseCodeSigningElectronBuilderYmlComments().length
  return ` Packaging indexed: \`electron-builder.yml\` (**${count}** §19 yaml comments, \`getReleaseCodeSigningElectronBuilderYmlComments\`); AGENTS/README/ops/bin/SDK — \`formatReleaseCodeSigningRoadmap*ElectronBuilder*\`; \`formatReleaseCodeSigningRoadmapElectronBuilderYmlCommentsDiagnosticLine\` in \`check:release\` / \`check:platform-packaging-scripts\`.`
}

/** §19 packaging indexed short tail — AGENTS / README / bin / ops / SDK indexed bullets. */
function formatReleaseCodeSigningRoadmapSigningIndexedPackagingIndexedShortTail(): string {
  const count = getReleaseCodeSigningElectronBuilderYmlComments().length
  return ` Packaging indexed: \`electron-builder.yml\` (**${count}** §19 yaml comments; J-1520..1539).`
}

/** §19 packaging indexed plain tail — `agent-contract.txt` (no markdown bold). */
function formatReleaseCodeSigningRoadmapSigningIndexedPackagingIndexedPlainTail(): string {
  const count = getReleaseCodeSigningElectronBuilderYmlComments().length
  return ` packaging indexed: electron-builder.yml (${count} §19 yaml comments; J-1520..1539).`
}

/** `docs/ARCHITECTURE.md` — §19 signing indexed (SDK sprint + diagnostics). */
export function formatReleaseCodeSigningRoadmapArchitectureSigningIndexedClause(): string {
  return `§19 signing indexed (SDK sprint + diagnostics): Help §15 hub — \`check:help-packaged-smoke-docs\`, \`check:help-owner-hardware-checklist-docs\`, strict signing crosslinks; \`continue.txt\` / \`initial.txt\` / \`agent-contract.txt\` — \`formatReleaseCodeSigningRoadmapSdkPromptSprintSigningIndexedBlock\` / \`formatReleaseCodeSigningRoadmapSdkContractSigningIndexedClause\`; \`check:release\` / \`check:platform-packaging-scripts\` — \`formatReleaseCodeSigningRoadmapSdkPromptSprintSigningIndexedDiagnosticLine\`.${formatReleaseCodeSigningRoadmapSigningIndexedPackagingIndexedTail()}`
}

/** `bin/README.md` — §19 signing roadmaps entry point. */
export function formatReleaseCodeSigningRoadmapBinReadmeLine(): string {
  return `- §19 publish signing (win/linux/mac): [\`release-code-signing-roadmap.ts\`](../src/shared/release-code-signing-roadmap.ts) + [\`docs/RELEASE.md\`](../docs/RELEASE.md) §4/§4.1/§4.2; ${formatReleaseCodeSigningRoadmapHelpGuardsMarkdownTail()}`
}

/** `AGENTS.md` — §19 signing roadmaps bullet (adjacent to Help §21). */
export function formatReleaseCodeSigningRoadmapAgentsBullet(): string {
  return `**§19 publish signing (win/linux/mac):** [\`release-code-signing-roadmap.ts\`](src/shared/release-code-signing-roadmap.ts) + [\`docs/RELEASE.md\`](docs/RELEASE.md) §4/§4.1/§4.2; ${formatReleaseCodeSigningRoadmapHelpGuardsMarkdownTail()} dev \`pack:*:dir\` may skip until publish.`
}

/** `README.md` — §19 signing roadmaps bullet. */
export function formatReleaseCodeSigningRoadmapReadmeLine(): string {
  return `- §19 publish signing (win/linux/mac): [\`release-code-signing-roadmap.ts\`](./src/shared/release-code-signing-roadmap.ts) + [\`docs/RELEASE.md\`](./docs/RELEASE.md) §4/§4.1/§4.2; ${formatReleaseCodeSigningRoadmapHelpGuardsMarkdownTail()}`
}

/** `docs/RELEASE.md` — §4 win/linux/mac signing canon pointer (before §4.1). */
export function formatReleaseCodeSigningRoadmapReleaseCanonParagraph(): string {
  return '**Дорожные карты подписи (win/linux/mac, канон):** [`release-code-signing-roadmap.ts`](../src/shared/release-code-signing-roadmap.ts) — Help clauses в `packaged-{windows,linux,macos}-smoke.md` (+ EN) и §15 hub (getting-started, owner/about, logging, knowledge, planner, ffmpeg); guards `npm run check:help-packaged-smoke-docs`, `check:help-owner-hardware-checklist-docs`, strict signing в `check:help-workflow-smoke-crosslinks`; dev `pack:*:dir` / `CSC_IDENTITY_AUTO_DISCOVERY=false` может обходиться без подписи до публикации.'
}

/** `docs/RELEASE.md` — §4 signing indexed (SDK sprint + diagnostics). */
export function formatReleaseCodeSigningRoadmapReleaseSigningIndexedParagraph(): string {
  const count = getReleaseCodeSigningElectronBuilderYmlComments().length
  return `**§19 signing indexed (SDK sprint + diagnostics):** Help §15 hub + \`check:help-packaged-smoke-docs\` + \`check:help-owner-hardware-checklist-docs\` + strict signing crosslinks; \`continue.txt\` / \`initial.txt\` / \`agent-contract.txt\` — \`formatReleaseCodeSigningRoadmapSdkPromptSprintSigningIndexedBlock\` / \`formatReleaseCodeSigningRoadmapSdkContractSigningIndexedClause\`; Support ZIP — \`formatReleaseCodeSigningRoadmapSdkPromptSprintSigningIndexedDiagnosticLine\` (\`check:release\` / \`check:platform-packaging-scripts\`). **Packaging indexed:** \`electron-builder.yml\` (**${count}** §19 yaml comments); \`formatReleaseCodeSigningRoadmap*ElectronBuilder*\` + \`formatReleaseCodeSigningRoadmapElectronBuilderYmlCommentsDiagnosticLine\` (J-1520..1539).`
}

/** `scripts/cursor-automation/prompts/agent-contract.txt` — §19 signing tail. */
export function formatReleaseCodeSigningRoadmapSdkContractClause(): string {
  return `§19 signing roadmaps (win/linux/mac): \`release-code-signing-roadmap.ts\` + \`docs/RELEASE.md\` §4/§4.1/§4.2; ${formatReleaseCodeSigningRoadmapHelpGuardsPlainTail()}`
}

/** `scripts/cursor-automation/prompts/agent-contract.txt` — §19 signing indexed tail. */
export function formatReleaseCodeSigningRoadmapSdkContractSigningIndexedClause(): string {
  return `§19 signing indexed: \`release-code-signing-roadmap.ts\` + \`docs/RELEASE.md\` §4/§4.1/§4.2; Help §15 hub + \`check:help-packaged-smoke-docs\` + \`check:help-owner-hardware-checklist-docs\` + strict signing crosslinks.${formatReleaseCodeSigningRoadmapSigningIndexedPackagingIndexedPlainTail()}`
}

/** `scripts/cursor-automation/prompts/agent-contract.txt` — §19 electron-builder.yml tail. */
export function formatReleaseCodeSigningRoadmapSdkContractElectronBuilderClause(): string {
  const count = getReleaseCodeSigningElectronBuilderYmlComments().length
  return `§19 packaging (electron-builder.yml): win nsis+zip (no portable); ${count} §19 yaml comments (getReleaseCodeSigningElectronBuilderYmlComments in release-code-signing-roadmap.ts); check:release + check:platform-packaging-scripts diagnostics.`
}

/** `scripts/cursor-automation/prompts/continue.txt` — §19 electron-builder fragment. */
export function formatReleaseCodeSigningRoadmapSdkContinuePromptElectronBuilderFragment(): string {
  const count = getReleaseCodeSigningElectronBuilderYmlComments().length
  return `§19 electron-builder.yml (${count} yaml comments; getReleaseCodeSigningElectronBuilderYmlComments); check:release + check:platform-packaging-scripts diagnostics.`
}

/** `continue.txt` / `initial.txt` — §19 signing indexed + electron-builder tail. */
export function formatReleaseCodeSigningRoadmapSdkPromptSprintSigningIndexedBlock(): string {
  return `§19 signing roadmaps indexed: \`release-code-signing-roadmap.ts\` + \`docs/RELEASE.md\` §4/§4.1/§4.2; Help §15 hub + \`check:help-packaged-smoke-docs\` + \`check:help-owner-hardware-checklist-docs\` + strict signing crosslinks. ${formatReleaseCodeSigningRoadmapSdkContinuePromptElectronBuilderFragment()}`
}

/** `check:release` / `check:platform-packaging-scripts` — §19 signing indexed (Support ZIP). */
export function formatReleaseCodeSigningRoadmapSdkPromptSprintSigningIndexedDiagnosticLine(): string {
  const count = getReleaseCodeSigningElectronBuilderYmlComments().length
  return `§19 signing indexed: release-code-signing-roadmap.ts + RELEASE §4/4.1/4.2; Help §15 hub; check:help-packaged-smoke-docs + check:help-owner-hardware-checklist-docs; strict signing crosslinks; electron-builder.yml ${count} §19 yaml comments (packaging indexed J-1520..1539)`
}

/** `check-release-scripts` / Support ZIP diagnostics — signing roadmaps index. */
export function formatReleaseCodeSigningRoadmapCheckReleaseDiagnosticLine(): string {
  return 'publish signing roadmaps: release-code-signing-roadmap.ts + docs/RELEASE.md §4/§4.1/§4.2 (dev pack:*:dir may skip; check:help-packaged-smoke-docs; check:help-owner-hardware-checklist-docs; strict signing crosslinks)'
}

/** `docs/RELEASE.md` §4 — packaging config pointer (win nsis+zip only; no portable target). */
export function formatReleaseCodeSigningRoadmapElectronBuilderYmlPointer(): string {
  return 'Конфиг упаковки: [`electron-builder.yml`](../electron-builder.yml) — `win.target`: **nsis** + **zip** (без `portable`, см. ТЗ §19); `mac`: dmg + `entitlementsInherit` + `notarize: false`; `linux`: AppImage + deb; `publish: null`; **9** inline §19 yaml-комментариев (`getReleaseCodeSigningElectronBuilderYmlComments` в `release-code-signing-roadmap.ts`); signing-ключи — §4/§4.1/§4.2 ниже.'
}

/** Support ZIP / check:release diagnostics — compact electron-builder.yml targets. */
export function formatReleaseCodeSigningRoadmapElectronBuilderConfigDiagnosticLine(): string {
  return 'electron-builder.yml: win nsis+zip (no portable), mac dmg+notarize off, linux AppImage+deb, publish null; 9 §19 yaml comments — docs/RELEASE.md §4'
}

/** `docs/ARCHITECTURE.md` — §19 packaging config entry. */
export function formatReleaseCodeSigningRoadmapArchitectureElectronBuilderClause(): string {
  return '- **Packaging config:** [`electron-builder.yml`](../electron-builder.yml) — win **nsis** + **zip** (no `portable`); mac **dmg** + `notarize: false`; linux AppImage + deb; `publish: null`; **9** §19 yaml comments (`getReleaseCodeSigningElectronBuilderYmlComments`) — §19 в [`docs/RELEASE.md`](RELEASE.md) §4.'
}

/** `electron-builder.yml` — top-of-file §19 signing + targets comment (YAML `#` lines). */
export function formatReleaseCodeSigningRoadmapElectronBuilderYmlSigningComment(): string {
  return '# §19 publish signing (dev pack:*:dir may skip): release-code-signing-roadmap.ts + docs/RELEASE.md §4 (win Authenticode/CSC), §4.2 (mac notarize), §4.1 (linux GPG).'
}

/** `electron-builder.yml` — win.target policy comment (no portable; TZ §19). */
export function formatReleaseCodeSigningRoadmapElectronBuilderYmlWinTargetComment(): string {
  return '# win.target: nsis + zip only (no portable — single-root policy; см. docs/RELEASE.md §4).'
}

/** `electron-builder.yml` — mac notarize off until publish (docs/RELEASE.md §4.2). */
export function formatReleaseCodeSigningRoadmapElectronBuilderYmlMacNotarizeComment(): string {
  return '# mac: notarize false until publish (Developer ID + notarytool — docs/RELEASE.md §4.2); entitlementsInherit — build/entitlements.mac.plist.'
}

/** `electron-builder.yml` — linux targets + GPG signing roadmap (docs/RELEASE.md §4.1). */
export function formatReleaseCodeSigningRoadmapElectronBuilderYmlLinuxTargetsComment(): string {
  return '# linux.target: AppImage + deb (GPG signing on publish — docs/RELEASE.md §4.1).'
}

/** `electron-builder.yml` — win default signing (Authenticode on publish). */
export function formatReleaseCodeSigningRoadmapElectronBuilderYmlWinSignComment(): string {
  return '# win: default electron-builder signing/signtool (CSC_LINK / WIN_CSC_LINK on publish — docs/RELEASE.md §4).'
}

/** `electron-builder.yml` — NSIS installer (docs/RELEASE.md §4). */
export function formatReleaseCodeSigningRoadmapElectronBuilderYmlNsisComment(): string {
  return '# nsis: Setup.exe installer — docs/RELEASE.md §4 (Authenticode at publish; deleteAppDataOnUninstall: false).'
}

/** `bin/README.md` — §19 signing indexed (SDK sprint + diagnostics). */
export function formatReleaseCodeSigningRoadmapBinReadmeSigningIndexedLine(): string {
  return `- §19 signing indexed: Help §15 hub + \`check:help-packaged-smoke-docs\` + \`check:help-owner-hardware-checklist-docs\` + strict signing crosslinks; SDK \`continue.txt\` / \`initial.txt\` / \`agent-contract.txt\` — \`formatReleaseCodeSigningRoadmapSdkPromptSprintSigningIndexedBlock\` / \`formatReleaseCodeSigningRoadmapSdkContractSigningIndexedClause\`; diagnostics — \`check:release\` / \`check:platform-packaging-scripts\` (\`formatReleaseCodeSigningRoadmapSdkPromptSprintSigningIndexedDiagnosticLine\`).${formatReleaseCodeSigningRoadmapSigningIndexedPackagingIndexedShortTail()}`
}

/** `bin/README.md` — electron-builder.yml §19 signing entry. */
export function formatReleaseCodeSigningRoadmapBinReadmeElectronBuilderLine(): string {
  return '- Packaging config + **9** §19 yaml comments in [`electron-builder.yml`](../electron-builder.yml) (`getReleaseCodeSigningElectronBuilderYmlComments` in `release-code-signing-roadmap.ts`; win/mac/linux/dmg/appImage/publish).'
}

/** `electron-builder.yml` — dmg artifact (mac; notarize off until publish). */
export function formatReleaseCodeSigningRoadmapElectronBuilderYmlDmgComment(): string {
  return '# dmg: mac artifact (.dmg); notarize при publish — docs/RELEASE.md §4.2.'
}

/** `electron-builder.yml` — AppImage naming (linux; GPG at publish). */
export function formatReleaseCodeSigningRoadmapElectronBuilderYmlAppImageComment(): string {
  return '# appImage: linux AppImage artifact name; GPG signing on publish — docs/RELEASE.md §4.1.'
}

/** `electron-builder.yml` — no auto-publish until configured. */
export function formatReleaseCodeSigningRoadmapElectronBuilderYmlPublishComment(): string {
  return '# publish: null — без auto-publish до явной настройки канала (docs/RELEASE.md §1).'
}

/** All §19 inline `#` lines in `electron-builder.yml` (governance / Vitest lock). */
export function getReleaseCodeSigningElectronBuilderYmlComments(): readonly string[] {
  return [
    formatReleaseCodeSigningRoadmapElectronBuilderYmlSigningComment(),
    formatReleaseCodeSigningRoadmapElectronBuilderYmlWinTargetComment(),
    formatReleaseCodeSigningRoadmapElectronBuilderYmlWinSignComment(),
    formatReleaseCodeSigningRoadmapElectronBuilderYmlNsisComment(),
    formatReleaseCodeSigningRoadmapElectronBuilderYmlMacNotarizeComment(),
    formatReleaseCodeSigningRoadmapElectronBuilderYmlDmgComment(),
    formatReleaseCodeSigningRoadmapElectronBuilderYmlLinuxTargetsComment(),
    formatReleaseCodeSigningRoadmapElectronBuilderYmlAppImageComment(),
    formatReleaseCodeSigningRoadmapElectronBuilderYmlPublishComment()
  ]
}

/** Support ZIP / check:release — §19 yaml comment registry count. */
export function formatReleaseCodeSigningRoadmapElectronBuilderYmlCommentsDiagnosticLine(): string {
  const count = getReleaseCodeSigningElectronBuilderYmlComments().length
  return `electron-builder.yml §19 yaml comments: ${count} (getReleaseCodeSigningElectronBuilderYmlComments in release-code-signing-roadmap.ts)`
}

/** `AGENTS.md` — §19 signing indexed bullet (SDK sprint + diagnostics). */
export function formatReleaseCodeSigningRoadmapAgentsSigningIndexedBullet(): string {
  return `**§19 signing indexed:** Help §15 hub + \`check:help-packaged-smoke-docs\` + \`check:help-owner-hardware-checklist-docs\` + strict signing crosslinks; SDK \`continue.txt\` / \`initial.txt\` / \`agent-contract.txt\` — \`formatReleaseCodeSigningRoadmapSdkPromptSprintSigningIndexedBlock\` / \`formatReleaseCodeSigningRoadmapSdkContractSigningIndexedClause\`; diagnostics — \`check:release\` / \`check:platform-packaging-scripts\` (\`formatReleaseCodeSigningRoadmapSdkPromptSprintSigningIndexedDiagnosticLine\`).${formatReleaseCodeSigningRoadmapSigningIndexedPackagingIndexedShortTail()}`
}

/** `AGENTS.md` — §19 electron-builder.yml bullet (after signing roadmaps). */
export function formatReleaseCodeSigningRoadmapAgentsElectronBuilderBullet(): string {
  const count = getReleaseCodeSigningElectronBuilderYmlComments().length
  return `**§19 packaging (\`electron-builder.yml\`):** win **nsis** + **zip** (no \`portable\`); **${count}** inline §19 yaml comments — \`getReleaseCodeSigningElectronBuilderYmlComments\` in [\`release-code-signing-roadmap.ts\`](src/shared/release-code-signing-roadmap.ts); diagnostics in \`check:release\` / \`check:platform-packaging-scripts\`.`
}

/** `README.md` — §19 signing indexed bullet. */
export function formatReleaseCodeSigningRoadmapReadmeSigningIndexedLine(): string {
  return `- §19 signing indexed: Help §15 hub + \`check:help-packaged-smoke-docs\` + \`check:help-owner-hardware-checklist-docs\` + strict signing crosslinks; SDK \`continue.txt\` / \`initial.txt\` / \`agent-contract.txt\` — \`formatReleaseCodeSigningRoadmapSdkPromptSprintSigningIndexedBlock\` / \`formatReleaseCodeSigningRoadmapSdkContractSigningIndexedClause\`; diagnostics — \`check:release\` / \`check:platform-packaging-scripts\` (\`formatReleaseCodeSigningRoadmapSdkPromptSprintSigningIndexedDiagnosticLine\`).${formatReleaseCodeSigningRoadmapSigningIndexedPackagingIndexedShortTail()}`
}

/** `README.md` — §19 electron-builder.yml bullet. */
export function formatReleaseCodeSigningRoadmapReadmeElectronBuilderLine(): string {
  const count = getReleaseCodeSigningElectronBuilderYmlComments().length
  return `- §19 packaging (\`electron-builder.yml\`): win **nsis** + **zip** (no \`portable\`); **${count}** §19 yaml comments — \`getReleaseCodeSigningElectronBuilderYmlComments\` in [\`release-code-signing-roadmap.ts\`](./src/shared/release-code-signing-roadmap.ts).`
}

/** `docs/SOURCES_OF_TRUTH.md` §19 signing index — electron-builder.yml fragment. */
export function formatReleaseCodeSigningRoadmapSourcesSigningIndexElectronBuilderFragment(): string {
  const count = getReleaseCodeSigningElectronBuilderYmlComments().length
  return `electron-builder.yml (${count} §19 yaml comments; getReleaseCodeSigningElectronBuilderYmlComments)`
}

/** Sprint §19 indexed span (checklist + handoff). */
export const RELEASE_CODE_SIGNING_SPRINT_INDEXED_JOURNAL_SPAN = 'J-1511..1545' as const

/** Historical sprint §19 bullet (signing + packaging indexed). */
export function formatReleaseCodeSigningRoadmapChecklistSprintSection19Line(): string {
  return `- [~] §19: dev Win [x] (Vite8 preload+CSP, J-1454); \`pack:*:dir\`+\`verify:*\`; signing+packaging indexed [x] (${RELEASE_CODE_SIGNING_SPRINT_INDEXED_JOURNAL_SPAN}); packaged smoke — владелец.`
}

/** `docs/SOURCES_OF_TRUTH.md` §19 signing index — signing indexed tail. */
export function formatReleaseCodeSigningRoadmapSourcesSigningIndexedFragment(): string {
  return `signing indexed (continue.txt, initial.txt, agent-contract.txt; SdkPromptSprintSigningIndexedBlock/DiagnosticLine; SdkContractSigningIndexedClause+packaging plain tail; ARCHITECTURE.md, RELEASE.md §4, AGENTS.md, README.md, bin/README.md, cursor-automation/README.md); packaging indexed electron-builder.yml (J-1520..1539); sprint checklist formatReleaseCodeSigningRoadmapChecklistSprintSection19Line (${RELEASE_CODE_SIGNING_SPRINT_INDEXED_JOURNAL_SPAN})`
}

/** continue.txt / initial.txt — sprint §19 checklist fragment. */
export function formatReleaseCodeSigningRoadmapSdkContinuePromptSprintChecklistSection19Fragment(): string {
  return `Sprint §19 checklist: formatReleaseCodeSigningRoadmapChecklistSprintSection19Line (${RELEASE_CODE_SIGNING_SPRINT_INDEXED_JOURNAL_SPAN}).`
}

/** `docs/RELEASE.md` §4.1 — Linux Help + formatter pointer. */
export function formatReleaseCodeSigningRoadmapReleaseLinuxHelpPointer(): string {
  return 'Formatters и Help: [`release-code-signing-roadmap.ts`](../src/shared/release-code-signing-roadmap.ts) (`formatLinuxReleaseCodeSigningRoadmapHelpClause`); `Help/ru/packaged-linux-smoke.md` (+ EN) — `check:help-packaged-smoke-docs`.'
}

/** `docs/RELEASE.md` §4.2 — macOS Help + formatter pointer. */
export function formatReleaseCodeSigningRoadmapReleaseMacosHelpPointer(): string {
  return 'Formatters и Help: [`release-code-signing-roadmap.ts`](../src/shared/release-code-signing-roadmap.ts) (`formatMacosReleaseCodeSigningRoadmapHelpClause`); `Help/ru/packaged-macos-smoke.md` (+ EN) — `check:help-packaged-smoke-docs`.'
}

/** `scripts/cursor-automation/README.md` — §19 signing index. */
export function formatReleaseCodeSigningRoadmapSdkAutomationReadmeLine(): string {
  return `- §19 publish signing (win/linux/mac): \`release-code-signing-roadmap.ts\` + \`docs/RELEASE.md\` §4/§4.1/§4.2 — см. \`prompts/agent-contract.txt\`; ${formatReleaseCodeSigningRoadmapHelpGuardsPlainTail()}`
}

/** `scripts/cursor-automation/README.md` — §19 signing indexed index. */
export function formatReleaseCodeSigningRoadmapSdkAutomationReadmeSigningIndexedLine(): string {
  return `- §19 signing indexed: \`continue.txt\` / \`initial.txt\` / \`agent-contract.txt\` — \`formatReleaseCodeSigningRoadmapSdkPromptSprintSigningIndexedBlock\` / \`formatReleaseCodeSigningRoadmapSdkContractSigningIndexedClause\`; diagnostics — \`formatReleaseCodeSigningRoadmapSdkPromptSprintSigningIndexedDiagnosticLine\` (\`check:release\` / \`check:platform-packaging-scripts\`).${formatReleaseCodeSigningRoadmapSigningIndexedPackagingIndexedShortTail()}`
}

/** `scripts/cursor-automation/README.md` — sprint §19 checklist bullet. */
export function formatReleaseCodeSigningRoadmapSdkAutomationReadmeChecklistSprintLine(): string {
  return `- Sprint §19 (archive checklist): \`formatReleaseCodeSigningRoadmapChecklistSprintSection19Line\` (${RELEASE_CODE_SIGNING_SPRINT_INDEXED_JOURNAL_SPAN}).`
}

/** `scripts/cursor-automation/README.md` — §19 electron-builder.yml index. */
export function formatReleaseCodeSigningRoadmapSdkAutomationReadmeElectronBuilderLine(): string {
  const count = getReleaseCodeSigningElectronBuilderYmlComments().length
  return `- §19 packaging (electron-builder.yml): win nsis+zip (no portable); ${count} §19 yaml comments — getReleaseCodeSigningElectronBuilderYmlComments in release-code-signing-roadmap.ts`
}

/** Help about-support-logs — Support ZIP archive bullet (alias). */
export function formatReleaseCodeSigningRoadmapOwnerHardwareChecklistArchiveClause(
  locale: ReleaseCodeSigningRoadmapLocale
): string {
  return locale === 'en'
    ? ' §19 publish signing (win/linux/mac): [`release-code-signing-roadmap.ts`](../../src/shared/release-code-signing-roadmap.ts) + [`docs/RELEASE.md`](../../docs/RELEASE.md) §4/§4.1/§4.2 — `check:help-packaged-smoke-docs`;'
    : ' §19 publish signing (win/linux/mac): [`release-code-signing-roadmap.ts`](../src/shared/release-code-signing-roadmap.ts) + [`docs/RELEASE.md`](../docs/RELEASE.md) §4/§4.1/§4.2 — `check:help-packaged-smoke-docs`;'
}

/** Help `getting-started.md` (+ EN) — §19 signing tail (alias — `packaged-e2e-help-workflow-crosslinks-meta`). */
export function formatReleaseCodeSigningRoadmapGettingStartedHelpClause(
  locale: ReleaseCodeSigningRoadmapLocale
): string {
  return locale === 'en'
    ? ' §19 publish signing (win/linux/mac): [`release-code-signing-roadmap.ts`](../../src/shared/release-code-signing-roadmap.ts) + [`docs/RELEASE.md`](../../docs/RELEASE.md) §4/§4.1/§4.2 — `check:help-packaged-smoke-docs`;'
    : ' §19 publish signing (win/linux/mac): [`release-code-signing-roadmap.ts`](../src/shared/release-code-signing-roadmap.ts) + [`docs/RELEASE.md`](../docs/RELEASE.md) §4/§4.1/§4.2 — `check:help-packaged-smoke-docs`;'
}

/** Help `logging-and-diagnostics.md` (+ EN) — §19 signing in Dev line (alias). */
export function formatReleaseCodeSigningRoadmapLoggingDiagnosticsHelpClause(
  locale: ReleaseCodeSigningRoadmapLocale
): string {
  return formatReleaseCodeSigningRoadmapGettingStartedHelpClause(locale)
}

/** Help `knowledge-base-howto.md` (+ EN) — §19 signing in Dev clause (alias). */
export function formatReleaseCodeSigningRoadmapKnowledgeHubHelpClause(
  locale: ReleaseCodeSigningRoadmapLocale
): string {
  return formatReleaseCodeSigningRoadmapGettingStartedHelpClause(locale)
}

/** Help `workflows-planner-scenarios.md` (+ EN) — §19 signing in diagnostics paragraph (alias). */
export function formatReleaseCodeSigningRoadmapPlannerScenariosHelpClause(
  locale: ReleaseCodeSigningRoadmapLocale
): string {
  return formatReleaseCodeSigningRoadmapGettingStartedHelpClause(locale)
}

/** Help `ffmpeg-terminal-hints.md` (+ EN) — §19 signing in packaged smoke paragraph (alias). */
export function formatReleaseCodeSigningRoadmapFfmpegTerminalHintsHelpClause(
  locale: ReleaseCodeSigningRoadmapLocale
): string {
  return formatReleaseCodeSigningRoadmapGettingStartedHelpClause(locale)
}
