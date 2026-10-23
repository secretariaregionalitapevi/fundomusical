$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path $PSScriptRoot -Parent
Set-Location -LiteralPath $projectRoot
$excluded = @('node_modules','.next','.tools','.cache','.git','.vercel','.pnpm-store','artifacts','test-results','playwright-report','tsconfig.tsbuildinfo')
$entries = Get-ChildItem -LiteralPath $projectRoot -Force | Where-Object {
  $_.Name -notin $excluded -and ($_.Name -notlike '.env*' -or $_.Name -eq '.env.example') -and $_.Name -notlike '*.log'
}
New-Item -ItemType Directory -Path (Join-Path $projectRoot 'artifacts') -Force | Out-Null
$archive = Join-Path $projectRoot 'artifacts/fundo-musical-source.zip'
Compress-Archive -LiteralPath @($entries.FullName) -DestinationPath $archive -Force
Write-Output $archive
