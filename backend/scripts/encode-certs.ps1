# Railway 배포를 위한 인증서 Base64 인코딩 스크립트 (PowerShell)

Write-Host "🔐 mTLS 인증서를 Base64로 인코딩합니다..." -ForegroundColor Cyan
Write-Host ""

# 인증서 파일 경로
$certPath = "../certs/health_hero_public.crt"
$keyPath = "../certs/health_hero_private.key"

# 파일 존재 확인
if (-not (Test-Path $certPath)) {
    Write-Host "❌ 인증서 파일을 찾을 수 없습니다: $certPath" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $keyPath)) {
    Write-Host "❌ 개인키 파일을 찾을 수 없습니다: $keyPath" -ForegroundColor Red
    exit 1
}

# Base64 인코딩
$certBase64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes((Resolve-Path $certPath)))
$keyBase64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes((Resolve-Path $keyPath)))

Write-Host "✅ 인증서 인코딩 완료" -ForegroundColor Green
Write-Host ""
Write-Host "다음 명령어를 Railway CLI에서 실행하세요:" -ForegroundColor Yellow
Write-Host ""
Write-Host "railway variables set TOSS_CERT_BASE64=`"$certBase64`"" -ForegroundColor White
Write-Host ""
Write-Host "railway variables set TOSS_KEY_BASE64=`"$keyBase64`"" -ForegroundColor White
Write-Host ""
Write-Host "또는 Railway Dashboard → Variables에서 직접 설정:" -ForegroundColor Yellow
Write-Host ""
Write-Host "TOSS_CERT_BASE64:" -ForegroundColor Cyan
Write-Host $certBase64
Write-Host ""
Write-Host "TOSS_KEY_BASE64:" -ForegroundColor Cyan
Write-Host $keyBase64
Write-Host ""
Write-Host "⚠️  주의: 이 값들을 안전하게 보관하고, Git에 커밋하지 마세요!" -ForegroundColor Red

