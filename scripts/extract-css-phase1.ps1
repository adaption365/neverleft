$root = Split-Path $PSScriptRoot -Parent
$indexPath = Join-Path $root 'index.html'
$cssDir = Join-Path $root 'css'
New-Item -ItemType Directory -Force -Path $cssDir | Out-Null

$lines = [System.IO.File]::ReadAllLines($indexPath)

function Get-RangeContent([int]$start, [int]$end) {
  $buf = New-Object System.Collections.Generic.List[string]
  for ($i = $start; $i -le $end; $i++) {
    $buf.Add($lines[$i])
  }
  return ($buf -join "`n")
}

# Line numbers are 1-based in editor; array is 0-based
# fonts: inside <style id="nl-embedded-fonts"> lines 13-23
$fonts = Get-RangeContent 12 22
[System.IO.File]::WriteAllText((Join-Path $cssDir 'fonts.css'), $fonts.TrimEnd() + "`n")

# main <style> lines 26-1182
$main = Get-RangeContent 25 1181
[System.IO.File]::WriteAllText((Join-Path $cssDir 'styles.css'), $main.TrimEnd() + "`n")

# intro lines 1189-1245
$intro = Get-RangeContent 1188 1244

# tour lines 1381-1393
$tour = Get-RangeContent 1380 1392

$combined = @(
  '/* NeverLeft — intro overlays (first visit + orientation) */'
  $intro
  ''
  '/* NeverLeft — spotlight walkthrough */'
  $tour
) -join "`n"

$stylesPath = Join-Path $cssDir 'styles.css'
$existing = [System.IO.File]::ReadAllText($stylesPath).TrimEnd()
[System.IO.File]::WriteAllText($stylesPath, $existing + "`n`n" + $combined.TrimEnd() + "`n")

Write-Host "Wrote css/fonts.css ($((Get-Item (Join-Path $cssDir 'fonts.css')).Length) bytes)"
Write-Host "Wrote css/styles.css ($((Get-Item (Join-Path $cssDir 'styles.css')).Length) bytes)"
