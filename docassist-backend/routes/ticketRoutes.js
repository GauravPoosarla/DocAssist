const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const {get_tickets, create_tickets, get_ticket_by_id, update_document} = require("../controllers/ticketController");

router.get('/', get_tickets);
router.get('/:id', get_ticket_by_id);
router.post('/' , create_tickets);
router.post('/:ticket_id/:doc_id', update_document);
module.exports = router;
