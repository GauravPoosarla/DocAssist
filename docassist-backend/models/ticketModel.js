const mongoose = require('mongoose');

const aiSchema = new mongoose.Schema({
    type: String,
    summary: String,
    doc_suggesstion: Array,
    keywords: Array,
    service: String,
    impact_location: String,
    is_permanent: String
});

const ticketSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: false
    },
    attachments: {
        type: Array,
        required: false
    },
    comments: {
        type: Array,
        required: false
    },
    jira_status: {
        type: String,
        required: false
    },
    type: {
        type: String,
        required: false
    },
    ai: aiSchema
},
{
    timestamps: true
});

const Ticket = mongoose.model('Ticket', ticketSchema);
module.exports = Ticket;