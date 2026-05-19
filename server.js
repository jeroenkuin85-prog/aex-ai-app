const express = require('express');
const os = require('os');
const path = require('path');
const app = express();
const PORT = 5173;

app.use(express.static(path.join(__dirname, 'public')));

const stocks = [
  { symbol:'ASML', name:'ASML Holding', price:982.40, change:1.82, rsi:58, trend:91, volume:86, momentum:88, pattern:'Ascending Triangle', entry:'€975 - €990', stop:'€948', target:'€1.025', score:8.3 },
  { symbol:'ADYEN', name:'Adyen', price:1481.20, change:0.74, rsi:53, trend:78, volume:71, momentum:73, pattern:'Bullish Pullback', entry:'€1.465 - €1.490', stop:'€1.420', target:'€1.555', score:7.0 },
  { symbol:'INGA', name:'ING Groep', price:16.92, change:0.41, rsi:61, trend:74, volume:68, momentum:70, pattern:'Momentum Continuation', entry:'€16,80 - €17,00', stop:'€16,35', target:'€17,65', score:6.9 },
  { symbol:'SHELL', name:'Shell', price:31.24, change:-0.18, rsi:49, trend:62, volume:55, momentum:51, pattern:'Neutral Range', entry:'€31,00 - €31,40', stop:'€30,35', target:'€32,20', score:5.5 }
];

app.get('/api/scan', (req, res) => {
  res.json({
    mode: 'Private scan',
    updatedAt: new Date().toLocaleTimeString('nl-NL', {hour:'2-digit', minute:'2-digit'}),
    stocks
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log('\n======================================');
  console.log(' AEX AI Advisor draait nu');
  console.log(' Laat dit zwarte scherm open staan');
  console.log('======================================\n');
  console.log(`PC link:      http://localhost:${PORT}/`);
  const nets = os.networkInterfaces();
  Object.values(nets).flat().forEach(net => {
    if (net && net.family === 'IPv4' && !net.internal) {
      console.log(`iPhone link:  http://${net.address}:${PORT}/`);
    }
  });
  console.log('\nGebruik op iPhone de iPhone link hierboven.\n');
});
