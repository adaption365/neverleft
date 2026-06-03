$root = Split-Path $PSScriptRoot -Parent
$indexPath = Join-Path $root 'index.html'
$outPath = Join-Path $root 'js\tour.js'
New-Item -ItemType Directory -Force -Path (Split-Path $outPath) | Out-Null

$lines = @(Get-Content -LiteralPath $indexPath)
# 1-based: intro script 94-146, tour script 152-227
$intro = $lines[93..145] | ForEach-Object { $_ -replace '^\s{2}', '' }
$tour = $lines[151..226] | ForEach-Object { $_ -replace '^\s{2}', '' }

$header = @(
  '/* NeverLeft onboarding intro + spotlight tour (modular split phase 2) */'
  ''
)

$body = $header + $intro + '' + $tour
Set-Content -LiteralPath $outPath -Value $body -Encoding utf8
Write-Host "Wrote $outPath ($($body.Count) lines)"
