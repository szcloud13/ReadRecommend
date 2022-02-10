// Footer.tsx
// Implements the footer sitewide

import React from "react";

// Material UI
import AppBar from "@material-ui/core/AppBar";
import CollectionsBookmarkIcon from '@material-ui/icons/CollectionsBookmark';
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import { makeStyles } from '@material-ui/core/styles';


const Style = makeStyles((theme) => ({
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6),
    }
}));

export default function Footer(): JSX.Element {
    const classes = Style();
    return (
        <footer className={classes.footer}>
            <Typography variant="h6" align="center" gutterBottom>
                ReadRecommend
                </Typography>
            <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
                Books!
                </Typography>
            <Copyright />
        </footer>
    )
}

function Copyright(): JSX.Element {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {"Copyright © "}
            {new Date().getFullYear()}
            {"."}
        </Typography>
    );
}
