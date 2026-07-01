# KeepCode AI IDE - Debug Baslat Scripti
# Bu script, IDE'nin neden acilmadigini tespit etmek icin kullanilir.
#
# Kullanim: Bu dosyayi PowerShell'de calistirin
#   .\debug_keepcode.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  KeepCode AI IDE - Debug Modu" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Olasi kurulum dizinleri
$possiblePaths = @(
    "$env:LOCALAPPDATA\Programs\KeepTG KeepCode AI\KeepCode AI.exe",
    "$env:LOCALAPPDATA\Programs\KeepCode AI\KeepCode AI.exe",
    "$env:ProgramFiles\KeepTG KeepCode AI\KeepCode AI.exe",
    "$env:ProgramFiles\KeepCode AI\KeepCode AI.exe"
)

$exePath = $null
foreach ($path in $possiblePaths) {
    if (Test-Path $path) {
        $exePath = $path
        break
    }
}

if (-not $exePath) {
    Write-Host "HATA: KeepCode AI IDE bulunamadi!" -ForegroundColor Red
    Write-Host "Aranan konumlar:" -ForegroundColor Yellow
    foreach ($path in $possiblePaths) {
        Write-Host "  - $path" -ForegroundColor Yellow
    }
    Write-Host ""
    $exePath = Read-Host "Lutfen KeepCode AI.exe'nin tam yolunu girin"
    if (-not (Test-Path $exePath)) {
        Write-Host "Dosya bulunamadi: $exePath" -ForegroundColor Red
        exit 1
    }
}

Write-Host "IDE Konumu: $exePath" -ForegroundColor Green
Write-Host ""

# Kurulum dizini bilgileri
$installDir = Split-Path $exePath -Parent
Write-Host "=== Kurulum Dizini Yapisi ===" -ForegroundColor Cyan

# Kritik dosyalari kontrol et
$criticalFiles = @(
    "resources\app\product.json",
    "resources\app\out\main.js",
    "resources\app\out\vs\code\electron-browser\workbench\workbench.js",
    "resources\app\out\vs\code\electron-browser\workbench\workbench.html",
    "resources\app\out\vs\workbench\workbench.desktop.main.js",
    "resources\app\out\vs\workbench\workbench.desktop.main.css",
    "resources\app\out\vs\base\parts\sandbox\electron-browser\preload.js",
    "resources\app\out\vs\sessions\sessions.desktop.main.js",
    "resources\app\out\vs\sessions\electron-browser\sessions.js"
)

Write-Host ""
Write-Host "Kritik dosya kontrolu:" -ForegroundColor Yellow
$allExist = $true
foreach ($file in $criticalFiles) {
    $fullPath = Join-Path $installDir $file
    if (Test-Path $fullPath) {
        $size = (Get-Item $fullPath).Length
        $sizeKB = [math]::Round($size / 1024, 1)
        Write-Host "  [OK] $file (${sizeKB}KB)" -ForegroundColor Green
    } else {
        Write-Host "  [EKSIK] $file" -ForegroundColor Red
        $allExist = $false
    }
}

# product.json icerigini kontrol et
Write-Host ""
Write-Host "=== product.json Bilgileri ===" -ForegroundColor Cyan
$productJsonPath = Join-Path $installDir "resources\app\product.json"
if (Test-Path $productJsonPath) {
    $productJson = Get-Content $productJsonPath | ConvertFrom-Json
    Write-Host "  nameShort: $($productJson.nameShort)" -ForegroundColor White
    Write-Host "  version: $($productJson.version)" -ForegroundColor White
    Write-Host "  commit: $($productJson.commit)" -ForegroundColor White
    Write-Host "  quality: $($productJson.quality)" -ForegroundColor White
    Write-Host "  updateUrl: $($productJson.updateUrl)" -ForegroundColor White
    
    if (-not $productJson.commit) {
        Write-Host "  UYARI: commit hash bos! Bu sorunun kaynagi olabilir." -ForegroundColor Red
    }
    
    # Checksums kontrol
    if ($productJson.checksums) {
        Write-Host "  checksums: mevcut" -ForegroundColor Green
    } else {
        Write-Host "  checksums: YOK (tamper detection devre disi)" -ForegroundColor Yellow
    }
} else {
    Write-Host "  HATA: product.json bulunamadi!" -ForegroundColor Red
}

# User data dizini kontrol
Write-Host ""
Write-Host "=== User Data Dizini ===" -ForegroundColor Cyan
$userDataDir = "$env:APPDATA\.keepcode-ai"
if (Test-Path $userDataDir) {
    Write-Host "  Konum: $userDataDir" -ForegroundColor Green
    
    # Log dosyalari
    $logsDir = Join-Path $userDataDir "logs"
    if (Test-Path $logsDir) {
        $latestLog = Get-ChildItem $logsDir -Recurse -File | Sort-Object LastWriteTime -Descending | Select-Object -First 5
        if ($latestLog) {
            Write-Host "  Son log dosyalari:" -ForegroundColor Yellow
            foreach ($log in $latestLog) {
                Write-Host "    - $($log.FullName) ($($log.Length) bytes, $($log.LastWriteTime))" -ForegroundColor White
            }
        }
    }
} else {
    Write-Host "  Konum: $userDataDir (henuz olusturulmamis)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  IDE'yi Debug Modunda Baslatiyorum..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Ciktiyi asagida goreceksiniz:" -ForegroundColor Yellow
Write-Host ""

# IDE'yi verbose modda baslat
$logFile = Join-Path $env:TEMP "keepcode_debug_$(Get-Date -Format 'yyyyMMdd_HHmmss').log"
Write-Host "Log dosyasi: $logFile" -ForegroundColor Green
Write-Host ""

# Oncelikle extension'siz deneyelim
Write-Host "Adim 1: Extension'siz baslatma denemesi..." -ForegroundColor Cyan
$process = Start-Process -FilePath $exePath -ArgumentList "--disable-extensions","--verbose","--log","trace" -PassThru -RedirectStandardError $logFile -NoNewWindow -Wait

Write-Host ""
Write-Host "IDE kapandi. Cikis kodu: $($process.ExitCode)" -ForegroundColor $(if ($process.ExitCode -eq 0) {"Green"} else {"Red"})

if (Test-Path $logFile) {
    $logSize = (Get-Item $logFile).Length
    if ($logSize -gt 0) {
        Write-Host ""
        Write-Host "=== Hata Ciktisi (son 50 satir) ===" -ForegroundColor Cyan
        Get-Content $logFile -Tail 50
    }
}

Write-Host ""
Write-Host "Tam log: $logFile" -ForegroundColor Yellow
