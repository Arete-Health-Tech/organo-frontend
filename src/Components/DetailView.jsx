import { Box, colors, Stack } from "@mui/material";
import React from "react";
import styles from "./style.module.css";
import MenProfile from "../Assets/profile.png";
import WomanProfile from "../Assets/woman.png";
import CloseIcon from "@mui/icons-material/Close";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

const TabCss = {
  fontFamily: "Outfit, sans-serif",
  fontSize: "0.9rem",
  textTransform: "capitalize",
  fontWeight: "400",
  color: "grey",
};

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const DetailView = ({ setDetails, details, setOpen, open, setScale }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const timelineData = [
    {
      year: 2008,
      title: "Super Specialisation - DM Cardiology",
    },
    {
      year: 2003,
      title: "PG - MD (General Medicine)",
    },
    {
      year: 2000,
      title: "MBBS",
    },
  ];
  const carrerHistory = [
    {
      year: 2017,
      title: "Senior Consulant - Artemis Hospital,Gurugram",
    },
    {
      year: 2011,
      title: "Consulant - Prime Hospital,Hyderabad",
    },
  ];
  const carrerHistoryParas = [
    {
      year: 2022,
      title: "Director",
    },
    {
      year: 2017,
      title: "Associate Director",
    },
  ];
  return (
    <>
      <Box
        // display={open ? "flex" : "none"}
        sx={{
          borderLeft: "1px solid rgba(0, 0, 0, 0.1) ",
          position: "absolute",
          bgcolor: "white",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          top: "0",
          right: "0",
          height: "100vh",
          width: "27%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            borderBottom: 1,
            borderColor: "divider",
            bgcolor: "#f8f9fa",
          }}
        >
          <Stack
            className={styles.employee_heading}
            sx={{
              cursor: "pointer",
              fontSize: "0.8rem",
              marginLeft: "10px",
            }}
            onClick={() => {
              setOpen(false);
              const newScale = Math.min(Math.max(1));
              setScale(newScale);
            }}
          >
            <CloseIcon />
          </Stack>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Personal Info" {...a11yProps(0)} sx={TabCss} />
            <Tab label="Expertise" {...a11yProps(1)} sx={TabCss} />
            <Tab label="Procedure Performed" {...a11yProps(2)} sx={TabCss} />
            <Tab label="Payment Mode" {...a11yProps(3)} sx={TabCss} />
          </Tabs>
        </Box>
        <CustomTabPanel
          value={value}
          index={0}
          style={{
            backgroundColor: "#f8f9fa",
            height: "95%",
          }}
        >
          <Box className={styles.employee_container}>
            <Stack
              display={"flex"}
              flexDirection={"row"}
              justifyContent={"space-between"}
            >
              <Stack className={styles.employee_heading}>
                Employee Information
              </Stack>
            </Stack>
            <Stack>
              {details !== null && (
                <Stack className={styles.employee_image}>
                  {details.Gender == "Male" ? (
                    <img src={MenProfile} alt="MenProfile/>" />
                  ) : (
                    <img src={WomanProfile} alt="WomanProfile" />
                  )}
                </Stack>
              )}
            </Stack>
            <Stack className={styles.employee_content}>
              <Stack className={styles._layout}>
                <Stack className={styles.title_text}>Name</Stack>
                <Stack className={styles.title_detail}>
                  {details ? details.Full_Name || details["Full Name"] : ""}
                </Stack>
              </Stack>
              <Stack className={styles._layout}>
                <Stack className={styles.title_text}>Employee Id</Stack>
                <Stack className={styles.title_detail}>
                  {details ? details.Employee_ID || details["Employee ID"] : ""}
                </Stack>
              </Stack>
              {details !== null && (
                <Stack className={styles._layout}>
                  <Stack className={styles.title_text}>Location</Stack>
                  <Stack className={styles.title_detail}>
                    {details.Location}
                  </Stack>
                </Stack>
              )}
              {/* Date of Joining */}
              <Stack className={styles._layout}>
                <Stack className={styles.title_text}>Date of Joining</Stack>
                <Stack className={styles.title_detail}>
                  {details
                    ? details.Date_of_Joining || details["Date of Joining"]
                    : ""}
                </Stack>
              </Stack>

              {details !== null && (
                <Stack className={styles._layout}>
                  <Stack className={styles.title_text}>Designation</Stack>
                  <Stack className={styles.title_detail}>
                    {details.Designation}
                  </Stack>
                </Stack>
              )}
              {details !== null && (
                <Stack className={styles._layout}>
                  <Stack className={styles.title_text}>Department</Stack>
                  <Stack className={styles.title_detail}>
                    {details.Department}
                  </Stack>
                </Stack>
              )}

              {details !== null && (
                <Stack className={styles._layout}>
                  <Stack className={styles.title_text}>DOB</Stack>
                  <Stack className={styles.title_detail}>
                    {details["Date of Birth"]}
                  </Stack>
                </Stack>
              )}

              {details !== null && (
                <Stack className={styles._layout}>
                  <Stack className={styles.title_text}>Gender</Stack>
                  <Stack className={styles.title_detail}>
                    {details.Gender}
                  </Stack>
                </Stack>
              )}

              {details !== null && (
                <Stack className={styles._layout}>
                  <Stack className={styles.title_text}>Age</Stack>
                  <Stack className={styles.title_detail}>{details.Age}</Stack>
                </Stack>
              )}

              {details !== null && (
                <Stack className={styles._layout}>
                  <Stack className={styles.title_text}>Phone Number</Stack>
                  <Stack className={styles.title_detail}>
                    {details?.Personal_Mobile_Number ||
                      details["Personal Mobile Number"]}
                  </Stack>
                </Stack>
              )}
              {details !== null && (
                <Stack className={styles._layout}>
                  <Stack className={styles.title_text}>Email</Stack>
                  <Stack className={styles.title_detail_email}>
                    {details
                      ? details.Is_Personal_Email ||
                        details["Is Personal Email"]
                      : ""}
                  </Stack>
                </Stack>
              )}
              {details !== null && (
                <Stack className={styles._layout}>
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
                </Stack>
              )}
              {details !== null && (
                <Stack className={styles._layout}>
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
                </Stack>
              )}
            </Stack>
          </Box>
        </CustomTabPanel>
        <CustomTabPanel
          value={value}
          index={1}
          style={{
            backgroundColor: "#f8f9fa",
            height: "95%",
          }}
        >
          <Box className={styles.employee_container}>
            <Stack
              display={"flex"}
              flexDirection={"row"}
              justifyContent={"space-between"}
            >
              <Stack className={styles.employee_heading}>
                Area Of Expertise
              </Stack>
            </Stack>
            <Stack className={styles.employee_content}>
              {/* <Stack className={styles._layout}> */}
              <Stack className={styles.title_text}>Expertise</Stack>
              <Stack
                sx={{
                  fontFamily: "Outfit, sans-serif",
                  letterSpacing: "0.8px",
                  fontSize: "0.9rem",
                  fontWeight: "400",
                }}
              >
                His areas of expertise include: Coronary Artery Diseases
                (Elective and Primary PCI), devices in management of Advanced
                Heart Failure – Biventricular Pacemakers (CRT-P), Combo Devices
                (CRT- D) and ICDs. He also has extensive experience of
                performing Carotid Artery Stenting, Subclavian Artery
                Angioplasty/Stenting, Aortic Stenting, Angioplasty/Stenting of
                other Peripheral Arteries and Below Knee Interventions (BKI). He
                also introduced Trans Cutaneous Aortic Valve Replacement (TAVI)
                in this region. He is also proficient in performing Endovascular
                Stent Grafts in treatment of Arterial Aneurysms, be it Thoracic
                Aortic Aneurysms or Infra Renal Aortic Aneurysms (AAA).
              </Stack>
              {/* </Stack> */}
            </Stack>
          </Box>
        </CustomTabPanel>
        <CustomTabPanel
          value={value}
          index={2}
          style={{
            backgroundColor: "#f8f9fa",
            height: "95%",
          }}
        >
          <Box className={styles.employee_container}>
            <Stack
              display={"flex"}
              flexDirection={"row"}
              justifyContent={"space-between"}
            >
              <Stack className={styles.employee_heading}>
                Area Of Expertise
              </Stack>
            </Stack>
            <Stack className={styles.employee_content}>
              {/* <Stack className={styles._layout}> */}
              <Stack className={styles.title_text}>Procedure Performed</Stack>
              <Stack
                sx={{
                  fontFamily: "Outfit, sans-serif",
                  letterSpacing: "0.8px",
                  fontSize: "0.9rem",
                  fontWeight: "400",
                }}
              >
                He regularly performs non surgical treatment of aortic
                dissections with stent grafts. He has many first’s to his name.
                He was the first in the world to show the efficacy of stenting
                for the management of patients with Takayasu’s Arteritis
                (Pulseless disease) He has been awarded Kataria Memorial Gold
                Medal in 1985, the highest academic awrd of PGI, Chandigarh
              </Stack>
              {/* </Stack> */}
            </Stack>
          </Box>
        </CustomTabPanel>
        <CustomTabPanel
          value={value}
          index={3}
          style={{
            backgroundColor: "#f8f9fa",
            height: "95%",
          }}
        >
          <Box className={styles.employee_container}>
            <Stack
              display={"flex"}
              flexDirection={"row"}
              justifyContent={"space-between"}
            >
              <Stack className={styles.employee_heading}>Payment Mode</Stack>
            </Stack>
            <Stack className={styles.employee_content}>
              <Stack className={styles._layout}>
                <Stack className={styles.title_text}>MG Amount</Stack>
                <Stack className={styles.title_detail}>---</Stack>
              </Stack>
              <Stack className={styles._layout}>
                <Stack className={styles.title_text}>
                  Any Other Condition{" "}
                </Stack>
                <Stack className={styles.title_detail}>---</Stack>
              </Stack>
              {details !== null && (
                <Stack className={styles._layout}>
                  <Stack className={styles.title_text}>Diagontics %</Stack>
                  <Stack className={styles.title_detail}>---</Stack>
                </Stack>
              )}
              {/* Date of Joining */}
              <Stack className={styles._layout}>
                <Stack className={styles.title_text}>Pharmacy %</Stack>
                <Stack className={styles.title_detail}>---</Stack>
              </Stack>

              {details !== null && (
                <Stack className={styles._layout}>
                  <Stack className={styles.title_text}>
                    If Separate from Total Revenue
                  </Stack>
                  <Stack className={styles.title_detail}>---</Stack>
                </Stack>
              )}
              {details !== null && (
                <Stack className={styles._layout}>
                  <Stack className={styles.title_text}>Revenue %</Stack>
                  <Stack className={styles.title_detail}>---</Stack>
                </Stack>
              )}

              {details !== null && (
                <Stack className={styles._layout}>
                  <Stack className={styles.title_text}>Mode of Payment </Stack>
                  <Stack className={styles.title_detail}>---</Stack>
                </Stack>
              )}
            </Stack>
          </Box>
        </CustomTabPanel>
      </Box>
      <Box
        display={open ? "flex" : "none"}
        sx={{
          position: "absolute",
          bgcolor: "#f8f9fa",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          borderTop: "1px solid rgba(0, 0, 0, 0.1) ",
          bottom: "0",
          left: "0",
          height: "33vh",
          width: "72.9%",
          justifyContent: "center",
        }}
      >
        <Stack className={styles.carrer_container_layout}>
          <Box className={styles.carrer_container}>
            {" "}
            <Stack className={styles.carrer_heading}>Academic history</Stack>
            <Stack className={styles.carrer_layout}>
              <Stack className={styles.carrer_layout_data}>
                <div className={styles.timelineContainer}>
                  <div className={styles.timelineInner}>
                    <div className={styles.timelineLine} />
                    {timelineData.map((item, index) => (
                      <div
                        key={item.year}
                        className={styles.timelineEvent}
                        style={{ marginTop: index === 0 ? "0" : "40px" }}
                      >
                        <div className="flex items-center w-full group">
                          <div className={styles.redDot} />
                          <div className={styles.textContent}>
                            <span className={styles.textTitle}>
                              {item.title}
                            </span>
                          </div>
                          <div className={styles.yearText}>{item.year}</div>
                        </div>
                      </div>
                    ))}
                    <div className={styles.bottomGradient} />
                  </div>
                </div>
              </Stack>
            </Stack>
          </Box>
          <Box className={styles.carrer_container}>
            {" "}
            <Stack className={styles.carrer_heading}>Carrer history</Stack>
            <Stack className={styles.carrer_layout}>
              <Stack className={styles.carrer_layout_data}>
                <div className={styles.timelineContainer}>
                  <div className={styles.timelineInner}>
                    <div className={styles.timelineLine} />
                    {carrerHistory.map((item, index) => (
                      <div
                        key={item.year}
                        className={styles.timelineEvent}
                        style={{ marginTop: index === 0 ? "0" : "40px" }}
                      >
                        <div className="flex items-center w-full group">
                          <div className={styles.redDot} />
                          <div className={styles.textContent}>
                            <span className={styles.textTitle}>
                              {item.title}
                            </span>
                          </div>
                          <div className={styles.yearText}>{item.year}</div>
                        </div>
                      </div>
                    ))}
                    <div className={styles.bottomGradient} />
                  </div>
                </div>
              </Stack>
            </Stack>
          </Box>
          <Box className={styles.carrer_container}>
            {" "}
            <Stack className={styles.carrer_heading}>
              Carrer history(Paras)
            </Stack>
            <Stack className={styles.carrer_layout}>
              <Stack className={styles.carrer_layout_data}>
                <div className={styles.timelineContainer}>
                  <div className={styles.timelineInner}>
                    <div className={styles.timelineLine} />
                    {carrerHistoryParas.map((item, index) => (
                      <div
                        key={item.year}
                        className={styles.timelineEvent}
                        style={{ marginTop: index === 0 ? "0" : "40px" }}
                      >
                        <div className="flex items-center w-full group">
                          <div className={styles.redDot} />
                          <div className={styles.textContent}>
                            <span className={styles.textTitle}>
                              {item.title}
                            </span>
                          </div>
                          <div className={styles.yearText}>{item.year}</div>
                        </div>
                      </div>
                    ))}
                    <div className={styles.bottomGradient} />
                  </div>
                </div>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </>
  );
};

export default DetailView;
