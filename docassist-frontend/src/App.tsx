import React, { useEffect, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Container,
  Box,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import Tickets from './Pages/Tickets';
import Chat from './Pages/Chat';
import ticketsData from './data/tickets';
import ticketData from './data/ticket';

export type TicketData = {
    attachments: string[]
    description: string
    id: string
    status: string
    title: string
    comments: string[]
    ai: any;
}

export type SuggestedDoc = {
  id: string;
  link: string;
  title: string;
}

export type TicketRes = {
  status: string;
  suggested_docs: SuggestedDoc[];
  ticket: TicketData
}


export const URL = 'http://127.0.0.1:5000/api'

function App() {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<TicketData| null>(null);
  const [selectedTicketDocs, setSelectedTicketDocs] = useState<SuggestedDoc| null>(null);
  const [isFetching, setIstFetching] = useState<boolean>(true);
  const [isTicketFetching, setIsTicketFetching] = useState<boolean>(true);

  const getAllTickets = async () => {
    // setIstFetching(true);
    // const data = ticketsData;
    // setTickets(data?.data);
    // getTicketById(data?.data[0]?.id)
    // setIstFetching(false);
    try {
      const response = await fetch(`${URL}/tickets/`);
      if (response.ok) {
        const data = await response.json();
        setTickets(data?.data);
        getTicketById(data?.data[0]?.id)
      } else {
        console.error('Failed to fetch tickets');
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setIstFetching(false);
    }
  }

  const getTicketById = async (id: string) => {
    if (id !== selectedTicket?.id) {
      setIsTicketFetching(true);
      // setSelectedTicket(ticketData?.ticket)
      // setSelectedTicketDocs(ticketData?.suggested_docs)
      // setIsTicketFetching(false);
      try {
        const response = await fetch(`${URL}/tickets/${id}`);
        if (response.ok) {
          const data = await response.json();
          setSelectedTicket(data?.ticket)
          setSelectedTicketDocs(data?.suggested_docs[0])
          // setSelectedChannel(ChannelsData[0])
        } else {
          console.error('Failed to fetch tickets');
        }
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setIsTicketFetching(false);
      }
    }
  }

  useEffect(() => {
    getAllTickets();
  }, [])
  

  return (
    <>
      <CssBaseline />
      <Backdrop
        open={isFetching}
        sx={{
          color: '#0747a6',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(0,0,0,0.4)', // 40% overlay
        }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <AppBar position="static">
        <Toolbar sx={{backgroundColor: "#0747a6"}}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            DocAssist
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="false" sx={{ mt: 4 }}>
        <Box display="flex" height="80vh" gap={2}>
          <Box flex="0 0 40%" bgcolor="#f4f5f7" borderRadius={2}>
            <Typography variant="h5" gutterBottom>
              <Tickets
                tickets={tickets}
                selectedTicket={selectedTicket}
                onSelect={getTicketById}
                isFetching={isFetching}
               />
            </Typography>
          </Box>
          <Box flex="1" bgcolor="#f0f0f0" p={2} borderRadius={2} boxShadow={1}>
            <Typography variant="h5" gutterBottom>
              <Container>
                {!isFetching && !isTicketFetching&& tickets.length > 0 ? (
                        <Chat 
                          ticket={selectedTicket}
                          ticketDocs={selectedTicketDocs}
                          isFetching={isFetching}
                          isTicketFetching={isTicketFetching}
                          tickets={tickets}
                          setTickets={setTickets}
                        />
                ): (
                  <>
                  {isTicketFetching ? (
                    <Typography align="center" sx={{ py: 3 }} variant="h6">
                        Fetching ticket details...
                    </Typography>
                  ) : (
                    <Typography align="center" sx={{ py: 3 }} variant="h6">
                      Looks like there's nothing here just yet..
                    </Typography>
                  )}
                  </>
                )}
                      </Container>              
            </Typography>
            {/* Add your right panel content here */}
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default App;