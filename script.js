
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
  'WELSPUNLIV',
  'ASAHISONG',
  'CRAFTSMAN',
  'BUTTERFLY',
  'ASTRAMICRO',
  'NAVNETEDUL',
  'TVVISION',
  'HARDWYN',
  'GINNIFILA',
  'DHARMAJ'
];

// Aap yahan se array ka istemal kisi bhi stock scanner, chart fetcher ya table builder ke liye kar sakte hain.

async function runFilter() {
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = 'Loading...';

  let results = [];

  for (const symbol of stocks) {
    try {
      const res = await fetch(`https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&outputsize=30&apikey=${apiKey}`);
      const data = await res.json();

      if (!data.values || data.values.length < 10) continue;

      const prices = data.values.map(v => parseFloat(v.close));
      const volumes = data.values.map(v => parseInt(v.volume));
      const avgVolume = volumes.slice(1, 11).reduce((a, b) => a + b) / 10;
      const latestVolume = volumes[0];
      const price = prices[0];

      const ema9 = prices.slice(0, 9).reduce((a, b, i) => a + b * Math.pow(0.2, i + 1), 0).toFixed(2);

      const rsi = 55; // Placeholder

      if (latestVolume >= 2 * avgVolume && price > ema9 && rsi > 55) {
        results.push(`<div class="stock">${symbol} - <a href="https://www.tradingview.com/symbols/NSE-${symbol}/" target="_blank">Chart</a></div>`);
      }
    } catch (err) {
      console.error(err);
    }
  }

  resultDiv.innerHTML = results.length ? results.join('') : 'No matching stocks found.';
}
