import React, { useEffect, useState } from 'react';
import type { ChannelData } from '../App';
import { Badge, Box, Button, CircularProgress, Container, FormControl, FormLabel, Stack, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from '@mui/material';
import { Person, Person2Outlined, PersonPinCircleRounded, PersonPinCircleTwoTone } from '@mui/icons-material';

type ChatProps = {
  channel: ChannelData;
  isFetching: boolean;
  isChannelFetching: boolean;
  channels: ChannelData[]
  setChannels: (channels: ChannelData) => void;
};

const userNames = ['John Doe', 'Jane Smith', 'Alice Johnson'];

const Chat: React.FC<ChatProps> = ({ channel, isFetching, isChannelFetching, channels, setChannels }) => {
    const [buttonLoading, setButtonLoading] = useState<boolean>(false);
    const [approved, setApproved] = useState<boolean>(false);
    const [selectedAttachment, setSelectedAttachment] = useState<string>(channel?.attachments[0] || '');

    useEffect(() => {
        setApproved(channel?.status === 'approved');
        setSelectedAttachment(channel?.attachments[0] || '');
    }, [channel?.id])

    const handleCopySummary = () => {
        if (channel.description) {
            navigator.clipboard.writeText(channel.description)
            .then(() => {
                alert('Summary copied!');
            })
        }
    };

    const selecteAttachment = (attachment: string) => {
        if (attachment !== selectedAttachment) {
            setSelectedAttachment(attachment);
        }
    }

    const handleApprove = async () => {
        if (!approved) {
            setButtonLoading(true);
            setTimeout(()=> {
                setApproved(true);
                const filteredChannels: any = channels.map((_) => {
                    if(_.id === channel.id) return {..._, status: 'approved'}
                    else return _
                })
                setChannels(filteredChannels);
                setButtonLoading(false);
            }, (2000))
        }
        // try {
        //     const response = await fetch('/api/tickets/approve', {
        //         method: 'POST',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify({ id: channel.id, desc: channel.desc }),
        //     });
        //     if (response.ok) {
        //         setApproved(true);
        //     } else {
        //         alert('Approval failed');
        //     }
        // } catch (error) {
        //     alert('Approval failed');
        // }
        // setButtonLoading(false);
    };

    return (
      <Container>
        {isFetching ? (
          <Typography align="center" sx={{ py: 3 }} variant="h6">
            Looks like there's nothing here just yet..
          </Typography>
        ) : (
            <>
            {isChannelFetching ? (
                <Typography align="center" sx={{ py: 3 }} variant="h6">
                    Fetching channel details...
                </Typography>
                ) : (
                    <>
                    {channel?.id ? (
                        <Box sx={{ py: 3 }}>
                            <Box sx={{ py: 3, justifyContent: 'space-between', display: 'flex', alignItems: 'center' }}>
                                <Typography variant="h5" gutterBottom>
                                {channel.title}
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
                            {channel.description || "No description available."}
                            </Typography>
                            {Array.isArray(channel.attachments) && channel.attachments.length > 0 && (
                              <FormControl component="fieldset" sx={{ my: 2, width: '100%' }}>
                                <FormLabel component="legend" sx={{mb: 2}}>Attachments</FormLabel>
                                {/* <RadioGroup
                                  value={selectedAttachment}
                                  onChange={e => setSelectedAttachment(e.target.value)}
                                >
                                  {channel.attachments.map((att, idx) => (
                                    <FormControlLabel
                                      key={idx}
                                      value={att}
                                      control={<Radio />}
                                      label={att}
                                    />
                                  ))}
                                </RadioGroup> */}
                                <ToggleButtonGroup
                                    value={selectedAttachment}
                                    orientation="vertical"
                                    exclusive
                                    onChange={(e: any) => selecteAttachment(e.target.value)}
                                    aria-label="radio group"
                                    sx={{width: '60%', marginTop: '12 px'}}
                                    >
                                        {channel.attachments.map((att, idx) => (
                                        <ToggleButton 
                                            key={idx}
                                            sx={{ 
                                                backgroundColor: selectedAttachment === att ? '#0747a6' :'transparent',
                                                color: selectedAttachment === att ? '#ffffff' : '#000000',
                                                borderRadius: '8px',
                                                ":hover": {
                                                    backgroundColor: selectedAttachment === att ? '#0747a6' :'transparent',
                                                    color: selectedAttachment === att ? '#ffffff' : '#000000',
                                                }
                                            }}
                                            value={att}
                                        >
                                            {att}
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
                                disabled={buttonLoading}
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
            )}
            </>
        )}
      </Container>
    );
};

export default Chat;