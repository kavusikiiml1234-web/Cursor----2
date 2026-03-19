#!/bin/bash
# ダブルクリックでサーバー起動 → ブラウザで蔵書管理を開く（macOS）
cd "$(dirname "$0")"
PORT=8765
python3 -m http.server "$PORT" >/dev/null 2>&1 &
PID=$!
sleep 1
open "http://127.0.0.1:$PORT/"
echo "蔵書管理: http://127.0.0.1:$PORT/"
echo "終了するにはこのターミナルを閉じるか、次を実行: kill $PID"
wait $PID
