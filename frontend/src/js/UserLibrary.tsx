// UserLibary.tsx
// User Libary page

import React, { ChangeEvent, useState } from "react";
import * as $ from "jquery";
import * as Router from "react-router-dom";

import CookieService from "../services/CookieService";
import BookReadStatus from "./BookReadStatus";

// Material UI
import AddIcon from "@material-ui/icons/Add";
import Alert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from '@material-ui/core/FormControl';
import Grid from "@material-ui/core/Grid";
import InputLabel from '@material-ui/core/InputLabel';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Typography from "@material-ui/core/Typography";

import { makeStyles } from "@material-ui/core/styles";

declare const API_URL: string;

const Style = makeStyles((theme) => ({
    icon: {
        marginRight: theme.spacing(2),
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
    },
    heroButtons: {
        marginTop: theme.spacing(4),
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
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

let bookToAdd;

export default function UserLibrary() {
    const classes = Style();
    const token = CookieService.get("access_token");

    let libraryBooks: Array<any> = [];

    let [ userBookCollections, setUserBookCollections ] = useState([]);
    const [ addToCollectionId, setAddToCollectionId ] = useState("");
    const [ addToCollectionError, setAddToCollectionError ] = useState("");

    const [ open, setOpen ] = useState(false);

    const handleClickOpen = (bookId) => {
        bookToAdd = bookId;
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleChange = (event: React.ChangeEvent<{value: unknown}>) => {
        setAddToCollectionId(event.target.value as string);
    }

    function requestUserCollections() {
        var data = getUserCollections(function (data) {
            if (data != null) {
                userBookCollections = data.collection_list;
            }
        });
    }

    function getUserCollections(callback) {
        $.ajax({
            async: false,
            url: API_URL + "/api/user/my_profile",
            method: "GET",
            data : {
                auth: token,
            },
            success: function (data) {
                if (data != null) {
                    if (data.message === "Got current user profile data") {
                        callback(data);
                    }
                }
            },
            error: function(error) {
                callback(error);
                console.log("Get user collections server error!");
            }
        })
    }

    function removeBook(id) {
        var data = removeLib(id, function (data) {
            if (data != null) {
                if (data.message == "Book removed from library") {
                    window.location.href = "/user/userlibrary";
                } else {
                    alert("No Matched Results!");
                    window.location.href = "/";
                }
            }
        });
    }

    function removeLib(id, callback) {
        $.ajax({
            async: false,
            url: API_URL + "/api/collections/delete_from_library",
            data: {
                auth: token,
                id: id,
            },
            method: "POST",
            success: function (data) {
                if (data != null) {
                    callback(data);
                }
                callback(null);
            },
            error: function () {
                console.log("server error!");
                callback(null);
            },
        });
    }

    function request() {
        var data = onSearch(function (data) {
            if (data != null) {
                if (data.message == "Got user library") {
                    libraryBooks = data.book_list;
                } else {
                    alert("No Matched Results!");
                    window.location.href = "/";
                }
            }
        });
    }

    function onSearch(callback) {
        $.ajax({
            async: false,
            url: API_URL + "/api/user/get_library",
            data: {
                auth: token,
            },
            method: "GET",
            success: function (data) {
                if (data != null) {
                    callback(data);
                }
                callback(null);
            },
            error: function () {
                console.log("server error!");
                callback(null);
            },
        });
    }

    function addBookToCollection(bookId, collectionId) {
        handleClose();
        $.ajax({
            async: false,
            url: API_URL + "/api/collections/add_title",
            data: {
                auth: token,
                collection_id: parseInt(collectionId),
                id: bookId,
            },
            method: "POST",
            success: function (data) {
                if (data != null) {
                    console.log(data);
                    if (data.message === "Book added to collection") {
                        setAddToCollectionError("Successfully added title to collection!");
                    } else if (data.message === "Book is already in collection") {
                        setAddToCollectionError("This book is already in the requested collection!")
                    }
                }
            },
            error: function () {
                console.log("Add book to collection server error!");
            }
        })
    }

    request();
    requestUserCollections();
    console.log(userBookCollections);

    return (
        <React.Fragment>
            <CssBaseline />
            <main>
                {/* Page Title and Main Action For Title */}
                <div className={classes.heroContent}>
                    <Container maxWidth="md">
                        <Typography component="h1" variant="h2" align="center" color="textPrimary">My Library</Typography>
                        <div className={classes.heroButtons}>
                            <Grid container spacing={2} justify="center">
                                <Grid item>
                                    <Button component={Router.Link} to="/" type="submit" variant="contained" color="primary" startIcon={<AddIcon />}>
                                        Find More Books
                                    </Button>
                                </Grid>
                            </Grid>
                        </div>
                    </Container>
                </div>

                {/* User's Libary Books */}
                <Container className={classes.cardGrid} maxWidth="md">
                    {/* User Feedback for Organising Books Into Collections */}
                    <div>
                        {addToCollectionError === "Successfully added title to collection!" ? 
                        (<Alert severity="success">{addToCollectionError}</Alert>) : null}
                        {addToCollectionError === "This book is already in the requested collection!" ?
                        (<Alert severity="warning">{addToCollectionError}</Alert>) : null}
                    </div>

                    <Grid container spacing={4}>
                        {libraryBooks.map((libraryBook) => (
                            <Grid item key={libraryBook.id} xs={12} sm={6} md={4}>
                                <Card className={classes.card}>
                                    <CardMedia className={classes.cardMedia} image="https://source.unsplash.com/random" title="Image title"/>
                                    <CardContent className={classes.cardContent}>
                                        <Typography gutterBottom variant="h5" component="h2">{libraryBook.book_title}</Typography>

                                        {/* Switch To Display Read Status of Book */}
                                        <BookReadStatus bookId={libraryBook.id}></BookReadStatus>

                                        <Typography>By Author: {libraryBook.book_author}</Typography>
                                        <Typography>Published on: {libraryBook.book_pub_date}</Typography>
                                    </CardContent>
                                    <CardActions>
                                        <Button component={Router.Link} to={"/bookdata/metadata?id=" + libraryBook.id} size="small" color="primary">View</Button>
                                        <Button size="small" color="primary" onClick={() => removeBook(libraryBook.id)}>Remove</Button>

                                        {/*Open Dialog For Adding to Book Collection*/}
                                        <Button 
                                            name={libraryBook.id} type="submit" variant="outlined" color="primary"
                                            onClick={() => handleClickOpen(libraryBook.id)} startIcon={<LibraryAddIcon />}
                                        >
                                            Add To
                                        </Button>

                                        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                                            <DialogTitle id="form-dialog-title">Add Book To Collection</DialogTitle>
                                            <DialogContent>
                                                <DialogContentText>Select a book collection:</DialogContentText>
                                                
                                                {/* Options to Add to Different User Collections */}
                                                <FormControl variant="outlined" className={classes.formControl} fullWidth>
                                                    <InputLabel id="add-to-collection">Book Collection</InputLabel>
                                                    <Select 
                                                        labelId="add-to-collection-label" id="add-to-collection-options" color="primary"
                                                        value={addToCollectionId} onChange={handleChange} label="collectionName" fullWidth
                                                    >
                                                        <MenuItem value=""><em>Book Collection</em></MenuItem>
                                                        
                                                        {userBookCollections.map((userBookCollection : any) => (
                                                            <MenuItem key={userBookCollection.collection_id} value={userBookCollection.collection_id}>
                                                                {userBookCollection.collection_name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={handleClose} color="primary">Cancel</Button>
                                                <Button onClick={() => addBookToCollection(bookToAdd, addToCollectionId)} color="primary" variant="contained">Save</Button>
                                            </DialogActions>
                                        </Dialog>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </main>
        </React.Fragment>
    );
}
