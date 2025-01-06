import React, { useState, useCallback, useEffect, useRef } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import styles from "./style.module.css";
import DetailView from "./DetailView";
import DefaultScreen from "../Assets/Time management-rafiki.svg";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  useTheme
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import MenProfile from "../Assets/profile.png";
import WomanProfile from "../Assets/woman.png";
import OrganoApi, { searchOrganoApi } from "../Api/api";
import { SpinnerDotted } from 'spinners-react';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

function getStylesDepartment(name, department, theme) {
  return {
    fontWeight: department.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
    fontFamily: "Outfit,sans-serif"
  };
}
function getStylesSubDepartment(name, department, theme) {
  return {
    fontWeight: department.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
    fontFamily: "Outfit,sans-serif"
  };
}
function getStylesLocation(name, department, theme) {
  return {
    fontWeight: department.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
    fontFamily: "Outfit,sans-serif"
  };
}
function getStylesDesignation(name, department, theme) {
  return {
    fontWeight: department.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
    fontFamily: "Outfit,sans-serif"
  };
}

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
  const [department, setDepartment] = useState([
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
    "Transfusion_Medicine",
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
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSubDepartment, setSelectedSubDepartment] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [loader, setLoader] = useState(false);


  const apply = () => {
    const payload = {
      location: selectedLocation,
      department: selectedDepartment,
      subDepartment: selectedSubDepartment,
      designation: selectedDesignation
    };
    if (
      selectedLocation !== "" ||
      selectedDepartment !== "" ||
      selectedSubDepartment !== "" ||
      selectedDesignation !== ""
    ) {
      setLoader(true);
      OrganoApi(payload)
        .then((response) => {
          setTotalOrganoData(response);
          setLoader(false)
        })
        .catch((error) => { setLoader(false); console.log(error) });
    }
  }

  useEffect(() => {
    setSelectedDepartment("");
    setSelectedSubDepartment("");
    setSelectedDesignation("");
  }, [selectedLocation])


  const handleChangeDepartment = (event) => {
    setSelectedDepartment(event.target.value);
  };
  const handleChangeSubDepartment = (event) => {
    setSelectedSubDepartment(event.target.value);
  };
  const handleChangeLocation = (event) => {
    setSelectedLocation(event.target.value);
  };
  const handleChangeDesignation = (event) => {
    setSelectedDesignation(event.target.value);
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

  // // Function to handle smooth scrolling
  // const handleScroll = () => {
  //   if (nodeRef.current) {
  //     nodeRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
  //   }
  // };

  // useEffect(() => {
  //   if (isExpanded) {
  //     handleScroll(); // Scroll when the node is expanded
  //   }
  // }, [isExpanded]); // Depend on the expanded state of the node

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

  const theme = useTheme();


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

  // This return is for component
  return (
    <>

      <Box className={styles.main_container}>
        <div className={styles.filterlayout}>
          <div
            className={styles.filterDiv}
            style={{
              height: "10vh",
              position: "fixed",
              zIndex: "100",
              backgroundColor: "white",
            }}
          >
            <FormControl sx={{ m: 1, width: 250 }}>
              <InputLabel
                id="demo-multiple-name-label"
                sx={{ fontFamily: "Outfit,sans-serif" }}
              >
                Location
              </InputLabel>
              <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                value={selectedLocation}
                onChange={handleChangeLocation}
                input={<OutlinedInput label="Sub-Department" />}
                MenuProps={MenuProps}
              >
                <MenuItem
                  value={""}
                  style={getStylesLocation("", location, theme)}
                >
                  Select
                </MenuItem>
                {location.map((value) => (
                  <MenuItem
                    key={value}
                    value={value}
                    style={getStylesLocation(value, location, theme)}
                  >
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, width: 250 }}>
              <InputLabel
                id="demo-multiple-name-label"
                sx={{ fontFamily: "Outfit,sans-serif" }}
              >
                Department
              </InputLabel>
              <Select
                labelId="demo-multiple-name-label"
                id="demo-multiple-name"
                value={selectedDepartment}
                onChange={handleChangeDepartment}
                input={<OutlinedInput label="Department" />}
                MenuProps={MenuProps}
              >
                <MenuItem
                  value={""}
                  style={getStylesDepartment("", department, theme)}
                >
                  Select
                </MenuItem>
                {department.map((value) => (
                  <MenuItem
                    key={value}
                    value={value}
                    style={getStylesDepartment(value, department, theme)}
                  >
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button sx={{ alignItems: 'center', top: '1rem' }} onClick={() => apply()}>
              Apply
            </Button>
            {/* {selectedDepartment !== "" && <FormControl sx={{ m: 1, width: 250 }}>
            <InputLabel
              id="demo-multiple-name-label"
              sx={{ fontFamily: "Outfit,sans-serif" }}
            >
              Sub-Department
            </InputLabel>
            <Select
              labelId="demo-multiple-name-label"
              id="demo-multiple-name"
              value={selectedSubDepartment}
              onChange={handleChangeSubDepartment}
              input={<OutlinedInput label="Sub-Department" />}
              MenuProps={MenuProps}
            >
              {subDepartment.map((value) => (
                <MenuItem
                  key={value}
                  value={value}
                  style={getStylesSubDepartment(value, subDepartment, theme)}
                >
                  {value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>} */}
            {/* {selectedDepartment !== "" && <FormControl sx={{ m: 1, width: 250 }}>
            <InputLabel
              id="demo-multiple-name-label"
              sx={{ fontFamily: "Outfit,sans-serif" }}
            >
              Designation
            </InputLabel>
            <Select
              labelId="demo-multiple-name-label"
              id="demo-multiple-name"
              value={selectedDesignation}
              onChange={handleChangeDesignation}
              input={<OutlinedInput label="Sub-Department" />}
              MenuProps={MenuProps}
            >
              {designation.map((value) => (
                <MenuItem
                  key={value}
                  value={value}
                  style={getStylesDesignation(value, designation, theme)}
                >
                  {value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>} */}
            {/* <FormControl sx={{ m: 1, width: 250 }}>
            <Box sx={{ fontWeight: 500, fontSize: 16, fontStyle: 'outfit,san-serif' }}>
              Clear All
            </Box>
            <Box sx={{ fontWeight: 300, fontSize: 12, fontStyle: 'outfit,san-serif' }}>
              Except Location
            </Box>
          </FormControl> */}
          </div>
          <div className={styles.filterlayout_search}>
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
        {loader ? <>
          <Box
            position="fixed"
            top={0}
            left={0}
            width="100%"
            height="100%"
            display="flex"
            justifyContent="center"
            alignItems="center"
            bgcolor="rgba(255, 255, 255, 0.5)" // Semi-transparent background
            zIndex={9999} // Ensure it's on top
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
                {' '}
                {/* Add margin-top to space text below the spinner */}
                Please Wait ...
              </Box>
            </Box>
          </Box>
        </> : <> {totalOrganoData.length > 0 ? (
          <div
            className={styles.treeDiv}
            style={{
              marginTop: "5vh",
              width: "100%",
              maxWidth: "2200px",
              overflow: "auto",
              height: "80vh",
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
                cursor: dragging ? "grabbing" : "grab", // Change cursor when dragging
                position: "relative",
              }}
              onMouseDown={handleMouseDown} // Add mouse down event to start dragging
            >
              {/* <div
          className={styles.treeDiv}
          style={{
            marginTop: "5vh",
            width: "100%",
            maxWidth: "2200px",
            overflowY: "auto",
            height: "80vh",
          }}
        > */}

              {totalOrganoData.length > 0 &&
                totalOrganoData.map((ordinate, index) =>
                  renderTreeNodes(ordinate, index)
                )}
            </div>
          </div>
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
        </>}
        <DetailView
          setDetails={setDetails}
          details={details}
          setOpen={setOpen}
          open={open}
        />
      </Box>
    </>
  );
};

export default OrgChart;
