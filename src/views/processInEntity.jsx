import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import axios from "axios";
import MenuCard from "../components/menuCard"; 
import { Box, CircularProgress, Alert } from "@mui/material";
import Title from "../components/Title"; 

import BusinessIcon from '@mui/icons-material/Business';
import SchoolIcon from '@mui/icons-material/School';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import YardOutlinedIcon from '@mui/icons-material/YardOutlined';
import ScienceOutlinedIcon from '@mui/icons-material/ScienceOutlined';
import PsychologyOutlinedIcon from '@mui/icons-material/PsychologyOutlined';
import MedicalInformationOutlinedIcon from '@mui/icons-material/MedicalInformationOutlined';
import ImportContactsOutlinedIcon from '@mui/icons-material/ImportContactsOutlined';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import BloodtypeOutlinedIcon from '@mui/icons-material/BloodtypeOutlined';
import BiotechOutlinedIcon from '@mui/icons-material/BiotechOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import SocialDistanceOutlinedIcon from '@mui/icons-material/SocialDistanceOutlined';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';
import TranslateOutlinedIcon from '@mui/icons-material/TranslateOutlined';
import CampaignOutlinedIcon from '@mui/icons-material/CampaignOutlined';
import LaptopChromebookOutlinedIcon from '@mui/icons-material/LaptopChromebookOutlined';
import BalanceOutlinedIcon from '@mui/icons-material/BalanceOutlined';
import LocalLibraryOutlinedIcon from '@mui/icons-material/LocalLibraryOutlined';
import TopicOutlinedIcon from '@mui/icons-material/TopicOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import TimelineOutlinedIcon from '@mui/icons-material/TimelineOutlined';


const iconOptions = [
    { name: 'Business', component: <BusinessIcon /> },
    { name: 'School', component: <SchoolIcon /> },
    { name: 'AccountBalance', component: <AccountBalanceOutlinedIcon /> },
    { name: 'HomeWork', component: <HomeWorkIcon /> },
    { name: 'Yard', component: <YardOutlinedIcon /> },
    { name: 'Science', component: <ScienceOutlinedIcon /> },
    { name: 'Biotech', component: <BiotechOutlinedIcon /> },
    { name: 'Psychology', component: <PsychologyOutlinedIcon /> },
    { name: 'Medical', component: < MedicalInformationOutlinedIcon /> },
    { name: 'Bloodtype', component: <BloodtypeOutlinedIcon /> },
    { name: 'LocalHospital', component: <LocalHospitalOutlinedIcon /> },
    { name: 'Topic', component: <TopicOutlinedIcon /> },
    { name: 'Assignment', component: <AssignmentOutlinedIcon /> },
    { name: 'Article', component: <ArticleOutlinedIcon /> },
    { name: 'ImportContacts', component: <ImportContactsOutlinedIcon /> },
    { name: 'AutoStories', component: <AutoStoriesOutlinedIcon /> },
    { name: 'LocalLibrary', component: <LocalLibraryOutlinedIcon /> },
    { name: 'Lightbulb', component: <LightbulbOutlinedIcon /> },
    { name: 'Settings', component: <SettingsOutlinedIcon /> },
    { name: 'PeopleOutline', component: <PeopleOutlineOutlinedIcon /> },
    { name: 'SocialDistance', component: <SocialDistanceOutlinedIcon /> },
    { name: 'Groups', component: <GroupsOutlinedIcon /> },
    { name: 'Gavel', component: <GavelOutlinedIcon /> },
    { name: 'Balance', component: <BalanceOutlinedIcon /> },
    { name: 'Assessment', component: <AssessmentOutlinedIcon /> },
    { name: 'Timeline', component: <TimelineOutlinedIcon /> },
    { name: 'Paid', component: <PaidOutlinedIcon /> },
    { name: 'RequestQuote', component: <RequestQuoteOutlinedIcon /> },
    { name: 'Translate', component: <TranslateOutlinedIcon /> },
    { name: 'Campaign', component: <CampaignOutlinedIcon /> },
    { name: 'LaptopChromebook', component: <LaptopChromebookOutlinedIcon /> },

];

const ProcessInEntity = () => {
    const { idEntidad } = useParams(); 
    const navigate = useNavigate(); 
    const [procesos, setProcesos] = useState([]);
    const [nombreEntidad, setNombreEntidad] = useState("");
    const [isLoading, setIsLoading] = useState(true); 

    useEffect(() => {
        if (!idEntidad) {
            console.error("ID de entidad no recibido");
            return;
        }

        axios.get(`http://127.0.0.1:8000/api/procesos/entidad/${idEntidad}`)
            .then(response => {
                console.log("Procesos obtenidos:", response.data);
                setProcesos(response.data.procesos || response.data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Error obteniendo procesos:", error);
                setIsLoading(false);
            });

        axios.get(`http://127.0.0.1:8000/api/entidades/${idEntidad}`)
            .then(response => setNombreEntidad(response.data.nombreEntidad))
            .catch(error => console.error("Error obteniendo el nombre de la entidad:", error));

    }, [idEntidad]);

    return (
        
        <Box sx={{ textAlign: "center", padding: "20px" }}>
            
            {/* Título mejorado con el componente Title */}
            <Title text={`Procesos de ${nombreEntidad}`} />

            {/* Indicador de carga elegante */}
            {isLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                    <CircularProgress color="primary" />
                </Box>
            ) : (
                <Box 
                    sx={{
                        display: "flex", 
                        flexWrap: "wrap", 
                        justifyContent: "center", 
                        gap: "16px", 
                        marginTop: "20px"
                    }}
                >
                    {procesos.length === 0 ? (
                        <Alert severity="warning" sx={{ width: "50%", margin: "0 auto" }}>
                            No se encontraron procesos para esta entidad.
                        </Alert>
                    ) : (
                        procesos.map(proceso => {
                            const iconObj = iconOptions.find(icon => icon.name === proceso.icono);
                            const IconComponent = iconObj ? iconObj.component : null;
              
                            return (
                              <MenuCard 
                                key={proceso.idProceso}
                                icon={IconComponent || null}
                                title={proceso.nombreProceso}
                                onClick={() => navigate(`/estructura-procesos/${proceso.idProceso}`)}
                              />
                            );
                          })
                        )}
                      </Box>
                    )}
                  </Box>
                );
              };

export default ProcessInEntity;

