const Document = require("../models/documentModel");

exports.create_documents = async (req,res) => {  
    try{
        await Document.create(req.body);
        return res.status(200).json({
            status: 'success',
            message: 'Document data from confluence stored successfully'
        })
    }catch(err){
        return res.status(500).json({
            status: 'fail',
            message: 'Internal server error',
            Error: err
        })
    }
}

exports.get_documents = async (req,res) => {
    try{
        const tickets = await Document.find({status: {$ne: 'pending'}});
        return res.status(200).json({
            status: 'success',
            data: tickets
        });
    }catch(err){
        return res.status(500).json({
            status: 'fail',
            message: 'Internal server error',
            Error: err
        })
    }
}