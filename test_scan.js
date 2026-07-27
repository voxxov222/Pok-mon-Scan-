fetch('http://localhost:3000/api/scan-card', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({ imageBase64: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=' })
}).then(r => r.json()).then(console.log).catch(console.error);
