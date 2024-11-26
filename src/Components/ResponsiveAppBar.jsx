// src/Components/ResponsiveAppBar.jsx

import { useState, useEffect,useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import CarRepairIcon from "@mui/icons-material/CarRepair";
import { addUser, getUsers } from "../service/api.js";
import { useAuth0 } from "@auth0/auth0-react";
import { CurrentUserContext } from "../context/CurrentUserContext";
import { useNavigate } from "react-router-dom";
import {
  CircularProgress,
} from "@mui/material";

const pages = ["Manage Inventory", "Sell","Track Payment","Track Sales & Profit","Expenses"];
const settings = ["Logout"];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const { loading } = useContext(CurrentUserContext);
 

  const { loginWithRedirect, user, logout, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const addUserToDatabase = async () => {
    if (isAuthenticated && user) {
      try {
        await addUser(user);
      } catch (error) {
        console.error("Error adding user:", error);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (isAuthenticated && user) {
        await addUserToDatabase();
        try {
          const users = await getUsers();
          const loggedInUser = users.find((u) => u.sub === user.sub);
          setCurrentUser(loggedInUser);
        } catch (error) {
          console.error("Error fetching user data:", error);
        } 
      } 
    };

    fetchData();
  }, [user, isAuthenticated]);

  const handleNavigation = (page) => {
    if (page === "Manage Inventory") {
      if (isAuthenticated) {
        navigate("/inventory");
      } else {
        loginWithRedirect();
      }
    }else if(page === "Sell"){
      if (isAuthenticated) {
        navigate("/itemSell");
      } else {
        loginWithRedirect();
      }
    }else if(page==="Track Sales & Profit"){
      if (isAuthenticated) {
        navigate("/track");
      } else {
        loginWithRedirect();
      }
    } else if(page==="Track Payment"){
      if (isAuthenticated) {
        navigate("/trackpay");
      } else {
        loginWithRedirect();
      }
    }else if(page==="Expenses"){
      if (isAuthenticated) {
        navigate("/expense");
      } else {
        loginWithRedirect();
      }
    }else {
      alert(`${page} is not configured yet.`);
    }

    
      
   
    

  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <AppBar position="static" style={{width:'100%'}}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Desktop Logo */}
          <CarRepairIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            onClick={() => navigate("/")} // Redirect to home on click
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontWeight: 700,
              letterSpacing: ".1rem",
              color: "inherit",
              textDecoration: "none",
              cursor: "pointer", // Add pointer cursor
            }}
          >
            Expert Car Accessories
          </Typography>

          {/* Mobile Menu Icon */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="open navigation menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={() => handleNavigation(page)}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Mobile Logo */}
          <CarRepairIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            onClick={() => navigate("/")} // Redirect to home on click
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontWeight: 700,
              letterSpacing: ".1rem",
              color: "inherit",
              textDecoration: "none",
              cursor: "pointer", // Add pointer cursor
            }}
          >
            Car Accessories
          </Typography>

          {/* Desktop Menu Items */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => handleNavigation(page)}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page}
              </Button>
            ))}
          </Box>

          {/* User Settings */}
          {isAuthenticated && currentUser ? (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt={currentUser.name || user.name}
                    src={currentUser.picture || user.picture}
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={() => {
                      handleCloseUserMenu();
                      if (setting === "Logout") {
                        logout({ returnTo: window.location.origin });
                      }
                    }}
                  >
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          ) : (
            // Login Button for Unauthenticated Users
            <Button color="inherit" onClick={() => loginWithRedirect()}>
              Login
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
