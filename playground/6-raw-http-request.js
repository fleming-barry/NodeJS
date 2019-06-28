const https = require('https');
const url =
  'https://api.darksky.net/forecast/5777c894369508429ed9e9cde27880b8/40,-75';

const request = https.request(url, resp => {
  let data = '';
  resp.on('data', chunk => {
    data = data + chunk.toString();
  });

  resp.on('end', () => {
    const body = JSON.parse(data);
    console.log(body);
  });
});

request.on('err', err => {
  console.log('An Error', err);
});
request.end();
