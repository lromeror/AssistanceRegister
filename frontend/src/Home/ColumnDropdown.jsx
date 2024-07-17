import React from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

export default function ColumnDropdown({ column, options }) {
    const [selectedOption, setSelectedOption] = React.useState('');

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    return (
        <Grid item xs={12} sm={6}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '10px' }}>{column}:</span>
                <TextField
                    select
                    label="Seleccionar"
                    value={selectedOption}
                    onChange={handleOptionChange}
                    fullWidth
                >
                    {options.map((option, index) => (
                        <MenuItem key={index} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
            </div>
        </Grid>
    );
}
