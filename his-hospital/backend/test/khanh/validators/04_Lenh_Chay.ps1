param (
    [string]$Phan = "ALL"
)

# Thư mục hiện tại của script là backend/test/khanh/validators
# backendDir là cha 3 cấp: validators -> khanh -> test -> backend
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Resolve-Path (Join-Path $scriptDir "..\..\..")

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "   BO KIEM THU DON VI TU DONG CHO 45 CA VALIDATE (LE TUAN KHANH)  " -ForegroundColor Yellow
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "Backend Dir: $backendDir" -ForegroundColor Gray
Write-Host "Tuy chon phan doan: $Phan" -ForegroundColor Gray
Write-Host ""

$filesToRun = @()

if ($Phan -eq "01") {
    $filesToRun += "test/khanh/validators/01_receiveOrder.test.js"
} elseif ($Phan -eq "02") {
    $filesToRun += "test/khanh/validators/02_labResult.test.js"
} elseif ($Phan -eq "03") {
    $filesToRun += "test/khanh/validators/03_pacs.test.js"
} else {
    $filesToRun += "test/khanh/validators/01_receiveOrder.test.js"
    $filesToRun += "test/khanh/validators/02_labResult.test.js"
    $filesToRun += "test/khanh/validators/03_pacs.test.js"
}

Push-Location $backendDir
try {
    & node --test $filesToRun
} finally {
    Pop-Location
}
