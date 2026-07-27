const https = require('https');
https.get('https://api.pokemontcg.io/v2/cards?q=name:Charizard', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => console.log(data.slice(0, 500)));
});
