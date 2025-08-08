const express = require('express');
const cron = require('node-cron');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const { fetchAndStoreJiraTickets } = require('./cron/fetchJiraTickets');
const { processPendingTickets } = require('./cron/processTickets');

const ticketsRoute = require('./routes/ticketRoutes');
const notionRoute = require('./routes/notionRoutes');

const db = process.env.DB_URL;
mongoose.connect(db).then(()=> console.log('db is connected')).catch(err => console.log('unable to connect db'));
const app = express();
app.use(express.json());

app.use('/api/tickets', ticketsRoute);
app.use('/api/notion', notionRoute);

cron.schedule('*/2 * * * *', async () => {
  try {
    await fetchAndStoreJiraTickets();
    console.log("Jira tickets fetch cron completed");
  } catch (err) {
    console.error("Jira fetch cron failed:", err.message);
  }
});

cron.schedule('*/3 * * * *', async () => {
  try {
    await processPendingTickets();
    console.log("LLM processing cron completed");
  } catch (err) {
    console.error("LLM processing cron failed:", err.message);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
