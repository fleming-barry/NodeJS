const request = require('request');
forecast = (longitude, latitude, callback) => {
  const url =
    'https://api.darksky.net/forecast/5777c894369508429ed9e9cde27880b8/' +
    latitude  +
    ',' +
    longitude;
  request({ url: url, json: true }, (err, {body}) => {
    if (err) {
      callback('Failed to get forecast', undefined);
    } else if (body.error) {
      callback('Bad Coordinates', undefined);
    } else {
      callback(undefined, {
        summary: body.daily.data[0].summary,
        tempature: body.currently.temperature,
        precipProbability: body.currently.precipProbability
      });
    }
  });
};

module.exports = forecast;
