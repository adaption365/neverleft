$root = Split-Path $PSScriptRoot -Parent
$indexPath = Join-Path $root 'index.html'
$utf8 = New-Object System.Text.UTF8Encoding $false
$allLines = [System.IO.File]::ReadAllLines($indexPath, $utf8)

# Ranges to omit (1-based inclusive) from original index.html
$omit = @(
  @(11, 24),
  @(25, 1183),
  @(1188, 1246),
  @(1380, 1394)
)

function Test-OmitLine([int]$lineNum) {
  foreach ($r in $omit) {
    if ($lineNum -ge $r[0] -and $lineNum -le $r[1]) { return $true }
  }
  return $false
}

$out = New-Object System.Collections.Generic.List[string]
for ($i = 0; $i -lt $allLines.Count; $i++) {
  $lineNum = $i + 1
  if ($lineNum -eq 11) {
    [void]$out.Add('<!-- Offline fonts + app styles (phase 1 split) -->')
    [void]$out.Add('<link rel="stylesheet" href="/css/fonts.css">')
    [void]$out.Add('<link rel="stylesheet" href="/css/styles.css">')
  }
  if (Test-OmitLine $lineNum) { continue }
  [void]$out.Add($allLines[$i])
}

[System.IO.File]::WriteAllLines($indexPath, $out, $utf8)
Write-Host "Updated index.html: $($out.Count) lines (was $($allLines.Count))"
