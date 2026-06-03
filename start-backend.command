#!/bin/zsh
set -e

SCRIPT_DIR="${0:A:h}"
BACKEND_DIR="$SCRIPT_DIR/backend/second-hand-campus-api"

if ! command -v mvn >/dev/null 2>&1; then
  echo "未找到 mvn，请先安装 Maven 或确认 Maven 已加入 PATH。"
  exit 1
fi

cd "$BACKEND_DIR"
echo "启动校园二手交易后端：http://localhost:8080"
mvn spring-boot:run
