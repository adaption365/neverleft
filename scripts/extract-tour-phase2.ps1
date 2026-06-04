$root = Split-Path $PSScriptRoot -Parent
$indexPath = Join-Path $root 'index.html'
$outPath = Join-Path $root 'js\tour.js'
New-Item -ItemType Directory -Force -Path (Split-Path $outPath) | Out-Null

$utf8 = New-Object System.Text.UTF8Encoding $false
$lines = [System.IO.File]::ReadAllLines($indexPath, $utf8)
# 1-based: intro script 94-146, tour script 152-227
$intro = $lines[93..145] | ForEach-Object { $_ -replace '^\s{2}', '' }
$tour = $lines[151..226] | ForEach-Object { $_ -replace '^\s{2}', '' }

$header = @(
  '/* NeverLeft onboarding intro + spotlight tour (modular split phase 2) */'
  ''
)

$body = $header + $intro + '' + $tour
[System.IO.File]::WriteAllLines($outPath, $body, $utf8)
Write-Host "Wrote $outPath ($($body.Count) lines)"
