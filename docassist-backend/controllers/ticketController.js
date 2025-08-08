const Ticket = require("../models/ticketModel");
const fs = require('fs');

exports.create_tickets = async (req, res) => {
    try{
        await Ticket.create(req.body);
        return res.status(200).json({
            status: 'success',
            message: 'Ticket data from jira stored successfully'
        })
    }catch(err){
        return res.status(500).json({
            status: 'fail',
            message: 'Internal server error',
            Error: err
        })
    }
}

exports.get_tickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({status: {$ne: 'pending'}});
    return res.status(200).json({
      status: 'success',
      data: tickets
    });
  } catch (err) {
    return res.status(500).json({
        status: 'fail',
        message: 'Internal server error',
        Error: err
    })
  }
}

exports.get_ticket_by_id = async (req,res) => {
  try{
    const id = req.params.id;
    const ticket = await Ticket.find({id});
    return res.status(200).json({
      status: 'success',
      data: ticket
    });
  }catch(err){
    return res.status(500).json({
        status: 'fail',
        message: 'Internal server error',
        Error: err
    })
  }
}
