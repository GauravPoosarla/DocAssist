const Ticket = require("../models/ticketModel");
const fs = require('fs');

exports.create_ticket = async (req, res) => {
    let ticket = [{
        id: 'JIRA-03',
        // data: "Unprocessed data",
        status: 123,
        ai: {type: "hello"}
    },
    {
        id: 'JIRA-04',
        // data: "Unprocessed data",
        status: "Unprocessed",
        ai:{
          type: "hello world"
        }
    }]

    try{
        await Ticket.create(ticket);
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
    // const data = fs.readFileSync(filePath, 'utf8');
    // const tickets = JSON.parse(data);
    const tickets = await Ticket.find();
    return res.status(200).json({
      status: 'success',
      data: tickets
    });
    // res.json(tickets);
  } catch (err) {
    console.error("Failed to read tickets.json", err);
    res.status(500).json({ error: "Unable to read tickets." });
  }
}
