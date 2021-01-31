var mongoose = require('mongoose');
var Product = require('../modules/product');

var products = [ 
        new Product({
            imagepath: '/images/1_3_4.jpg',
            title: 'Gothic Video Game',
            description: 'Awesome Game!!!',
            price: 10
        }),
        new Product({
            imagepath: '/images/1_9.jpg',
            title: 'GTA 5 Game',
            description: 'Awesome Game!!!',
            price: 10
        }),
        new Product({
            imagepath: '/images/1_17.jpg',
            title: 'Crusder Game',
            description: 'Awesome Game!!!',
            price: 10
        }),
        new Product({
            imagepath: '/images/1_17_1.jpg',
            title: 'Balance Video Game',
            description: 'Awesome Game!!!',
            price: 10
        }),
        new Product({
            imagepath: '/images/2_9.jpg',
            title: 'Asphalt 8 Game',
            description: 'Awesome Game!!!',
            price: 10
        }),
        new Product({
            imagepath: '/images/2_16.jpg',
            title: 'Pubg Game',
            description: 'Awesome Game!!!',
            price: 10
        })
];

var done=0;
for(var i=0;i<products.length;i++)
{
    products[i].save(function(err,result){
        done++;
        if(done === products.length)
        {
            exit();
        }
    });
}

function exit()
{
    mongoose.disconnect();
}