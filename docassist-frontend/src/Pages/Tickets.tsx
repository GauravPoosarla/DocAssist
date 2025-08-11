import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  IconButton, 
  Button, 
  Toolbar,
  Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import type { TicketData } from '../App';

type ChannelProps = {
  tickets: TicketData[];
  selectedTicket: TicketData | null;
  onSelect: (ticketId: string) => void;
  isFetching: boolean;
  isTicketFetching: boolean;
};

const statusColor = (status: string) => {
  switch (status) {
    case 'approved':
      return 'success';
    case 'processed':
      return 'default';
    case 'pending':
      return 'warning';
    case 'rejected':
      return 'error';
    default:
      return 'default';
  }
};

const Tickets: React.FC<ChannelProps> = ({
  tickets,
  selectedTicket,
  onSelect,
  isFetching,
  isTicketFetching,
}) => {
  
  return isFetching ? (
    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
      <Typography variant="h6">Fetching tickets...</Typography>
    </Box>
  ) : (
    <Box>
      <Toolbar sx={{backgroundColor: "#0747a6", borderRadius: '8px 8px 0 0'}} >
          <Typography variant="h6" sx={{ flexGrow: 1, color: 'white' }}>
            Tickets
          </Typography>
        </Toolbar>
        {(tickets || []).length ? (
            <List sx={{ overflowY: 'auto'}}>
        {tickets.map((ticket) => (
          <ListItem
            key={ticket.id}
            secondaryAction={
              <Chip
                  label={ticket.status}
                  color={statusColor(ticket.status)}
                  size="small"
                  sx={{ minWidth: 80, textTransform: 'capitalize', fontWeight: 500, borderRadius: '8px', padding: '8px 12px', }}
                />
            }
            sx={{ 
                ":hover" : !isTicketFetching ? { backgroundColor: '#ffffff', cursor: 'pointer' } : '', 
                padding:'6px 18px', 
                backgroundColor: selectedTicket?.id === ticket.id ? '#ffffff' : ''
            }}
            onClick={() => !isTicketFetching ? onSelect(ticket?.id) : null}
          >
            <ListItemText
                primary={ticket.title}
                primaryTypographyProps={{
                    sx: {
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '85%', // adjust width as needed
                    display: 'block',
                    }
                }}
            />
          </ListItem>
        ))}
      </List>
        ) : (
            <Typography align="center" variant="body1" color="text.secondary" gutterBottom>
                No Ticktes to show
            </Typography>
        )}
    </Box>
  );
};

export default Tickets;