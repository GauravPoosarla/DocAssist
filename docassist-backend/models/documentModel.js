const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
    id: String,
    title: String,
    link: String,
    summary: String    
});

const Document = mongoose.model("Document", documentSchema);
module.exports = Document;