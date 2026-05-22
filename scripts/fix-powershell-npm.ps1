# Velorix helper: unblock npm.ps1/npx.ps1, try ExecutionPolicy RemoteSigned,
# automatically append npm.cmd/npx.cmd aliases to PowerShell profiles (Windows PS + PS7 path).

$ErrorActionPreference = 'Continue'

function Install-FluxNpmProfileAliases {
  param(
    [Parameter(Mandatory)][string]$NpmCmd,
    [Parameter(Mandatory)][string]$NpxCmd
  )

  $marker = '# Velorix-auto-npm-alias'
  $nl = "`r`n"
  $block = "$nl$marker${nl}Set-Alias -Name npm -Value '$NpmCmd'${nl}Set-Alias -Name npx -Value '$NpxCmd'$nl"

  $paths = @(
    (Join-Path $env:USERPROFILE 'Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1'),
    (Join-Path $env:USERPROFILE 'Documents\PowerShell\Microsoft.PowerShell_profile.ps1')
  )

  foreach ($p in $paths) {
    $dir = Split-Path -Parent $p
    if (-not (Test-Path -LiteralPath $dir)) {
      New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }

    if (Test-Path -LiteralPath $p) {
      try {
        $raw = Get-Content -LiteralPath $p -Raw -ErrorAction Stop
      } catch {
        $raw = ''
      }

      if ($raw -and ($raw.IndexOf($marker, [System.StringComparison]::Ordinal) -ge 0)) {
        Write-Host "Aliases already installed: $p"
        continue
      }

      Add-Content -LiteralPath $p -Value $block -Encoding UTF8
      Write-Host "Appended npm/npx aliases: $p"
    } else {
      $initial = "${marker}${nl}Set-Alias -Name npm -Value '$NpmCmd'${nl}Set-Alias -Name npx -Value '$NpxCmd'$nl"
      Set-Content -LiteralPath $p -Value $initial -Encoding UTF8
      Write-Host "Created profile with npm/npx aliases: $p"
    }
  }
}

$nodeDir = Join-Path ${env:ProgramFiles} 'nodejs'
Write-Host "Node.js folder: $nodeDir"

$npmCmdResolved = Join-Path $nodeDir 'npm.cmd'
$npxCmdResolved = Join-Path $nodeDir 'npx.cmd'
if (-not (Test-Path -LiteralPath $npmCmdResolved)) {
  Write-Error "npm.cmd not found: $npmCmdResolved"
  exit 1
}

foreach ($name in @('npm.ps1', 'npx.ps1')) {
  $pathItem = Join-Path $nodeDir $name
  if (Test-Path -LiteralPath $pathItem) {
    try {
      Unblock-File -LiteralPath $pathItem
      Write-Host "Unblock-File OK: $name"
    } catch {
      Write-Warning "Unblock-File failed (${name}): $($_.Exception.Message)"
    }
  } else {
    Write-Warning "Missing: $pathItem"
  }
}

try {
  Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force
  Write-Host 'Set-ExecutionPolicy CurrentUser RemoteSigned: OK'
} catch {
  Write-Warning "Set-ExecutionPolicy failed (Group Policy?): $($_.Exception.Message)"
}

Write-Host ''
Write-Host 'Installing npm/npx aliases into PowerShell profiles...'
Install-FluxNpmProfileAliases -NpmCmd $npmCmdResolved -NpxCmd $npxCmdResolved

Write-Host ''
Write-Host 'Verify npm (via cmd shim):'
& $npmCmdResolved --version
