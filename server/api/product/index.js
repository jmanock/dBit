'use strict';

var express = require('express');
var controller = require('./product.controller');
var multiparty = require('connect-multiparty');
// For now, store the files locally, not in the cloud.
var uploadOptions = { autoFile: true,
    uploadDir: 'client/assets/uploads/'
};

var router = express.Router();

router.post('/:id/upload', multiparty(uploadOptions), controller.upload);
router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/:slug/catalog', controller.catalog);
router.get('/:term/search', controller.search);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
