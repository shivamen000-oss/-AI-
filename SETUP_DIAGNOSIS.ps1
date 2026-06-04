# ========== ECC セットアップ診断スクリプト ==========
# Windows PowerShell 用
# 実行方法: powershell -ExecutionPolicy Bypass -File SETUP_DIAGNOSIS.ps1

Write-Host "`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║         ECC Setup Diagnosis - Windows PowerShell          ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# ========== 環境情報 ==========
Write-Host "📋 環境情報" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

$osInfo = [System.Environment]::OSVersion
Write-Host "OS: $osInfo" -ForegroundColor Green

$nodeVersion = node --version
Write-Host "Node.js: $nodeVersion" -ForegroundColor Green

$npmVersion = npm --version
Write-Host "npm: $npmVersion" -ForegroundColor Green

try {
    $yarnVersion = yarn --version
    Write-Host "Yarn: $yarnVersion" -ForegroundColor Green
} catch {
    Write-Host "Yarn: ❌ インストールされていません" -ForegroundColor Red
}

Write-Host "現在のディレクトリ: $(pwd)" -ForegroundColor Green
Write-Host "`n"

# ========== ファイル確認 ==========
Write-Host "📁 ファイル構造確認" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

$files = @(
    "package.json",
    "scripts/ecc.js",
    "scripts/lib/utils.js",
    "scripts/lib/package-manager.js",
    "node_modules"
)

foreach ($file in $files) {
    $path = "$PSScriptRoot/$file"
    $exists = Test-Path $path
    
    if ($exists) {
        if ((Get-Item $path).PSIsContainer) {
            $itemCount = (Get-ChildItem $path -ErrorAction SilentlyContinue | Measure-Object).Count
            Write-Host "✅ $file (ディレクトリ - $itemCount アイテム)" -ForegroundColor Green
        } else {
            $size = (Get-Item $path).Length
            Write-Host "✅ $file (ファイル - $('{0:N0}' -f $size) bytes)" -ForegroundColor Green
        }
    } else {
        Write-Host "❌ $file (見つかりません)" -ForegroundColor Red
    }
}

Write-Host "`n"

# ========== package.json 確認 ==========
Write-Host "📦 package.json 情報" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

if (Test-Path "package.json") {
    try {
        $pkg = Get-Content "package.json" | ConvertFrom-Json
        Write-Host "Name: $($pkg.name)" -ForegroundColor Green
        Write-Host "Version: $($pkg.version)" -ForegroundColor Green
        Write-Host "Description: $($pkg.description)" -ForegroundColor Green
        
        if ($pkg.bin) {
            Write-Host "`nBin エントリ:" -ForegroundColor Cyan
            foreach ($key in $pkg.bin.PSObject.Properties.Name) {
                Write-Host "  • $key → $($pkg.bin.$key)" -ForegroundColor Green
            }
        }
    } catch {
        Write-Host "❌ package.json のパース失敗: $_" -ForegroundColor Red
    }
} else {
    Write-Host "❌ package.json が見つかりません" -ForegroundColor Red
}

Write-Host "`n"

# ========== Git 情報 ==========
Write-Host "🔀 Git 情報" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

try {
    $currentBranch = git rev-parse --abbrev-ref HEAD
    Write-Host "現在のブランチ: $currentBranch" -ForegroundColor Green
    
    Write-Host "`n利用可能なブランチ:" -ForegroundColor Cyan
    $branches = git branch -a
    foreach ($branch in $branches) {
        Write-Host "  $branch" -ForegroundColor Green
    }
    
    Write-Host "`nリモート:" -ForegroundColor Cyan
    $remotes = git remote -v
    foreach ($remote in $remotes) {
        Write-Host "  $remote" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Git コマンド実行失敗: $_" -ForegroundColor Red
}

Write-Host "`n"

# ========== npx ecc テスト ==========
Write-Host "🧪 ECC CLI テスト" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

try {
    Write-Host "`n📊 npx ecc status:" -ForegroundColor Magenta
    Write-Host "─────────────────────────────────────────────────" -ForegroundColor Gray
    npx ecc status
    Write-Host "✅ 成功" -ForegroundColor Green
} catch {
    Write-Host "❌ 失敗: $_" -ForegroundColor Red
}

try {
    Write-Host "`n📦 npx ecc list-installed:" -ForegroundColor Magenta
    Write-Host "─────────────────────────────────────────────────" -ForegroundColor Gray
    npx ecc list-installed
    Write-Host "✅ 成功" -ForegroundColor Green
} catch {
    Write-Host "❌ 失敗: $_" -ForegroundColor Red
}

try {
    Write-Host "`n🔍 npx ecc doctor:" -ForegroundColor Magenta
    Write-Host "─────────────────────────────────────────────────" -ForegroundColor Gray
    npx ecc doctor
    Write-Host "✅ 成功" -ForegroundColor Green
} catch {
    Write-Host "❌ 失敗: $_" -ForegroundColor Red
}

try {
    Write-Host "`n📋 npx ecc help:" -ForegroundColor Magenta
    Write-Host "─────────────────────────────────────────────────" -ForegroundColor Gray
    npx ecc help
    Write-Host "✅ 成功" -ForegroundColor Green
} catch {
    Write-Host "❌ 失敗: $_" -ForegroundColor Red
}

try {
    Write-Host "`n📌 npx ecc version:" -ForegroundColor Magenta
    Write-Host "─────────────────────────────────────────────────" -ForegroundColor Gray
    npx ecc version
    Write-Host "✅ 成功" -ForegroundColor Green
} catch {
    Write-Host "❌ 失敗: $_" -ForegroundColor Red
}

Write-Host "`n"

# ========== 完了 ==========
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║             診断完了！結果を確認してください                ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

Write-Host "📝 トラブルシューティング:" -ForegroundColor Yellow
Write-Host "   1. npx ecc コマンドが見つからない場合:" -ForegroundColor Cyan
Write-Host "      → npm install を実行してください" -ForegroundColor Green
Write-Host "   2. Node.js が見つからない場合:" -ForegroundColor Cyan
Write-Host "      → Node.js 18+ をインストールしてください" -ForegroundColor Green
Write-Host "   3. ファイルが見つからない場合:" -ForegroundColor Cyan
Write-Host "      → git checkout setup/environment-setup を実行してください" -ForegroundColor Green
Write-Host "`n"
