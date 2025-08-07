const Ticket = require("../models/ticketModel");

exports.create_ticket = async (req, res) => {
    let ticket = {
        ticket_id: 'JIRA-02',
        data: "Unprocessed data",
        status: "Unprocessed"
    }
    try{
        await Ticket.create(ticket);
        return res.status(200).json({
            status: 'success',
            message: 'Ticket data from jira stored successfully'
        })
    }catch(err){
        throw err;
    }
}

exports.get_ticket = async (req, res) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    // const tickets = JSON.parse(data);
    const tickets = await Ticket.find({"ticket_id": "JIRA-01"});
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
