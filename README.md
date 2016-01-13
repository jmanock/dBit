# Chewyshop
Chewyshop is a prototype of a full-stack JavaScript e-commerce app. This is a Single Page Application (SPA). Angular takes control of the one `index.html` file and manages the transitions and the different states in such a way that the user will feel like he/she is navigating through different pages.
[Live URL](https://chewy-shop.herokuapp.com/)

![product-page](http://i.imgur.com/ZmmYjgO.png) 

## User Stories
* [x] As a seller, I want to **create, edit and delete products**.
* [x] As a user, I want to **see all the published products and their details** when I click on them.
* [x] As a user, I want to **search for a product** so that I can find what I'm looking for quickly.
* [x] As a user, I want to have a **category navigation menu** so that I can narrow down the search results.
 
## Install locally
### Prerequisites

- [Node.js and NPM](nodejs.org) >= v0.12.0
- [Bower](bower.io) (`npm install --global bower`)
- [Ruby](https://www.ruby-lang.org) and then `gem install sass`
- [Grunt](http://gruntjs.com/) (`npm install --global grunt-cli`)
- [MongoDB](https://www.mongodb.org/) - Keep a running daemon with `mongod`

### Run the app
1. Run `npm install` to install server dependencies.
2. Run `bower install` to install front-end dependencies.
3. Run `mongod` in a separate shell to keep an instance of the MongoDB Daemon running
4. Run `grunt serve` to start the development server. It should automatically open the client in your browser when ready.

### Create a production build
Run `grunt build` after steps above.

## SASS
I love using SASS on any project, it allows me to write cleaner and better CSS. I extended/customized Bootstrap using BEM/OOCSS concepts and feel [Harry Roberts](http://csswizardry.com/) is a great advocate for this approach. 

### Customizing Bootstrap
While the easiest approach is to override Bootstrap's styles using CSS (not SASS), i.e. duplicating a Bootstrap class with your custom properties, it's not ideal because the extra classes are tacked on to the Bootstrap stylesheet (bigger file size).

A better approach is to assign your own values to Bootstrap's variables _in a separate file_. So when BS is inevitably updated with bug fixes and new features, disentangling your customizations and updating them to the new version won't be a problem.

## Grunt
Grunt.js does all the powerful work in this project.

* Delete all files in build folder, [see](https://github.com/gruntjs/grunt-contrib-clean)
* Uglify and combine JS, [see](https://github.com/gruntjs/grunt-contrib-uglify)
* Process SASS files, [see](https://github.com/gruntjs/grunt-contrib-sass)
* Minify CSS, [see](https://github.com/gruntjs/grunt-contrib-cssmin)
* Compress image files, [see](https://github.com/gruntjs/grunt-contrib-imagemin)
* Copy files, [see](https://github.com/gruntjs/grunt-contrib-copy)
* Watch for changes and re-run, [see](https://github.com/gruntjs/grunt-contrib-watch)
* and more

### TODOs
https://github.com/fab9/chewyshop/issues

Other notes:
This project was scaffolded with the [Angular Full-Stack Generator](https://github.com/DaftMonk/generator-angular-fullstack) version 3.0.0-rc4.
