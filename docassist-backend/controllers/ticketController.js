const Ticket = require("../models/ticketModel");
const {findRelevantDocsForTicket} = require("../services/llmService");
const {updateConfluencePageWithTicket, fetchConfluencePages} = require("../services/confluenceService");

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
    const rel_docs = await findRelevantDocsForTicket(ticket[0]);
    return res.status(200).json({
      status: 'success',
      ticket,
      rel_docs
    });
  }catch(err){
    return res.status(500).json({
        status: 'fail',
        message: 'Internal server error',
        Error: err
    })
  }
}

exports.update_document = async (req, res) => {
  try{
    const {ticket_id, doc_id} = req.params;
    const ticket = await Ticket.find({id: ticket_id});
    const config = {
      domain: process.env.CONFLUENCE_DOMAIN,
      email: process.env.CONFLUENCE_EMAIL,
      apiToken: process.env.CONFLUENCE_API_TOKEN,
      spaceKey: process.env.CONFLUENCE_SPACE_KEY
    };

    await updateConfluencePageWithTicket(config, doc_id, ticket[0]);
    return res.status(200).json({
      status: 'success',
      message: 'document updated successfully'
    });
  }catch(err){
    return res.status(500).json({
      status: 'fail',
      message: 'Internal server error',
      err
    })
  }
}
