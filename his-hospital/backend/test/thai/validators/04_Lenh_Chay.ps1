param (
    [string]$Phan = "ALL"
)

# Thu muc hien tai cua script la backend/test/thai/validators
# backendDir la thu muc goc backend (cha 3 cap)
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Resolve-Path (Join-Path $scriptDir "..\..\..")

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "   BO KIEM THU DON VI TU DONG CHO 3 CHUC NANG (NGUYEN HONG THAI) " -ForegroundColor Yellow
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "Backend Dir: $backendDir" -ForegroundColor Gray
Write-Host "Tuy chon phan doan: $Phan" -ForegroundColor Gray
Write-Host ""

$filesToRun = @()

if ($Phan -eq "01") {
    $filesToRun += "test/thai/validators/01_patientRegistration.test.js"
} elseif ($Phan -eq "02") {
    $filesToRun += "test/thai/validators/02_clinicAppointment.test.js"
} elseif ($Phan -eq "03") {
    $filesToRun += "test/thai/validators/03_queueDispatch.test.js"
} else {
    $filesToRun += "test/thai/validators/01_patientRegistration.test.js"
    $filesToRun += "test/thai/validators/02_clinicAppointment.test.js"
    $filesToRun += "test/thai/validators/03_queueDispatch.test.js"
}

Push-Location $backendDir
try {
    & node --test $filesToRun
} finally {
    Pop-Location
}
