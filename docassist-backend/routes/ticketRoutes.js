const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const Ticket = require("../models/ticketModel");
const {get_ticket, create_ticket} = require("../controllers/ticketController");

const filePath = path.join(__dirname, '../data/tickets.json');

router.get('/', get_ticket);

router.post('/' , create_ticket);

module.exports = router;
