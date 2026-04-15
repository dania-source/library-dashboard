import { AppBar, Toolbar, Typography, Box, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const Navbar = ({ logo, onMenuClick }) => {
return (
    <AppBar position="static" sx={{ backgroundColor: "#541029" }}>
    <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
    <Box sx={{ display: "flex", alignItems: "center" }}>
        {/* عم نعامل البوكس كوسم img */}
            <Box component="img" src={logo} alt="Logo" sx={{ height: 40, marginLeft: 2, objectFit: "contain" }} />
            <Typography variant="h5" sx={{ color: "#F3C5C7", marginLeft: 2 }}>
                لوحة تحكم المكتبة
            </Typography>
        </Box>
        <IconButton onClick={onMenuClick} color="inherit">
            <MenuIcon />
        </IconButton>
    </Toolbar>
    </AppBar>
);
};

export default Navbar;