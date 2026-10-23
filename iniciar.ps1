$ErrorActionPreference = 'Stop'
& (Join-Path $PSScriptRoot 'scripts/project.ps1') -Task dev
