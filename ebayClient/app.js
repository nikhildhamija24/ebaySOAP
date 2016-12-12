var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('client-sessions');

var index = require('./routes/index');
var users = require('./routes/users');
var user = require('./routes/userHome');
var signin = require('./routes/signin');
var register = require('./routes/register');
var prodDetails = require('./routes/product');
var cart = require('./routes/cart');
var pay = require('./routes/validatePayment');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  cookieName : 'session',
  secret : 'cmpe273_ebay_soap',
  duration : 30*60*1000,
  activeDuration : 5*60*1000
}));

app.use('/', index);

app.get('/signinPage', signin.getSignInPage);
app.get('/registerPage', register.getRegisterPage);
app.get('/getUsername', signin.getUsername);
app.get('/product', prodDetails.productDetails);
app.get('/allProds', prodDetails.allProducts);
app.get('/getAllProducts', prodDetails.getAllProducts);
app.get('/cartPage', cart.getCartPage);
app.get('/getCart', cart.getTheCart);
app.get('/userHome', users.getUserHome);
app.get('/userProfile',user.getUserProfile);
app.get('/payment', pay.checkout);
app.get('/logout', signin.logout);

app.post('/signin', signin.checkLogin);
app.post('/register', register.signup);
app.post('/userUpdate', user.updateUserProfile);
app.post('/addToCart', cart.addToCart);
app.post('/addToBidCart', prodDetails.addToBid);
app.post('/deleteFromCart', cart.deleteFromCart);
app.post('/product', prodDetails.addProduct);
app.post('/checkout', pay.validatePayment);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
