import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const thisDir = dirname(fileURLToPath(import.meta.url))

/** Корень скриптов автоматизации: scripts/cursor-automation */
export const automationRoot = join(thisDir, '..')

/** Корень монорепо Velorix (родитель `scripts/`) */
export const projectRoot = join(thisDir, '..', '..', '..')

export const stopFlagPath = join(automationRoot, 'STOP')

export const promptsDirDefault = join(automationRoot, 'prompts')
