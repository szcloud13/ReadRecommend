// Header.tsx
// Implements the header sitewide

import $ = require('jquery');
import React from "react";
import * as Router from 'react-router-dom';
import CookieService from "../services/CookieService";

// Material UI
import clsx from 'clsx';
import AppBar from "@material-ui/core/AppBar";
import Button from '@material-ui/core/Button';
import CollectionsBookmarkIcon from '@material-ui/icons/CollectionsBookmark';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
// Page imports
import Sidebar from "./Sidebar";

declare const API_URL: string;

const userSignedIn = false;
const drawerWidth = 240;

const Style = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    drawerContainer: {
        overflow: 'auto',
    },
}));

function handleLogout() {
    const tokenToRemove = CookieService.get('access_token')
    console.log(tokenToRemove);

    // Remove 'access_token' cookie on frontend using CookieService.
    CookieService.remove('access_token');

    console.log("is this working?");
    // Remove cookie on backend.
    $.ajax({
        url: API_URL + "/api/auth/signout",
        method: "POST",
        data: {
            token: tokenToRemove,
        },
        success: function (data) {
            console.log("Logged out");
        },
        error: function () {
            console.log("server error!");
        }
    });
    window.location.href="/";
    //window.location.reload();
}

interface Props {
    userSignedIn: boolean;
}
//<Button component={Router.Link} to="/" color="inherit" startIcon={<CollectionsBookmarkIcon />}/>

const Header: React.FC<Props> = ({userSignedIn} : Props) => {
    const classes = Style();
    const theme = useTheme();
    // Determine whether a user is signed in by checking for 'access_token' cookie.
    const token = CookieService.get('access_token')
    
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        if(userSignedIn){
            setOpen(true);
        }    
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    if (token) {
        userSignedIn = true;
    } else {
        userSignedIn = false;
    }

    return (
        <div>
            <AppBar position="relative" className={classes.appBar}>
                <Toolbar>
                    <Typography variant="h6" color="inherit" noWrap>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            className={clsx(classes.menuButton, open && classes.hide)}
                        >
                            <CollectionsBookmarkIcon />
                        </IconButton>
                    </Typography>
                    {/* Renders Login button if user not signed in, otherwise reders Logout button.*/}
                    {(userSignedIn) ? (<Button component={Router.Link} to="/" color="inherit" onClick={handleLogout}>Logout</Button>)
                                    : (<Button component={Router.Link} to="/auth/signin" color="inherit">Login</Button>)}

                </Toolbar>
            </AppBar>

            {/* Renders sidebar only if user is signed in */}
            {(userSignedIn) 
                ? (
                        <Drawer
                            className={classes.drawer}
                            variant="persistent"
                            anchor="left"
                            open={open}
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                        >
                        <div>            
                            <Toolbar />
                            <IconButton onClick={handleDrawerClose}>
                                {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                              </IconButton>
                              <Sidebar />
                        </div>
                        </Drawer>  
                  ) 
                : (null)
            }
        </div>
    )
}

export default Header;
