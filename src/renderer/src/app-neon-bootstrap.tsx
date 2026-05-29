import type { JSX } from 'react'
import { useEffect, useState } from 'react'

import { DownloadsScreen } from './pages/DownloadsScreen'
import { HistoryScreen } from './pages/HistoryScreen'
import { KnowledgeEmbeddedWorkspace } from './pages/KnowledgeEmbeddedWorkspace'
import { PlannerScreen } from './pages/PlannerScreen'
import { ProcessingScreen } from './pages/ProcessingScreen'
import { SettingsScreen } from './pages/SettingsScreen'
import { ScenariosScreen } from './pages/ScenariosScreen'
import { InspectorScreen } from './pages/InspectorScreen'
import { TerminalScreen } from './pages/TerminalScreen'
import { FirstRunEnginesScreen } from './pages/FirstRunEnginesScreen'
import { QuitConfirmScreen } from './pages/QuitConfirmScreen'
import { FfmpegErrorScreen } from './pages/FfmpegErrorScreen'
import { CriticalCrashScreen } from './pages/CriticalCrashScreen'
import { EncoderBenchmarkScreen } from './pages/EncoderBenchmarkScreen'
import { PluginsScreen } from './pages/PluginsScreen'
import { EnginePathsScreen } from './pages/EnginePathsScreen'
import { ExportPresetNameScreen } from './pages/ExportPresetNameScreen'
import { ExternalScriptFilterScreen } from './pages/ExternalScriptFilterScreen'
import { ScenarioBuilderScreen } from './pages/ScenarioBuilderScreen'
import { SlideshowScreen } from './pages/SlideshowScreen'
import { NoiseGeneratorScreen } from './pages/NoiseGeneratorScreen'
import { ImageConversionScreen } from './pages/ImageConversionScreen'
import { FileMaintenanceScreen } from './pages/FileMaintenanceScreen'
import { AboutScreen } from './pages/AboutScreen'
import { ToolsScreen } from './pages/ToolsScreen'
import { Ref26StatesPage } from './pages/Ref26StatesPage'
import { Ref27KitPage } from './pages/Ref27KitPage'

type NeonRoute =
  | 'ref27'
  | 'ref26'
  | 'ref1'
  | 'ref2'
  | 'ref3'
  | 'ref4'
  | 'ref5'
  | 'ref6'
  | 'ref7'
  | 'ref8'
  | 'ref9'
  | 'ref10'
  | 'ref11'
  | 'ref12'
  | 'ref13'
  | 'ref14'
  | 'ref15'
  | 'ref16'
  | 'ref17'
  | 'ref18'
  | 'ref19'
  | 'ref20'
  | 'ref21'
  | 'ref22'
  | 'ref23'
  | 'ref24'
  | 'ref25'

function readRoute(): NeonRoute {
  if (typeof window === 'undefined') {
    return 'ref1'
  }
  const hash = window.location.hash
  if (hash === '#ref26' || hash === '#states') {
    return 'ref26'
  }
  if (hash === '#ref27' || hash === '#components') {
    return 'ref27'
  }
  if (hash === '#ref2' || hash === '#downloads') {
    return 'ref2'
  }
  if (hash === '#ref3' || hash === '#history') {
    return 'ref3'
  }
  if (hash === '#ref4' || hash === '#planner') {
    return 'ref4'
  }
  if (hash === '#ref5' || hash === '#knowledge') {
    return 'ref5'
  }
  if (hash === '#ref6' || hash === '#settings') {
    return 'ref6'
  }
  if (hash === '#ref7' || hash === '#scenarios') {
    return 'ref7'
  }
  if (hash === '#ref8' || hash === '#inspector') {
    return 'ref8'
  }
  if (hash === '#ref9' || hash === '#terminal') {
    return 'ref9'
  }
  if (hash === '#ref10' || hash === '#tools') {
    return 'ref10'
  }
  if (hash === '#ref11' || hash === '#about') {
    return 'ref11'
  }
  if (hash === '#ref12' || hash === '#file-maintenance') {
    return 'ref12'
  }
  if (hash === '#ref13' || hash === '#image-conversion') {
    return 'ref13'
  }
  if (hash === '#ref14' || hash === '#noise-generator') {
    return 'ref14'
  }
  if (hash === '#ref15' || hash === '#slideshow') {
    return 'ref15'
  }
  if (hash === '#ref16' || hash === '#scenario-builder') {
    return 'ref16'
  }
  if (hash === '#ref17' || hash === '#external-script-filter') {
    return 'ref17'
  }
  if (hash === '#ref18' || hash === '#export-preset-name') {
    return 'ref18'
  }
  if (hash === '#ref19' || hash === '#engine-paths') {
    return 'ref19'
  }
  if (hash === '#ref20' || hash === '#first-run-engines') {
    return 'ref20'
  }
  if (hash === '#ref21' || hash === '#quit-confirm') {
    return 'ref21'
  }
  if (hash === '#ref22' || hash === '#ffmpeg-error') {
    return 'ref22'
  }
  if (hash === '#ref23' || hash === '#critical-crash') {
    return 'ref23'
  }
  if (hash === '#ref24' || hash === '#encoder-benchmark') {
    return 'ref24'
  }
  if (hash === '#ref25' || hash === '#plugins') {
    return 'ref25'
  }
  return 'ref1'
}

function neonScreenForRoute(route: NeonRoute): JSX.Element {
  if (route === 'ref26') {
    return <Ref26StatesPage />
  }
  if (route === 'ref27') {
    return <Ref27KitPage />
  }
  if (route === 'ref2') {
    return <DownloadsScreen />
  }
  if (route === 'ref3') {
    return <HistoryScreen />
  }
  if (route === 'ref4') {
    return <PlannerScreen />
  }
  if (route === 'ref5') {
    return <KnowledgeEmbeddedWorkspace />
  }
  if (route === 'ref6') {
    return <SettingsScreen />
  }
  if (route === 'ref7') {
    return <ScenariosScreen />
  }
  if (route === 'ref8') {
    return <InspectorScreen />
  }
  if (route === 'ref9') {
    return <TerminalScreen />
  }
  if (route === 'ref10') {
    return <ToolsScreen />
  }
  if (route === 'ref11') {
    return <AboutScreen />
  }
  if (route === 'ref12') {
    return <FileMaintenanceScreen />
  }
  if (route === 'ref13') {
    return <ImageConversionScreen />
  }
  if (route === 'ref14') {
    return <NoiseGeneratorScreen />
  }
  if (route === 'ref15') {
    return <SlideshowScreen />
  }
  if (route === 'ref16') {
    return <ScenarioBuilderScreen />
  }
  if (route === 'ref17') {
    return <ExternalScriptFilterScreen />
  }
  if (route === 'ref18') {
    return <ExportPresetNameScreen />
  }
  if (route === 'ref19') {
    return <EnginePathsScreen />
  }
  if (route === 'ref20') {
    return <FirstRunEnginesScreen />
  }
  if (route === 'ref21') {
    return <QuitConfirmScreen />
  }
  if (route === 'ref22') {
    return <FfmpegErrorScreen />
  }
  if (route === 'ref23') {
    return <CriticalCrashScreen />
  }
  if (route === 'ref24') {
    return <EncoderBenchmarkScreen />
  }
  if (route === 'ref25') {
    return <PluginsScreen />
  }
  return <ProcessingScreen />
}

/** NEON dev routes: ref.1 default, #ref2–25 portal screens, #ref27 kit, #ref26 states. */
export function AppNeonBootstrap(): JSX.Element {
  const [route, setRoute] = useState<NeonRoute>(readRoute)

  useEffect(() => {
    const onHash = (): void => {
      setRoute(readRoute())
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  return (
    <div key={route} className="vn-route-surface" data-neon-route={route}>
      {neonScreenForRoute(route)}
    </div>
  )
}
