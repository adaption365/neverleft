$root = Split-Path $PSScriptRoot -Parent
$indexPath = Join-Path $root 'index.html'
$utf8 = New-Object System.Text.UTF8Encoding $false
$allLines = [System.IO.File]::ReadAllLines($indexPath, $utf8)

# After phase 1 on 99bad41 layout: intro script 93-147, tour 151-229 (end walkthrough comment)
$omitStart = 93
$omitEnd = 229

$out = New-Object System.Collections.Generic.List[string]
for ($i = 0; $i -lt $allLines.Count; $i++) {
  $lineNum = $i + 1
  if ($lineNum -eq $omitStart) {
    [void]$out.Add('<script src="/js/tour.js"></script>')
    [void]$out.Add('<!-- ============ end landing layer + walkthrough (see js/tour.js) ============ -->')
    continue
  }
  if ($lineNum -ge $omitStart -and $lineNum -le $omitEnd) { continue }
  [void]$out.Add($allLines[$i])
}

[System.IO.File]::WriteAllLines($indexPath, $out, $utf8)
Write-Host "Updated index.html: $($out.Count) lines (was $($allLines.Count))"
