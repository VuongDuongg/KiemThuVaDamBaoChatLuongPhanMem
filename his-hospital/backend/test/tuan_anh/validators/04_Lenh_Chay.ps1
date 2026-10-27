param (
    [string]$Phan = "ALL"
)

# Thu muc hien tai cua script la backend/test/tuan_anh/validators
# backendDir la thu muc goc backend (cha 3 cap)
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Resolve-Path (Join-Path $scriptDir "..\..\..")

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "   BO KIEM THU DON VI TU DONG CHO 3 CHUC NANG (NGO TUAN ANH)     " -ForegroundColor Yellow
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "Backend Dir: $backendDir" -ForegroundColor Gray
Write-Host "Tuy chon phan doan: $Phan" -ForegroundColor Gray
Write-Host ""

$filesToRun = @()

if ($Phan -eq "01") {
    $filesToRun += "test/tuan_anh/validators/01_consultation.test.js"
} elseif ($Phan -eq "02") {
    $filesToRun += "test/tuan_anh/validators/02_labOrder.test.js"
} elseif ($Phan -eq "03") {
    $filesToRun += "test/tuan_anh/validators/03_prescription.test.js"
} else {
    $filesToRun += "test/tuan_anh/validators/01_consultation.test.js"
    $filesToRun += "test/tuan_anh/validators/02_labOrder.test.js"
    $filesToRun += "test/tuan_anh/validators/03_prescription.test.js"
}

Push-Location $backendDir
try {
    & node --test $filesToRun
} finally {
    Pop-Location
}
