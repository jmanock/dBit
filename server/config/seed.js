'use strict';

var User = require('../api/user/user.model');
var Product = require('../api/product/product.model');
var Catalog = require('../api/catalog/catalog.model');
var mainCatalog, dogs, cats, other;

User
  .find({})
  .removeAsync()
  .then(function(){
    User.createAsync({
      provider:'local',
      name:'Test User',
      email:'test@test.com',
      password:'test'
    },{
      provider:'local',
      role:'admin',
      name:'Admin',
      email:'admin@admin.com',
      password:'admin'
    })
    .then(function(){
      console.log('finished populating users');
    });
  });

  Catalog
    .find({})
    .remove()
    .then(function(){
      return Catalog.create({name: 'All'});
    })
    .then(function(catalog){
      mainCatalog = catalog;
      return mainCatalog.addChild({name:'Dogs'});
    })
    .then(function(category){
      dogs = category._id;
      return mainCatalog.addChild({name:'Cats'});
    })
    .then(function(category){
      cats = category._id;
      return mainCatalog.addChild({name:'Other'});
    })
    .then(function(category){
      other = category._id;
      return Product.find({}).remove({});
    })
    .then(function(){
      return Product.create({
        title:'Fat Cat',
        imageUrl:'http://i.imgur.com/tRbuajy.jpg',
        price:2.59,
        stock:250,
        categories:[cats],
        description:'The perfect bite-sized toy'
      },{
        title:'Christmas Tree Sweter',
        imageUrl:'http://i.imgur.com/QHRV0ev.jpg',
        price:5.97,
        stock:100,
        description:'Let your dog steal the show at christmas'
      },{
        title: 'Begging Strips',
            imageUrl: 'http://i.imgur.com/Ki1nlIu.jpg',
            price: 9.34,
            stock: 100,
            categories: [dogs],
            description: 'Bacon ipsum dolor amet adipisicing adipisicing incididunt swine adipisicing shoulder mollit aute corned beef.'
        }, {
            title: 'Cat Thing',
            imageUrl: 'http://i.imgur.com/tRbuajy.jpg',
            price: 5.97,
            stock: 100,
            categories: [cats],
            description: 'The perfect bite-sized toy, Appeteasers will make every hour Happy Hour! Get ‘em while they’re hot!'
        }, {
            title: 'Dog thing',
            imageUrl: 'http://i.imgur.com/Ki1nlIu.jpg',
            price: 9.34,
            stock: 100,
            categories: [dogs],
            description: 'Bacon ipsum dolor amet adipisicing adipisicing incididunt swine adipisicing shoulder mollit aute corned beef.'
        }, {
            title: 'Another Cat Thing',
            imageUrl: 'http://i.imgur.com/tRbuajy.jpg',
            price: 5.97,
            stock: 100,
            categories: [cats],
            description: 'The perfect bite-sized toy, Appeteasers will make every hour Happy Hour! Get ‘em while they’re hot!'
        }, {
            title: 'Another dog thing',
            imageUrl: 'http://i.imgur.com/Ki1nlIu.jpg',
            price: 9.24,
            stock: 100,
            categories: [dogs],
            description: 'Bacon ipsum dolor amet adipisicing adipisicing incididunt swine adipisicing shoulder mollit aute corned beef.'
        }, {
            title: 'One More Cat Thingie',
            imageUrl: 'http://i.imgur.com/tRbuajy.jpg',
            price: 7.97,
            stock: 100,
            categories: [cats],
            description: 'The perfect bite-sized toy, Appeteasers will make every hour Happy Hour! Get ‘em while they’re hot!'
        }, {
            title: 'One more dog thing',
            imageUrl: 'http://i.imgur.com/Ki1nlIu.jpg',
            price: 9.34,
            stock: 100,
            categories: [dogs],
            description: 'Bacon ipsum dolor amet adipisicing adipisicing incididunt swine adipisicing shoulder mollit aute corned beef.'
        }, {
            title: 'XXCat Thing',
            imageUrl: 'http://i.imgur.com/tRbuajy.jpg',
            price: 5.44,
            stock: 100,
            categories: [cats],
            description: 'The perfect bite-sized toy, Appeteasers will make every hour Happy Hour! Get ‘em while they’re hot!'
        }, {
            title: 'KKDog thing',
            imageUrl: 'http://i.imgur.com/Ki1nlIu.jpg',
            price: 9.44,
            stock: 100,
            categories: [dogs],
            description: 'Bacon ipsum dolor amet adipisicing adipisicing incididunt swine adipisicing shoulder mollit aute corned beef.'
        }, {
            title: 'FFAnother Cat Thing',
            imageUrl: 'http://i.imgur.com/tRbuajy.jpg',
            price: 5.17,
            stock: 100,
            categories: [cats],
            description: 'The perfect bite-sized toy, Appeteasers will make every hour Happy Hour! Get ‘em while they’re hot!'
        }, {
            title: 'JJAnother dog thing',
            imageUrl: 'http://i.imgur.com/Ki1nlIu.jpg',
            price: 9.34,
            stock: 100,
            categories: [dogs],
            description: 'Bacon ipsum dolor amet adipisicing adipisicing incididunt swine adipisicing shoulder mollit aute corned beef.'
        }, {
            title: 'Yet Another Cat Thingie',
            imageUrl: 'http://i.imgur.com/tRbuajy.jpg',
            price: 4.97,
            stock: 100,
            categories: [cats],
            description: 'The perfect bite-sized toy, Appeteasers will make every hour Happy Hour! Get ‘em while they’re hot!'
        }, {
            title: 'DDOne more dog thing',
            imageUrl: 'http://i.imgur.com/Ki1nlIu.jpg',
            price: 9.34,
            stock: 100,
            categories: [dogs],
            description: 'Bacon ipsum dolor amet adipisicing adipisicing incididunt swine adipisicing shoulder mollit aute corned beef.'
      });
    })
    .then(function(){
      console.log('Finished populating products with catagories');
    })
    .then(null, function(err){
      console.error('Error populating Products and catagories ', err);
    });
