const request = require('request');
const geoCode = (address, callback) => {
  const url =
    'https://api.mapbox.com/geocoding/v5/mapbox.places/' +
    address +
    '.json?access_token=pk.eyJ1IjoiYmZsZW1pbmcyMSIsImEiOiJjanhmNDE4NnkwNWF3M3VvN3U5MXV6OGhoIn0.jNaGXZi1WHL7AGPZNFJhWQ&limit=1';
  request({ url: url, json: true }, (err, {body}) => {
    if (err) {
      callback('Unable to connect', undefined);
    } else if (body.features.length === 0) {
      callback('Unable to find location ' + address, undefined);
    } else {
      callback(undefined, {
        latitude: body.features[0].center[0],
        longitude: body.features[0].center[1],
        location: body.features[0].place_name
      });
    }
  });
};

module.exports = geoCode;
