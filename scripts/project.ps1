param([ValidateSet('dev','build','start','lint','typecheck','test','test:e2e','test:security','check','format')][string]$Task = 'dev')
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path $PSScriptRoot -Parent
Set-Location -LiteralPath $projectRoot
if ($Task -eq 'dev' -and -not (Test-Path -LiteralPath '.env.local')) { Copy-Item -LiteralPath '.env.example' -Destination '.env.local' }
$portableNode = Join-Path $projectRoot '.tools/node_modules/node/bin'
if (Test-Path -LiteralPath (Join-Path $portableNode 'node.exe')) { $env:PATH = $portableNode + ';' + $env:PATH }
$nodeMajor = [int]((& node --version).TrimStart('v').Split('.')[0])
if ($nodeMajor -ne 24) { throw 'Instale Node.js 24 LTS ou use a instalação portátil preparada neste projeto.' }
$env:PLAYWRIGHT_BROWSERS_PATH = Join-Path $projectRoot '.cache/ms-playwright'
$env:NEXT_TELEMETRY_DISABLED = '1'
$portablePnpm = Join-Path $projectRoot '.tools/node_modules/pnpm/bin/pnpm.cjs'
if (Test-Path -LiteralPath $portablePnpm) { & node $portablePnpm run $Task } else { & pnpm run $Task }
exit $LASTEXITCODE
