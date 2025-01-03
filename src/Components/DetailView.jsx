import { Box, Drawer, Stack } from '@mui/material'
import React from 'react'
import styles from "./style.module.css";
import dummyImage from "../../src/Assets/DummyImage.png";
import MenProfile from '../Assets/profile.png';
import WomanProfile from '../Assets/woman.png'


const drawerWidth = 'auto';

const DetailView = ({ setDetails, details, setOpen, open }) => {

    return (
       
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
                    <Box className={styles.employee_container}>
                        <Stack className={ styles.employee_heading }>Employee Information</Stack>
                        <Stack>
                            {details && <Stack className={styles.employee_image}>
                                { details.Gender == "Male" ? <img src={MenProfile} alt="MenProfile/>" /> : <img src={WomanProfile} alt="WomanProfile" /> }
                            </Stack>}
                        </Stack>
                        <Stack className={ styles.employee_content }>
                            <Stack className={ styles._layout }>
                                <Stack className={styles.title_text}>Name</Stack>
                                 <Stack className={styles.title_detail}>{details ? details.Full_Name || details["Full Name"] : ""}</Stack>
                        </Stack>
                         <Stack className={ styles._layout }>
                                <Stack className={styles.title_text}>Employee Id</Stack>
                                 <Stack className={styles.title_detail}>{details ? details.Employee_ID || details["Employee ID"] : ""}</Stack>
                        </Stack>
                         {details &&  <Stack className={ styles._layout }>
                                <Stack className={styles.title_text}>Location</Stack>
                                 <Stack className={styles.title_detail}>{ details.Location}</Stack>
                        </Stack> }
                        {/* Date of Joining */ }
                         <Stack className={ styles._layout }>
                                <Stack className={styles.title_text}>Date of Joining</Stack>
                                 <Stack className={styles.title_detail}>{details ? details.Date_of_Joining || details["Date of Joining"] : ""}</Stack>
                        </Stack>

                          {details &&  <Stack className={ styles._layout }>
                                <Stack className={styles.title_text}>Designation</Stack>
                                 <Stack  className={styles.title_detail}>{ details.Designation}</Stack>
                        </Stack> }
                        {details &&  <Stack className={ styles._layout }>
                                <Stack className={styles.title_text}>Department</Stack>
                                 <Stack  className={styles.title_detail}>{ details.Department}</Stack>
                        </Stack> }
                        
                         {details &&  <Stack className={ styles._layout }>
                                <Stack className={styles.title_text}>Gender</Stack>
                                 <Stack  className={styles.title_detail}>{ details.Gender}</Stack>
                        </Stack> }
                        
                              {details["Personal Mobile Number"] && <Stack className={ styles._layout }>
                                <Stack className={styles.title_text}>Phone Number</Stack>
                                 <Stack  className={styles.title_detail}>{details ? details.Personal_Mobile_Number ||
                                details["Personal Mobile Number"] : ""}</Stack>
                            </Stack>}
                            {details["Is Personal Email"] && <Stack className={ styles._layout }>
                                <Stack className={styles.title_text}>Email</Stack>
                                 <Stack  className={styles.title_detail_email}>{details ? details.Is_Personal_Email ||
                                details["Is Personal Email"] : ""}</Stack>
                            </Stack>}
                            
                            
                        </Stack>
                    </Box>
                </Drawer>
            </>
      
    );
}

export default DetailView
