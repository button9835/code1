const WebSocket = require('ws');
const express = require('express');
const http = require('http');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const TEXT_FILE = 'last_text.txt';

// 🔹 서버 시작 시 저장된 마지막 텍스트 불러오기
let lastText = "";
if (fs.existsSync(TEXT_FILE)) {
    lastText = fs.readFileSync(TEXT_FILE, 'utf8').trim();
}

app.use(express.static('public')); // 정적 파일 제공

wss.on('connection', (ws) => {
    console.log('클라이언트 연결됨');

    // 🔹 새 클라이언트에게 마지막 저장된 텍스트 전송
    if (lastText) {
        ws.send(lastText);
    }

    ws.on('message', (message) => {
        const text = message.toString();
        if (text.length > 100) return; // 100자 초과 방지
        console.log(`받은 메시지: ${text}`);

        // 🔹 마지막 입력값 저장
        lastText = text;
        fs.writeFileSync(TEXT_FILE, text, 'utf8');

        // 🔹 모든 클라이언트에게 전송
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(text);
            }
        });
    });

    ws.on('close', () => {
        console.log('클라이언트 연결 종료');
    });
});

server.listen(3000, () => {
    console.log('서버 실행 중: http://localhost:3000');
});
