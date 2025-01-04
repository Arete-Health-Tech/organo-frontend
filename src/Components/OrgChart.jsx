import React, { useState, useCallback, useEffect, useRef } from "react";
import { Tree, TreeNode } from "react-organizational-chart";
import styles from "./style.module.css";
import DetailView from "./DetailView";
import dummyImage from "../../src/Assets/DummyImage.png";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  useTheme,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import MenProfile from "../Assets/profile.png";
import WomanProfile from "../Assets/woman.png";
import OrganoApi from "../Api/api";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  "Oliver Hansen",
  "Van Henry",
  "April Tucker",
  "Ralph Hubbard",
  "Omar Alexander",
  "Carlos Abbott",
  "Miriam Wagner",
  "Bradley Wilkerson",
  "Virginia Andrews",
  "Kelly Snyder",
];

function getStyles(name, personName, theme) {
  return {
    fontWeight: personName.includes(name)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
    fontFamily: "Outfit,sans-serif",
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


  useEffect(() => {
    OrganoApi().then((response) => {
      console.log(response)
      setTotalOrganoData(response)
    }).catch(error => console.log(error))
  }, [])



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
        y: draggedPosition.y + deltaY,
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
        ...getAllDescendantIds(subordinate),
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

  let isExpanded

  const nodeRef = useRef(null); // Reference to the DOM element

  // Function to handle smooth scrolling
  const handleScroll = () => {
    if (nodeRef.current) {
      nodeRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  useEffect(() => {
    if (isExpanded) {
      handleScroll(); // Scroll when the node is expanded
    }
  }, [isExpanded]); // Depend on the expanded state of the node


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
            onFocus={() => handleScroll()} // Scroll on focus
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
                className={
                  isExpanded ? styles.toggleMinus : styles.togglePlus
                }
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
          node.subordinates.map((subordinate, subIndex) =>
            <TreeNode>{renderTreeNodes(subordinate, subIndex)}</TreeNode>
          )}
      </Tree>
    );
  };

  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  // This return is for component
  return (
    <Box className={styles.main_container}>
      {/* <div style={{ marginBottom: "10px" }}>
                <button onClick={handleZoomOut} disabled={scale <= 0.5}>Zoom Out</button>
                <button onClick={handleZoomIn} disabled={scale >= 2}>Zoom In</button>
                <span style={{ marginLeft: "10px" }}>Zoom Level: {Math.round(scale * 100)}%</span>
            </div> */}
      <div
        className={styles.filterDiv}
        style={{
          height: "10vh",
          position: "fixed",
          zIndex: "100",
          backgroundColor: "white",
          width: "100%",
        }}
      >
        <FormControl sx={{ m: 1, width: 250, borderRadius: "5px" }}>
          <InputLabel
            id="demo-multiple-name-label"
            sx={{ fontFamily: "Outfit,sans-serif" }}
          >
            Facility
          </InputLabel>
          <Select
            labelId="demo-multiple-name-label"
            id="demo-multiple-name"
            multiple
            value={personName}
            onChange={handleChange}
            input={<OutlinedInput label="Facility" />}
            MenuProps={MenuProps}
          >
            {names.map((name) => (
              <MenuItem
                key={name}
                value={name}
                style={getStyles(name, personName, theme)}
              >
                {name}
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
            multiple
            value={personName}
            onChange={handleChange}
            input={<OutlinedInput label="Department" />}
            MenuProps={MenuProps}
          >
            {names.map((name) => (
              <MenuItem
                key={name}
                value={name}
                style={getStyles(name, personName, theme)}
              >
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
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
        < div
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

          {totalOrganoData.length > 0 && totalOrganoData.map((ordinate, index) => renderTreeNodes(ordinate, index))}
        </div>
      </div >


      <DetailView
        setDetails={setDetails}
        details={details}
        setOpen={setOpen}
        open={open}
      />
    </Box >
  );
};

export default OrgChart;
