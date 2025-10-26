Write-Host "`n🚀 Starting GhostWrite auto-deploy script..." -ForegroundColor Cyan

# 1️⃣ Navigate to your project
$projectPath = "C:\Users\Alexi\Desktop\ghostwrite"
if (!(Test-Path $projectPath)) { Write-Host "❌ Folder not found: $projectPath"; exit }
Set-Location $projectPath

# 2️⃣ Check required files
$required = @("server.js", "package.json", ".env", "public\chargeback.html")
foreach ($f in $required) {
  if (Test-Path $f) { Write-Host "✅ $f found" -ForegroundColor Green }
  else { Write-Host "⚠️ Missing $f" -ForegroundColor Yellow }
}

# 3️⃣ Confirm start script in package.json
if (Get-Content package.json | Select-String '"start"\s*:\s*"node server.js"') {
  Write-Host "✅ Start script configured correctly" -ForegroundColor Green
}
else {
  Write-Host "⚠️ Please add `"start`": `"node server.js`" to your package.json" -ForegroundColor Yellow
}

# 4️⃣ Install node modules if missing
if (!(Test-Path "node_modules")) {
  Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
  npm install
}
else { Write-Host "✅ node_modules present" -ForegroundColor Green }

# 5️⃣ Quick local test (Ctrl+C to stop when done)
Write-Host "`n🌐 Testing locally... (open http://localhost:3000/chargeback.html)" -ForegroundColor Cyan
Start-Process "http://localhost:3000/chargeback.html"
Start-Job { node server.js } | Out-Null
Start-Sleep -Seconds 5
Stop-Job -Name * -Force

# 6️⃣ Git push to origin main
Write-Host "`n📤 Pushing latest code to GitHub..." -ForegroundColor Cyan
git add .
git commit -m "Auto-deploy update $(Get-Date -Format 'MM/dd/yyyy HH:mm')"
git push origin main

Write-Host "`n✅ Code pushed successfully." -ForegroundColor Green
Write-Host "➡️  Go to https://render.com/dashboard → ghostwrite-1 → Manual Deploy → Clear build cache & Deploy" -ForegroundColor Yellow
Write-Host "`nWhen it says 'Your service is live 🎉', visit:" -ForegroundColor Cyan
Write-Host "👉  https://ghostwrite-1.onrender.com/chargeback.html" -ForegroundColor Green
