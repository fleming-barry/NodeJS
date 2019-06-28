const geoCode = require('./utils/geoCode');
const forecast = require('./utils/forecast');

const location = process.argv[2];
if (!location) {
  console.log('Provide an address scrub!');
} else {
  geoCode(location, (err, { latitude, longitude, location }) => {
    if (err) {
      return console.log(err);
    }

    forecast(latitude, longitude, (err, foreCastData) => {
      if (err) {
        return console.log(err);
      }
      console.log(location);
      console.log(foreCastData);
    });
  });
}
