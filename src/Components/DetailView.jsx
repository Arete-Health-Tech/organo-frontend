import { Box, Drawer, Stack } from '@mui/material'
import React from 'react'
import styles from "./style.module.css";
import dummyImage from "../../src/Assets/DummyImage.png";

const drawerWidth = 'auto';

const DetailView = ({ setDetails, details, setOpen, open }) => {

    return (
        <div>
            <>
                <Drawer
                    sx={{
                        position: 'relative',
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                            borderTopLeftRadius: '15px',
                            borderBottomLeftRadius: '15px'
                        }
                    }}
                    anchor="right"
                    open={open}
                    onClose={() => { setOpen(false); setDetails('') }}
                >
                    <Box>
                        <Stack>
                            {details ? details.Full_Name || details["Full Name"] : ""}
                            {details ? details.Personal_Mobile_Number ||
                                details["Personal Mobile Number"] : ""}
                            {details ? details.Is_Personal_Email ||
                                details["Is Personal Email"] : ""}
                        </Stack>
                    </Box>
                </Drawer>
            </>
        </div>
    );
}

export default DetailView
