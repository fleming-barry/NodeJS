const path = require('path');
const express = require('express');
const hbs = require('hbs');
const forecast = require('./utils/forecast');
const geoCode = require('./utils/geoCode');

const app = express();
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialPath = path.join(__dirname, '../templates/partials');

app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialPath);

app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather App',
    name: 'Barry'
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Me',
    name: 'Barry'
  });
});

app.get('/help', (req, res) => {
  res.render('help', {
    title: 'Help',
    message: 'Are you lost right now?',
    name: 'Barry'
  });
});

app.get('/weather', (req, res) => {
  const address = req.query.address;
  if (!address) {
    return res.send({
      errors: ['address must be provided']
    });
  }

    geoCode(address, (err,{ latitude, longitude, location } = {}) => {
      if (err) {
        return res.send({
          errors: [err]
        });
      } 

      forecast(latitude, longitude, (err, foreCastData) => {
        if (err) {
          return res.send({
            errors: [err]
          });
        }
        res.send({
          forecast: foreCastData,
          location: location,
          address: req.query.address
        });
      });
    });
});

app.get('/help/*', (req, res) => {
  res.render('404', {
    title: '404',
    message: 'Help article not found',
    name: 'Barry'
  });
});

app.get('*', (req, res) => {
  res.render('404', {
    title: '404',
    message: 'Page not found',
    name: 'Barry'
  });
});

app.listen(3000, () => {
  console.log('Server is up on port 3000.');
});
