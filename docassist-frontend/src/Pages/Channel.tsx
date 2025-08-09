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
import type { ChannelData } from '../App';

type ChannelProps = {
  selectedId: string;
  onSelect: (channel: ChannelData) => void;
  isFetching: boolean;
  setSelectedChannel: (channel: ChannelData) => void;
  setIsChannelFetching: (isFetching: boolean) => void;
  setChannelDeleting: (isDeleting: boolean) => void
  channelsArray: ChannelData[];
};

const Channel: React.FC<ChannelProps> = ({ selectedId, onSelect, isFetching, setSelectedChannel, setChannelDeleting, channelsArray }) => {
  const [channels, setChannels] = useState<ChannelData[]>(channelsArray);

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

useEffect(() => {
    setChannels(channelsArray);
}, [channelsArray.length]);

  return isFetching ? (
    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
      <Typography variant="h6">Fetching channels...</Typography>
    </Box>
  ) : (
    <Box>
      <Toolbar sx={{backgroundColor: "#0747a6", borderRadius: '8px 8px 0 0'}} >
          <Typography variant="h6" sx={{ flexGrow: 1, color: 'white' }}>
            Tickets
          </Typography>
        </Toolbar>
        {(channels || []).length ? (
            <List sx={{ overflowY: 'auto'}}>
        {channels.map((channel) => (
          <ListItem
            key={channel.id}
            secondaryAction={
            //   <IconButton edge="end" onClick={(e) => {
            //     e.preventDefault();
            //     e.stopPropagation();
            //     handleDelete(channel.id)}
            //   } 
            //   >
            //     <DeleteIcon />
            //   </IconButton>
              <Chip
                  label={channel.status}
                  color={statusColor(channel.status)}
                  size="small"
                  sx={{ minWidth: 80, textTransform: 'capitalize', fontWeight: 500, borderRadius: '8px', padding: '8px 12px', }}
                />
            }
            sx={{ 
                ":hover" : { backgroundColor: '#ffffff', cursor: 'pointer' }, 
                padding:'6px 18px', 
                backgroundColor: selectedId === channel.id ? '#ffffff' : ''
            }}
            onClick={() => onSelect(channel)}
          >
            <ListItemText
                primary={channel.title}
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

export default Channel;