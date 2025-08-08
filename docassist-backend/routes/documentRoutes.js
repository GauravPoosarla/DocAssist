const express = require('express');
const router = express.Router();
const {get_documents, create_documents} = require("../controllers/documentController");

router.get('/', get_documents);

router.post('/' , create_documents);

module.exports = router;
