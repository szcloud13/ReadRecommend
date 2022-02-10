// RecentlyAddedBooks.tsx
// Displays the top 10 most recently added books to a collection.

import React from "react";
import * as Router from "react-router-dom";
import * as $ from "jquery";
import CookieService from "../services/CookieService";

// Material UI
import Alert from "@material-ui/lab/Alert";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import { makeStyles } from "@material-ui/core/styles";

declare const API_URL: string;

const Style = makeStyles((theme) => ({
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    card: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
    },
    cardMedia: {
        paddingTop: "56.25%", // 16:9
    },
    cardContent: {
        flexGrow: 1,
    },
    root: {
        padding: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: 400,
    },
    buttons:{
        paddingLeft: theme.spacing(2),
    }
}));

interface Props {}

let collectionId = window.location.href.split("?")[1];
if (collectionId) {
    collectionId = collectionId.split("=")[1];
}

let recently_added_books: any[] = [];

const RecentlyAddedBooks: React.FC<Props> = ({}) => {
    const classes = Style();

    // Retrieve the collection's top 10 most recently added books.
    function requestRecentlyAddedBooks() {
        var data = getRecentlyAddedBooks(function (data) {
            if (data != null) {
                recently_added_books = data.book_list;
            }
        });
    }

    // Performs Ajax call to retrieve the collection's top 10 most recently added books.
    function getRecentlyAddedBooks(callback) {
        $.ajax({
            async: false,
            url: API_URL + "/api/collections/recent_added",
            data: {
                collection_id: collectionId,
            },
            method: "GET",
            success: function (data) {
                if (data != null) {
                    callback(data);
                }
                callback(null);
            },
            error: function () {
                console.log("Server error!");
                callback(null);
            },
        });
    }

    requestRecentlyAddedBooks();

    return (
        <React.Fragment>
            <CssBaseline />
            <main>
                <div className={classes.heroContent}>
                    {/*Header & Action Buttons*/}
                    <Container maxWidth="sm">
                        <Grid>
                            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                                Recently Added Books
                            </Typography>


                            <div className={classes.heroButtons}>
                              <Grid container spacing={2} justify="center">
                                <Grid item>
                                    <Button
                                        variant="outlined"
                                        color="default"
                                        component={Router.Link}
                                        to={"/user/editcollection?collectionid=" + collectionId}
                                        startIcon={<ArrowBackIosIcon />}
                                    >
                                        Back to Editing
                                    </Button>
                                </Grid>
                                <Grid item>    
                                    <Button
                                        className="buttons"
                                        variant="outlined"
                                        color="default"
                                        component={Router.Link}
                                        to={"/user/viewcollection?collectionid=" + collectionId}
                                        startIcon={<ArrowBackIosIcon />}
                                    >
                                        Back to Viewing
                                    </Button>
                                </Grid>
                              </Grid>  
                            </div>
                        </Grid>
                    </Container>

                    {/*Top 10 Most Recently Added Books*/}
                    {console.log(recently_added_books)}
                    <Container className={classes.cardGrid} maxWidth="md">
                        <Grid container spacing={4}>
                            {/*Renders Card For Each Book*/}
                            {recently_added_books.map((book) => (
                                <Grid item key={book.id} xs={12} sm={6} md={4}>
                                    <Card className={classes.card}>
                                        <CardMedia className={classes.cardMedia} image="https://source.unsplash.com/random?book" title="Image Title"/>
                                        <CardContent className={classes.cardContent}>
                                            <Typography gutterBottom variant="h5" component="h2">
                                                {book.title}
                                            </Typography>
                                            
                                        </CardContent>
                                        <CardActions>
                                            <Button component={Router.Link} to={"/bookdata/metadata?isbn=" + book.id} size="small" color="primary">
                                                View
                                            </Button>
                                           
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>

                </div>
            </main>
        </React.Fragment>
    );
}

export default RecentlyAddedBooks;