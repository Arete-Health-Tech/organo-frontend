/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback, useEffect, useRef } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import styles from "./style.module.css";
import DetailView from "./DetailView";
import DefaultScreen from "../Assets/Time management-rafiki.svg";
import SearchIcon from "@mui/icons-material/Search";
import { Autocomplete, Box, Stack, TextField } from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import MenProfile from "../Assets/profile.png";
import WomanProfile from "../Assets/woman.png";
import OrganoApi, { searchOrganoApi } from "../Api/api";
import { SpinnerDotted } from "spinners-react";

const OrgChart = () => {
  const [details, setDetails] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [expandedNodeIds, setExpandedNodeIds] = useState([]); // State to track expanded nodes

  const [scale, setScale] = useState(1); // Initial zoom level
  const [offset, setOffset] = useState({ x: 0, y: 0 }); // To track mouse position for zooming
  const [dragging, setDragging] = useState(false); // To check if the user is dragging
  const [position, setPosition] = useState({ x: 0, y: 0 }); // To track the drag start position
  const [draggedPosition, setDraggedPosition] = useState({ x: 0, y: 0 }); // To track the dragged offset
  const [totalOrganoData, setTotalOrganoData] = useState([]); // To track the dragged offset
  const [superSpeciality, setSuperSpeciality] = useState([
    "Information_Technology",
    "Human_Resources",
    "Oncology",
    "Anaesthesia",
    "Cardiology",
    "CTVS",
    "Finance_and_Account",
    "Pulmonology",
    "Pediatrics",
    "Neonatology",
    "Clinical_Laboratory",
    "Critical_Care",
    "Dental",
    "Plastic_Surgery",
    "Dermatology",
    "Gastroenterology",
    "GI_Surgery",
    "Emergency",
    "Ambulatory_Care",
    "Endocrinology",
    "ENT",
    "General_Surgery",
    "Internal_Medicine",
    "Wards",
    "Neurology",
    "Neuro_Surgery",
    "Neuro_Intervention_Radiology",
    "Obstetrics_and_Gynaecology",
    "Ophthalmology",
    "Orthopedics",
    "Physiotherapy",
    "Psychiatry",
    "Nuclear_Medicine",
    "Radiology_and_Imaging",
    "Urology",
    "Nephrology",
    "Rheumatology",
    "Transfusion_Medicine"
  ]);
  const [subDepartment, setSubDepartment] = useState([
    "Sub Department",
    "Cardiac_Anaesthesia",
    "General_Anaesthesia",
    "Neuro_Anaesthesia",
    "Pain_and_Palliative_Care",
    "Ayush",
    "Brachy_Therapy",
    "Gamma_Camera",
    "LINAC",
    "Radiation_Oncology",
    "Medical_Oncology",
    "Medical_Oncology - BMT",
    "Medical_Oncology - Haemato_Oncology",
    "Surgical_Oncology",
    "Surgical_Oncology - GI_Oncosurgery",
    "Surgical_Oncology - Gynae_oncosurgery",
    "Surgical_Oncology - Head_and_Neck",
    "Orthopedics_Oncology",
    "Paras_Cancer_Centre",
    "Interventional_Cardiology",
    "Non_Invasive_Cardiology_",
    "Paediatric_Cardiology",
    "Cardiac_Surgery - Adult",
    "Cardiac_Surgery - Adult_and_Paediatric",
    "Cardiac_Surgery - Paediatric",
    "Peripheral_Interventions",
    "Vascular_Surgery",
    "CTVS_Core",
    "Pulmonology",
    "Pediatrics",
    "Pediatric_Gastroenterology",
    "Pediatric_Neurology",
    "Neonatology",
    "Bio_Chemistry",
    "Clinical_Patholgy",
    "Histopathology",
    "Immunoassay",
    "Microbiology",
    "Phlebotomy",
    "Clinical_Laboratory_Operations",
    "Hematology",
    "CTVS_ICU",
    "Kidney_Transplant_ICU",
    "Liver_Transplant_ICU",
    "MICU",
    "NICU",
    "NSICU",
    "NSTICU",
    "PICU",
    "SICU",
    "Surgical_Oncology - Oncology_ICU",
    "CCU",
    "HDU",
    "Orthopedic_ICU",
    "Pulmo_ICU",
    "Dental",
    "Plastic_Surgery",
    "Reconstructive_Surgery",
    "Dermatology",
    "Gastroenterology",
    "Hepatology",
    "GI_Surgey",
    "Liver_Transplant",
    "ER",
    "Minor_OT",
    "Medical_Room / Clinics",
    "Endocrinology",
    "ENT",
    "Bariatric_Surgery",
    "MAS",
    "General_Surgery_Core",
    "Internal_Medicine",
    "Medical_Surgical_Ward",
    "Neuro_Surgery_Ward",
    "Obstetrics_and_Gynaecology",
    "Neurology",
    "Neurosurgery",
    "Spine_Surgery",
    "Neuro_Intervention_Radiology",
    "Fetal_Medicine",
    "Gynaecology",
    "IVF",
    "LR",
    "Obstetrics",
    "Gynae Oncology",
    "Eye",
    "Arthroscopy",
    "Joint_Replacement_Surgery",
    "Spine_Surgery",
    "Sports_Injury_Center",
    "Trauma_and_Complex_Cases",
    "Orthopedics",
    "Physiotherapy",
    "Psychiatry",
    "Psychology",
    "PET_CT",
    "Nuclear_Medicine",
    "CT",
    "Interventional_Radiology",
    "Mammography",
    "MRI",
    "MRI / CT / X - _Ray",
    "Ultrasound",
    "X - Ray",
    "Radiology_and_Imaging",
    "Kidney_Transplant",
    "Urology",
    "Nephrology",
    "Rheumatology",
    "Blood_Bank"
  ]);
  const [location, setLocation] = useState([
    "Gurgaon",
    "Patna",
    "Ranchi",
    "Srinagar",
    "Gurgaon Hospital"
  ]);
  const [designation, setDesignation] = useState([
    "Manager",
    "Deputy Manager",
    "Executive",
    "Assistant General Manager"
  ]);
  const [selectedSuperSpeciality, setSelectedSuperSpecialtiy] = useState(null);
  const [selectedSubDepartment, setSelectedSubDepartment] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedDesignation, setSelectedDesignation] = useState(null);
  const [loader, setLoader] = useState(false);
  const [isFilterApply, setIsFilterApply] = useState(false);

  const apply = () => {
    setExpandedNodeIds([]);
    const payload = {
      location: selectedLocation,
      department: selectedSuperSpeciality,
      subDepartment: selectedSubDepartment,
      designation: selectedDesignation
    };
    if (
      selectedLocation !== null ||
      selectedSuperSpeciality !== null ||
      selectedSubDepartment !== null ||
      selectedDesignation !== null
    ) {
      setIsFilterApply(true);
      setLoader(true);
      OrganoApi(payload)
        .then((response) => {
          setTotalOrganoData(response);
          setLoader(false);
        })
        .catch((error) => {
          setLoader(false);
          console.log(error);
        });
    }
  };

  const clearFilter = () => {
    setSelectedSuperSpecialtiy(null);
    setSelectedSubDepartment(null);
    setSelectedLocation(null);
    setSelectedDesignation(null);
    setTotalOrganoData([]);
    setIsFilterApply(false);
    setOpen(false)
    setScale(Math.min(Math.max(1)));
  };

  useEffect(() => {
    setSelectedSuperSpecialtiy(null);
    setSelectedSubDepartment(null);
    setSelectedDesignation(null);
  }, [selectedLocation]);

  const handleChangeSuperSpeciality = (event, newValue) => {
    setSelectedSuperSpecialtiy(newValue);
  };
  const handleChangeLocation = (event, newValue) => {
    console.log(newValue);
    setSelectedLocation(newValue);
  };
  // Handle zooming based on mouse wheel
  const handleWheel = useCallback(
    (event) => {
      event.preventDefault();

      // Adjust the scale more slowly by changing the increment
      let newScale = scale + (event.deltaY > 0 ? -0.05 : 0.05);

      // Clamp the scale value to a smaller range (e.g., 0.5 to 2)
      newScale = Math.min(Math.max(newScale, 0.5), 1);

      // Update the scale
      setScale(newScale);

      // Get the mouse position to adjust transformOrigin
      setOffset({ x: event.clientX, y: event.clientY });
    },
    [scale]
  );

  // Handle dragging
  const handleMouseDown = (e) => {
    setDragging(true);
    setPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (dragging) {
      const deltaX = e.clientX - position.x;
      const deltaY = e.clientY - position.y;
      setPosition({ x: e.clientX, y: e.clientY });
      setDraggedPosition({
        x: draggedPosition.x + deltaX,
        y: draggedPosition.y + deltaY
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    // Add event listeners for dragging
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    // Cleanup the event listeners
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, position]);

  // Recursive function to get all descendant node IDs
  const getAllDescendantIds = (node) => {
    if (!node?.subordinates || node.subordinates.length === 0) {
      return [];
    }
    return node.subordinates.reduce(
      (acc, subordinate) => [
        ...acc,
        subordinate._id,
        ...getAllDescendantIds(subordinate)
      ],
      []
    );
  };

  // For Expanding the tree this function is used
  const toggleExpand = (node) => {
    const nodeId = node._id;
    if (expandedNodeIds.includes(nodeId)) {
      // Collapse the node and all its descendants
      const descendants = getAllDescendantIds(node);
      setExpandedNodeIds((prevIds) =>
        prevIds.filter((id) => id !== nodeId && !descendants.includes(id))
      );
    } else {
      // Expand the node
      setExpandedNodeIds((prevIds) => [...prevIds, nodeId]);
    }
  };

  let isExpanded;

  const nodeRef = useRef(null); // Reference to the DOM element

  const renderTreeNodes = (node, index) => {
    isExpanded = expandedNodeIds.includes(node._id); // Check if this node is expanded

    return (
      <Tree
        key={node._id}
        lineWidth={"2px"}
        lineColor={"#dae8ff"}
        lineBorderRadius={"4px"}
        label={
          <div
            className={styles.box}
            ref={nodeRef} // Attach the ref
            onClick={() => {
              setDetails(node);
              setOpen(true);
              const newScale = Math.min(Math.max(0.6));
              setScale(newScale);
              const treeDiv = document.querySelector(`.${styles.treeDiv}`);
              if (treeDiv && open !== true) {
                treeDiv.scrollTo({
                  left: "50%",
                  top: "20%",
                  behavior: "smooth" // Smooth scrolling effect
                });
              }
            }}
            tabIndex={0} // Make element focusable
          // onFocus={() => handleScroll()} // Scroll on focus
          >
            <div className={styles.headerBox}>
              <div className={styles.imgDiv}>
                {node.Gender === "Male" ? (
                  <img className={styles.img} src={MenProfile} alt="Male" />
                ) : (
                  <img className={styles.img} src={WomanProfile} alt="Female" />
                )}
              </div>
              <div className={styles.details}>
                <div className={styles.name}>
                  {node.Full_Name || node["Full Name"]}
                </div>
                <div className={styles.Designation}>{node.Designation}</div>
                {node["Personal Mobile Number"] && (
                  <div className={styles.mobileDiv}>
                    <div className={styles.mobileIcon}>
                      <PhoneAndroidIcon
                        style={{ color: "#0c0c0c2c", fontSize: "20px" }}
                      />
                    </div>
                    <div className={styles.mobileNumber}>
                      {node.Personal_Mobile_Number ||
                        node["Personal Mobile Number"]}
                    </div>
                  </div>
                )}
                {node["Is Personal Email"] && (
                  <div className={styles.emailDiv}>
                    <div className={styles.emailIcon}>
                      <MailOutlineIcon
                        style={{ color: "#0c0c0c2c", fontSize: "20px" }}
                      />
                    </div>
                    <div className={styles.email}>
                      {node.Is_Personal_Email || node["Is Personal Email"]}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {node?.subordinates?.length > 0 && (
              <div
                className={isExpanded ? styles.toggleMinus : styles.togglePlus}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent the event from propagating
                  toggleExpand(node);
                }}
              >
                {isExpanded ? <RemoveIcon /> : <AddIcon />}
              </div>
            )}
          </div>
        }
      >
        {isExpanded &&
          node?.subordinates?.length > 0 &&
          node.subordinates.map((subordinate, subIndex) => (
            <TreeNode>{renderTreeNodes(subordinate, subIndex)}</TreeNode>
          ))}
      </Tree>
    );
  };

  const [searchEmployeeId, setSearchEmployeeId] = useState("");
  const handleSearchKeyPress = async (e) => {
    if (e.key === "Enter" && searchEmployeeId === "") {
      setLoader(true);
      setTotalOrganoData([]);
      setLoader(false);
      return;
    } else if (e.key === "Enter") {
      setLoader(true);
      setSearchEmployeeId(searchEmployeeId);
      const searchEmployeeData = await searchOrganoApi(searchEmployeeId);
      setTotalOrganoData(searchEmployeeData);
      setLoader(false);
    }
  };
  const handleZoomIn = () =>
    setScale((prevScale) => Math.min(prevScale + 0.1, 2));
  const handleZoomOut = () =>
    setScale((prevScale) => Math.max(prevScale - 0.1, 0.5));

  return (
    <>
      <Box className={styles.main_container}>
        <div
          className={styles.filterlayout}
          display={"flex"}
          flexDirection={"column"}
        >
          <div
            className={styles.filterDiv}
            style={{
              height: "10vh",
              position: "fixed",
              zIndex: "100",
              backgroundColor: "white"
            }}
          >
            <Autocomplete
              disablePortal
              options={location}
              value={selectedLocation}
              onChange={handleChangeLocation}
              sx={{
                width: 200,
                marginLeft: 2,
                "& .MuiOutlinedInput-root": {
                  padding: "2px 8px" // Reduce padding inside the input
                },
                "& .MuiInputBase-root": {
                  height: "5vh", // Set a fixed height
                  fontSize: "14px", // Adjust font size
                  fontFamily: "Outfit, sans-serif"
                },
                "& .MuiAutocomplete-input": {
                  padding: "0 4px", // Reduce input padding
                  textTransform: "capitalize"
                },
                "& .MuiInputLabel-root": {
                  fontSize: "16px", // Adjust label size
                  fontFamily: "Outfit, sans-serif"
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Facility"
                  InputLabelProps={{
                    style: { fontFamily: "Outfit, sans-serif" }
                  }}
                />
              )}
            />
            <Autocomplete
              disablePortal
              options={superSpeciality}
              value={selectedSuperSpeciality}
              onChange={handleChangeSuperSpeciality}
              sx={{
                width: 200,
                marginLeft: 2,
                "& .MuiOutlinedInput-root": {
                  padding: "2px 8px" // Reduce padding inside the input
                },
                "& .MuiInputBase-root": {
                  height: "5vh", // Set a fixed height
                  fontSize: "14px", // Adjust font size
                  fontFamily: "Outfit, sans-serif"
                },
                "& .MuiAutocomplete-input": {
                  padding: "0 4px", // Reduce input padding
                  textTransform: "capitalize"
                },
                "& .MuiInputLabel-root": {
                  fontSize: "16px", // Adjust label size
                  fontFamily: "Outfit, sans-serif"
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Super Speciality"
                  InputLabelProps={{
                    style: { fontFamily: "Outfit, sans-serif" }
                  }}
                />
              )}
            />
            {/* <Autocomplete
              disablePortal
              options={department}
              value={selectedSuperSpeciality}
              onChange={handleChangeSuperSpeciality}
              sx={{
                width: 250,
                marginLeft: 2,
                "& .MuiOutlinedInput-root": {
                  padding: "2px 8px", // Reduce padding inside the input
                },
                "& .MuiInputBase-root": {
                  height: "5vh", // Set a fixed height
                  fontSize: "14px", // Adjust font size
                  fontFamily: "Outfit, sans-serif",
                },
                "& .MuiAutocomplete-input": {
                  padding: "0 4px", // Reduce input padding
                  textTransform: "capitalize",
                },
                "& .MuiInputLabel-root": {
                  fontSize: "16px", // Adjust label size
                  fontFamily: "Outfit, sans-serif",
                },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Super Speciality"
                  InputLabelProps={{ style: { fontFamily: "Outfit, sans-serif" } }}
                />
              )}
            />
            <Autocomplete
              disablePortal
              options={department}
              value={selectedSuperSpeciality}
              onChange={handleChangeSuperSpeciality}
              sx={{
                width: 250,
                marginLeft: 2,
                "& .MuiOutlinedInput-root": {
                  padding: "2px 8px", // Reduce padding inside the input
                },
                "& .MuiInputBase-root": {
                  height: "5vh", // Set a fixed height
                  fontSize: "14px", // Adjust font size
                  fontFamily: "Outfit, sans-serif",
                },
                "& .MuiAutocomplete-input": {
                  padding: "0 4px", // Reduce input padding
                  textTransform: "capitalize",
                },
                "& .MuiInputLabel-root": {
                  fontSize: "16px", // Adjust label size
                  fontFamily: "Outfit, sans-serif",
                },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Super Speciality"
                  InputLabelProps={{ style: { fontFamily: "Outfit, sans-serif" } }}
                />
              )}
            /> */}

            <Stack className={styles.applyButtonStack}>
              <button className={styles.applyButton} onClick={() => apply()}>
                Apply
              </button>
              <button
                style={{ display: isFilterApply ? "block" : "none" }}
                className={styles.clearButton}
                onClick={clearFilter}
              >
                Clear
              </button>
            </Stack>
          </div>
          <div
            className={styles.filterlayout_search}
            style={{ width: open ? "70%" : "100%" }}
          >
            <div width={"95%"} position={"relative"}>
              <span className={styles.search_icon}>
                {" "}
                <SearchIcon />
              </span>
              <input
                type="text"
                value={searchEmployeeId !== "undefined" ? searchEmployeeId : ""}
                className={styles.search_input}
                placeholder=" Search By Employee ID"
                onChange={(e) => setSearchEmployeeId(e.target.value)}
                onKeyDown={handleSearchKeyPress}
              />
            </div>
          </div>
        </div>
        {loader ? (
          <>
            <Box
              position="fixed"
              top={0}
              left={0}
              width="100%"
              height="100%"
              display="flex"
              justifyContent="center"
              alignItems="center"
              bgcolor="rgba(255, 255, 255, 0.5)"
              zIndex={9999}
            >
              <Box
                display="flex"
                flexDirection="column" // Arrange spinner and text vertically
                justifyContent="center"
                alignItems="center"
              >
                <SpinnerDotted
                  size={100}
                  thickness={100}
                  speed={50}
                  color="#007BFF"
                // secondaryColor="#D9EBFF"
                />
                <Box mt={2} fontSize="16px" fontWeight="bold">
                  {" "}
                  {/* Add margin-top to space text below the spinner */}
                  Please Wait ...
                </Box>
              </Box>
            </Box>
          </>
        ) : (
          <>
            {totalOrganoData.length > 0 ? (
              <>
                <div
                  className={styles.scrollable_container}
                  style={{
                    marginTop: "6vh",
                    width: open ? "75%" : "100%",
                    maxWidth: "2400px",
                    overflowX: "scroll", // Always show scrollbar
                    height: open ? "50vh" : "80vh",
                  }}
                  onWheel={handleWheel}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                      transform: `scale(${scale}) translate(${draggedPosition.x}px, ${draggedPosition.y}px)`, // Zoom and drag
                      transformOrigin: `${offset.x}px ${offset.y}px`, // Zoom around the mouse position
                      transition: "transform 0.8s ease",
                      width: "100%",
                      height: "100%",
                      cursor: dragging ? "grabbing" : "grab",
                      position: "relative"
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  >
                    {totalOrganoData.length > 0 &&
                      totalOrganoData.map((ordinate, index) =>
                        renderTreeNodes(ordinate, index)
                      )}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px"
                  }}
                >
                  <button
                    onClick={handleZoomOut}
                    disabled={scale <= 0.5}
                    className={styles.zoomButton}
                  >
                    Zoom Out
                  </button>
                  <button
                    onClick={handleZoomIn}
                    disabled={scale >= 2}
                    className={styles.zoomButton}
                  >
                    Zoom In
                  </button>
                  <div className={styles.zoomtext}>
                    Zoom Level: {Math.round(scale * 100)}%
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className={styles.defaultscreen}>
                  <div className={styles.defaultscreen_img}>
                    {" "}
                    <img src={DefaultScreen} alt="DefaultScreen" />
                  </div>
                  <div className={styles.defaultscreen_text}>
                    No data available, kindly use filters
                  </div>
                </div>
              </>
            )}
          </>
        )}
        {open && <DetailView
          setDetails={setDetails}
          details={details}
          setOpen={setOpen}
          setScale={setScale}
          open={open}
        />}
      </Box>
    </>
  );
};

export default OrgChart;
