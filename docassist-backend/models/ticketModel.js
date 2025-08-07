const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    ticket_id: {
        type: String,
        required: true
    },
    data: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: true
    }
},
{
    timestamps: true
});

const Ticket = mongoose.model('Ticket', ticketSchema);
module.exports = Ticket;