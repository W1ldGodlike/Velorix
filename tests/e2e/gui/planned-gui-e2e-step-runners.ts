/**
 * §21 — тела шагов planned-gui-e2e (вызываются из `planned-gui-e2e.spec.ts`).
 */
import { expect } from '@playwright/test'
import type { Page } from 'playwright'

import type { PackagedE2eSmokeScenario } from '../../../src/shared/packaged-e2e-smoke-registry'

import { openLocalVideoViaTopbar } from './planned-gui-e2e-launch'

export async function runPlannedGuiE2eOpenFileStep(page: Page, sampleMp4: string): Promise<void> {
  await openLocalVideoViaTopbar(page, sampleMp4)
  await expect(page.locator('video.app-preview-video')).toBeVisible()
}

export async function runPlannedGuiE2eYtdlpStep(page: Page): Promise<void> {
  await page.locator('#workspace-tab-downloads').click()
  await expect(page.locator('#workspace-panel-downloads')).toBeVisible({ timeout: 15_000 })
  await expect(page.locator('.app-downloads-url-input')).toBeVisible()
  await expect(page.getByRole('button', { name: /Add to queue|Добавить в очередь/i })).toBeVisible()
}

export async function runPlannedGuiE2eEditorDlStep(page: Page): Promise<void> {
  await page.locator('#workspace-tab-downloads').click()
  await expect(page.locator('#workspace-panel-downloads')).toBeVisible({ timeout: 15_000 })
  await expect(
    page.getByRole('button', {
      name: /Open downloaded file in FluxAlloy|Открыть скачанный файл в FluxAlloy/i
    })
  ).toBeVisible()
}

export async function runPlannedGuiE2eSnapshotStep(page: Page, sampleMp4: string): Promise<void> {
  await openLocalVideoViaTopbar(page, sampleMp4)
  const snapBtn = page.getByRole('button', { name: /Save frame|Сохранить кадр/i })
  await expect(snapBtn).toBeEnabled({ timeout: 15_000 })
}

export async function runPlannedGuiE2eExportStep(page: Page, sampleMp4: string): Promise<void> {
  await openLocalVideoViaTopbar(page, sampleMp4)
  const exportBtn = page.getByRole('button', {
    name: /Start export|Начать экспорт|Trim → export|Обрезать → экспорт/i
  })
  await expect(exportBtn.first()).toBeEnabled({ timeout: 15_000 })
}

export async function runPlannedGuiE2eKnowledgeStep(page: Page): Promise<void> {
  const knowledgeBtn = page.locator(
    'button[title*="Knowledge"], button[title*="Справка"], button[title*="knowledge"]'
  )
  await knowledgeBtn.first().click()
  await expect(page.getByRole('navigation', { name: /Contents|Оглавление/i })).toBeVisible({
    timeout: 15_000
  })
  await expect(page.locator('.app-knowledge-p').first()).toBeVisible({ timeout: 15_000 })
  const internal = page.locator('button.app-knowledge-link').first()
  if ((await internal.count()) > 0) {
    await internal.click()
    await expect(page.locator('.app-knowledge-p').first()).toBeVisible({ timeout: 15_000 })
  }
}

export async function runPlannedGuiE2eSupportZipStep(page: Page): Promise<void> {
  const aboutBtn = page.locator('button[title*="About"], button[title*="О программе"]')
  await aboutBtn.first().click()
  const zipBtn = page.getByRole('button', { name: /Support ZIP|Архив поддержки/i })
  await expect(zipBtn).toBeVisible({ timeout: 15_000 })
  await zipBtn.click()
  await expect(page.getByText(/Support ZIP saved|Архив поддержки.*сохранён/i).first()).toBeVisible({
    timeout: 30_000
  })
}

export async function runPlannedGuiE2eSettingsStep(page: Page): Promise<void> {
  const settingsBtn = page.locator(
    'button[title*="application settings"], button[title*="настройки приложения"], button[title*="Open application settings"]'
  )
  await settingsBtn.first().click()
  await expect(
    page.getByRole('heading', { name: /Application settings|Настройки приложения/i })
  ).toBeVisible({ timeout: 15_000 })
  await page.getByRole('button', { name: /Dependencies|Зависимости/i }).click()
  await expect(page.locator('#app-settings-deps-hint')).toBeVisible({ timeout: 15_000 })
  await expect(page.locator('.app-engine-path-rows')).toBeVisible()
  await page.keyboard.press('Escape')
}

export async function runPlannedGuiE2eStep(
  page: Page,
  row: PackagedE2eSmokeScenario,
  sampleMp4: string | null
): Promise<void> {
  switch (row.stepId) {
    case 'open-file':
      if (!sampleMp4) {
        throw new Error('sample MP4 required for open-file')
      }
      await runPlannedGuiE2eOpenFileStep(page, sampleMp4)
      return
    case 'ytdlp':
      await runPlannedGuiE2eYtdlpStep(page)
      return
    case 'editor-dl':
      await runPlannedGuiE2eEditorDlStep(page)
      return
    case 'snapshot':
      if (!sampleMp4) {
        throw new Error('sample MP4 required for snapshot')
      }
      await runPlannedGuiE2eSnapshotStep(page, sampleMp4)
      return
    case 'export':
      if (!sampleMp4) {
        throw new Error('sample MP4 required for export')
      }
      await runPlannedGuiE2eExportStep(page, sampleMp4)
      return
    case 'knowledge':
      await runPlannedGuiE2eKnowledgeStep(page)
      return
    case 'support-zip':
      await runPlannedGuiE2eSupportZipStep(page)
      return
    case 'settings':
      await runPlannedGuiE2eSettingsStep(page)
      return
    default:
      break
  }
}
