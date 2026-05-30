# Center of Cursor / VS Code main window (Windows). Exit 2 if none found.
$ErrorActionPreference = 'Stop'
$procs = Get-Process -Name Cursor, Code -ErrorAction SilentlyContinue |
  Where-Object { $_.MainWindowHandle -ne 0 -and $_.MainWindowTitle.Length -gt 0 } |
  Sort-Object { $_.MainWindowTitle.Length } -Descending
if (-not $procs) {
  exit 2
}
$p = $procs | Select-Object -First 1
Add-Type -TypeDefinition @'
using System;
using System.Runtime.InteropServices;
public class NeonRefVisualWin32 {
  [StructLayout(LayoutKind.Sequential)]
  public struct RECT { public int Left; public int Top; public int Right; public int Bottom; }
  [DllImport("user32.dll")]
  public static extern bool GetWindowRect(IntPtr hWnd, out RECT lpRect);
}
'@
[NeonRefVisualWin32+RECT]$rect = New-Object NeonRefVisualWin32+RECT
[void][NeonRefVisualWin32]::GetWindowRect($p.MainWindowHandle, [ref]$rect)
$cx = [int][Math]::Round(($rect.Left + $rect.Right) / 2)
$cy = [int][Math]::Round(($rect.Top + $rect.Bottom) / 2)
Write-Output "$cx,$cy"
