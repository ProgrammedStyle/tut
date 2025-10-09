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
import { Fragment, useEffect, useRef } from "react";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import GavelIcon from "@mui/icons-material/Gavel";

const Header = () => {
  const headerElem = useRef(null);

  const navIconSX = {
    fontSize: "23px",
    color: "#fff"
  };

  const personalIconSX = {
    fontSize: "18px",
    color: "rgba(0, 0, 0, 0.5)"
  };

  useEffect(() => {
    if ( headerElem ) {
      const observer = new ResizeObserver(() => {
        document.body.style.paddingTop = `${headerElem.current.offsetHeight}px`;
      });

      observer.observe(headerElem.current);
    
      return () => {
        observer.unobserve(headerElem.current);
      };
    }
  }, []);

  return (
    <header className={styles.header} ref={headerElem}>
      <div className={styles.hLeftB}>
        <Logo click={true} />
        <Search />
      </div>
      <div className={styles.hRightB}>
        <NavLink role={<HomeIcon sx={navIconSX}/>} title={"Home"} link={"/"} />
        <NavLink role={<ShoppingCartIcon sx={navIconSX} />} title={"My Cart"} link={"/cart"} />
        <MenuComponent
          menuItemsStyle={styles.menuItemsStyle}
          menuAnchor={
            <NavLink role={<Person sx={navIconSX} />} title={"Profile"} link={null} />
          }
          menuItems={[
            { role: "item", link: "/CreateAccount", content: (
              <Fragment>
                <PersonAddAltOutlinedIcon sx={personalIconSX} />
                <div>
                  Create Account
                </div>
              </Fragment>
            ) },
            { role: "item", link: "/Sign In", content: (
              <Fragment>
                <LoginOutlinedIcon sx={personalIconSX} />
                <div>
                  Sign In
                </div>
              </Fragment>
            ) },
            { role: "Divider", link: null, content: null },
            { role: "item", link: "/Privacy Policy", content: (
              <Fragment>
                <PrivacyTipIcon sx={personalIconSX} />
                <div>
                  Privacy Policy
                </div>
              </Fragment>
            ) },
            { role: "item", link: "/Terms", content: (
              <Fragment>
                <GavelIcon sx={personalIconSX} />
                <div>
                  Terms
                </div>              
              </Fragment>
            ) }
          ]}
        />
      </div>
    </header>
  );
};

export default Header;