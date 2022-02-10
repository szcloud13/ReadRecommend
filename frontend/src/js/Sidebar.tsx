// Sidebar.tsx
// User sidebar which is rendered when a user is signed in.
import React from "react";
import * as Router from 'react-router-dom';
import * as $ from "jquery";

// Material UI
import CollectionsBookmarkIcon from '@material-ui/icons/CollectionsBookmark';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import LocalLibraryIcon from '@material-ui/icons/LocalLibrary';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import HomeIcon from '@material-ui/icons/Home';
import PeopleIcon from '@material-ui/icons/People';
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import CookieService from "../services/CookieService";
import { makeStyles, useTheme } from "@material-ui/core/styles";

const drawerWidth = 240;

const Style = makeStyles((theme) => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerContainer: {
        overflow: 'auto',
    },
}));

// 
const Sidebar: React.FC = ({}) => {
    const classes = Style();    
    const theme = useTheme();
    return (
        
        <div className={classes.drawerContainer}>
            <List>
                <ListItem button key={'Home Page'} component={Router.Link} to="/">
                <ListItemIcon><HomeIcon /></ListItemIcon>
                <ListItemText primary={'Home Page'} />
                </ListItem>

                <ListItem button key={'My Library'} component={Router.Link} to="/user/userlibrary">
                <ListItemIcon><LocalLibraryIcon /></ListItemIcon>
                <ListItemText primary={'My Library'} />
                </ListItem>

                <ListItem button key={'Find Users'} component={Router.Link} to="/user/findusers">
                <ListItemIcon><PeopleIcon /></ListItemIcon>
                <ListItemText primary={'Find Users'} />
                </ListItem>

                <ListItem button key={"My Profile"} component={Router.Link} to="/user/profile">
                <ListItemIcon><LibraryBooksIcon /></ListItemIcon>
                <ListItemText primary={'My Profile'} />
                </ListItem>

                <ListItem button key={"More Books"} component={Router.Link} to="/user/recommendations">
                <ListItemIcon><MenuBookIcon /></ListItemIcon>
                <ListItemText primary={'More Books'} />
                </ListItem>

                <ListItem button key={"Keyword Search"} component={Router.Link} to="/keyword">
                <ListItemIcon><VpnKeyIcon /></ListItemIcon>
                <ListItemText primary={'Keyword Search'} />
                </ListItem>

            </List>
        </div>
            
    );
}

export default Sidebar;
