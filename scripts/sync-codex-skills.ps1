$ErrorActionPreference = "Stop"

param(
  [string]$RepoSkillRoot = (Join-Path $PSScriptRoot "..\.codex\skills"),
  [string]$TargetSkillRoot = "$HOME\.codex\skills"
)

$resolvedRepoSkillRoot = (Resolve-Path $RepoSkillRoot).Path

if (-not (Test-Path -LiteralPath $resolvedRepoSkillRoot)) {
  throw "Repo skill directory not found: $resolvedRepoSkillRoot"
}

$skillDirectories = Get-ChildItem -LiteralPath $resolvedRepoSkillRoot -Directory

if ($skillDirectories.Count -eq 0) {
  throw "No repo-local skills found in: $resolvedRepoSkillRoot"
}

New-Item -ItemType Directory -Force -Path $TargetSkillRoot | Out-Null

foreach ($skillDirectory in $skillDirectories) {
  $targetDirectory = Join-Path $TargetSkillRoot $skillDirectory.Name
  New-Item -ItemType Directory -Force -Path $targetDirectory -ErrorAction Stop | Out-Null
  Copy-Item -Path (Join-Path $skillDirectory.FullName "*") -Destination $targetDirectory -Recurse -Force -ErrorAction Stop
}

Write-Host "Synced skills to $TargetSkillRoot"
Get-ChildItem -LiteralPath $TargetSkillRoot -Directory | Select-Object Name
