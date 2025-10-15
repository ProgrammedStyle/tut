import SearchIcon from "@mui/icons-material/Search";
import WhiteIconButton from "../WhiteIconButton";
import InputText from "../InputText";
import styles from "./index.module.css";

const Search = () => (
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
        label="Search"
    />
);

export default Search;
