
const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

let players = [];

server.on('connection', ws => {
    console.log('A new player connected.');
    players.push(ws);

    ws.on('message', message => {
        const data = JSON.parse(message);

        // Broadcast the player's score to others
        players.forEach(player => {
            if (player !== ws && player.readyState === WebSocket.OPEN) {
                player.send(JSON.stringify(data));
            }
        });

        // Check for winning condition
        if (data.score >= 10000) {
            ws.send(JSON.stringify({ type: 'win', message: 'You win!' }));
            players.forEach(player => {
                if (player !== ws && player.readyState === WebSocket.OPEN) {
                    player.send(JSON.stringify({ type: 'lose', message: 'You lose!' }));
                }
            });
        }
    });

    ws.on('close', () => {
        console.log('A player disconnected.');
        players = players.filter(player => player !== ws);
    });
});

console.log('WebSocket server is running on ws://localhost:8080');
