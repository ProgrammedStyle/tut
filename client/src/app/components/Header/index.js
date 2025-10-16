"use client";

import Logo from "../Logo";
import styles from "./index.module.css";
import Search from "../Search";
import NavLink from "../NavLink";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Person from "@mui/icons-material/Person";
import MenuComponent from "../MenuComponent";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import { Fragment, useEffect, useRef, useState } from "react";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import GavelIcon from "@mui/icons-material/Gavel";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ContactMailOutlinedIcon from "@mui/icons-material/ContactMailOutlined";
import { useSelector } from 'react-redux';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import { IconButton, Menu, MenuItem, Typography, Box } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../contexts/LanguageContext';


const Header = () => {
  const { userData } = useSelector((state) => state.user);
  const [languageAnchorEl, setLanguageAnchorEl] = useState(null);
  const router = useRouter();
  const { changeLanguage, languageData } = useLanguage();

  const languages = [
    { code: 'sa', name: 'العربية', flag: '🇸🇦', englishName: 'Arabic (Saudi Arabia)' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪', englishName: 'German' },
    { code: 'gb', name: 'English', flag: '🇬🇧', englishName: 'English (UK)' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹', englishName: 'Italian' },
    { code: 'es', name: 'Español', flag: '🇪🇸', englishName: 'Spanish' },
    { code: 'ir', name: 'فارسی', flag: '🇮🇷', englishName: 'Persian' },
    { code: 'pk', name: 'اردو', flag: '🇵🇰', englishName: 'Urdu' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷', englishName: 'Turkish' },
    { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩', englishName: 'Indonesian' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺', englishName: 'Russian' },
    { code: 'in', name: 'हिन्दी', flag: '🇮🇳', englishName: 'Hindi' }
  ];

  const handleLanguageClick = (event) => {
    setLanguageAnchorEl(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setLanguageAnchorEl(null);
  };

  const handleLanguageSelect = (language) => {
    // Change the website language immediately
    changeLanguage(language.code);
    handleLanguageClose();
  };

  const personalIconSX = {
    fontSize: "18px",
    color: "rgba(0, 0, 0, 0.5)"
  };

  const signedoutTools = [
    { role: "item", link: "/CreateAccount", content: (
      <Fragment>
        <PersonAddAltOutlinedIcon sx={personalIconSX} />
        <div>
          Create Account
        </div>
      </Fragment>
    ) },
    { role: "item", link: "/SignIn", content: (
      <Fragment>
        <LoginOutlinedIcon sx={personalIconSX} />
        <div>
          Sign In
        </div>
      </Fragment>
    ) }
  ];

  const adminTools = [
    { role: "item", link: "/Dashboard", content: (
      <Fragment>
        <DashboardIcon sx={personalIconSX} />
        <div>
          Dashboard
        </div>
      </Fragment>
    ) }
  ];

  const signoutTool = [
    { role: "item", link: "/SignOut", content: (
      <Fragment>
        <LogoutIcon sx={personalIconSX} />
        <div>
          Sign Out
        </div>
      </Fragment>
    ) }
  ];

  const tools = ((userData === null) ? signedoutTools:adminTools);

  const signout = ((userData === null) ? []:signoutTool);

  const headerElem = useRef(null);

  const navIconSX = {
    fontSize: "23px",
    color: "#fff"
  };

  useEffect(() => {
    const currentHeader = headerElem.current;
    if ( currentHeader ) {
      const updateHeaderWidth = () => {
        // Calculate scrollbar width
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        
          // Set header width to exclude scrollbar
          if (currentHeader) {
            currentHeader.style.width = `calc(100% - ${scrollbarWidth}px)`;
            
            // Set body padding to exactly match header height
            document.body.style.paddingTop = `${currentHeader.offsetHeight}px`;
          }
      };
      
      const observer = new ResizeObserver(() => {
        updateHeaderWidth();
      });

      if (currentHeader) {
        observer.observe(currentHeader);
      }
      
      // Initial update
      updateHeaderWidth();
      
      // Update on window resize
      window.addEventListener('resize', updateHeaderWidth);
    
      return () => {
        if (currentHeader) {
          observer.unobserve(currentHeader);
        }
        window.removeEventListener('resize', updateHeaderWidth);
      };
    }
  }, []);

  return (
    <header className={styles.header} ref={headerElem}>
      <div className={styles.headerContent}>
        <div className={styles.hLeftB}>
          <Logo click={true} />
        </div>
        <div className={styles.hRightB}>
          <NavLink role={<HomeIcon sx={navIconSX}/>} title={"Home"} link={"/"} />          
          {/* Language Dropdown */}
          <IconButton
            onClick={handleLanguageClick}
            sx={{ 
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              px: 1.5,
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)'
              }
            }}
            title="Select Language"
          >
            <Typography sx={{ fontSize: '1.3rem' }}>
              {languages.find(l => l.code === languageData.code)?.flag || '🇬🇧'}
            </Typography>
            <LanguageIcon sx={{ fontSize: "20px" }} />
          </IconButton>
          
          <Menu
            anchorEl={languageAnchorEl}
            open={Boolean(languageAnchorEl)}
            onClose={handleLanguageClose}
            PaperProps={{
              sx: {
                maxHeight: '400px',
                width: '250px',
                '& .MuiMenuItem-root': {
                  px: 2,
                  py: 1.5
                }
              }
            }}
          >
            {languages.map((language) => {
              const isSelected = languageData.code === language.code;
              return (
                <MenuItem 
                  key={language.code}
                  onClick={() => handleLanguageSelect(language)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    backgroundColor: isSelected ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                    borderLeft: isSelected ? '4px solid #667eea' : '4px solid transparent',
                    '&:hover': {
                      backgroundColor: isSelected ? 'rgba(102, 126, 234, 0.15)' : 'rgba(0, 0, 0, 0.04)'
                    }
                  }}
                >
                  <Typography sx={{ fontSize: '1.5rem' }}>
                    {language.flag}
                  </Typography>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ 
                      fontWeight: isSelected ? 600 : 500, 
                      fontSize: '0.9rem',
                      color: isSelected ? '#667eea' : 'inherit'
                    }}>
                      {language.name}
                    </Typography>
                    <Typography sx={{ 
                      fontSize: '0.75rem', 
                      color: isSelected ? '#667eea' : 'text.secondary',
                      opacity: isSelected ? 0.8 : 1
                    }}>
                      {language.englishName}
                    </Typography>
                  </Box>
                  {isSelected && (
                    <Typography sx={{ fontSize: '1.2rem', color: '#667eea' }}>
                      ✓
                    </Typography>
                  )}
                </MenuItem>
              );
            })}
          </Menu>
          
          {/* Profile Menu */}
          <MenuComponent
            menuItemsStyle={styles.menuItemsStyle}
            menuAnchor={
              <NavLink role={<Person sx={navIconSX} />} title={"Profile"} link={null} />
            }
            menuItems={[
              ...tools
              ,
              { role: "Divider", link: null, content: null },
              { role: "item", link: "/about", content: (
                <Fragment>
                  <InfoOutlinedIcon sx={personalIconSX} />
                  <div>
                    About Us
                  </div>
                </Fragment>
              ) },
              { role: "item", link: "/contact", content: (
                <Fragment>
                  <ContactMailOutlinedIcon sx={personalIconSX} />
                  <div>
                    Contact Us
                  </div>
                </Fragment>
              ) },
              ...signout
            ]}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;