const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const {get_tickets, create_tickets, get_ticket_by_id} = require("../controllers/ticketController");

router.get('/', get_tickets);
router.get('/:id', get_ticket_by_id);
router.post('/' , create_tickets);

module.exports = router;
