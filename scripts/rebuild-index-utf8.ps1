# Rebuild index.html (phase 1+2) from clean UTF-8 base without mojibake.
# Uses git checkout (not Get-Content on git show). Never use Set-Content -Encoding utf8.
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
Set-Location $root

git checkout 99bad41 -- index.html
& (Join-Path $PSScriptRoot 'apply-css-phase1.ps1')
& (Join-Path $PSScriptRoot 'apply-tour-phase2.ps1')
node (Join-Path $PSScriptRoot 'verify-utf8.mjs')
