import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  CssBaseline,
  useTheme,
  useMediaQuery,
  ListItemButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import BookIcon from "@mui/icons-material/Book";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { useNavigate } from "react-router-dom";
import ParametrosForm from "./admin/parametros/params";
import MateriasForm from "./admin/materias/materias";
import ProfesoresForm from "./admin/profesores/profesores";
import EstudiantesForm from "./admin/estudiantes/estudiantes";
import EstudianteForm from "./student/estudiantes";

const drawerWidth = 240;

type UserRole = {
  usuarioRolId: number;
  usuarioId: number;
  rolId: number;
};

const AppLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const usuarioNombres = localStorage.getItem("usuarioNombres") || "";
  const usuarioApellidos = localStorage.getItem("usuarioApellidos") || "";
  const roles = JSON.parse(localStorage.getItem("roles") || "[]") as UserRole[];

  const [selectedMenuItem, setSelectedMenuItem] = useState<string>("");
  const userRole = roles[0] ?? null;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const adminMenu = [
    {
      text: "Parametrización",
      icon: <SettingsIcon />,
      component: <ParametrosForm />,
    },
    {
      text: "Materias",
      icon: <AddBoxIcon />,
      component: <MateriasForm />,
    },
    {
      text: "Profesores",
      icon: <PeopleIcon />,
      component: <ProfesoresForm />,
    },
    {
      text: "Estudiantes",
      icon: <SchoolIcon />,
      component: <EstudiantesForm />,
    },
  ];

  const studentMenu = [
    {
      text: "Inscribir materias",
      icon: <BookIcon />,
      component: <EstudianteForm />,
    },
  ];

  const renderContent = () => {
    if (!selectedMenuItem) {
      return (
        <>
          <Typography variant="h4" gutterBottom>
            Bienvenido {usuarioNombres} {usuarioApellidos}
          </Typography>
          <Typography>¿Qué harás hoy?.</Typography>
        </>
      );
    }

    const item = menuItems.find((item) => item.text === selectedMenuItem);
    if (item && item.component) {
      return item.component;
    }

    return null;
  };

  const menuItems = userRole.rolId === 1 ? adminMenu : studentMenu;

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="subtitle1" noWrap component="div">
          {usuarioNombres} {usuarioApellidos}
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => {
                setSelectedMenuItem(item.text);
                if (isMobile) handleDrawerToggle();
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Cerrar sesión" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap component="div">
            Sistema Académico
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="menu de navegación"
      >
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Mejora performance en móvil
          }}
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        {renderContent()}
      </Box>
    </Box>
  );
};

export default AppLayout;
