const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const port = process.env.PORT || 3000; // sets the herolu port

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');  // see this on the npmjs.com/package/hbs page

// THIS IS THE MIDDELWARE WE CREATE TO WRITE TO A LOG FILE ******************
app.use((req, res, next) => {
  //next tells us, express, when the function is done.
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;

  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if(err) {
      console.log('Unable to append to server.log.')
     }
   });
  next();
});   // END OF MIDDLEWARE WRITE TO LOG SECTION

//****************************** MAINTENANCE MODE CODE ********************

// WE COMMENT THIS OUT BELOW TO REMOVE MAINTENANCE MODE. IF WE WANT IT BACK
// WE JUST NEED TO REMOVE THE COMMENTS SO THE CODE RUNS.

// app.use((req, res, next) => {
//   res.render('maintenance.hbs', {
//     pageTitle: 'Maintenance Page',
//     maintenanceMsg: 'Maintenance in progress...'
//   });
// });
//  WE DON'T CALL next(); SO THAT CODE STOPS AT THE MAINTENANCE SCREEN.
// ************************************************************************

app.use(express.static(__dirname + '/public'));

// ch 44 - this allows us to remove the get year call from each rendered
// page below. Now it will be a helper function and used in the footer
// partial, footer.hbs, to get the year for the home and about pages.
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
});

// this is another helper function that changes text to uppercase and returns
// it. we will use our welcomeMsg as the text to make uppercase in home.hbs.
hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

app.get('/', (req, res) => {
    res.render('home.hbs', {
      pageTitle: 'Home Page',
      welcomeMsg: 'Welcome to my website!'
    });
});

app.get('/about', (req, res) =>{
    res.render('about.hbs', {
      pageTitle: 'About Page'
    });
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to handle request'
  });
});


app.listen(port, () => {
   console.log(`Server is up on port ${port}`);
});
// listen to port 3000
// remember to stop terminal from listening with control C to quit
// the call to app.listen can use asecond argument, it's a function
// we use to print a message that listen is running on port 3000.
