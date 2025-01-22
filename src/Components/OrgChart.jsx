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

  const [facilityData, setFacilityData] = useState({
    "Corporate": {
      "Supply Chain Management": {
        "Supply Chain Management": ["Supply Chain Administration", "Purchase-Medical", "Purchase-General Items"],
      },
      "Information Technology": {
        "Information Technology": ["Applications", "IT Operations", "IT Support"],
      },
      "Engineering and Maintenance": {
        "Engineering and Maintenance": ["Maintenance", "EandM Operation"],
      },
      "Human Resources": {
        "Human Resources": ["Talent Acqusition", "HR Administration", "HR Operations"],
      },
      "Digital Marketing": {
        "Digital Marketing": ["Creative Designer", "Performance Marketing", "Content Marketing", "Digital Marketing Administration", "SEO"],
      },
      "Sales and Marketing": {
        "Sales and Marketing": ["Branding", "Sales and Marketing Administration"],
      },
      "Strategy and Business Intelligence": {
        "Strategy and Business Intelligence": ["Strategy and Business Intelligence"],
      },
      "General Administration": {
        "General Administration": ["Hospital Administration"],
      },
      "Office Administration": {
        "Office Administration": ["Administration", "FandB Services"],
      },
      "CRM and Customer Service": {
        "CRM and Customer Service": ["Call Centre"],
      },
      "Legal": {
        "Finance and Account": ["Legal & Secretarial"],
      },
      "Central Buying Unit": {
        "Central Buying Unit": ["Non-Medical Purchase", "Medical Purchase"],
      },
      "Projects and Engineering": {
        "Projects and Engineering": ["Projects Operations"],
      },
      "IP Billing": {
        "Finance and Account": ["Bill Administration"],
      },
      "MD-Office": {
        "MD-Office": ["MD-Office"],
      },
      "Bio Medical Engineering": {
        "Bio Medical Engineering": ["BME Operations"],
      },
      "Finance and Account": {
        "Finance and Account": ["Transformation", "Audit", "Finance Administration", "AP", "MIS"],
      },
    },
    "Customer Care - Globiva Service DLF Phase IV": {
      "CRM and Customer Service": {
        "CRM and Customer Service": ["Call Centre"],
      },
    },
    "Darbhanga": {
      "Anaesthesia": {
        "Anaesthesia": ["General Anaesthesia"],
      },
      "Bio Medical Engineering": {
        "Bio Medical Engineering": ["BME Operations"],
      },
      "Cancer Centre": {
        "Oncology": ["Medical Oncology"],
      },
      "Cardiac Science": {
        "Critical Care": ["CCU"],
        "Cardiology": ["Interventional Cardiology", "Paediatric Cardiology"],
        "Cath lab": ["Cath Lab Unit"],
      },
      "Child Health": {
        "Pediatrics": ["Pediatrics"],
      },
      "Clinical Laboratory": {
        "Clinical Laboratory": ["Bio Chemistry", "Microbiology", "Phlebotomy"],
      },
      "Critical Care": {
        "Hospital Operations": ["Coordinator-ICU"],
      },
      "CSSD": {
        "CSSDs": ["CSSD"],
      },
      "Digestive and Liver Diesease": {
        "Gastroenterology": ["Gastroenterology"],
        "Endoscopy": ["Endoscopy"],
      },
      "Emergency Medicine": {
        "Emergency": ["Emergency"],
        "Nursing Administration": ["Emergency"],
      },
      "Engineering and Maintenance": {
        "Engineering and Maintenance": ["EandM Operation"],
      },
      "Finance and Account": {
        "Finance and Account": ["AP", "Finance Administration"],
      },
      "Front Office": {
        "Front Office": ["IP Admission", "OP Billing"],
      },
      "General Administration": {
        "General Administration": ["Hospital Administration"],
      },
      "General and Minimal Access Surgey": {
        "Operation Theater": ["General-OT"],
        "General Surgery": ["MAS"],
      },
      "Hospital Infection Control": {
        "Nursing Administration": ["Infection Control"],
      },
      "Human Resources": {
        "Human Resources": ["HR Operations", "HR Administration"],
      },
      "Information Technology": {
        "Information Technology": ["IT Operations", "IT Support"],
      },
      "Internal Medicine": {
        "Internal Medicine": ["Internal Medicine"],
      },
      "IP Billing": {
        "Finance and Account": ["Bill Processing"],
      },
      "Medical Surgical Ward": {
        "Wards": ["Medical Surgical Ward"],
      },
      "MRD": {
        "MRD": ["MRD Administration"],
      },
      "Neuroscience": {
        "Operation Theater": ["Neuro-OT"],
        "Neuro Lab": ["EEG/EMG/NCV"],
      },
      "Nutrition and Dietetics": {
        "Nutrition and Dietetics": ["Dietetics Operations"],
      },
      "Obstetrics and Gynaecology": {
        "Obstetrics and Gynaecology": ["Gynaecology"],
      },
      "OPD": {
        "OPD": ["OP Nursing Counter"],
      },
      "Ophthalmology": {
        "Ophthalmology": ["Eye"],
      },
      "Patient Care Services": {
        "Patient Care Services": ["Guest Relations"],
      },
      "Pharmacy": {
        "Pharmacy": ["OP Pharmacy", "IP Pharmacy"],
      },
      "Quality": {
        "Hospital Operations": ["Quality"],
      },
      "Radiology": {
        "Pharmacy": ["Radiology and Imaging", "MRI/CT/X- Ray"],
      },
      "Renal Science": {
        "Urology": ["Urology"],
        "Nephrology": ["Nephrology"],
      },
      "Sales and Marketing": {
        "Sales and Marketing": ["Business Development-Domestic"],
      },
      "Security and Safety": {
        "Security and Safety": ["Security", "Fire and Safety"],
      },
    },
    "Gurgaon": {
      "Academic and Research": {
        "Academic and Research": ["Clinical Research"],
      },
      "Anaesthesia": {
        "Anaesthesia": ["General Anaesthesia"],
      },
      "Cancer Centre": {
        "Operation Theater": ["Surgical Oncology OT"],
        "Oncology": ["Surgical Oncology", "Medical Oncology-Haemato Oncology", "Radiation Oncology", "Medical Oncology", "Chemo Day Care", "Paras Cancer Centre"],
        "Hospital Operations": ["Coordinator-Oncology", "Coordinator-Medical Oncology", "Coordinator-Radiation Oncology", "Coordinator-Surgical Oncology",],
        "Nursing Administration": ["Oncology"],
        "BMT": ["BMT"],
      },
      "Bio Medical Engineering": {
        "Bio Medical Engineering": ["BME Operations"],
      },
      "Cardiac Science": {
        "Critical Care": ["CTVS ICU", "CCU"],
        "Cath lab": ["Cath Lab Unit"],
        "Cardiology": ["Non Invasive Cardiology", "Interventional Cardiology"],
        "Anaesthesia": ["Cardiac Anaesthesia"],
        "OPD": ["Cardiac OPD"],
        "Non Invasive Cardiac Lab": ["ECG/ ECHO/TMT Room"],
        "Nursing Administration": ["CCU"],
        "Operation Theater": ["Cardiac-OT"],
      },
      "Chest and Respiratory": {
        "Pulmonology": ["Pulmonology"],
        "Hospital Operations": ["Coordinator-Pulmonology"],
        "Pulmonary Lab": ["Non Intervention Pulmo Lab"],
      },
      "Child Health": {
        "Critical Care": ["PICU", "NICU"],
        "Nursing Administration": ["NICU", "PICU"],
        "Pediatrics": ["Pediatrics"],
        "Neonatology": ["Neonatology"],
      },
      "Clinical Laboratory": {
        "Clinical Laboratory": ["Hematology", "Phlebotomy", "Microbiology", "Bio Chemistry", "Clinical Patholgy", "Clinical Laboratory Operations"],
      },
      "Critical Care": {
        "Critical Care": ["MICU"],
        "Nursing Administration": ["MICU", "Critical Care"],
      },
      "CCSSD": {
        "CSSD": ["CSSD"],
      },
      "Digestive and Liver Diesease": {
        "Critical Care": ["Liver Transplant ICU"],
        "Gastroenterology": ["Gastroenterology"],
        "Hospital Operations": ["Coordinator-Gastroenterology", "Coordinator-LTP"],
        "GI Surgery": ["Liver Transplant"],
        "Operation Theatery": ["Liver Transplant-OT"],
        "Endoscopy": ["Endoscopy"],
        "Anaesthesia": ["Liver and GI Anaesthesia"],
      },
      "Emergency Medicine": {
        "Emergency": ["Emergency"],
        "Ambulatory Care": ["Medical Room/Clinics"],
      },
      "Endocrinology": {
        "Endocrinology": ["Endocrinology"],
      },
      "Engineering and Maintenance": {
        "Engineering and Maintenance": ["Maintenance", "EandM Operation"],
      },
      "ENT": {
        "ENT": ["ENT"],
      },
      "Front Office": {
        "Front Office": ["OP Billing", "IP Admission"],
      },
      "Food and Beverages": {
        "Food and Beverages": ["FandB Operations"],
      },
      "Finance and Account": {
        "Finance and Account": ["Recovery", "Finance Administration", "Doctor's Payout", "AP", "AR"],
      },
      "General Administration": {
        "General Administration": ["Hospital Administration"],
      },
      "General and Minimal Access Surgey": {
        "Operation Theater": ["General-OT"],
        "General Surgery": ["Renal Transplant", "Breast & Endocrine Surgery", "MAS"],
        "OPD": ["General Surgery"],
      },
      "Hospital Infection Control": {
        "Nursing Administration": ["Infection Control"],
      },
      "Human Resources": {
        "Human Resources": ["Talent Acqusition", "HR Administration", "Learning and Development", "HR Operations"],
      },
      "Information Technology": {
        "Information Technology": ["IT Operations", "IT Support"],
      },
      "Internal Medicine": {
        "Internal Medicine": ["Internal Medicine"],
        "Hospital Operations": ["Coordinator-Internal Medicine"],
      },
      "IP Billing": {
        "Finance and Account": ["Bill Processing", "Cashier Billing", "Billing Dispatch", "TPA Billing", "Bill Administration", "Financial Counselling"],
      },
      "Legal": {
        "Finance and Account": ["Legal & Secretarial"],
      },
      "Medical Administration": {
        "Hospital Operations": ["Medical Administration"],
      },
      "Medical Operations": {
        "Hospital Operations": ["Medical Operations"],
      },
      "Medical Surgical Ward": {
        "Wards": ["Medical Surgical Ward"],
        "Nursing Administration": ["Wards"],
      },
      "MRD": {
        "MRD": ["MRD Administration"],
      },
      "Neuroscience": {
        "Critical Care": ["NSICU", "NSTICU"],
        "Anaesthesia": ["Neuro Anaesthesia"],
        "Neurology": ["Neurology"],
        "Operation Theater": ["Neuro-OT"],
        "Neuro Intervention Radiology": ["Neuro Intervention Radiology"],
        "Neuro Lab": ["EEG/EMG/NCV"],
        "Hospital Operations": ["Coordinator-Neuro Surgery", "Coordinator-Neurointerventional Radiology"],
        "Wards": ["Neuro Surgery Ward"],
      },
      "Non Clinical Services": {
        "Hospital Operations": ["Non Clinical Services"],
      },
      "Nursing Administration": {
        "Nursing Administration": ["Nursing Admin"],
      },
      "Nursing Education": {
        "Nursing Administration": ["Nursing Education"],
      },
      "Nutrition and Dietetics": {
        "Nutrition and Dietetics": ["Dietetics Operations", "Dietetics Administration"],
      },
      "OPD": {
        "OPD": ["OP Nursing Counter"],
      },
      "Operation Theater": {
        "Operation Theater": ["Pre and Post Operations"],
        "Nursing Administration": ["Operation Theater"],
      },
      "Obstetrics and Gynaecology": {
        "Obstetrics and Gynaecology": ["Gynaecology", "IVF", "Obstetrics"],
        "Hospital Operations": ["Coordinator-Obstetrics and Gynaecology"],
        "Labour Room": ["Labour Room"],
        "Wards": ["Obstetrics and Gynaecology"],
        "Nursing Administration": ["Labour Room"],
      },
      "Orthopedics": {
        "Orthopedics": ["Sports Injury Center", "Joint Replacement Surgery"],
        "Operation Theater": ["Orthopedics-OT"],
        "OPD": ["Orthopedics"],
        "Hospital Operations": ["Coordinator-Ortho"],
        "Critical Care": ["Orthopedic ICU"],
      },
      "Patient Care Services": {
        "Patient Care Services": ["Guest Relations", "Discharge Team"],
      },
      "Pharmacy": {
        "Pharmacy": ["OP Pharmacy", "IP Pharmacy", "OT Pharmacy", "Pharmacy Administration"],
      },
      "Psychology": {
        "Psychology": ["Psychology"],
      },
      "Quality": {
        "Hospital Operations": ["Quality"],
      },
      "Radiology": {
        "Interventional Radiology": ["Interventional Radiology"],
        "Radiology and Imaging": ["Radiology and Imaging", "MRI/CT/X- Ray", "X-Ray", "MRI"],
        "Nuclear Medicine": ["PET CT", "Nuclear Medicine"],
      },
      "Renal Science": {
        "Dialysis": ["Dialysis Unit"],
        "Urology": ["Kidney Transplant", "Urology"],
        "Nephrology": ["Nephrology"],
        "OPD": ["Uro Lab"],
        "Nursing Administration": ["Dialysis Unit"],
      },
      "Rheumatology": {
        "Rheumatology": ["Rheumatology"],
      },
      "Sales and Marketing": {
        "Sales and Marketing": ["PSU", "Referral Sales", "International SandM-Business Development", "Business Development-Domestic", "International SandM-Operation", "Sales and Marketing Administration", "Branding", "MIS"],
      },
      "Security and Safety": {
        "Security and Safety": ["Transport", "Security", "Fire and Safety"],
      },
      "Supply Chain Management": {
        "Supply Chain Management": ["Purchase-Medical", "Purchase-General Items", "General Store", "Supply Chain Administration"],
      },
      "Transfusion Medicine": {
        "Blood Bank": ["Blood Bank"],
        "Transfusion Medicine": ["Blood Bank"],
      },
    },
    "Kanpur": {
      "Anaesthesia": {
        "Anaesthesia": ["General Anaesthesia"],
        "Cancer Centre": ["Oncology"],
      },
      "Bio Medical Engineering": {
        "Bio Medical Engineering": ["BME Operations"],
      },
      "Cancer Centre": {
        "Oncology": ["Medical Oncology-Haemato Oncology", "Surgical Oncology", "Medical Oncology", "Radiation Oncology", "Radiotherapy", "LINAC"],
      },
      "Cardiac Science": {
        "CTVS": ["CTVS Core"],
        "Anaesthesia": ["Cardiac Anaesthesia"],
        "Cardiology": ["Interventional Cardiology"],
        "Cath lab": ["Cath Lab Unit"],
        "Non Invasive Cardiac Lab": ["ECG/ ECHO/TMT Room"],
        "Critical Care": ["CTVS ICU", "CCU"],
        "Operation Theater": ["Cardiac-OT"],
      },
      "Chest and Respiratory": {
        "Pulmonology": ["Pulmonology"],
      },
      "Child Health": {
        "Critical Care": ["NICU", "PICU"],
        "Pediatrics": ["Pediatrics"],
      },
      "Clinical Laboratory": {
        "Clinical Laboratory": ["Bio Chemistry", "Microbiology", "Clinical Laboratory Operations", "Phlebotomy", "Clinical Patholgy"],
      },
      "Critical Care": {
        "Critical Care": ["MICU"],
      },
      "CSSD": {
        "CSSD": ["CSSD"],
      },
      "Digestive and Liver Diesease": {
        "Gastroenterology": ["Hepatology"],
        "Endoscopy": ["Endoscopy"],
      },
      "Emergency Medicine": {
        "Emergency": ["Emergency"],
      },
      "Endocrinology": {
        "Endocrinology": ["Endocrinology"],
      },
      "Engineering and Maintenance": {
        "Engineering and Maintenance": ["Maintenance", "EandM Operation"],
      },
      "ENT": {
        "ENT": ["ENT"],
      },
      "Finance and Account": {
        "Finance and Account": ["AP", "Finance Administration"],
      },
      "Food and Beverages": {
        "Food and Beverages": ["FandB Operations"],
      },
      "Front Office": {
        "Front Office": ["OP Billing", "IP Admission"],
      },
      "General Administration": {
        "General Administration": ["Hospital Administration"],
      },
      "General and Minimal Access Surgey": {
        "Operation Theater": ["General-OT"],
        "General Surgery": ["General Surgery Core"],
        "OPD": ["General Surgery"],
      },
      "Human Resources": {
        "Human Resources": ["HR Operations", "Learning and Development", "Talent Acqusition"],
      },
      "Information Technology": {
        "Information Technology": ["IT Operations", "IT Support"],
      },
      "Internal Medicine": {
        "Internal Medicine": ["Internal Medicine"],
      },
      "IP Billing": {
        "Finance and Account": ["TPA Billing", "Bill Administration", "Cashier Billing"],
      },
      "Medical Administration": {
        "Hospital Operations": ["Medical Administration"],
      },
      "Medical Surgical Ward": {
        "Wards": ["Medical Surgical Ward"],
        "Nursing Administration": ["Wards"],
      },
      "MRD": {
        "MRD": ["MRD Administration"],
      },
      "Neuroscience": {
        "Anaesthesia": ["Neuro Anaesthesia"],
        "Neuro Lab": ["EEG/EMG/NCV"],
        "Neuro Surgery": ["Spine Surgery"],
        "Neurology": ["Neurology"],
      },
      "Non Clinical Services": {
        "Hospital Operations": ["Non Clinical Services"],
      },
      "Nursing Administration": {
        "Nursing Administration": ["Nursing Admin"],
      },
      "Nursing Education": {
        "Nursing Administration": ["Nursing Education"],
      },
      "Nutrition and Dietetics": {
        "Nutrition and Dietetics": ["Dietetics Operations"],
      },
      "Obstetrics and Gynaecology": {
        "Obstetrics and Gynaecology": ["Gynaecology"],
      },
      "OPD": {
        "OPD": ["OP Nursing Counter"],
      },
      "Operation Theater": {
        "Nursing Administration": ["Operation Theater"],
        "Operation Theater": ["Pre and Post Operations"],
      },
      "Ophthalmology": {
        "Ophthalmology": ["Eye"],
      },
      "Orthopedics": {
        "Orthopedics": ["Joint Replacement Surgery", "Orthopedics", "Spine Surgery"],
      },
      "Patient Care Services": {
        "Patient Care Services": ["Guest Relations"],
      },
      "Pharmacy": {
        "Pharmacy": ["OP Pharmacy", "IP Pharmacy"],
      },
      "Quality": {
        "Hospital Operations": ["Quality"],
      },
      "Radiology": {
        "Radiology and Imaging": ["MRI/CT/X-Ray", "X-Ray"],
        "Interventional Radiology": ["Interventional Radiology"],
      },
      "Renal Science": {
        "Dialysis": ["Dialysis Unit"],
        "Urology": ["Urology"],
      },
      "Sales and Marketing": {
        "Sales and Marketing": ["Business Development-Domestic", "Referral Sales", "Sales and Marketing Administration", "Digital Marketing", "Camp"],
      },
      "Security and Safety": {
        "Security and Safety": ["Fire and Safety", "Security"],
      },
      "Supply Chain Management": {
        "Supply Chain Management": ["Receiving Store", "Supply Chain Administration", "Purchase-Medical", "General Store"],
      },
      "Transfusion Medicine": {
        "Transfusion Medicine": ["Blood Bank"],
        "Blood Bank": ["Blood Bank"],
      },
    },
    "Panchkula": {
      "Anaesthesia": {
        "Anaesthesia": ["General Anaesthesia"],
      },
      "Cancer Centre": {
        "Oncology": ["Surgical Oncology", "Medical Oncology", "Chemo Day Care", "Medical Oncology-Haemato Oncology", "Orthopedics Oncology"],
        "Hospital Operations": ["Coordinator-Hemat-Oncology", "Coordinator-Medical Oncology"],
        "BMT": ["BMT"]
      },
      "Cardiac Science": {
        "Operation Theater": ["Cardiac-OT"],
        "Non Invasive Cardiac Lab": ["ECG/ ECHO/TMT Room"],
        "Critical Care": ["CCU", "CTVS ICU"],
        "Cath lab": ["Cath Lab Unit"],
        "Cardiology": ["Interventional Cardiology", "Non Invasive Cardiology "],
        "CTVS": ["Cardiac Surgery-Adult"],
        "Hospital Operations": ["Coordinator-Cardiology", "Coordinator-CTVS", "Cardiology"],
        "Anaesthesia": ["Cardiac Anaesthesia"],
      },
      "Chest and Respiratory": {
        "Pulmonology": ["Pulmonology"],
      },
      "Child Health": {
        "Pediatrics": ["Pediatrics"],
      },
      "Clinical Laboratory": {
        "Clinical Laboratory": ["Bio Chemistry", "Microbiology", "Immigration", "Hematology", "Clinical Patholgy", "Phlebotomy", "Histopathology"],
      },
      "Critical Care": {
        "Critical Care": ["MICU", "SICU"],
      },
      "CSSD": {
        "CSSD": ["CSSD"],
      },
      "Dermatology": {
        "Plastic Surgery": ["Plastic Surgery"],
        "Dermatology": ["Dermatology"],
        "Hospital Operations": ["Coordinator-Plastic Surgery"],
      },
      "Digestive and Liver Diesease": {
        "GI Surgery": ["GI Surgey"],
        "Endoscopy": ["Endoscopy"],
        "Gastroenterology": ["Hepatology", "Gastroenterology"],
        "Hospital Operations": ["Coordinator-Gastroenterology"],
      },
      "Emergency Medicine": {
        "Emergency": ["Emergency"],
      },
      "Endocrinology": {
        "Endocrinology": ["Endocrinology"],
      },
      "Engineering and Maintenance": {
        "Engineering and Maintenance": ["Maintenance", "EandM Operation"],
      },
      "ENT": {
        "ENT": ["ENT"],
      },
      "Finance and Account": {
        "Finance and Account": ["AP", "Finance Administration", "Doctor's Payout", "Recovery", "AR"],
      },
      "Food and Beverages": {
        "Food and Beverages": ["FandB Operations"],
      },
      "Front Office": {
        "Front Office": ["IP Admission", "OP Billing"],
      },
      "General Administration": {
        "General Administration": ["Hospital Administration"],
      },
      "General and Minimal Access Surgey": {
        "Operation Theater": ["General-OT"],
        "General Surgery": ["MAS"],
        "Hospital Operations": ["Coordinator-General Surgery"],
      },
      "Human Resources": {
        "Human Resources": ["Learning and Development", "HRBP", "HR Administration", "HR Operations", "Talent Acqusition"],
      },
      "Information Technology": {
        "Information Technology": ["IT Operations"],
      },
      "Internal Medicine": {
        "Internal Medicine": ["Internal Medicine"],
        "Hospital Operations": ["Coordinator-Internal Medicine"],
      },
      "IP Billing": {
        "Finance and Account": ["Bill Administration", "Billing Audit", "Billing Dispatch", "Bill Processing", "Credit Billing", "TPA Billing"],
      },
      "Medical Administration": {
        "Hospital Operations": ["Medical Administration"],
      },
      "Medical Operations": {
        "Hospital Operations": ["Medical Operations"],
      },
      "Medical Surgical Ward": {
        "Wards": ["Medical Surgical Ward"],
      },
      "MRD": {
        "MRD": ["MRD Administration"],
      },
      "Neuroscience": {
        "Hospital Operations": ["Coordinator-Neuro Science"],
        "Neurology": ["Neurology"],
        "Operation Theater": ["Neuro-OT"],
        "Neuro Lab": ["EEG/EMG/NCV"],
      },
      "Non Clinical Services": {
        "Hospital Operations": ["Non Clinical Services"],
      },
      "Nursing Administration": {
        "Nursing Administration": ["Nursing Admin"],
      },
      "Nursing Education": {
        "Nursing Administration": ["Nursing Education"],
      },
      "Nutrition and Dietetics": {
        "Nutrition and Dietetics": ["Dietetics Operations"],
      },
      "Obstetrics and Gynaecology": {
        "Obstetrics and Gynaecology": ["Gynaecology"],
      },
      "OPD": {
        "OPD": ["OP Nursing Counter", "Immigration"],
      },
      "Orthopedics": {
        "Hospital Operations": ["Coordinator-Ortho"],
        "Critical Care": ["Orthopedic ICU"],
        "Orthopedics": ["Sports Injury Center", "Joint Replacement Surgery"],
      },
      "Patient Care Services": {
        "Patient Care Services": ["Discharge Team", "Guest Relations"],
      },
      "Pharmacy": {
        "Pharmacy": ["IP Pharmacy", "Pharmacy Administration", "OP Pharmacy", "OT Pharmacy"],
      },
      "Psychiatry": {
        "Psychiatry": ["Psychiatry"],
      },
      "Quality": {
        "Hospital Operations": ["Quality"],
      },
      "Renal Science": {
        "Hospital Operations": ["Coordinator-Urology", "Coordinator-KT"],
        "Uro Lab": ["Uro Lab"],
        "Critical Care": ["Kidney Transplant ICU"],
        "Urology": ["Kidney Transplant", "Urology"],
        "Nephrology": ["Nephrology"],
      },
      "Sales and Marketing": {
        "Sales and Marketing": ["PSU", "Camp", "Business Development-Domestic", "ECHS", "Sales and Marketing Administration", "Branding"],
      },
      "Security and Safety": {
        "Security and Safety": ["Security", "Fire and Safety"],
      },
      "Supply Chain Management": {
        "Supply Chain Management": ["General Store", "Purchase-Medical", "Receiving Store", "Purchase-General Items", "Supply Chain Administration"],
      },
      "Transfusion Medicine": {
        "Blood Bank": ["Blood Bank"],
        "Transfusion Medicine": ["Blood Bank"],
      },
    },
    "Paras Labs PTC Gurgaon": {
      "Clinical Laboratory": {
        "Clinical Laboratory": ["Serology", "Hematology", "Microbiology", "Histopathology", "Phlebotomy", "Clinical Patholgy", "Bio Chemistry", "Clinical Laboratory Operations", "Molecular Biology"],
      },
      "Human Resources": {
        "Human Resources": ["HR Administration"],
      },
      "Information Technology": {
        "Information Technology": ["IT Operations", "IT Support"],
      },
      "Quality": {
        "Clinical Laboratory": ["Quality"],
      },
      "Sales and Marketing": {
        "Sales and Marketing": ["Branding", "Business Development-Domestic"],
      },
      "Supply Chain Management": {
        "Supply Chain Management": ["Sample Accessioning", "Logistics", "Purchase-Medical", "Receiving Store"],
      },
    },
    "Patna": {
      "Ambulatory Care": {
        "Ambulatory Care": ["Medical Room/Clinics"],
      },
      "Anaesthesia": {
        "Anaesthesia": ["General Anaesthesia"],
      },
      "Cancer Centre": {
        "Oncology": ["Medical Oncology", "Radiation Oncology", "Medical Oncology-Haemato Oncology", "Surgical Oncology", "Medical Oncology-BMT", "Surgical Oncology-Head and Neck"],
        "Hospital Operations": ["Coordinator-Hemat-Oncology", "Coordinator-Oncology", "Coordinator-Oncology DayCare"],
        "BMT": ["BMT"],
      },
      "Cardiac Science": {
        "Critical Care": ["CCU", "CTVS ICU"],
        "Hospital Operations": ["Coordinator-Cardiology"],
        "Operation Theater": ["Cardiac-OT"],
        "Cardiology": ["Interventional Cardiology", "Non Invasive Cardiology "],
        "Non Invasive Cardiac Lab": ["ECG/ ECHO/TMT Room"],
        "CTVS": ["CTVS Core"],
        "Cath lab": ["Cath Lab Unit"],
        "Anaesthesia": ["CTVS Anaesthesia"],
      },
      "Chest and Respiratory": {
        "Critical Care": ["Pulmo ICU"],
        "Pulmonology": ["Pulmonology"],
        "Hospital Operations": ["Coordinator-Pulmonology"],
      },
      "Child Health": {
        "Critical Care": ["NICU", "PICU"],
        "Pediatrics": ["Pediatrics"],
      },
      "Clinical Laboratory": {
        "Clinical Laboratory": ["Histopathology", "Phlebotomy", "Microbiology", "Clinical Patholgy", "Bio Chemistry", "Hematology", "Clinical Laboratory Operations"],
        "Hospital Operations": ["Coordinator-Clinical Laboratory"],
      },
      "Critical Care": {
        "Critical Care": ["SICU", "MICU", "HDU"],
      },
      "CSSD": {
        "CSSD": ["CSSD",],
      },
      "Dermatology": {
        "Plastic Surgery": ["Plastic Surgery",],
      },
      "Digestive and Liver Diesease": {
        "Gastroenterology": ["Gastroenterology", "Hepatology",],
        "Endoscopy": ["Endoscopy",],
      },
      "Emergency Medicine": {
        "Emergency": ["Emergency", "Ambulance", "Minor OT"],
      },
      "Endocrinology": {
        "Endocrinology": ["Endocrinology"],
      },
      "Engineering and Maintenance": {
        "Engineering and Maintenance": ["EandM Operation", "Maintenance"],
      },
      "ENT": {
        "ENT": ["ENT"],
      },
      "Finance and Account": {
        "Finance and Account": ["Finance Administration", "AP", "Recovery", "Doctor's Payout"],
      },
      "Food and Beverages": {
        "Food and Beverages": ["FandB Operations"],
      },
      "Front Office": {
        "Front Office": ["OP Billing", "IP Admission"],
      },
      "General Administration": {
        "General Administration": ["Hospital Administration"],
      },
      "General and Minimal Access Surgey": {
        "Operation Theater": ["General-OT"],
        "General Surgery": ["General Surgery Core", "MAS"],
        "OPD": ["General Surgery"],
      },
      "Hospital Infection Control": {
        "Nursing Administration": ["Infection Control"],
      },
      "Human Resources": {
        "Human Resources": ["HR Administration", "Talent Acqusition"],
      },
      "Information Technology": {
        "Information Technology": ["IT Operations", "IT Support"],
      },
      "Internal Medicine": {
        "Internal Medicine": ["Internal Medicine"],
      },
      "IP Billing": {
        "Finance and Account": ["Cashier Billing", "Bill Processing", "Bill Processing", "Billing Dispatch", "TPA Billing"],
      },
      "Medical Administration": {
        "Hospital Operations": ["Medical Administration"],
      },
      "Medical Operations": {
        "Hospital Operations": ["Hospital Operations"],
      },
      "Medical Surgical Ward": {
        "Wards": ["Medical Surgical Ward"],
      },
      "MRD": {
        "MRD": ["MRD Administration"],
      },
      "Neuroscience": {
        "Critical Care": ["NSICU"],
        "Neurology": ["Neurology"],
        "Hospital Operations": ["Coordinator-Neuro Science"],
        "Operation Theater": ["Neuro-OT"],
        "Neuro Lab": ["EEG/EMG/NCV"],
      },
      "Non Clinical Services": {
        "Hospital Operations": ["Non Clinical Services"],
      },
      "Nursing Administration": {
        "Nursing Administration": ["Nursing Admin"],
      },
      "Nutrition and Dietetics": {
        "Nutrition and Dietetics": ["Dietetics Operations", "Dietetics Administration"],
      },
      "Obstetrics and Gynaecology": {
        "Obstetrics and Gynaecology": ["Gynaecology", "Obstetrics"],
        "OPD": ["Obstetrics and Gynaecology"],
      },
      "OPD": {
        "OPD": ["OP Nursing Counter"],
      },
      "Operation Theater": {
        "Operation Theater": ["Pre and Post Operations", "OT Administration"],
      },
      "Ophthalmology": {
        "Ophthalmology": ["Eye"],
        "Ophthalmology Lab": ["Optometry"],
      },
      "Orthopedics": {
        "Orthopedics": ["Joint Replacement Surgery", "Orthopedics", "Spine Surgery", "Sports Injury Center", "Arthroscopy"],
        "OPD": ["Orthopedics"],
        "Operation Theater": ["Orthopedics-OT"],
        "Hospital Operations": ["Coordinator-Ortho"],
      },
      "Patient Care Services": {
        "Patient Care Services": ["Guest Relations", "Discharge Team"],
      },
      "Pharmacy": {
        "Pharmacy": ["OP Pharmacy", "IP Pharmacy", "OT Pharmacy", "Pharmacy Administration"],
      },
      "Psychiatry": {
        "Psychiatry": ["Psychiatry"],
      },
      "Quality": {
        "Hospital Operations": ["Quality"],
      },
      "Radiology": {
        "Radiology and Imaging": ["X-Ray", "Radiology and Imaging", "Mammography", "MRI/CT/X- Ray", "Ultrasound"],
        "Nuclear Medicine": ["Nuclear Medicine"],
        "Interventional Radiology": ["Interventional Radiology"],
      },
      "Renal Science": {
        "Nephrology": ["Nephrology"],
        "OPD": ["Uro Lab"],
        "Urology": ["Urology"],
        "Hospital Operations": ["Coordinator-KT", "Coordinator-Nephrology"],
      },
      "Sales and Marketing": {
        "Sales and Marketing": ["Branding", "MIS", "Business Development-Domestic", "Referral Sales", "Camp"],
      },
      "Security and Safety": {
        "Security and Safety": ["Security", "Fire and Safety"],
      },
      "Supply Chain Management": {
        "Supply Chain Management": ["General Store", "Receiving Store", "Purchase-General Items", "Supply Chain Administration", "Logistics"],
      },
      "Transfusion Medicine": {
        "Blood Bank": ["Blood Bank"],
        "Transfusion Medicine": ["Blood Bank"],
      },

    },
    "Ranchi": {
      "Ambulatory Care": {
        "Ambulatory Care": ["Medical Room/Clinics"],
      },
      "Anaesthesia": {
        "Anaesthesia": ["General Anaesthesia"],
      },
      "Bio Medical Engineering": {
        "Bio Medical Engineering": ["BME Operations"],
      },
      "Cancer Centre": {
        "Oncology": ["Surgical Oncology-Head and Neck", "Medical Oncology", "Surgical Oncology"],
        "Hospital Operations": ["Coordinator-Medical Oncology", "Coordinator-Surgical Oncology"],
        "Operation Theater": ["Surgical Oncology OT"],
      },
      "Cardiac Science": {
        "Cath lab": ["Cath Lab Unit"],
        "Critical Care": ["CTVS ICU", "CCU"],
        "Hospital Operations": ["Coordinator-Cardiology", "Coordinator-CTVS"],
        "Non Invasive Cardiac Lab": ["ECG/ ECHO/TMT Room"],
        "CTVS": ["Cardiac Surgery-Adult"],
        "Operation Theater": ["Cardiac-OT"],
        "Cardiology": ["Interventional Cardiology"],
        "Anaesthesia": ["Cardiac Anaesthesia"],
      },
      "Chest and Respiratory": {
        "Pulmonology": ["Pulmonology"],
      },
      "Child Health": {
        "Critical Care": ["NICU"],
        "Pediatrics": ["Pediatrics"],
      },
      "Clinical Laboratory": {
        "Clinical Laboratory": ["Clinical Laboratory Operations", "Microbiology", "Histopathology", "Phlebotomy", "Immunoassay", "Bio Chemistry", "Clinical Patholgy"],
      },
      "Critical Care": {
        "Critical Care": ["MICU", "HDU"],
        "Hospital Operations": ["Coordinator-ICU"],
      },
      "CSSD": {
        "CSSD": ["CSSD"],
      },
      "Dermatology": {
        "Plastic Surgery": ["Plastic Surgery"],
        "Dermatology": ["Dermatology"],
      },
      "Digestive and Liver Diesease": {
        "Endoscopy": ["Endoscopy"],
        "Gastroenterology": ["Gastroenterology"],
      },
      "Emergency Medicine": {
        "Emergency": ["Minor OT", "Emergency"],
        "Ambulatory Care": ["Medical Room/Clinics"],
        "Hospital Operations": ["Coordinator-Emergency"],
      },
      "Engineering and Maintenance": {
        "Engineering and Maintenance": ["EandM Operation"],
      },
      "ENT": {
        "ENT": ["ENT"],
      },
      "Finance and Account": {
        "Finance and Account": ["AP", "Finance Administration", "AR"],
      },
      "Food and Beverages": {
        "Food and Beverages": ["FandB Operations"]
      },
      "Front Office": {
        "Front Office": ["IP Admission", "OP Billing"],
      },
      "General and Minimal Access Surgey": {
        "Operation Theater": ["General-OT"],
        "Hospital Operations": ["Coordinator-General Surgery"],
        "General Surgery": ["Bariatric Surgery", "MAS"],
        "OPD": ["General Surgery"],
      },
      "Hospital Infection Control": {
        "Nursing Administration": ["Infection Control"],
      },
      "Human Resources": {
        "Human Resources": ["Talent Acqusition", "HR Operations", "Learning and Development", "HR Administration"],
      },
      "Information Technology": {
        "Information Technology": ["IT Operations", "IT Support"],
      },
      "Internal Medicine": {
        "Internaal Medicine": ["Internaal Medicine"],
      },
      "IP Billing": {
        "Finance and Account": ["Billing Audit", "Cashier Billing", "Credit Billing", "Credit Billing", "TPA Billing", "Billing Dispatch", "Bill Administration"],
      },
      "Medical Administration": {
        "Hospital Operations": ["Medical Administration"],
      },
      "Medical Operations": {
        "Medical Operations": ["Medical Operations"],
      },
      "Medical Surgical Ward": {
        "Wards": ["Medical Surgical Ward"],
      },
      "MRD": {
        "MRD": ["MRD Administration"],
      },
      "Neuroscience": {
        "Hospital Operations": ["Coordinator-Neuro Surgery", "Coordinator-Neurology", "Coordinator-Neuro Science"],
        "Wards": ["Neuro Surgery Ward"],
        "Anaesthesia": ["Neuro Anaesthesia"],
        "Operation Theater": ["Neuro-OT"],
        "Neurology": ["Neurology"],
        "Neuro Lab": ["EEG/EMG/NCV"],
      },
      "Non Clinical Services": {
        "Hospital Operations": ["Non Clinical Services"],
      },
      "Nursing Administration": {
        "Nursing Administration": ["Nursing Admin"],
      },
      "Nutrition and Dietetics": {
        "Nutrition and Dietetics": ["Dietetics Operations"],
      },
      "Obstetrics and Gynaecology": {
        "Wards": ["Obstetrics and Gynaecology"],
        "Obstetrics and Gynaecology": ["Gynaecology"],
        "OPD": ["Obstetrics and Gynaecology"],
      },
      "OPD": {
        "OPD": ["OP Nursing Counter"],
      },
      "Operation Theater": {
        "Operation Theater": ["Pre and Post Operations"],
      },
      "Ophthalmology": {
        "Ophthalmology": ["Eye"],
      },
      "Orthopedics": {
        "Hospital Operations": ["Coordinator-Ortho"],
        "Operation Theater": ["Orthopedics-OT"],
        "Orthopedics": ["Joint Replacement Surgery"],
      },
      "Patient Care Services": {
        "Patient Care Services": ["Guest Relations"],
      },
      "Pharmacy": {
        "Pharmacy": ["IP Pharmacy", "OP Pharmacy", "OT Pharmacy", "Pharmacy Administration"],
      },
      "Psychiatry": {
        "Psychiatry": ["Psychiatry"],
      },
      "Quality": {
        "Hospital Operations": ["Quality"],
      },
      "Radiology": {
        "Radiology and Imaging": ["MRI/CT/X- Ray"],
      },
      "Renal Science": {
        "Dialysis": ["Dialysis Unit"],
        "Urology": ["Urology"],
        "Nephrology": ["Nephrology"],
        "Uro Lab": ["Uro Lab"],
      },
      "Sales and Marketing": {
        "Sales and Marketing": ["Branding", "Business Development-Domestic", "Digital Marketing", "Referral Sales", "PSU", "Sales and Marketing Administration"],
      },
      "Security and Safety": {
        "Security and Safety": ["Security", "Fire and Safety"],
      },
      "Supply Chain Management": {
        "Supply Chain Management": ["Supply Chain Administration", "General Store", "Receiving Store"],
      },
    },
    "Srinagar": {
      "Anaesthesia": {
        "Anaesthesia": ["General Anaesthesia"],
      },
      "Cancer Centre": {
        "Oncology": ["Surgical Oncology-GI Oncosurgery", "Medical Oncology", "Surgical Oncology"],
        "Hospital Operations": ["Coordinator-Oncology"],
        "Operation Theater": ["Surgical Oncology OT"],
      },
      "Cardiac Science": {
        "Cath lab": ["Cath Lab Unit"],
        "Critical Care": ["CTVS ICU", "CCU"],
        "Hospital Operations": ["Coordinator-CTVS"],
        "Non Invasive Cardiac Lab": ["ECG/ ECHO/TMT Room"],
        "CTVS": ["Peripheral Interventions", "Cardiac Surgery-Adult and Paediatric", "CTVS Core", "Cardiac Surgery-Adult"],
        "Operation Theater": ["Cardiac-OT"],
        "Cardiology": ["Interventional Cardiology", "Non Invasive Cardiology "],
      },
      "Chest and Respiratory": {
        "Pulmonology": ["Pulmonology"],
        "Pulmonary Lab": ["Non Intervention Pulmo Lab"],
      },
      "Child Health": {
        "Critical Care": ["NICU"],
        "Pediatrics": ["Pediatrics"],
      },
      "Clinical Laboratory": {
        "Clinical Laboratory": ["Clinical Patholgy", "Histopathology", "Microbiology", "Hematology", "Bio Chemistry", "Clinical Laboratory Operations"],
      },
      "Critical Care": {
        "Critical Care": ["SICU", "MICU"],
      },
      "CSSD": {
        "CSSD": ["CSSD"],
      },
      "Digestive and Liver Diesease": {
        "Gastroenterology": ["Gastroenterology"],
        "Endoscopy": ["Endoscopy"],
      },
      "Emergency Medicine": {
        "Emergency": ["Emergency"],
        "Nursing Administration": ["Emergency"],
      },
      "Engineering and Maintenance": {
        "Engineering and Maintenance": ["Maintenance"],
      },
      "Finance and Account": {
        "Finance and Account": ["Finance Administration", "AR", "Doctor's Payout", "AP"],
      },
      "Front Office": {
        "Front Office": ["OP Billing"],
      },
      "General Administration": {
        "General Administration": ["Hospital Administration"],
      },
      "General and Minimal Access Surgey": {
        "Operation Theater": ["General-OT"],
        "General Surgery": ["General Surgery Core"],
      },
      "Human Resources": {
        "Human Resources": ["HRBP", "Talent Acqusition", "HR Operations", "Learning and Development"],
      },
      "Information Technology": {
        "Information Technology": ["IT Operations", "IT Support"],
      },
      "Internal Medicine": {
        "Internal Medicine": ["Internal Medicine"],
      },
      "IP Billing": {
        "Finance and Account": ["Bill Processing", "Cashier Billing"],
      },
      "Medical Administration": {
        "Hospital Operations": ["Medical Administration"],
      },
      "Medical Operations": {
        "Medical Operations": ["Medical Operations"],
      },
      "Medical Surgical Ward": {
        "Wards": ["Medical Surgical Ward"],
      },
      "MRD": {
        "MRD": ["MRD Administration"],
      },
      "Neuroscience": {
        "Operation Theater": ["Neuro-OT"],
        "Anaesthesia": ["Neuro Anaesthesia"],
        "Hospital Operations": ["Coordinator-Neurology", "Coordinator-Neuro Surgery"],
        "Neurology": ["Neurology"],
        "Neuro Lab": ["EEG/EMG/NCV"],
      },
      "Non Clinical Services": {
        "Hospital Operations": ["Non Clinical Services"],
      },
      "Nursing Administration": {
        "Nursing Administration": ["Nursing Admin"],
      },
      "Nutrition and Dietetics": {
        "Nutrition and Dietetics": ["Dietetics Operations"],
      },
      "Obstetrics and Gynaecology": {
        "Obstetrics and Gynaecology": ["Gynaecology"],
      },
      "OPD": {
        "OPD": ["OP Nursing Counter"],
      },
      "Operation Theater": {
        "Operation Theater": ["Pre and Post Operations"],
      },
      "Orthopedics": {
        "Orthopedics": ["Joint Replacement Surgery"],
      },
      "Patient Care Services": {
        "Patient Care Services": ["Guest Relations", "Discharge Team"],
      },
      "Pharmacy": {
        "Pharmacy": ["IP Pharmacy", "OP Pharmacy", "OT Pharmacy", "Pharmacy Administration"],
      },
      "Psychiatry": {
        "Psychiatry": ["Psychiatry"],
      },
      "Quality": {
        "Hospital Operations": ["Quality"],
      },
      "Radiology": {
        "Radiology and Imaging": ["CT", "Radiology and Imaging", "MRI", "X-Ray", "MRI/CT/X- Ray"],
        "Hospital Operations": ["Coordinator-Radiology"],
        "Interventional Radiology": ["Interventional Radiology"],
      },
      "Renal Science": {
        "OPD": ["Uro Lab"],
        "Urology": ["Urology"],
        "Nephrology": ["Nephrology"],
        "Dialysis": ["Dialysis Unit"],
      },
      "Rheumatology": {
        "Rheumatology": ["Rheumatology"],
      },
      "Sales and Marketing": {
        "Sales and Marketing": ["Referral Sales", "Business Development-Domestic", "Branding"],
      },
      "Security and Safety": {
        "Security and Safety": ["Fire and Safety", "Fire and Safety"],
      },
      "Supply Chain Management": {
        "Supply Chain Management": ["Supply Chain Administration"],
      },
      "Transfusion Medicine": {
        "Blood Bank": ["Blood Bank"],
      },
    },
    "Udaipur": {
      "Ambulatory Care": {
        "Ambulatory Care": ["Medical Room/Clinics"],
      },
      "Anaesthesia": {
        "Anaesthesia": ["General Anaesthesia"],
      },
      "Bio Medical Engineering": {
        "Bio Medical Engineering": ["BME Operations"],
      },
      "Cancer Centre": {
        "Hospital Operations": ["Coordinator-Oncology DayCare"],
        "Oncology": ["Surgical Oncology", "Chemo Day Care", "Medical Oncology", "Medical Oncology-Haemato Oncology"],
        "Operation Theater": ["Surgical Oncology OT"],
      },
      "Cardiac Science": {
        "Anaesthesia": ["Cardiac Anaesthesia"],
        "Operation Theater": ["Cardiac-OT"],
        "Cardiology": ["Interventional Cardiology", 'Non Invasive Cardiology'],
        "Critical Care": ["CCU"],
        "Cath lab": ["Cath Lab Unit"],
        "Non Invasive Cardiac Lab": ["ECG/ ECHO/TMT Room"],
      },
      "Chest and Respiratory": {
        "Pulmonary Lab": ["Non Intervention Pulmo Lab"],
        "Pulmonology": ["Pulmonology"],
      },
      "Child Health": {
        "Critical Care": ["NICU"],
        "Pediatrics": ["Pediatrics"],
      },
      "Clinical Laboratory": {
        "Clinical Laboratory": ["Phlebotomy", "Microbiology", "Bio Chemistry", "Clinical Patholgy", "Hematology"],
      },
      "Critical Care": {
        "Critical Care": ["MICU", "HDU"],
      },
      "CSSD": {
        "CSSD": ["CSSD"],
      },
      "Digestive and Liver Diesease": {
        "Endoscopy": ["Endoscopy"],
        "Gastroenterology": ["Gastroenterology"],
      },
      "Emergency Medicine": {
        "Emergency": ["Emergency"],
        "Ambulatory Care": ["Medical Room/Clinics", "General Day Care"],
      },
      "Endocrinology": {
        "Endocrinology": ["Endocrinology"],
      },
      "Engineering and Maintenance": {
        "Engineering and Maintenance": ["Engineering and Maintenance", "Maintenance"],
      },
      "Finance and Account": {
        "Finance and Account": ["Finance Administration", "Recovery", "AP"],
      },
      "Food and Beverages": {
        "Food and Beverages": ["FandB Operations"],
      },
      "Front Office": {
        "Front Office": ["OP Billing", "IP Admission"],
      },
      "General Administration": {
        "General Administration": ["Hospital Administration"],
      },
      "General and Minimal Access Surgey": {
        "Operation Theater": ["General-OT"],
        "General Surgery": ["General Surgery Core"],
      },
      "Human Resources": {
        "Human Resources": ["Talent Acqusition", "HR Operations", "HR Administration", "HRBP"],
      },
      "Information Technology": {
        "Information Technology": ["IT Support"],
      },
      "Internal Medicine": {
        "Internal Medicine": ["Internal Medicine"],
        "Hospital Operations": ["Coordinator-Internal Medicine"],
      },
      "IP Billing": {
        "Finance and Account": ["TPA Billing", "Bill Administration", "Credit Billing", "Bill Processing"],
      },
      "Medical Administration": {
        "Hospital Operations": ["Medical Administration"],
      },
      "Medical Operations": {
        "Medical Operations": ["Medical Operations"],
      },
      "Medical Surgical Ward": {
        "Wards": ["Medical Surgical Ward"],
      },
      "MRD": {
        "MRD": ["MRD Administration"],
      },
      "Neuroscience": {
        "Neurology": ["Neurology"],
        "Operation Theater": ["Neuro-OT"],
      },
      "Non Clinical Services": {
        "Hospital Operations": ["Non Clinical Services"],
      },
      "Nursing Administration": {
        "Nursing Administration": ["Nursing Admin"],
      },
      "Nursing Education": {
        "Nursing Administration": ["Nursing Education"],
      },
      "Nutrition and Dietetics": {
        "Nutrition and Dietetics": ["Dietetics Administration"],
      },
      "Obstetrics and Gynaecology": {
        "Labour Room": ["Labour Room"],
        "Obstetrics and Gynaecology": ["Gynaecology"],
        "Hospital Operations": ["Coordinator-Obstetrics and Gynaecology"],
        "OPD": ["Obstetrics and Gynaecology"],
      },
      "OPD": {
        "OPD": ["OP Nursing Counter"],
      },
      "Operation Theater": {
        "Operation Theater": ["Pre and Post Operations"],
      },
      "Ophthalmology": {
        "Ophthalmology Lab": ["Optometry"],
        "Ophthalmology": ["Eye"],
      },
      "Orthopedics": {
        "Orthopedics": ["Orthopedics"],
        "Operation Theater": ["Orthopedics-OT"],
      },
      "Patient Care Services": {
        "Patient Care Services": ["Guest Relations"],
      },
      "Pharmacy": {
        "Pharmacy": ["IP Pharmacy", "Pharmacy Administration", "OP Pharmacy", "OT Pharmacy"],
      },
      "Quality": {
        "Hospital Operations": ["Quality"],
      },
      "Radiology": {
        "Radiology and Imaging": ["X-Ray", "CT", "Radiology and Imaging", "MRI"],
        "Hospital Operations": ["Coordinator-Radiology"],
      },
      "Renal Science": {
        "Urology": ["Urology"],
        "OPD": ["Nephrology"],
        "Nephrology": ["Nephrology"],
      },
      "Rheumatology": {
        "Rheumatology": ["Rheumatology"],
      },
      "Sales and Marketing": {
        "Sales and Marketing": ["Business Development-Domestic", "Branding", "Sales and Marketing Administration", "Digital Marketing", "Referral Sales"],
      },
      "Security and Safety": {
        "Security and Safety": ["Security"],
      },
      "Supply Chain Management": {
        "Supply Chain Management": ["General Store", "Purchase-General Items", "Supply Chain Administration"],
      },
    },
  });


  const [location, setLocation] = useState([
    "Corporate",
    "Customer Care - Globiva Service DLF Phase IV",
    "Darbhanga",
    "Gurgaon",
    "Kanpur",
    "Panchkula",
    "Paras Labs PTC Gurgaon",
    "Patna",
    "Ranchi",
    "Srinagar",
    "Udaipur",
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

  const getSuperSpecialitiesForLocation = (data, location) => {
    // Check if the location exists in the data
    if (data[location]) {
      // Return the keys (SuperSpecialities) for the specified location
      return Object.keys(data[location]);
    } else {
      // Return an empty array if the location is not found
      return [];
    }
  };
  const getKeysForSuperSpeciality = (data, superSpeciality, selectedLocation) => {
    if (data[selectedLocation][superSpeciality]) {
      // Return the keys (department) for the specified location
      return Object.keys(data[selectedLocation][superSpeciality]);
    } else {
      // Return an empty array if the location is not found
      return [];
    }
  };



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
            <Autocomplete
              disablePortal
              options={getSuperSpecialitiesForLocation(facilityData, selectedLocation)}
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
            />
            {selectedSuperSpeciality !== null && selectedLocation !== null && (
              <Autocomplete
                disablePortal
                options={getKeysForSuperSpeciality(facilityData, selectedSuperSpeciality, selectedLocation)}
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
