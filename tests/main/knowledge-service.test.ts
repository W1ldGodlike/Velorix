import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { describe, expect, it } from 'vitest'

import {
  buildKnowledgeHelpDirCandidates,
  listKnowledgeArticles,
  readKnowledgeArticle
} from '../../src/main/services/knowledge/knowledge-service'

function withHelpDir(fn: (dir: string) => void): void {
  const root = mkdtempSync(join(tmpdir(), 'VELORIX-help-'))
  const help = join(root, 'Help')
  mkdirSync(help)
  try {
    fn(help)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
}

function portablePath(p: string): string {
  return p.replace(/\\/g, '/')
}

describe('knowledge-service', () => {
  it('строит порядок каталогов Help для dev и packaged режимов', () => {
    expect(
      buildKnowledgeHelpDirCandidates({
        cwd: 'C:/repo',
        appPath: 'C:/repo/out',
        resourcesPath: 'C:/app/resources',
        isPackaged: false
      }).map(portablePath)
    ).toEqual(['C:/repo/Help', 'C:/repo/out/Help', 'C:/app/resources/Help'])
    expect(
      buildKnowledgeHelpDirCandidates({
        cwd: 'C:/repo',
        appPath: 'C:/app/app.asar',
        resourcesPath: 'C:/app/resources',
        isPackaged: true
      }).map(portablePath)[0]
    ).toBe('C:/app/resources/Help')
  })

  it('listKnowledgeArticles читает только безопасные markdown статьи с заголовком', () => {
    withHelpDir((help) => {
      mkdirSync(join(help, 'ru'))
      writeFileSync(join(help, 'ru', 'start.md'), '# Quick start\n\nBody', 'utf8')
      writeFileSync(join(help, 'bad name.md'), '# Bad', 'utf8')
      writeFileSync(join(help, 'script.js'), 'no', 'utf8')

      expect(listKnowledgeArticles([help])).toEqual({
        ok: true,
        articles: [{ slug: 'start', fileName: 'start.md', title: 'Quick start' }]
      })
    })
  })

  it('listKnowledgeArticles с preferredUiLocale=en берёт заголовок из Help/en при наличии', () => {
    withHelpDir((help) => {
      mkdirSync(join(help, 'ru'))
      mkdirSync(join(help, 'en'))
      writeFileSync(join(help, 'ru', 'demo.md'), '# Русский заголовок\n\nru', 'utf8')
      writeFileSync(join(help, 'en', 'demo.md'), '# English title\n\nen', 'utf8')

      expect(listKnowledgeArticles([help], 'en')).toEqual({
        ok: true,
        articles: [{ slug: 'demo', fileName: 'demo.md', title: 'English title' }]
      })
      expect(listKnowledgeArticles([help], 'ru')).toEqual({
        ok: true,
        articles: [{ slug: 'demo', fileName: 'demo.md', title: 'Русский заголовок' }]
      })
    })
  })

  it('readKnowledgeArticle валидирует slug и возвращает markdown', () => {
    withHelpDir((help) => {
      mkdirSync(join(help, 'ru'))
      writeFileSync(join(help, 'ru', 'keyboard-shortcuts.md'), '# Hotkeys\n\nCtrl+O', 'utf8')

      expect(readKnowledgeArticle([help], '../secret')).toEqual({
        ok: false,
        error: 'Некорректная статья справки'
      })
      expect(readKnowledgeArticle([help], 'keyboard-shortcuts')).toEqual({
        ok: true,
        article: {
          slug: 'keyboard-shortcuts',
          fileName: 'ru/keyboard-shortcuts.md',
          title: 'Hotkeys'
        },
        markdown: '# Hotkeys\n\nCtrl+O'
      })
    })
  })

  it('readKnowledgeArticle с preferredUiLocale=en берёт Help/en/*.md при наличии', () => {
    withHelpDir((help) => {
      mkdirSync(join(help, 'ru'))
      mkdirSync(join(help, 'en'))
      writeFileSync(join(help, 'ru', 'demo.md'), '# RU Title\n\nru', 'utf8')
      writeFileSync(join(help, 'en', 'demo.md'), '# EN Title\n\nen body', 'utf8')

      expect(readKnowledgeArticle([help], { slug: 'demo', preferredUiLocale: 'en' })).toEqual({
        ok: true,
        article: { slug: 'demo', fileName: 'en/demo.md', title: 'EN Title' },
        markdown: '# EN Title\n\nen body'
      })
    })
  })

  it('readKnowledgeArticle en UI без en-файла падает обратно на Help/ru', () => {
    withHelpDir((help) => {
      mkdirSync(join(help, 'ru'))
      mkdirSync(join(help, 'en'))
      writeFileSync(join(help, 'ru', 'only-ru.md'), '# Ru\n\nx', 'utf8')

      expect(readKnowledgeArticle([help], { slug: 'only-ru', preferredUiLocale: 'en' })).toEqual({
        ok: true,
        article: { slug: 'only-ru', fileName: 'ru/only-ru.md', title: 'Ru' },
        markdown: '# Ru\n\nx'
      })
    })
  })

  it('readKnowledgeArticle встраивает Help/assets в data:image base64', () => {
    withHelpDir((help) => {
      mkdirSync(join(help, 'assets'))
      writeFileSync(
        join(help, 'assets', 'tiny.svg'),
        '<svg xmlns="http://www.w3.org/2000/svg"/>',
        'utf8'
      )
      mkdirSync(join(help, 'ru'))
      writeFileSync(join(help, 'ru', 'with-pic.md'), '# Pic\n\n![t](assets/tiny.svg)\n', 'utf8')

      const res = readKnowledgeArticle([help], 'with-pic')
      expect(res.ok).toBe(true)
      if (!res.ok) {
        return
      }
      expect(res.markdown).toContain('data:image/svg+xml;base64,')
      expect(res.markdown).not.toContain('velorixhelp:')
      expect(res.article.title).toBe('Pic')
    })
  })

  it('readKnowledgeArticle не читает en без preferredUiLocale=en', () => {
    withHelpDir((help) => {
      mkdirSync(join(help, 'ru'))
      mkdirSync(join(help, 'en'))
      writeFileSync(join(help, 'ru', 'x.md'), '# Root\n\nroot', 'utf8')
      writeFileSync(join(help, 'en', 'x.md'), '# Enonly\n\nen', 'utf8')

      expect(readKnowledgeArticle([help], 'x')).toEqual({
        ok: true,
        article: { slug: 'x', fileName: 'ru/x.md', title: 'Root' },
        markdown: '# Root\n\nroot'
      })
    })
  })
})
