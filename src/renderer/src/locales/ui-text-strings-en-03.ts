/** Renderer UI copy (En, part 03). */
export const uiTextStringsEnPart03 = {
  batchExportOutputDirClear: 'Next to source',
  batchExportOutputDirOpen: 'Open folder',
  batchExportOutputDirPlaceholder: 'Next to source file',
  downloadsRailAria: 'Download settings',
  downloadsSettingsSectionsStackAria: 'Collapsible yt-dlp settings sections',
  downloadsRailTitle: 'yt-dlp settings',
  downloadsRailSubtitle:
    'Video quality, save folder, subtitles, after-download actions, and network behavior. Sections collapse; the same values apply in the pop-out downloads window.',
  downloadsRailIntroTooltip:
    'These fields affect upcoming downloads from the queue. Hover any switch, list, or button for a longer plain-language explanation.',
  downloadsRailFormatSummary: 'Format',
  downloadsRailFormatQualityLabel: 'Format / quality',
  downloadsFormatHint: '`-f` preset; with “Audio only”, video format presets are not applied.',
  downloadsPlaylistSpan: 'Full playlist',
  downloadsPlaylistPillLabel: 'Full playlist',
  downloadsPlaylistHint: '`--yes-playlist` instead of a single video.',
  downloadsAudioOnlySpan: 'Audio only',
  downloadsAudioOnlyPillLabel: 'Audio only',
  downloadsAudioOnlyHint: '`-x` when you need audio without a video track.',
  downloadsSubtitlesLabel: 'Subtitles',
  downloadsSubPresetNone: 'Do not download',
  downloadsSubPresetManual: 'Manual tracks',
  downloadsSubPresetManualAuto: 'Manual + auto',
  downloadsSubLangsHelp: 'A single `--sub-langs` token without spaces (e.g. ru,en or all).',
  downloadsSubLangsLabel: 'Subtitle languages',
  downloadsSubLangsPlaceholder: 'ru,en or all',
  downloadsRailMetadataSummary: 'Metadata',
  downloadsOpenAfterSuccessSpan: 'Open after success',
  downloadsOpenAfterSuccessPillLabel: 'Open after success',
  downloadsOpenAfterSuccessHint: 'Completed files open in the editor immediately.',
  downloadsAutoExportSpan: 'Auto-export after open',
  downloadsAutoExportPillLabel: 'Auto-export after open',
  downloadsAutoExportHint:
    'After a successful open — ffmpeg writes `…-export` next to the download (uses the export panel settings).',
  downloadsEnqueueBatchSpan: 'Batch export',
  downloadsEnqueueBatchPillLabel: 'Enqueue after download',
  downloadsEnqueueBatchHint:
    'After a successful download, video files are added to the §7.3 batch export queue.',
  downloadsTooltipEnqueueBatch:
    'Add the finished file to batch export without picking it manually on the Editor tab.',
  downloadsAutoStartBatchSpan: 'Start batch',
  downloadsAutoStartBatchPillLabel: 'Auto-start batch',
  downloadsAutoStartBatchHint:
    'After enqueue, start batch processing when ffmpeg is idle (export panel settings).',
  downloadsTooltipAutoStartBatch: 'Automatically start batch export after the file is queued.',
  downloadsCookiesBrowserLabel: 'Browser cookies',
  downloadsCookiesBrowserNone: 'Do not use',
  downloadsYtdlpBrowserPrettyChrome: 'Chrome',
  downloadsYtdlpBrowserPrettyEdge: 'Edge',
  downloadsYtdlpBrowserPrettyFirefox: 'Firefox',
  downloadsYtdlpBrowserTokenChrome: 'chrome',
  downloadsYtdlpBrowserTokenEdge: 'edge',
  downloadsYtdlpBrowserTokenFirefox: 'firefox',
  downloadsImpersonateLabel: 'Client impersonation',
  downloadsImpersonateOff: 'Off',
  downloadsCookiesProfileLabel: 'Profile / container (browser cookies)',
  downloadsCookiesProfilePlaceholder: 'e.g. Default or Profile 1',
  downloadsCookiesProfileHint:
    'yt-dlp suffix after the colon: `--cookies-from-browser` `chrome:…` (do not type the browser prefix in this field).',
  downloadsCookiesFileGroupAria: 'yt-dlp cookies file',
  downloadsCookiesFileActionsToolbarAria: 'Cookies file: pick or clear',
  downloadsCookiesNetscapeHelp: 'Netscape cookies file',
  downloadsCookiesFileNotSelected: 'No file selected',
  downloadsCookiesFilePriorityHelp:
    'File cookies override browser cookies; only use trusted cookie exports.',
  downloadsRailPick: 'Select',
  downloadsRailSavingSummary: 'Saving',
  downloadsOutputDirAria: 'yt-dlp download directory',
  downloadsOutputDirActionsToolbarAria:
    'Download directory: open in explorer, pick folder, or reset to default',
  downloadsOutputDirLabel: 'Download directory',
  downloadsOutputPathLoading: 'Loading path…',
  downloadsOutputUseDefaultUserdata: 'Using the default directory under userData.',
  downloadsOutputUseCustom: 'Using a user-selected directory.',
  downloadsRailOpenFolder: 'Open',
  downloadsOutputDefaultButton: 'Default',
  downloadsFilenameTemplateLabel: 'Filename template',
  downloadsFilenameTemplateHelp: '`%(ext)s` is required; `..` path escapes are blocked.',
  downloadsRailNetworkSummary: 'Network',
  downloadsQueueRetryLabel: 'Queue row retry',
  downloadsQueueRetryHelp: 'Re-runs the whole queue row on a non-zero exit code.',
  downloadsRateLimitLabel: 'Rate limit',
  downloadsRateLimitPlaceholder: '500K or 2M',
  downloadsRateLimitHelp: 'Single safe token for download speed limiting.',
  downloadsYtdlpRetriesLabel: 'yt-dlp retries',
  downloadsYtdlpRetriesPlaceholder: '0–99',
  downloadsYtdlpRetriesHelp: 'yt-dlp `--retries`.',
  downloadsFragmentRetriesLabel: 'Fragment retries',
  downloadsFragmentRetriesPlaceholder: '0–99',
  downloadsFragmentRetriesHelp: 'HLS/DASH fragment retries.',
  downloadsRailExpertSummary: 'Expert & preview',
  downloadsExtraArgsLabel: 'Extra argv',
  downloadsExtraArgsHelp: 'No shell: tokens as in the catalog; unsafe tokens are rejected in main.',
  downloadsHintCatalogIntro:
    'Short reference of flags below. Type part of a token or description, then click a flag — it is appended to “Extra arguments”. Each row includes a plain-language note.',
  downloadsHintCatalogFilterLabel: 'Search the argv catalog',
  downloadsHintSearchPlaceholder: 'e.g. --cookies or --sub',
  downloadsHintSearchAria: 'Search argv tokens and descriptions',
  downloadsHintListAria: 'Flag catalog with descriptions',
  downloadsHintsUnavailable: 'Catalog unavailable.',
  downloadsHintsNoMatches: 'No matches.',
  downloadsHintsSameAsPopoutHelp:
    'Same catalog as the download pop-out: search and list; click a flag to append the token to argv.',
  downloadsRailDocOutput: 'Output template',
  downloadsRailDocPostprocess: 'Post-processing',
  downloadsRailExpertDocNavAria: 'Navigation: external yt-dlp documentation for the expert section',
  downloadsCommandPreviewHelp: 'Command preview (read-only)',
  terminalHintInsertButtonAriaTemplate: 'Insert {token}, tool {tool}. {summary}',
  terminalHintInsertButtonAriaNoSummaryTemplate: 'Insert {token}, tool {tool}',
  downloadsHintTokenButtonAriaTemplate:
    'Append token {token} from category «{category}». {summary}',
  downloadsHintTokenButtonAriaNoSummaryTemplate: 'Append token {token} from category «{category}»',
  downloadsOptionsLoading: 'Loading yt-dlp settings…',
  downloadsRailRefreshOptions: 'Reload settings',
  downloadsRailFooterToolbarAria: 'Downloads settings rail footer',
  downloadsTooltipSectionFormat:
    'Default “what to download”: audio-only vs video+audio, whole playlist vs single item, subtitles and languages.',
  downloadsTooltipSectionMetadata:
    'After-download behavior, how to identify to the site, and optional login hints via browser cookies or a cookie file. Rarely needed until a site asks for sign-in.',
  downloadsTooltipSectionSaving:
    'Where files land on disk and how names are built. The built-in folder is safe; pick your own if you want everything in Downloads or another drive.',
  downloadsTooltipSectionNetwork:
    'Retry behavior and optional speed limits — spare your connection or ask the app to try harder on flaky Wi‑Fi.',
  downloadsTooltipSectionExpert:
    'Extra parameters for advanced users, a flag catalog, and a read-only command preview. Skip if normal downloads already work.',
  downloadsTooltipFormatPresetSelect:
    'A bundled profile for what to fetch: closer to source quality, smaller, or audio-only. When “Audio only” is on, video choices are ignored.',
  downloadsTooltipPlaylistSwitch:
    'If the URL is a playlist, turn this on to fetch the whole series; turn off for a single item only.',
  downloadsTooltipAudioOnlySwitch:
    'Save sound without a video track — lighter files for music or podcasts.',
  downloadsTooltipSubtitlesSelect:
    'Whether to pull text tracks with the video and how aggressively to match them. “Do not download” keeps things simpler and faster.',
  downloadsTooltipSubLangsInput:
    'Comma-separated subtitle languages or “all”. Leave empty or use “do not download” when subtitles are not needed.',
  downloadsTooltipOpenAfterSuccess:
    'After a successful download, open the file here so you can preview or export it immediately.',
  downloadsTooltipAutoExport:
    'After the file opens, automatically save a second file using the Editor FFmpeg panel — handy when you always need the same finished format.',
  downloadsTooltipCookiesBrowser:
    'Let the app reuse login cookies from the selected browser so private pages download like in your logged-in window. Avoid on shared PCs.',
  downloadsTooltipImpersonate:
    'Some sites vary quality by client type. Leave off unless you are troubleshooting a picky source.',
  downloadsTooltipCookiesProfile:
    'If the browser has multiple profiles, name the right one; otherwise the default profile is used. Often you can leave this blank.',
  downloadsTooltipCookiesPick:
    'Choose a cookie file you exported earlier. It overrides browser-based cookies when set.',
  downloadsTooltipCookiesClear:
    'Remove the chosen cookie file and fall back to browser or defaults.',
  downloadsTooltipOutputOpenFolder:
    'Open the current download folder in the file manager to inspect finished files.',
  downloadsTooltipOutputPick: 'Choose a different folder for upcoming downloads.',
  downloadsTooltipOutputDefault: 'Restore the app’s built-in download folder after experiments.',
  downloadsTooltipFilenameTemplate:
    'How output files are named — the template must leave room for the extension so different sites do not collide. Do not use “..” to jump out of the folder.',
  downloadsTooltipQueueRetrySelect:
    'How many times to restart the whole queue row after a non-zero failure — helpful on unstable networks.',
  downloadsTooltipRateLimitInput:
    'Cap download speed so the rest of the household keeps bandwidth. Leave empty for no limit.',
  downloadsTooltipRetriesInput: 'How many reconnect attempts before surfacing an error.',
  downloadsTooltipFragmentRetriesInput:
    'Same idea for small pieces of long streams — raise if big files stall mid-way.',
  downloadsTooltipExtraArgsTextarea:
    'Optional extra words for advanced tuning, as in the catalog below. Unsafe combinations are filtered for safety.',
  downloadsTooltipHintSearchInput:
    'Filter the list by token or description text. Click a flag in the list to append that token to “Extra arguments”.',
  downloadsTooltipRefreshFooter:
    'Reload settings from disk after changes in another window or manual edits.',
  enginesSummaryReady: 'Engines: ready',
  enginesSummaryMissing: 'Engines: not found',
  enginesSummaryError: 'Engines: check error',
  enginesSummaryChecking: 'Engines: checking…',
  engineDisplayNameFfmpeg: 'ffmpeg',
  engineDisplayNameFfprobe: 'ffprobe',
  engineDisplayNameYtdlp: 'yt-dlp',
  commonUnicodeEllipsis: '…',
  enginesVersionLineErrorMark: '!'
} as const
