// src/components/ResponsiveSidebarMenu.tsx
import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Button,
  Typography,
  Divider,
  Box,
  IconButton,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import {
  ExpandLess,
  ExpandMore,
  School,
  Settings,
  People,
  MenuBook,
  Logout,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
// Definición de los tipos de menú
import type {
  MenuItem,
  ResponsiveSidebarMenuProps,
} from "./interfaces/SidebarMenu";

const drawerWidth = 240;

const ResponsiveSidebarMenu: React.FC<ResponsiveSidebarMenuProps> = ({
  role,
  userName,
  onLogout,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<{ [key: string]: boolean }>(
    {}
  );

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // md ~ 960px

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSubmenuClick = (label: string) => {
    setOpenSubmenus((prevState) => ({
      ...prevState,
      [label]: !prevState[label],
    }));
  };

  // Menús
  const adminMenu: MenuItem[] = [
    {
      label: "Parametrización",
      path: "/admin/parametros/params",
      icon: <Settings />,
    },
    {
      label: "Materias",
      path: "/admin/materrias/materias",
      icon: <MenuBook />,
    },
    {
      label: "Profesores",
      path: "/admin/profesores/profesores",
      icon: <People />,
    },
    {
      label: "Estudiantes",
      path: "/admin/estudiantes/estudiantes",
      icon: <School />,
    },
  ];

  const studentMenu: MenuItem[] = [
    {
      label: "Registrar materias",
      path: "/student/materias/registrar",
      icon: <MenuBook />,
    },
  ];

  const menuItems = role === 1 ? adminMenu : studentMenu;

  // Drawer content
  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" noWrap component="div">
          {userName}
        </Typography>
      </Box>
      <Divider />

      {/* Menu */}
      <List>
        {menuItems.map((item, index) => (
          <div key={index}>
            {item.subMenu ? (
              <>
                <ListItem onClick={() => handleSubmenuClick(item.label)}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                  {openSubmenus[item.label] ? <ExpandLess /> : <ExpandMore />}
                </ListItem>
                <Collapse
                  in={openSubmenus[item.label]}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {item.subMenu.map((subItem, subIndex) => (
                      <ListItem
                        key={subIndex}
                        component={Link}
                        to={subItem.path}
                        sx={{ pl: 4 }}
                        onClick={() => isMobile && setMobileOpen(false)}
                      >
                        <ListItemIcon>
                          <MenuBook />
                        </ListItemIcon>
                        <ListItemText primary={subItem.label} />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </>
            ) : (
              <ListItem
                component={Link}
                to={item.path!}
                onClick={() => isMobile && setMobileOpen(false)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            )}
          </div>
        ))}
      </List>

      {/* Footer */}
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <Box sx={{ p: 2 }}>
        <Button
          variant="contained"
          color="error"
          startIcon={<Logout />}
          fullWidth
          onClick={onLogout}
        >
          Cerrar sesión
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      {/* AppBar solo en mobile */}
      {isMobile && (
        <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Sistema
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="menu lateral"
      >
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>
    </>
  );
};

export default ResponsiveSidebarMenu;
