import React, { useEffect, useState } from 'react';
import { URL, type SuggestedDoc, type TicketData } from '../App';
import { Badge, Box, Button, CircularProgress, FormControl, FormLabel, Stack, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from '@mui/material';
import { Person } from '@mui/icons-material';

type ChatProps = {
  ticket: any;
  ticketDocs: SuggestedDoc[] | null;
  isFetching: boolean;
  isTicketFetching: boolean;
  tickets: TicketData[];
  setTickets: (tickets: TicketData[]) => void;
};

const userNames = ['John Doe', 'Jane Smith', 'Alice Johnson'];

const Chat: React.FC<ChatProps> = ({
  ticket,
  ticketDocs,
  isFetching,
  isTicketFetching,
  tickets,
  setTickets,
}) => {
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);
    const [approved, setApproved] = useState<boolean>(false);
    const [selectedDoc, setSelectedDoc] = useState<SuggestedDoc | null>(null);

    useEffect(() => {
        setApproved(ticket?.status === 'approved');
        // setSelectedDoc(ticketDocs[0] || '');
    }, [ticket?.id])

    const handleCopySummary = () => {
        if (ticket?.ai?.summary) {
            navigator.clipboard.writeText(ticket?.ai?.summary)
            .then(() => {
                alert('Summary copied!');
            })
        }
    };

    const selecteAttachment = (doc: string) => {
        if (selectedDoc?.id !== doc) {
            const foundDoc: any = ticketDocs?.find(_ => _.id === doc)
            setSelectedDoc(foundDoc);
        }
    }

    const handleApprove = async () => {
        if (!approved) {
            setButtonLoading(true);
            // setTimeout(()=> {
            //     setApproved(true);
            //     const filteredTickets: any = tickets.map((_) => {
            //         if(_.id === ticket.id) return {..._, status: 'approved'}
            //         else return _
            //     })
            //     setTickets(filteredTickets);
            //     setButtonLoading(false);
            // }, (2000))
            try {
                const response = await fetch(`${URL}/tickets//${ticket?.id}/${selectedDoc?.id}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                });
                if (response.ok) {
                    setApproved(true);
                    const filteredTickets: any = tickets.map((_) => {
                        if(_.id === ticket.id) return {..._, status: 'approved'}
                        else return _
                    })
                    setTickets(filteredTickets);
                } else {
                    alert('Approval failed');
                }
            } catch (error) {
                alert('Approval failed');
            } finally{
                setButtonLoading(false);
            }
        }
    };

    return (
        <>
        {ticket?.id ? (
            <Box sx={{ py: 3 }}>
                <Box sx={{ py: 3, justifyContent: 'space-between', display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h5" gutterBottom>
                    {ticket.title}
                    </Typography>
                    <Tooltip
                        title={
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {userNames.map((name, index) => (
                                    <Typography variant="caption" color="inherit" key={index}>
                                        {name}
                                    </Typography>
                                ))}
                            </Box>
                        }
                        placement="bottom-end"
                        arrow
                        sx={{ backgroundColor: 'transparent', height: '50px', width: '50px', fontSize: 'large', padding: '8px'  }}
                    >
                        <Badge badgeContent={'2'} color="primary" max={99} sx={{ cursor: 'pointer' }}>
                            <Person color="action" fontSize='large' />
                        </Badge>
                    </Tooltip>
                </Box>

                <Typography variant="body1" color="text.secondary" gutterBottom>
                    {ticket?.ai?.summary || "No AI suggested summary available."}
                </Typography>
                {Array.isArray(ticketDocs) && (ticketDocs || [])?.length > 0 && (
                    <FormControl component="fieldset" sx={{ my: 2, width: '100%' }}>
                    <FormLabel component="legend" sx={{mb: 2}}>AI suggested Documents</FormLabel>
                    <ToggleButtonGroup
                        value={selectedDoc?.id}
                        orientation="vertical"
                        exclusive
                        onChange={(e: any) => selecteAttachment(e.target.value)}
                        aria-label="radio group"
                        sx={{width: '60%', marginTop: '12 px'}}
                        >
                            {ticketDocs.map((doc, idx) => (
                            <ToggleButton 
                                key={idx}
                                sx={{ 
                                    backgroundColor: selectedDoc?.id === doc?.id ? '#0747a6' :'transparent',
                                    color: selectedDoc?.id === doc?.id ? '#ffffff' : '#000000',
                                    borderRadius: '8px',
                                    ":hover": {
                                        backgroundColor: selectedDoc?.id === doc?.id ? '#0747a6' :'transparent',
                                        color: selectedDoc?.id === doc?.id ? '#ffffff' : '#000000',
                                    }
                                }}
                                value={doc?.id}
                            >
                                {doc?.title}
                            </ToggleButton>
                        ))}
                        </ToggleButtonGroup>
                    </FormControl>
                )}
                <Stack direction="row" spacing={2}  sx={{ mt: 2 }}>
                <Button variant="outlined" onClick={handleCopySummary}>
                    Copy Summary
                </Button>
                <Button
                    variant="contained"
                    color={approved ? "success" : "primary"}
                    onClick={handleApprove}
                    disabled={buttonLoading || !selectedDoc?.id}
                    startIcon={buttonLoading ? <CircularProgress size={20} color="inherit" /> : null}
                >
                    {approved ? "Approved" : "Approve"}
                </Button>
                </Stack>
            </Box>              
        ): (
            <Typography align="center" variant="body1" color="text.secondary" gutterBottom>
            No data to show
            </Typography>
        )}
        </>
    );
};

export default Chat;