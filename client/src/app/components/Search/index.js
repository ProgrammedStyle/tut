import SearchIcon from "@mui/icons-material/Search";
import { useLanguage } from "../../contexts/LanguageContext";
import { useState, useEffect } from "react";
import WhiteIconButton from "../WhiteIconButton";
import InputText from "../InputText";
import styles from "./index.module.css";

const Search = () => {
  const { t } = useLanguage();
  const [isClient, setIsClient] = useState(false);
  
  // Set client flag on mount
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Safe translation function
  const safeT = (key) => {
    if (!isClient) {
      return 'Search'; // Fallback during SSR
    }
    return t(key);
  };
  
  return (
    <InputText
        inputProps={{
            type: "search",
            value: "",
            name: "search",
            inputTextStyle: styles.searchInputTextBox
        }}
        icon={
            <WhiteIconButton 
                sx={{
                    padding: "6px"  
                }}
            >
                <SearchIcon
                    style={{
                        fontSize: 18   
                    }}
                    sx={{
                        "& path": {
                            fill: "#fff !important"
                        }
                    }}
                />
            </WhiteIconButton>
        }
        borderBottom={false}
        bgColor={false}
        linesColor={"defColor"}
        label={safeT('header-search-placeholder')}
    />
  );
};

export default Search;
