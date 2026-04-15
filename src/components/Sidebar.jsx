import { Drawer, Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Switch } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import BookIcon from "@mui/icons-material/Book";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

const Sidebar = ({ open, onClose, darkMode, setDarkMode }) => {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 250 }} role="presentation">
        <List>
          {/* الرئيسية */}
          <ListItem disablePadding>
            <ListItemButton onClick={onClose}>
              <ListItemIcon><HomeIcon /></ListItemIcon>
              <ListItemText primary="الرئيسية" />
            </ListItemButton>
          </ListItem>

          {/* إدارة الكتب */}
          <ListItem disablePadding>
            <ListItemButton onClick={onClose}>
              <ListItemIcon><BookIcon /></ListItemIcon>
              <ListItemText primary="إدارة الكتب" />
            </ListItemButton>
          </ListItem>

          {/* تبديل الوضع الليلي */}
          <ListItem>
            <ListItemButton>
              <ListItemIcon>
                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </ListItemIcon>
              <ListItemText primary="الوضع الليلي" />
              <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;