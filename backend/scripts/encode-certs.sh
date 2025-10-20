#!/bin/bash
# Railway 배포를 위한 인증서 Base64 인코딩 스크립트 (Bash)

echo "🔐 mTLS 인증서를 Base64로 인코딩합니다..."
echo ""

# 인증서 파일 경로
CERT_PATH="../certs/health_hero_public.crt"
KEY_PATH="../certs/health_hero_private.key"

# 파일 존재 확인
if [ ! -f "$CERT_PATH" ]; then
    echo "❌ 인증서 파일을 찾을 수 없습니다: $CERT_PATH"
    exit 1
fi

if [ ! -f "$KEY_PATH" ]; then
    echo "❌ 개인키 파일을 찾을 수 없습니다: $KEY_PATH"
    exit 1
fi

# Base64 인코딩
CERT_BASE64=$(base64 -w 0 "$CERT_PATH" 2>/dev/null || base64 "$CERT_PATH")
KEY_BASE64=$(base64 -w 0 "$KEY_PATH" 2>/dev/null || base64 "$KEY_PATH")

echo "✅ 인증서 인코딩 완료"
echo ""
echo "다음 명령어를 Railway CLI에서 실행하세요:"
echo ""
echo "railway variables set TOSS_CERT_BASE64=\"$CERT_BASE64\""
echo ""
echo "railway variables set TOSS_KEY_BASE64=\"$KEY_BASE64\""
echo ""
echo "⚠️  주의: 이 값들을 안전하게 보관하고, Git에 커밋하지 마세요!"

