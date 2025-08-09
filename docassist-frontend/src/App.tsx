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
import Channel from './Pages/Channel';
import Chat from './Pages/Chat';

export type ChannelData = {
    attachments: string[]
    description: string
    id: string
    status: string
    title: string
}

export const URL = 'http://127.0.0.1:5000/api'

export const ChannelsData = [
    { 
      attachments: ["test", "test2", "test3"],
      description: "feedback email flag is triggered for product feedback. Currently a flag is controlled in back office at SKU level to pass this into to CRMSince CRM already have logic on their end to filter products, its an overhead to maintain the flag in back officeso pls remove the flag from back office",
      id: "DOCASSIST-10",
      status: "pending",
      title: "Feedback email flag",
    },
]

function App() {
  const [channels, setChannels] = useState<ChannelData[]>(ChannelsData);
  const [selectedChannel, setSelectedChannel] = useState<ChannelData>(channels[0]);
  const [isFetching, setIstFetching] = useState<boolean>(true);
  const [isChannelFetching, setIsChannelFetching] = useState<boolean>(true);
  const [isChannelDeleting, setChannelDeleting] = useState(false)

  const setSelectedChannelState = (channel: ChannelData) => {
    setSelectedChannel(channel);
  }

  const getAllTickets = async () => {
    setIstFetching(true);
    setChannels(ChannelsData);
    getTicketById(ChannelsData[0]?.id)
    setIstFetching(false);
    // try {
    //   const response = await fetch(`${URL}/tickets/`);
    //   if (response.ok) {
    //     const data = await response.json();
    //     // setChannels(data?.data);
    //     setChannels(ChannelsData);
    //     // getTicketById(data?.data[0]?.id)
    //     getTicketById(ChannelsData[0]?.id)
    //   } else {
    //     console.error('Failed to fetch tickets');
    //   }
    // } catch (error) {
    //   console.error('Error fetching tickets:', error);
    // } finally {
    //   setIstFetching(false);
    // }
  }

  const getTicketById = async (id: string) => {
    setIsChannelFetching(true);
    setSelectedChannel(ChannelsData[0])
    setIsChannelFetching(false);
    // try {
    //   const response = await fetch(`${URL}/tickets/${id}`);
    //   if (response.ok) {
    //     const data = await response.json();
    //     // setSelectedChannel(data?.data[0])
    //     setSelectedChannel(ChannelsData[0])
    //   } else {
    //     console.error('Failed to fetch tickets');
    //   }
    // } catch (error) {
    //   console.error('Error fetching tickets:', error);
    // } finally {
    //   setIsChannelFetching(false);
    // }
  }

  useEffect(() => {
    getAllTickets();
  }, [])

  const getChannelDetails = (channel: ChannelData) => {
    if (channel.id !== selectedChannel.id) {
      getTicketById(channel?.id)
    }
  }

  useEffect(() => {
    if (isChannelDeleting){
      setIsChannelFetching(true);
      setTimeout(()=> {
        setIsChannelFetching(false);
        setChannelDeleting(false)
      }, (500))
    }
  }, [isChannelDeleting]);


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
              <Channel 
                selectedId={selectedChannel?.id} 
                onSelect={getChannelDetails} 
                isFetching={isFetching}
                setIsChannelFetching={setIsChannelFetching} 
                setSelectedChannel={setSelectedChannelState}
                setChannelDeleting={setChannelDeleting}
                channelsArray={channels}
               />
            </Typography>
          </Box>
          {/* Right 60% */}
          <Box flex="1" bgcolor="#f0f0f0" p={2} borderRadius={2} boxShadow={1}>
            <Typography variant="h5" gutterBottom>
              <Chat 
                channel={selectedChannel}
                isFetching={isFetching}
                isChannelFetching={isChannelFetching}
                channels={channels}
                setChannels={setChannels}
              />
            </Typography>
            {/* Add your right panel content here */}
          </Box>
        </Box>
      </Container>
    </>
  );
}

export default App;