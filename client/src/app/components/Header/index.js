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
import { IconButton, Menu, MenuItem, Typography, Box, TextField, InputAdornment, Dialog, DialogContent } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../contexts/LanguageContext';


const Header = () => {
  const { userData } = useSelector((state) => state.user);
  const [languageAnchorEl, setLanguageAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const router = useRouter();
  const { changeLanguage, languageData, currentLanguage, t } = useLanguage();
  const [isClient, setIsClient] = useState(false);

  // Set client flag on mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Safe translation function for Header
  const safeT = (key) => {
    if (!isClient) {
      // During SSR, return fallback text
      const fallbacks = {
        'header-home': 'Home',
        'header-language': 'Select Language',
        'header-profile': 'Profile',
        'header-create-account': 'Create Account',
        'header-signin': 'Sign In',
        'header-dashboard': 'Dashboard',
        'header-about-us': 'About Us',
        'header-contact-us': 'Contact Us',
        'header-sign-out': 'Sign Out'
      };
      return fallbacks[key] || key;
    }
    return t(key);
  };

  const languages = [
    { code: 'sa', name: 'العربية', flagImage: '/43202d1d-0b38-0519-664b-ad756f89352a.webp', englishName: 'Arabic (Saudi Arabia)' },
    { code: 'de', name: 'Deutsch', flagImage: '/ef08ffca-86b1-0596-edcb-efd50e14b233.png', englishName: 'German' },
    { code: 'gb', name: 'English', flagImage: '/02f88a29-69f3-66cb-e866-0fe8658c141a.webp', englishName: 'English (UK)' },
    { code: 'it', name: 'Italiano', flagImage: '/50baa781-a501-cc27-8bab-b5fe9be04435.webp', englishName: 'Italian' },
    { code: 'es', name: 'Español', flagImage: '/OIP.webp', englishName: 'Spanish' },
    { code: 'ir', name: 'فارسی', flagImage: '/c912c394-4616-b548-27e2-a4dcbd80b5cc.webp', englishName: 'Persian' },
    { code: 'pk', name: 'اردو', flagImage: '/239b7560-8f8d-e4ad-1e97-d329f86cc189.webp', englishName: 'Urdu' },
    { code: 'tr', name: 'Türkçe', flagImage: '/817660b1-0350-87a9-2987-92b56f0bd99c.webp', englishName: 'Turkish' },
    { code: 'id', name: 'Bahasa Indonesia', flagImage: '/b37d4f5b-2634-5030-68f4-42190b5d9cc4.webp', englishName: 'Indonesian' },
    { code: 'ru', name: 'Русский', flagImage: '/722a3e3a-756d-c106-9e95-7df0eb00c161.webp', englishName: 'Russian' },
    { code: 'in', name: 'हिन्दी', flagImage: '/2329dd78-7690-6ff6-e7a5-a5f487305e97.webp', englishName: 'Hindi' }
  ];

  const handleLanguageClick = (event) => {
    setLanguageAnchorEl(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setLanguageAnchorEl(null);
  };

  // Handle Google search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirect to Google search results
      window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery.trim())}`, '_blank');
      setSearchQuery(''); // Clear the search field
    }
  };

  const handleLanguageSelect = (language) => {
    // Change the website language immediately
    changeLanguage(language.code);
    handleLanguageClose();
  };

  const personalIconSX = {
    fontSize: "24px",
    color: "rgba(0, 0, 0, 0.5)"
  };

  const signedoutTools = [
    { role: "item", link: "/CreateAccount", content: (
      <Fragment>
        <PersonAddAltOutlinedIcon sx={personalIconSX} />
        <div>
          {safeT('header-create-account')}
        </div>
      </Fragment>
    ) },
    { role: "item", link: "/SignIn", content: (
      <Fragment>
        <LoginOutlinedIcon sx={personalIconSX} />
        <div>
          {safeT('header-signin')}
        </div>
      </Fragment>
    ) }
  ];

  const adminTools = [
    { role: "item", link: "/Dashboard", content: (
      <Fragment>
        <DashboardIcon sx={personalIconSX} />
        <div>
          {safeT('header-dashboard')}
        </div>
      </Fragment>
    ) }
  ];

  const signoutTool = [
    { role: "item", link: "/SignOut", content: (
      <Fragment>
        <LogoutIcon sx={personalIconSX} />
        <div>
          {safeT('header-sign-out')}
        </div>
      </Fragment>
    ) }
  ];

  const tools = ((userData === null) ? signedoutTools:adminTools);

  const signout = ((userData === null) ? []:signoutTool);

  const headerElem = useRef(null);

  const navIconSX = {
    fontSize: "28px",
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
          
          {/* Google Search Field with text below - Desktop - Only render on client side */}
          {isClient && (
            <Box sx={{ marginLeft: '20px', display: { xs: 'none', md: 'block' } }}>
              <form onSubmit={handleSearch}>
                <Box
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    width: '320px',
                    height: '44px',
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(20px)',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                      transition: 'left 0.5s ease',
                    },
                    '&:hover': {
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      boxShadow: '0 8px 32px 0 rgba(255, 255, 255, 0.1), inset 0 0 20px rgba(255, 255, 255, 0.05)',
                      transform: 'translateY(-2px)',
                      '&::before': {
                        left: '100%',
                      },
                    },
                    '&:focus-within': {
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08))',
                      border: '1px solid rgba(255, 255, 255, 0.4)',
                      boxShadow: '0 12px 40px 0 rgba(255, 255, 255, 0.15), inset 0 0 30px rgba(255, 255, 255, 0.08)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                <SearchIcon 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.8)', 
                    ml: 2,
                    fontSize: '22px',
                    transition: 'all 0.3s ease',
                    filter: 'drop-shadow(0 2px 4px rgba(255, 255, 255, 0.2))',
                  }} 
                />
                <input
                  type="text"
                  placeholder="Search anything..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch(e);
                    }
                  }}
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    backgroundColor: 'transparent',
                    color: '#fff',
                    fontSize: '14.5px',
                    fontWeight: '500',
                    padding: '12px 16px',
                    fontFamily: 'inherit',
                    letterSpacing: '0.5px',
                  }}
                />
                  {searchQuery && (
                    <Box
                      component="button"
                      type="submit"
                      sx={{
                        mr: 1,
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        color: '#fff',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.2))',
                          transform: 'scale(1.08) rotate(5deg)',
                          boxShadow: '0 6px 20px rgba(255, 255, 255, 0.3)',
                          border: '1px solid rgba(255, 255, 255, 0.4)',
                        },
                        '&:active': {
                          transform: 'scale(0.95)',
                        },
                      }}
                    >
                      <SearchIcon sx={{ fontSize: '18px' }} />
                    </Box>
                  )}
                </Box>
              </form>
              
              {/* Small "Alquds Virtual Guide" text below search field */}
              <Typography
                sx={{
                  fontSize: '0.6rem',
                  color: '#fff',
                  textAlign: 'left',
                  mt: 0.5,
                  fontWeight: 300,
                  letterSpacing: '0.5px',
                }}
              >
                Alquds Virtual Guide
              </Typography>
            </Box>
          )}
        </div>
        
        <div className={styles.hRightB}>
          {/* Mobile Search Button - Only show on small screens */}
          {isClient && (
            <IconButton
              onClick={() => setMobileSearchOpen(true)}
              sx={{ 
                display: { xs: 'flex', md: 'none' },
                color: '#fff',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)'
                }
              }}
            >
              <SearchIcon sx={{ fontSize: "28px" }} />
            </IconButton>
          )}
          
          <NavLink role={<HomeIcon sx={navIconSX}/>} title={safeT('header-home')} link={"/"} />          
          {/* Language Dropdown - Only render on client side */}
          {isClient && (
            <IconButton
              onClick={handleLanguageClick}
              sx={{ 
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: 0.8,
                px: 2,
                py: 1,
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)'
                }
              }}
              title={safeT('header-language')}
            >
              <Box sx={{ width: '28px', height: '20px', position: 'relative', borderRadius: '4px', overflow: 'hidden' }}>
                <Image 
                  src={languages.find(l => l.code === currentLanguage)?.flagImage || '/02f88a29-69f3-66cb-e866-0fe8658c141a.webp'}
                  alt="Language flag"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </Box>
              <LanguageIcon sx={{ fontSize: "26px" }} />
            </IconButton>
          )}
          
          {isClient && (
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
                  py: 2,
                  minHeight: '48px !important',
                  padding: '12px 16px !important'
                },
                '& .MuiMenuItem-gutters': {
                  padding: '12px 16px !important',
                  minHeight: '48px !important'
                }
              }
            }}
          >
            {languages.map((language) => {
              const isSelected = currentLanguage === language.code;
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
                  <Box sx={{ width: '36px', height: '26px', position: 'relative', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                    <Image 
                      src={language.flagImage}
                      alt={`${language.englishName} flag`}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </Box>
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
          )}
          
          {/* Profile Menu - Only render on client side */}
          {isClient && (
            <MenuComponent
            menuItemsStyle={styles.menuItemsStyle}
            menuAnchor={
              <NavLink role={<Person sx={navIconSX} />} title={safeT('header-profile')} link={null} />
            }
            menuItems={[
              ...tools
              ,
              { role: "Divider", link: null, content: null },
              { role: "item", link: "/about", content: (
                <Fragment>
                  <InfoOutlinedIcon sx={personalIconSX} />
                  <div>
                    {safeT('header-about-us')}
                  </div>
                </Fragment>
              ) },
              { role: "item", link: "/contact", content: (
                <Fragment>
                  <ContactMailOutlinedIcon sx={personalIconSX} />
                  <div>
                    {safeT('header-contact-us')}
                  </div>
                </Fragment>
              ) },
              ...signout
            ]}
            />
          )}
        </div>
      </div>
      
      {/* Mobile Search Dialog */}
      <Dialog 
        open={mobileSearchOpen} 
        onClose={() => setMobileSearchOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            backgroundColor: '#1a1a1a',
            borderRadius: '16px',
            padding: 2
          }
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" sx={{ color: '#fff' }}>Search</Typography>
            <IconButton onClick={() => setMobileSearchOpen(false)} sx={{ color: '#fff' }}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          <form onSubmit={(e) => { handleSearch(e); setMobileSearchOpen(false); }}>
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
              }}
            >
              <SearchIcon 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.8)', 
                  ml: 2,
                  fontSize: '22px',
                }} 
              />
              <input
                type="text"
                placeholder="Search anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: '500',
                  padding: '14px 16px',
                  fontFamily: 'inherit',
                  letterSpacing: '0.5px',
                }}
              />
              {searchQuery && (
                <Box
                  component="button"
                  type="submit"
                  sx={{
                    mr: 1,
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1))',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    color: '#fff',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.2))',
                    },
                  }}
                >
                  <SearchIcon sx={{ fontSize: '20px' }} />
                </Box>
              )}
            </Box>
          </form>
          
          {/* Small "Alquds Virtual Guide" text below mobile search field */}
          <Typography
            sx={{
              fontSize: '0.6rem',
              color: '#fff',
              textAlign: 'left',
              mt: 1,
              fontWeight: 300,
              letterSpacing: '0.5px',
            }}
          >
            Alquds Virtual Guide
          </Typography>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;