import { AppBar, Toolbar, Typography, Box, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const Navbar = ({ logo, onMenuClick }) => {
  return (
    <AppBar 
      position="fixed" // التغيير هنا لجعلها ثابتة تماماً في أعلى الشاشة
      sx={{ 
        backgroundColor: "#480D21",
        zIndex: (theme) => theme.zIndex.drawer + 1 // لضمان بقائها فوق الـ Sidebar
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box 
            component="img" 
            src={logo} 
            alt="Logo" 
            sx={{ height: 40, marginLeft: 2, objectFit: "contain" }} 
          />
          <Typography variant="h5" sx={{ color: "#F3C5C7", marginLeft: 2 }}>
            لوحة تحكم المكتبة
          </Typography>
        </Box>
       
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;