const apiKey = 'f807de378e154661b95ff8ddfe940dfd';
const stockSymbols = [
  'IDEAFORGE',
  'PREMEXPLN',
  'MAYURUNIQ',
  'APOLLO',
  'SJS',
  'BORORENEW',
  'KPRMILL',
  'YESBANK',
  'ZENITHSTL',
  'DCXINDIA',
  'SAKAR',
  'NDRAUTO',
  'TTL',
  'SPLPETRO',
  'COMSYN',
  'FAZE3Q',
  'WELSPUNLIV'
];

async function runFilter() {
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = 'Loading...';

  let results = [];

  for (const symbol of stockSymbols) {
    try {
      const res = await fetch(`https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&outputsize=100&apikey=${apiKey}`);
      const data = await res.json();

      if (!data.values || data.values.length < 15) continue;

      const closes = data.values.map(v => parseFloat(v.close));
      const volumes = data.values.map(v => parseInt(v.volume));

      const latestVolume = volumes[0];
      const avgVolume = volumes.slice(1, 11).reduce((a, b) => a + b, 0) / 10;

      const price = closes[0];

      // RSI(14) Calculation
      let gains = 0, losses = 0;
      for (let i = 0; i < 14; i++) {
        const diff = closes[i] - closes[i + 1];
        if (diff >= 0) gains += diff;
        else losses -= diff;
      }
      const avgGain = gains / 14;
      const avgLoss = losses / 14;
      const rs = avgGain / (avgLoss || 1);
      const rsi = 100 - (100 / (1 + rs));

      const ema9 = closes.slice(0, 9).reduce((a, b, i) => a + b * Math.pow(0.2, i + 1), 0).toFixed(2);

      if (rsi > 54 && latestVolume >= 1.5 * avgVolume && price > ema9) {
        results.push(`<div class="stock">${symbol} - <a href="https://www.tradingview.com/symbols/NSE-${symbol}/" target="_blank">Chart</a> - RSI: ${rsi.toFixed(1)}</div>`);
      }

    } catch (err) {
      console.error(err);
    }
  }

  resultDiv.innerHTML = results.length ? results.join('') : 'No matching stocks found.';
}
