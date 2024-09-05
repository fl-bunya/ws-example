const WebSocket = require('ws');

// WebSocketサーバーをポート8080で作成
const wss = new WebSocket.Server({ port: 8080 });

// メッセージ履歴を保存する配列（最大10件）
const messageHistory = [];

const MAX_HISTORY = 1000;

wss.on('connection', (ws) => {
  console.log('クライアントが接続しました。');

  // 過去の10件のメッセージを接続したクライアントに送信
  messageHistory.forEach((message) => {
    ws.send(message);
  });

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

    // メッセージをテキスト形式で履歴に追加
    const textMessage = message.toString(); // バッファを文字列に変換
    messageHistory.push(textMessage);

    // メッセージ履歴が10件を超えたら古いものを削除
    if (messageHistory.length > MAX_HISTORY) {
      messageHistory.shift(); // 最古のメッセージを削除
    }

    // 全てのクライアントにメッセージを送信
    broadcast(textMessage);
  });

  // 接続終了時
  ws.on('close', () => {
    console.log('クライアントが切断しました。');
  });

  // 初回接続時にクライアントへメッセージ送信
  ws.send('チャットサーバーに接続されました。');
});

console.log('WebSocketチャットサーバーがポート8080で起動中...');
