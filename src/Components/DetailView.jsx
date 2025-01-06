import { Box, Drawer, Stack } from '@mui/material'
import React from 'react'
import styles from "./style.module.css";
import MenProfile from '../Assets/profile.png';
import WomanProfile from '../Assets/woman.png'

const DetailView = ({ setDetails, details, setOpen, open }) => {

    return (
       
            <>
                <Drawer
                    sx={{
                        position: 'relative',
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: '30%',
                            borderTopLeftRadius: '15px',
                            borderBottomLeftRadius: '15px'
                        }
                    }}
                    anchor="right"
                    open={open}
                    onClose={() => { setOpen(false); setDetails('') }}
                >
                <Box className={styles.employee_container}>
                    <Stack className={styles.employee_heading}>Employee Information</Stack>
                    <Stack>
                        {details !== null && <Stack className={styles.employee_image}>
                            {details.Gender == "Male" ? <img src={MenProfile} alt="MenProfile/>" /> : <img src={WomanProfile} alt="WomanProfile" />}
                        </Stack>}
                    </Stack>
                    <Stack className={styles.employee_content}>
                        <Stack className={styles._layout}>
                            <Stack className={styles.title_text}>Name</Stack>
                            <Stack className={styles.title_detail}>{details ? details.Full_Name || details["Full Name"] : ""}</Stack>
                        </Stack>
                        <Stack className={styles._layout}>
                            <Stack className={styles.title_text}>Employee Id</Stack>
                            <Stack className={styles.title_detail}>{details ? details.Employee_ID || details["Employee ID"] : ""}</Stack>
                        </Stack>
                        {details !== null && <Stack className={styles._layout}>
                            <Stack className={styles.title_text}>Location</Stack>
                            <Stack className={styles.title_detail}>{details.Location}</Stack>
                        </Stack>}
                        {/* Date of Joining */}
                        <Stack className={styles._layout}>
                            <Stack className={styles.title_text}>Date of Joining</Stack>
                            <Stack className={styles.title_detail}>{details ? details.Date_of_Joining || details["Date of Joining"] : ""}</Stack>
                        </Stack>

                        {details !== null && <Stack className={styles._layout}>
                            <Stack className={styles.title_text}>Designation</Stack>
                            <Stack className={styles.title_detail}>{details.Designation}</Stack>
                        </Stack>}
                        {details !== null && <Stack className={styles._layout}>
                            <Stack className={styles.title_text}>Department</Stack>
                            <Stack className={styles.title_detail}>{details.Department}</Stack>
                        </Stack>}

                        {details !== null && <Stack className={styles._layout}>
                            <Stack className={styles.title_text}>DOB</Stack>
                            <Stack className={styles.title_detail}>{details["Date of Birth"]}</Stack>
                        </Stack>}

                        {details !== null && <Stack className={styles._layout}>
                            <Stack className={styles.title_text}>Gender</Stack>
                            <Stack className={styles.title_detail}>{details.Gender}</Stack>
                        </Stack>}

                        {details !== null && <Stack className={styles._layout}>
                            <Stack className={styles.title_text}>Age</Stack>
                            <Stack className={styles.title_detail}>{details.Age}</Stack>
                        </Stack>}

                        {details !== null && <Stack className={styles._layout}>
                            <Stack className={styles.title_text}>Phone Number</Stack>
                            <Stack className={styles.title_detail}>{details?.Personal_Mobile_Number ||
                                details["Personal Mobile Number"]}</Stack>
                        </Stack>}
                        {details !== null && <Stack className={styles._layout}>
                            <Stack className={styles.title_text}>Email</Stack>
                            <Stack className={styles.title_detail_email}>{details ? details.Is_Personal_Email ||
                                details["Is Personal Email"] : ""}</Stack>
                        </Stack>}
                        {details !== null && <Stack className={styles._layout}>
                            <Stack className={styles.title_text}>Current Address</Stack>
                            <Stack className={styles.title_detail_email}>
                                {details
                                    ? [
                                        details["Current Address Line 1"],
                                        details["Current Address Line 2"],
                                        details["Current Address Line 3"],
                                        details["Current Address City"],
                                        details["Current Address State"],
                                        details["Current Address Country"],
                                        details["Current AddressPincode"],
                                    ]
                                        .filter(Boolean) // Filters out undefined, null, or empty values
                                        .join(", ") // Joins the remaining fields with a comma and space
                                    : ""}
                            </Stack>
                        </Stack>}
                        {details !== null && <Stack className={styles._layout}>
                            <Stack className={styles.title_text}>Permanent Address</Stack>
                            <Stack className={styles.title_detail_email}>
                                {details
                                    ? [
                                        details["Permanent Address Line 1"],
                                        details["Permanent Address Line 2"],
                                        details["Permanent Address Line 3"],
                                        details["Permanent Address City"],
                                        details["Permanent Address State"],
                                        details["Permanent Address Country"],
                                        details["Permanent AddressPincode"],
                                    ]
                                        .filter(Boolean) // Filters out undefined, null, or empty values
                                        .join(", ") // Joins the remaining fields with a comma and space
                                    : ""}
                            </Stack>
                        </Stack>}

                    </Stack>
                </Box>
                </Drawer>
            </>
      
    );
}

export default DetailView
