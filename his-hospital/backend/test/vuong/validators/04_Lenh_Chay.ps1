param (
    [string]$Phan = "ALL"
)

# Thư mục hiện tại của script là backend/test/vuong/validators
# backendDir là thư mục gốc backend (cha 3 cấp)
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Resolve-Path (Join-Path $scriptDir "..\..\..")

Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "   BỘ KIỂM THỬ ĐƠN VỊ TỰ ĐỘNG CHO 3 CHỨC NĂNG (VŨ ĐỨC VƯƠNG)     " -ForegroundColor Yellow
Write-Host "=================================================================" -ForegroundColor Cyan
Write-Host "Backend Dir: $backendDir" -ForegroundColor Gray
Write-Host "Tùy chọn phân đoạn: $Phan" -ForegroundColor Gray
Write-Host ""

$filesToRun = @()

if ($Phan -eq "01") {
    $filesToRun += "test/vuong/validators/01_lapHoaDon.test.js"
} elseif ($Phan -eq "02") {
    $filesToRun += "test/vuong/validators/02_thanhToanHoaDon.test.js"
} elseif ($Phan -eq "03") {
    $filesToRun += "test/vuong/validators/03_quanLyThuoc.test.js"
} else {
    $filesToRun += "test/vuong/validators/01_lapHoaDon.test.js"
    $filesToRun += "test/vuong/validators/02_thanhToanHoaDon.test.js"
    $filesToRun += "test/vuong/validators/03_quanLyThuoc.test.js"
}

Push-Location $backendDir
try {
    & node --test $filesToRun
} finally {
    Pop-Location
}
