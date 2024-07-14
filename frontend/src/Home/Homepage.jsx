import React, { useState } from 'react';
import Header from './../Sistem/Header';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from './Card';
import './Styles/Home.css';
import Newdata from "./../Home/NewData";
import Data from "./../Home/Data";

export default function Homepage() {
    const [active, setActive] = useState(0);

    const changeActive = (active_number) => {
        setActive(active_number);
    }

    let content;

    switch (active) {
        case 1:
            content = <Newdata />;
            break;
        case 2:
            content = <Data />;
            break;
        default:
            content = <></>;
    }

    return (
        <Container>
            <Header />
            <Container className='mt-50'>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={6} className='center'>
                        <Card id={1} onClick={() => changeActive(1)} />
                    </Grid>
                    <Grid item xs={6} className='center'>
                        <Card id={2} onClick={() => changeActive(2)} />
                    </Grid>
                </Grid>
            </Container>
            <Container className='mt-50'>
                {content}
            </Container>
        </Container>
    );
}
