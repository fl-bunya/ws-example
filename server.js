// server.js
const WebSocket = require('ws');

// WebSocketサーバーをポート8080で作成
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('クライアントが接続しました。');

  // 接続している全てのクライアントにメッセージを送信する関数
  const broadcast = (data) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  };

  // クライアントからメッセージを受け取ったときの処理
  ws.on('message', (message) => {
    console.log('受信したメッセージ: ', message);
    // 全てのクライアントにメッセージを送信
    broadcast(message);
  });

  // 接続終了時
  ws.on('close', () => {
    console.log('クライアントが切断しました。');
  });

  // 初回接続時にクライアントへメッセージ送信
  ws.send('チャットサーバーに接続されました。');
});

console.log('WebSocketチャットサーバーがポート8080で起動中...');
