var express = require('express');
var router = express.Router();
var Product = require('../modules/product');
var Order = require('../modules/order');
var Cart = require('../modules/cart');
require('dotenv').config();

/* GET home page. */
router.get('/', function(req, res, next) {
  var successMsg = req.flash('success')[0];
  Product.find(function(err,docs){

    res.render('layout', { title: 'Shopping Cart', products:docs,successMsg: successMsg,noMessages: !successMsg });
  });
});

router.get('/add-to-cart/:id',function(req,res,next){
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    Product.findById(productId, function(err,product){
        if(err)
        {
          return res.redirect('/');
        }
        cart.add(product,product.id);
        req.session.cart = cart;
        res.redirect('/');
    });
});

router.get('/reduce/:id',function(req,res,next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/remove/:id',function(req,res,next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

router.get('/shopping-cart',function(req,res,next){
  
    if(!req.session.cart)
    {
      return res.render('shopping-cart',{title: 'Shopping Cart',products:null});
    }
    var cart = new Cart(req.session.cart);
    res.render('shopping-cart', {title: 'Shopping Cart',products: cart.generateArray(),totalPrice: cart.totalPrice});
});

router.get('/checkout',isLoggedIn,function(req,res,next){
  if(!req.session.cart)
  {
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
  var errMsg = req.flash('error')[0];
  res.render('checkout',{title: 'Shopping Cart',total: cart.totalPrice,errMsg: errMsg,noError: !errMsg});
});

router.post('/checkout',isLoggedIn,function(req,res,next){
  if(!req.session.cart)
  {
    return res.redirect('/shopping-cart');
  }
  var cart = new Cart(req.session.cart);
    var stripe = require('stripe')(
      'sk_test_gyPtvvxfSjicJAMob835lmxT00V10jNLZb'
    );

    stripe.charges.create({
        shipping: {
          name: 'chitraket savani',
          address: {
            line1: '510 Townsend St',
            postal_code: '98140',
            city: 'San Francisco',
            state: 'GJ',
            country: 'IN',
          },
        },
        amount:cart.totalPrice * 100,
        currency: "inr",
        source: req.body.stripeToken,
        description: "My First Test Charge (created for API docs)"
    },function(err,charge){
        if(err){
          req.flash('error',err.message);
          return res.redirect('/checkout');
        }

        var order = new Order({
            user: req.user,
            cart: cart,
            address: req.body.address,
            name: req.body.name,
            paymentId: charge.id
        });

        order.save(function(err,result){
          req.flash('success','Successfully bought product!');
          req.session.cart = null;
          res.redirect('/');
        });
    });
});

module.exports = router;

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  req.session.oldUrl = req.url;
  res.redirect('/users/signin');
}