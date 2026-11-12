$ErrorActionPreference = "Stop"
$releaseDir = Join-Path (Get-Location) "release"
if (-not (Test-Path $releaseDir)) { throw "Release directory is missing." }
$setup = Get-ChildItem $releaseDir -File | Where-Object { $_.Name -like "NIVA-Launcher-Setup-*.exe" }
$portable = Get-ChildItem $releaseDir -File | Where-Object { $_.Name -like "NIVA-Launcher-Portable-*.exe" }
if (-not $setup) { throw "NSIS setup EXE was not produced." }
if (-not $portable) { throw "Portable EXE was not produced." }
$all = @($setup) + @($portable)
$lines = foreach ($file in $all) {
  $bytes = [System.IO.File]::ReadAllBytes($file.FullName)
  if ($bytes.Length -lt 256) { throw "Artifact is unexpectedly small: $($file.Name)" }
  if ($bytes[0] -ne 0x4D -or $bytes[1] -ne 0x5A) { throw "Artifact is not a PE executable: $($file.Name)" }
  $peOffset = [BitConverter]::ToInt32($bytes, 0x3C)
  if ($peOffset -lt 64 -or $peOffset + 6 -ge $bytes.Length) { throw "Invalid PE header: $($file.Name)" }
  if ($bytes[$peOffset] -ne 0x50 -or $bytes[$peOffset + 1] -ne 0x45 -or $bytes[$peOffset + 2] -ne 0 -or $bytes[$peOffset + 3] -ne 0) { throw "Invalid PE signature: $($file.Name)" }
  $machine = [BitConverter]::ToUInt16($bytes, $peOffset + 4)
  if ($machine -ne 0x8664) { throw "Expected AMD64 PE machine 0x8664, got 0x$($machine.ToString('X4')): $($file.Name)" }
  $hash = (Get-FileHash -Algorithm SHA256 -Path $file.FullName).Hash.ToLowerInvariant()
  "{0}  {1}" -f $hash, $file.Name
}
$lines | Set-Content -Path (Join-Path $releaseDir "SHA256SUMS.txt") -Encoding ascii
Get-ChildItem $releaseDir -File | Select-Object Name, Length | Format-Table -AutoSize
