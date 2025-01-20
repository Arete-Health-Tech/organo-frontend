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
    "Front Office",
    "Finance and Account",
    "Emergency Medicine",
    "IP Billing",
    "General and Minimal Access Surgey",
    "Cardiac Science",
    "OPD",
    "Clinical Laboratory",
    "Cancer Centre",
    "Transfusion Medicine",
    "Bio Medical Engineering",
    "Obstetrics and Gynaecology",
    "Human Resources",
    "Medical Surgical Ward",
    "Critical Care",
    "Radiology",
    "Digestive and Liver Diesease",
    "Sales and Marketing",
    "Orthopedics",
    "Supply Chain Management",
    "Ambulatory Care",
    "Security and Safety",
    "Neuroscience",
    "Engineering and Maintenance",
    "Renal Science",
    "Patient Care Services",
    "Child Health",
    "Psychology",
    "Medical Operations",
    "CSSD",
    "Academic and Research",
    "Anaesthesia",
    "Central Buying Unit",
    "Chest and Respiratory",
    "CRM and Customer Service",
    "Digital Marketing",
    "Endocrinology",
    "ENT",
    "Food and Beverages",
    "General Administration",
    "Hospital Infection Control",
    "Information Technology",
    "Internal Medicine",
    "Legal",
    "MD-Office",
    "Medical Administration",
    "MRD",
    "Non Clinical Services",
    "Nursing Administration",
    "Nursing Education",
    "Nutrition and Dietetics",
    "Office Administration",
    "Operation Theater",
    "Ophthalmology",
    "Pharmacy",
    "Projects and Engineering",
    "Psychiatry",
    "Quality",
    "Rheumatology",
    "Strategy and Business Intelligence"
  ]);
  const [department, setDepartment] = useState([
    "Academic and Research",
    "Ambulatory Care",
    "Anaesthesia",
    "Bio Medical Engineering",
    "Blood Bank",
    "BMT",
    "Cardiology",
    "Cath lab",
    "Central Buying Unit",
    "Clinical Laboratory",
    "Critical Care",
    "CRM and Customer Service",
    "CSSD",
    "CTVS",
    "Day care",
    "Dermatology",
    "Dialysis",
    "Digital Marketing",
    "Emergency",
    "Endocrinology",
    "Endoscopy",
    "Engineering and Maintenance",
    "ENT",
    "Finance and Account",
    "Food and Beverages",
    "Front Office",
    "Gastroenterology",
    "General Administration",
    "General Surgery",
    "GI Surgery",
    "Hospital Operations",
    "House Keeping",
    "Human Resources",
    "Information Technology",
    "Internal Medicine",
    "Interventional Radiology",
    "Labour Room",
    "MD-Office",
    "MRD",
    "Neonatology",
    "Nephrology",
    "Neuro Intervention Radiology",
    "Neuro Lab",
    "Neuro Surgery",
    "Neurology",
    "Non Invasive Cardiac Lab",
    "Nuclear Medicine",
    "Nursing",
    "Nursing Administration",
    "Nutrition and Dietetics",
    "Obstetrics and Gynaecology",
    "Office Administration",
    "Oncology",
    "OPD",
    "Operation Theater",
    "Ophthalmology",
    "Ophthalmology Lab",
    "Orthopedics",
    "Patient  Care  Services",
    "Patient Care Services",
    "Pediatrics",
    "Pharmacy",
    "Plastic Surgery",
    "Projects and Engineering",
    "Psychiatry",
    "Psychology",
    "Pulmonary Lab",
    "Pulmonology",
    "Radiology and Imaging",
    "Rheumatology",
    "Sales and Marketing",
    "Security and Safety",
    "Strategy and Business Intelligence",
    "Supply Chain Management",
    "Transfusion Medicine",
    "Uro Lab",
    "Urology",
    "Wards"
  ]);
  const [subDepartment, setSubDepartment] = useState([
    "IP Admission",
    "AP",
    "Emergency",
    "Bill Processing",
    "General-OT",
    "Cath Lab Unit",
    "OP Nursing Counter",
    "Histopathology",
    "Surgical Oncology-Head and Neck",
    "Medical Oncology",
    "Surgical Oncology",
    "Blood Bank",
    "BME Operations",
    "Gynaecology",
    "Talent Acqusition",
    "Medical Surgical Ward",
    "MICU",
    "Cardiac-OT",
    "Interventional Radiology",
    "Liver Transplant ICU",
    "Serology",
    "Branding",
    "Coordinator-Ortho",
    "Hematology",
    "Clinical Patholgy",
    "Cashier Billing",
    "CTVS ICU",
    "Sample Accessioning",
    "ECG/ ECHO/TMT Room",
    "Medical Room/Clinics",
    "Security",
    "NSICU",
    "Maintenance",
    "Dialysis Unit",
    "Surgical Oncology OT",
    "OP Billing",
    "HR Administration",
    "Guest Relations",
    "CCU",
    "CTVS Core",
    "PICU",
    "NICU",
    "Psychology",
    "Medical Operations",
    "Neuro Anaesthesia",
    "CSSD",
    "Coordinator-Urology",
    "NSTICU",
    "Transport",
    "Non Clinical Services",
    "IP Pharmacy",
    "Pulmo ICU",
    "OP Pharmacy",
    "Referral Sales",
    "Nursing Admin",
    "Interventional Cardiology",
    "Coordinator-Cardiology",
    "Bill Administration",
    "Coordinator-Neuro Science",
    "Billing Audit",
    "Chemo Day Care",
    "Supply Chain Administration",
    "Uro Lab",
    "Applications",
    "General Anaesthesia",
    "X-Ray",
    "Plastic Surgery",
    "Radiology and Imaging",
    "Internal Medicine",
    "EandM Operation",
    "SICU",
    "MRD Administration",
    "Finance Administration",
    "Coordinator-Hemat-Oncology",
    "PSU",
    "Coordinator-CTVS",
    "MAS",
    "Neurology",
    "Urology",
    "Medical Oncology-Haemato Oncology",
    "MRI/CT/X- Ray",
    "HRBP",
    "Bio Chemistry",
    "Camp",
    "Gastroenterology",
    "Fire and Safety",
    "HR Operations",
    "Creative Designer",
    "Pediatrics",
    "General Surgery Core",
    "Business Development-Domestic",
    "Medical Administration",
    "Cardiac Anaesthesia",
    "Coordinator-Oncology DayCare",
    "Clinical Laboratory Operations",
    "Doctor's Payout",
    "Phlebotomy",
    "Paediatric Cardiology",
    "Nephrology",
    "Optometry",
    "Eye",
    "Dermatology",
    "Logistics",
    "Flow Cytometry",
    "Endoscopy",
    "Receiving Store",
    "Recovery",
    "Coordinator-Plastic Surgery",
    "General Store",
    "Wards",
    "IT Operations",
    "Microbiology",
    "Purchase-Medical",
    "Infection Control",
    "Non Invasive Cardiology",
    "CT",
    "Cardiac Surgery-Adult",
    "Learning and Development",
    "Coordinator-Neuro Surgery",
    "Coordinator-Medical Oncology",
    "BMT",
    "Coordinator-Oncology",
    "Ambulance",
    "Neuro-OT",
    "ENT",
    "Joint Replacement Surgery",
    "Credit Billing",
    "Pharmacy Administration",
    "Billing Dispatch",
    "GI Surgey",
    "Pre and Post Operations",
    "Coordinator-Obstetrics and Gynaecology",
    "Labour Room",
    "Minor OT",
    "FandB Operations",
    "Coordinator-Gastroenterology",
    "Quality",
    "Dietetics Operations",
    "Discharge Team",
    "TPA Billing",
    "Coordinator-Clinical Laboratory",
    "Coordinator-Internal Medicine",
    "Obstetrics and Gynaecology",
    "Kidney Transplant ICU",
    "Cardiology",
    "Strategy and Business Intelligence",
    "Transformation",
    "Audit",
    "Hospital Administration",
    "Administration",
    "International SandM-Business Development",
    "Clinical Research",
    "Call Centre",
    "Radiation Oncology",
    "Coordinator-Radiation Oncology",
    "Orthopedic ICU",
    "Endocrinology",
    "Immigration",
    "Kidney Transplant",
    "International SandM-Operation",
    "Mammography",
    "MIS",
    "Nursing Education",
    "Sports Injury Center",
    "HDU",
    "ECHS",
    "Liver Transplant",
    "Orthopedics",
    "OT Pharmacy",
    "Sales and Marketing Administration",
    "Neuro Intervention Radiology",
    "PET CT",
    "Purchase-General Items",
    "Psychiatry",
    "Hepatology",
    "Legal & Secretarial",
    "EEG/EMG/NCV",
    "Performance Marketing",
    "Content Marketing",
    "Pulmonology",
    "Dietetics Administration",
    "Renal Transplant, Breast & Endocrine Surgery",
    "Coordinator-Neurology",
    "Non-Medical Purchase",
    "Spine Surgery",
    "AR",
    "Orthopedics-OT",
    "Operation Theater",
    "Coordinator-Radiology",
    "General Surgery",
    "Digital Marketing Administration",
    "Digital Marketing",
    "Neuro Surgery Ward",
    "Projects Operations",
    "IT Support",
    "Liver Transplant-OT",
    "SEO",
    "FandB Services",
    "Nuclear Medicine",
    "Coordinator-Emergency",
    "Coordinator-General Surgery",
    "Bariatric Surgery",
    "Critical Care",
    "Coordinator-Surgical Oncology",
    "Coordinator-Pulmonology",
    "Immunoassay",
    "Non Intervention Pulmo Lab",
    "Cardiac OPD",
    "Liver and GI Anaesthesia",
    "Coordinator-LTP",
    "Peripheral Interventions",
    "Coordinator-Neurointerventional Radiology",
    "General Cashier",
    "Obstetrics",
    "Front Office operations",
    "IVF",
    "Coordinator-KT",
    "Coordinator-ICU",
    "General Day Care",
    "MRI",
    "Medical Oncology-BMT",
    "Neonatology",
    "Radiotherapy",
    "HK Operations",
    "Cardiac Surgery-Adult and Paediatric",
    "Neurosurgery",
    "LINAC",
    "Medical Purchase",
    "MD Office",
    "Rheumatology",
    "Coordinator-Nephrology",
    "Financial Counselling",
    "Paras Cancer Centre",
    "Oncology",
    "Onco Daycare",
    "Trauma and Complex Cases",
    "OT Administration",
    "Orthopedics Oncology",
    "Surgical Oncology-GI Oncosurgery",
    "Civil",
    "Corporate",
    "Security & Safety Operations",
    "Ultrasound",
    "Molecular Biology",
    "3rd A",
    "3rd C&D",
    "4th C",
    "Arthroscopy",
    "CTVS Anaesthesia",
    "3rd B",
    "4th A"
  ]);

  const [location, setLocation] = useState([
    "Corporate",
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
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [loader, setLoader] = useState(false);
  const [isFilterApply, setIsFilterApply] = useState(false);

  const apply = () => {
    setOpen(false);
    setExpandedNodeIds([]);
    const payload = {
      location: selectedLocation,
      superSpeciality: selectedSuperSpeciality,
      department: selectedDepartment,
      subDepartment: selectedSubDepartment,
      designation: selectedDesignation
    };
    if (
      selectedLocation !== null ||
      selectedSuperSpeciality !== null ||
      selectedSubDepartment !== null ||
      selectedDepartment !== null ||
      selectedDesignation !== null
    ) {
      setIsFilterApply(true);
      setLoader(true);
      OrganoApi(payload)
        .then((response) => {
          setTotalOrganoData(response);
          setLoader(false);
          setSearchEmployeeId("");
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
    setSelectedDepartment(null);
    setSelectedLocation(null);
    setSelectedDesignation(null);
    setTotalOrganoData([]);
    setIsFilterApply(false);
    setOpen(false);
    setSearchEmployeeId("");
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

  const handleChangeDepartment = (event, newValue) => {
    setSelectedDepartment(newValue);
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

  function calculateTotalCTC(employeeList) {
    let totalCTC = 0;

    employeeList.forEach((employee) => {
      if (employee["Annual CTC"]) {
        totalCTC += parseFloat(employee["Annual CTC"]);
        if (employee.subordinates && employee.subordinates.length > 0) {
          totalCTC += calculateTotalCTC(employee.subordinates);
        }
      }
    });

    return totalCTC;
  }

  let isExpanded;

  const nodeRef = useRef(null);

  const renderTreeNodes = (node, index) => {
    isExpanded = expandedNodeIds.includes(node._id);

    const totalSalary = calculateTotalCTC(totalOrganoData);
    const salaryRatio = Number(node["Annual CTC"])
      ? ((Number(node["Annual CTC"]) / totalSalary) * 100).toFixed(2)
      : "0.00";

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
                <div className={styles.Designation}>Role : {node.Role}</div>
                <div className={styles.Designation}>
                  Reportees : {node?.subordinates?.length}{" "}
                </div>
                <div className={styles.Designation}>
                  {" "}
                  Salary : {Number(node["Annual CTC"]) || "N/A"} ({salaryRatio}
                  )%
                </div>
                <div className={styles.name}>{node["OU Name"]}</div>
                {/* <div className={styles.mobileDiv}>
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
                <div className={styles.emailDiv}>
                  <div className={styles.emailIcon}>
                    <MailOutlineIcon
                      style={{ color: "#0c0c0c2c", fontSize: "20px" }}
                    />
                  </div>
                  <div className={styles.email}>
                    {node.Is_Personal_Email || node["Is Personal Email"]}
                  </div>
                </div> */}
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
      setOpen(false);
      const newScale = Math.min(Math.max(1));
      setScale(newScale);
      return;
    } else if (e.key === "Enter") {
      setLoader(true);
      setOpen(false);
      clearFilter();
      const newScale = Math.min(Math.max(1));
      setScale(newScale);
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
                  // padding: "2px 8px", //
                },
                "& .MuiInputBase-root": {
                  // height: "5vh", // Set a fixed height
                  fontSize: "14px", // Adjust font size
                  fontFamily: "Outfit, sans-serif"
                },
                "& .MuiAutocomplete-input": {
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
            {selectedLocation !== "Corporate" && <Autocomplete
              disablePortal
              options={superSpeciality}
              value={selectedSuperSpeciality}
              onChange={handleChangeSuperSpeciality}
              sx={{
                width: 200,
                marginLeft: 2,
                "& .MuiOutlinedInput-root": {
                  // padding: "2px 8px", // Reduce padding inside the input
                },
                "& .MuiInputBase-root": {
                  fontSize: "14px", // Adjust font size
                  fontFamily: "Outfit, sans-serif"
                },
                "& .MuiAutocomplete-input": {
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
            />}
            {selectedSuperSpeciality !== null && selectedLocation !== null && (
              <Autocomplete
                disablePortal
                options={department}
                value={selectedDepartment}
                onChange={handleChangeDepartment}
                sx={{
                  width: 200,
                  marginLeft: 2,
                  "& .MuiOutlinedInput-root": {
                    // padding: "2px 8px", // Reduce padding inside the input
                  },
                  "& .MuiInputBase-root": {
                    fontSize: "14px", // Adjust font size
                    fontFamily: "Outfit, sans-serif"
                  },
                  "& .MuiAutocomplete-input": {
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
                    label="Department"
                    InputLabelProps={{
                      style: { fontFamily: "Outfit, sans-serif" }
                    }}
                  />
                )}
              />
            )}
            <Stack className={styles.applyButtonStack}>
              <button className={styles.applyButton} onClick={apply}>
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
                    height: open ? "45vh" : "80vh"
                  }}
                // onWheel={handleWheel}
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
        {open && (
          <DetailView
            setDetails={setDetails}
            details={details}
            setOpen={setOpen}
            setScale={setScale}
            open={open}
          />
        )}
      </Box>
    </>
  );
};

export default OrgChart;
