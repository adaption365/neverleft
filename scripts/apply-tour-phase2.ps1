$root = Split-Path $PSScriptRoot -Parent
$indexPath = Join-Path $root 'index.html'
$allLines = @(Get-Content -LiteralPath $indexPath)

# Omit 1-based lines 93-227 (both inline script blocks)
$out = New-Object System.Collections.Generic.List[string]
for ($i = 0; $i -lt $allLines.Count; $i++) {
  $lineNum = $i + 1
  if ($lineNum -eq 93) {
    [void]$out.Add('<script src="/js/tour.js"></script>')
    continue
  }
  # Drop both inline script blocks (intro + tour)
  if ($lineNum -ge 94 -and $lineNum -le 227) { continue }
  [void]$out.Add($allLines[$i])
}

Set-Content -LiteralPath $indexPath -Value $out -Encoding utf8
Write-Host "Updated index.html: $($out.Count) lines (was $($allLines.Count))"
