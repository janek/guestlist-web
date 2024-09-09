import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { Event } from '../types/Event';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface AddEventPopupProps {
  open: boolean;
  onClose: () => void;
  onAddEvent: (event: Omit<Event, 'id'>) => void;
}

export const AddEventPopup: React.FC<AddEventPopupProps> = ({ open, onClose, onAddEvent }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [pin, setPin] = useState<number | ''>('');

  const handleSubmit = () => {
    if (title && description && startTime && endTime && location && pin !== '') {
      onAddEvent({
        title,
        description,
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        location,
        image_url: imageUrl || undefined,
        pin: Number(pin),
      });
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Event</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Title"
          type="text"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Description"
          type="text"
          fullWidth
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            label="Start Time"
            value={startTime}
            onChange={(newValue) => setStartTime(newValue)}
          />
          <DateTimePicker
            label="End Time"
            value={endTime}
            onChange={(newValue) => setEndTime(newValue)}
          />
        </LocalizationProvider>
        <TextField
          margin="dense"
          label="Location"
          type="text"
          fullWidth
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Image URL"
          type="text"
          fullWidth
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Pin"
          type="number"
          fullWidth
          value={pin}
          onChange={(e) => setPin(e.target.value === '' ? '' : Number(e.target.value))}
          inputProps={{ min: 0 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>Add Event</Button>
      </DialogActions>
    </Dialog>
  );
};
