const WebSocket = require('ws');
const express = require('express');
const http = require('http');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('public')); // 정적 파일 제공

wss.on('connection', (ws) => {
    console.log('클라이언트 연결됨');

    ws.on('message', (message) => {
        const text = message.toString();
        if (text.length > 100) return; // 100자 초과 방지
        console.log(`받은 메시지: ${text}`);

        // 텍스트를 logs.txt에 기록
        const logEntry = `[${new Date().toISOString()}] ${text}\n`;
        fs.appendFileSync('logs.txt', logEntry, 'utf8');

        // 모든 클라이언트에게 전송
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
