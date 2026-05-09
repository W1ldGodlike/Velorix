# Fixes common "npm.ps1 disabled" errors: Unblocks npm.ps1/npx.ps1 (Mark-of-the-Web),
# tries Set-ExecutionPolicy RemoteSigned for CurrentUser. If GPO blocks policy change,
# add npm.cmd aliases to profile (instructions printed).

$ErrorActionPreference = 'Continue'

$nodeDir = Join-Path ${env:ProgramFiles} 'nodejs'
Write-Host "Node.js folder: $nodeDir"

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
  Write-Warning "Set-ExecutionPolicy failed (often blocked by Group Policy): $($_.Exception.Message)"
  Write-Host ''
  Write-Host 'Workaround - open PowerShell profile and add aliases:'
  Write-Host ('  npm.cmd path: ''{0}''' -f (Join-Path $nodeDir 'npm.cmd'))
  Write-Host '  Commands to paste:'
  Write-Host ('  Set-Alias -Name npm -Value ''{0}''' -f (Join-Path $nodeDir 'npm.cmd'))
  Write-Host ('  Set-Alias -Name npx -Value ''{0}''' -f (Join-Path $nodeDir 'npx.cmd'))
}

Write-Host ''
Write-Host 'Verify npm:'
& (Join-Path $nodeDir 'npm.cmd') --version
