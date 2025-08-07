const express = require('express');
const cron = require('node-cron');
const dotenv = require('dotenv');

dotenv.config();

const fetchTickets = require('./cron/fetchTickets');
const { fetchIssues } = require('./services/githubService');
const processPendingTickets = require('./cron/processTickets');

const ticketsRoute = require('./routes/tickets');
const notionRoute = require('./routes/notion');

const app = express();
app.use(express.json());

app.use('/api/tickets', ticketsRoute);
app.use('/api/notion', notionRoute);

cron.schedule('*/2 * * * *', fetchTickets);
cron.schedule('*/3 * * * *', processPendingTickets);
cron.schedule('*/5 * * * *', fetchIssues);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
