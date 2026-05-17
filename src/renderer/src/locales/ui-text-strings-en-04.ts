/** Renderer UI copy (En, part 04). */
export const uiTextStringsEnPart04 = {
  uiPlaceholderDash: '—',
  commonNotApplicableShort: 'n/a',
  topbarProductName: 'FluxAlloy',
  topbarHeaderAria: 'Top bar: workspace tabs and actions',
  topbarTrailingGroupAria: 'Button cluster to the right of workspace tabs',
  appMainShellAria: 'FluxAlloy main window',
  topbarActionsToolbarAria: 'Actions toolbar: files, tools, and help',
  topbarOpenFileTitle:
    'Pick a video from your PC — it appears in the preview and timeline for trimming and export.',
  topbarOpenFileLabel: 'Open',
  topbarOpenVideoFolderTitle:
    'Pick a folder — the first video found is opened in preview (same scan as batch and folder drag-and-drop).',
  topbarOpenVideoFolderLabel: 'Folder',
  topbarInspectorTitle:
    'Separate window: full ffprobe summary (tracks, chapters, JSON) and TXT/HTML export. If a clip is already open in the editor, the same file is used.',
  topbarInspectorLabel: 'Inspector',
  topbarExportCancelTitle:
    'Stop the current save job; any partial output is removed. The source file on disk stays untouched.',
  topbarExportCancelBusy: 'Cancelling…',
  topbarExportCancelReady: 'Cancel export',
  topbarEnginesDownloadTitle:
    'Download missing built-in tools into your user app folder — handy on a fresh machine.',
  topbarEnginesDownloadBusy: 'Downloading…',
  topbarEnginesDownloadReady: 'Download engines',
  topbarEnginePathsTitle:
    'Point the app to custom tool locations if you do not want the bundled copies or auto-discovery.',
  topbarEnginePathsLabel: 'Engine paths',
  topbarKnowledgeLabel: 'Knowledge base',
  topbarAboutTitle: 'About and diagnostics',
  topbarAboutLabel: 'About',
  topbarThemeToggleTitle: 'Toggle dark / light theme',
  topbarThemeUseLight: 'Light theme',
  topbarThemeUseDark: 'Dark theme',
  topbarUiLocaleSwitchToEnglishTitle: 'Switch interface to English',
  topbarUiLocaleSwitchToRussianTitle: 'Switch interface to Russian',
  topbarUiLocaleVisuallyHiddenRu: 'Current interface language: Russian',
  topbarUiLocaleVisuallyHiddenEn: 'Current interface language: English',
  editorPreviewDropzoneAria: 'Preview area',
  editorPreviewVideoAriaTemplate: 'Preview: {name}',
  editorPreviewMediaCardGroupAria: 'Preview video and transport controls',
  editorPreviewStackAria: 'Preview stack: video, timeline, and ffprobe panel',
  editorWorkbenchAria: 'Editor: preview area and FFmpeg panel',
  editorPreviewCaptionAria: 'Preview caption with file name',
  editorPreviewPlaceholderAria: 'Preview without a file',
  editorPreviewEmptyLead:
    'No source — drop a video here or use Open… in the File menu / the top button.',
  editorPreviewEmptyHint:
    'Local files stream via the fluxmedia scheme only after a dialog pick or Electron path DnD.',
  editorFfmpegRailShowTitle:
    'Expand the right-hand “save settings” panel: video/audio quality, site presets, and command preview.',
  editorFfmpegRailShowHidden: 'Expand FFmpeg settings panel',
  editorFfmpegRailRestoreLabel: 'FFmpeg',
  editorFfmpegSettingsAria: 'FFmpeg settings',
  editorFfmpegRailSectionsRegionAria: 'FFmpeg export settings sections in the side rail',
  editorFfmpegPanelHeadGroupAria: 'FFmpeg panel header and collapse control',
  editorFfmpegSettingsTitle: 'FFmpeg settings',
  editorFfmpegSettingsSubtitle:
    'Choose how the saved clip will look and sound. You can collapse sections to keep the screen tidy.',
  editorFfmpegRailCollapseTitle:
    'Collapse the save-settings panel for more preview and timeline space. Your values stay saved.',
  editorFfmpegRailCollapseHidden: 'Collapse FFmpeg settings panel',
  editorFfmpegRailHeaderToolbarAria: 'FFmpeg panel header: collapse',
  editorTooltipFfmpegPanelIntro:
    'This panel does not change the source file on disk — it only describes the result when you export or when an auto-export runs after a download. Adjust freely until you save.',
  editorTooltipSectionVideo:
    'Video: how the picture is compressed, packed into a file, and optional cleanup (banding, noise, color). Stronger effects usually mean longer waits.',
  editorTooltipSectionFormat:
    'Layout: frame size, frame rate, rotation, and crop. Useful to match a platform (square or widescreen) before saving.',
  editorTooltipSectionAudio:
    'Audio & frame snapshot: loudness and cleanup, a still frame export, subtitles, and optional container tags. You can turn the audio track off entirely.',
  editorTooltipSectionPresets:
    'Presets: ready-made bundles for popular sites plus your own saved combinations. Picking a preset fills all fields; you can still tweak manually.',
  editorTooltipSectionOutput:
    'Output: how the save command is built, where the app will suggest saving, and quick actions for the last result.',
  editorTooltipVideoCodec:
    'Pick the picture “engine”. One option is widely compatible; another can make smaller files at similar sharpness, but very old devices may struggle.',
  editorTooltipEncodePreset:
    'Trade-off between encoding time and file size/quality. “Smaller file” waits longer; “higher quality” is heavier and slower. The middle option fits most clips.',
  editorTooltipContainer:
    'The file “wrapper” type. Common choices open almost everywhere; one option is handy for Apple devices. If unsure, keep the default.',
  editorTooltipCrf:
    'Fine quality control without a hard size cap. Lower numbers look cleaner but weigh more; higher numbers shrink the file. “Use preset” follows the speed choice above.',
  editorTooltipVideoBitrate:
    'A hard cap on video data per second — predictable file size. When this is active, the separate quality slider above is not used.',
  editorTooltipResolution:
    'How tall the frame is. “Source” keeps the original size; other choices shrink the picture to make the file lighter.',
  editorTooltipFps:
    'Frames per second in the saved clip. “Source” keeps the original rate; fixed values help when a site asks for exactly 30 or 25 fps.',
  editorTooltipRotation:
    'Rotate or mirror the whole frame before saving — handy for sideways footage or reflections.',
  editorTooltipCrop:
    'Cut edges using a template (square, widescreen, etc.) before compression. The original file on disk stays untouched.',
  editorTooltipAacBitrate:
    'How rich the saved audio is. Higher values sound fuller but increase size. Mid values are enough for speech and simple edits.',
  editorTooltipSnapshotFormat:
    'How a single captured frame is saved: maximum sharpness without compression, or a smaller JPEG.',
  editorTooltipUserPresetSelectFallback:
    'Pick a row to load a full set of fields. Built-in presets show a short description under the cursor; you create your own with “+ Preset”.',
  editorTooltipPresetAdd:
    'Save the current panel fields under a new name — handy for several recurring workflows.',
  editorTooltipPresetRename:
    'Rename the selected custom preset. Built-in names are fixed and update with the app.',
  editorTooltipPresetOverwrite:
    'Overwrite the selected custom preset with the current fields when you have tuned settings and want to refresh the saved profile.',
  editorTooltipPresetDelete:
    'Remove the selected custom preset from the list. Built-in rows cannot be deleted.',
  editorTooltipExportCommandPreview:
    'Shows the steps the app will run when saving — for transparency. You can copy the line if you need the same steps elsewhere.',
  editorTooltipExportLastFile:
    'Open the last saved clip in the same preview to quickly check the result.',
  editorTooltipExportLastFolder:
    'Open the folder that contains the last saved clip — for example to drag the file into a messenger.',
  editorTooltipCopyExportPath:
    'Copy the full path of the last saved clip to the clipboard for another app.',
  editorTooltipExportOpenPreview:
    'Open the last saved clip again in this preview without hunting for the file.',
  editorTooltipSnapshotLastFile: 'Open the last saved frame snapshot separately from the video.',
  editorTooltipSnapshotLastFolder: 'Show the folder of the last frame snapshot.',
  editorTooltipSnapshotCopyPath: 'Copy the path of the last frame snapshot.',
  editorTooltipTwoPass:
    'Two-pass mode first scans the whole clip, then writes with steadier file size. It only makes sense with a fixed video bitrate and a compatible codec; expect roughly double the wait.',
  editorTooltipNoAudio:
    'Turn on for picture-only output — no sound in the saved file. Useful for bumpers or when you will add audio later elsewhere.',
  editorTooltipStripMetadata:
    'Remove hidden tags like title, artist, or cover art from the finished file. Some sites ask for this, or you may want less personal data in the file.',
  editorTooltipStripChapters:
    'Remove chapter markers so the file plays as one continuous stream without sections in the player.',
  editorFfmpegSectionVideo: 'Video',
  editorFfmpegSectionVideoHint:
    'How heavy the finished video will be: compression style, file packaging, and optional picture cleanup.',
  editorFieldVideoCodec: 'Video codec',
  editorAriaVideoCodecExport: 'How the picture is compressed when saving',
  editorFieldEncodePreset: 'Speed and default quality',
  editorAriaEncodePresetExport: 'How long saving runs and how tightly the picture is packed',
  editorFieldContainer: 'File type',
  editorAriaContainerExport: 'How the finished clip is packaged',
  editorFieldCrf: 'Fine quality',
  editorAriaCrfExport: 'Fine-grained picture quality',
  editorCrfOptionPreset: 'Match the speed preset',
  editorFieldVideoBitrate: 'Video size cap',
  editorAriaVideoBitrateExport: 'Hard limit on video data per second',
  editorVideoBitrateOptionCrf: 'No hard cap (use the quality slider above)',
  editorFieldDeinterlace: 'Comb smoothing',
  editorAriaDeinterlace: 'Smooth interlaced video',
  editorHintDeinterlace:
    'Older TV/camera footage sometimes stores alternating lines — motion shows thin “combs”. The first mode removes them with little change to smoothness; the second is smoother but can change how motion feels.',
  editorFieldDenoise: 'Denoise',
  editorAriaDenoise: 'Reduce noise',
  editorHintDenoise:
    'Removes speckle and color grain, especially in shadows. Stronger settings clean more but can soften fine hair, fabric, or text.',
  editorFieldDeband: 'Reduce banding',
  editorAriaDeband: 'Smooth color steps',
  editorHintDeband:
    'Skies, walls, and shadows sometimes show steps instead of smooth gradients. This softens those steps; strong modes can slightly blur very fine detail.',
  editorFieldHisteq: 'Brightness balance',
  editorAriaHisteq: 'Overall brightness balance',
  editorHintHisteq:
    'When the whole frame feels too dark or blown out, this gently rebalances light. It is a global pass, not full manual color grading.',
  editorFieldLut3d: 'Color look',
  editorAriaLut3d: 'Preset color look',
  editorHintLut3d:
    'Built-in cinematic looks — warmer, cooler, or punchier without tweaking many sliders. Off returns the original colors.',
  editorFieldSharpen: 'Sharpen',
  editorAriaSharpen: 'Edge sharpening',
  editorHintSharpen:
    'Makes edges a bit crisper. Mild is subtle; strong can add bright halos around sharp edges.',
  editorFieldEq: 'Color',
  editorAriaEq: 'Simple color moods',
  editorHintEq: 'Quick moods: warmer, cooler, brighter, or softer — handy for vibe without graphs.',
  editorFieldHue: 'Hue & saturation',
  editorAriaHue: 'Hue shift and saturation',
  editorHintHue:
    'Nudges the overall color cast or boosts saturation — useful if the image feels dull or overly neon.',
  editorFieldGrain: 'Film grain',
  editorAriaGrain: 'Grain overlay',
  editorHintGrain:
    'Adds subtle texture like film stock. Nice for stylized looks; usually off for clean documentary footage.',
  editorFieldVignette: 'Vignette',
  editorAriaVignette: 'Edge darkening',
  editorHintVignette:
    'Darkens corners to draw the eye to the center. Strong vignettes noticeably close in the frame.',
  editorFieldBlur: 'Blur',
  editorAriaBlur: 'Light blur',
  editorHintBlur:
    'Softens detail evenly — like a slight missed focus. Can flatter portraits; usually bad for on-screen text.',
  editorFfmpegSectionFrameLayout: 'Layout',
  editorFfmpegSectionFrameLayoutHint:
    'Frame size, frames per second, rotation, and crop before compression — match a platform before saving.',
  editorFieldResolution: 'Resolution',
  editorAriaResolutionExport: 'Output frame size',
  editorFieldFps: 'Frames per second',
  editorAriaFpsExport: 'Frame rate in the saved file',
  editorFpsOptionSource: 'Match source',
  editorExportFpsOptionTemplate: '{value} fps'
} as const
