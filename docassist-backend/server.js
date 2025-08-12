const express = require('express');
const cron = require('node-cron');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

dotenv.config();

const { fetchAndStoreJiraTickets } = require('./cron/fetchJiraTickets');
const { processPendingTickets } = require('./cron/processTickets');
const {fetchAndStoreConfluenceDocs} = require('./cron/fetchConfluenceDocs');

const ticketsRoute = require('./routes/ticketRoutes');
const documentRoute = require('./routes/documentRoutes');

const db = process.env.DB_URL;
mongoose.connect(db).then(()=> console.log('db is connected')).catch(err => console.log('unable to connect db'));
const app = express();
app.use(cors());

app.use(express.json());

app.use('/api/tickets', ticketsRoute);
app.use('/api/documents', documentRoute);


cron.schedule('*/2 * * * *', async () => {
  try {
    console.log("Fetch Jira cron started");
    await fetchAndStoreJiraTickets();
    console.log("Jira tickets fetch cron completed");
  } catch (err) {
    console.error("Jira fetch cron failed:", err.message);
  }
}); 


// app.get('/api/jira/fetch', async (req,res) => {
//   let tickets = await fetchAndStoreJiraTickets();
//   return res.status(200).json({
//     status: 'success',
//     data: tickets
//   })
// })


// app.get('/api/jira/process', async (req,res) => {
//   let tickets = await processPendingTickets();
//   return res.status(200).json({
//     status: 'success',
//     data: tickets
//   })
// })

cron.schedule('*/3 * * * *', async () => {
  try {
    console.log("Process Jira cron started");
    await processPendingTickets();
    console.log("LLM processing cron completed");
  } catch (err) {
    console.error("LLM processing cron failed:", err.message);
  }
});

cron.schedule('*/2 * * * *', async () => {
  try {
    console.log("Document fetch cron started");
    await fetchAndStoreConfluenceDocs();
    console.log("Documents fetch cron completed");
  } catch (err) {
    console.error("Documents fetch cron failed:", err.message);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
