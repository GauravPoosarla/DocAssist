const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
    id: String,
    title: String,
    summary: String    
});

const Document = mongoose.model(Document, documentSchema);
module.exports = Document;