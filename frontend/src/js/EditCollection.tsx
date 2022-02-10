// EditCollection.tsx
// A page where users can edit a previously created collection.

import React, { ChangeEvent, useState } from "react";
import * as Router from "react-router-dom";
import * as $ from "jquery";
import CookieService from "../services/CookieService";

import BookReadStatus from "./BookReadStatus";

// Material UI
import Alert from "@material-ui/lab/Alert";
import AddIcon from "@material-ui/icons/Add";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Chip from "@material-ui/core/Chip";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import EditIcon from "@material-ui/icons/Edit";
import Grid from "@material-ui/core/Grid";
import HistoryIcon from "@material-ui/icons/History";
import ImportExportIcon from "@material-ui/icons/ImportExport";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import { makeStyles } from "@material-ui/core/styles";

declare const API_URL: string;

const Style = makeStyles((theme) => ({
    actionButton: {
        margin: 10,
    },
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
    chip: {
        margin: theme.spacing(0.5),
    },
    chipRoot: {
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        listStyle: "none",
        padding: theme.spacing(0.5),
        margin: 0,
    },
    root: {
        padding: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: 400,
    },
}));

interface Props {}

let book_list: any[] = [];
let tag_list: any[] = [];
let collection: any;

const EditCollection: React.FC<Props> = ({}) => {
    const classes = Style();
    // For editing the collection's title.
    const [open, setOpen] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    // For editing the collection's tag.
    const [tagDialog, setTagOpen] = useState(false);
    const [newTag, setNewTag] = useState("");

    // For dialog component
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleTagOpen = () => {
        setTagOpen(true);
    };

    const handleTagClose = () => {
        setTagOpen(false);
    };

    // Detects new value typed into dialog box and loads it on the screen.
    const onTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewTitle(value);
    };

    // Detects new value typed into dialog box and loads it on the screen.
    const onTagChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewTag(value);
    };

    // Collection Data. TODO: Add more fields.
    const [collectionData, setCollectionData] = useState({
        collectionTitle: "",
        collectionTag: "",
        editCollectionError: "",
    });

    //Deletes a tag from the array of the collection's tags.
    const handleDelete = (chipToDelete) => () => {
        removeTag(chipToDelete.tag_label);
    };

    function addTag() {
        // Closes dialog box.
        handleTagClose();

        // Changes the collection title on the front-end display.
        setCollectionData((prevCollectionData) => {
            return {
            ...prevCollectionData,
            collectionTag: newTag,
            };
        });

        var data = setCollectionTag(newTag, function (data) {
            if (data != null) {
                console.log(data.message);
                if (data.message == "Tag successfully added to collection") {
                } else if (data.message == "Collection already has this tag") {
                    window.location.href = "/";
                } else {
                    alert("Tag weird error!");
                    window.location.href = "/";
                }
            }
        });
    }

    // Retrieves collection data from the back-end/database.
    function request() {
        var data = getBooks(function (data) {
            if (data != null) {
                if (data.message == "Collection data delivered") {
                    book_list = data.book_list;
                    collection = data.collection_name;
                } else {
                    alert("No Matched Results!");
                    window.location.href = "/";
                }
            }
        });
    }

    function requestTags() {
        var result = getTags(function (result) {
            if (result != null) {
                if (result.message == "Got tags") {
                    let newTags: any[] = [];
                    result.tag_list.forEach(function (tag) {
                        let Tag = { key: newTags.length, tag_label: tag.tag_label };
                        newTags.push(Tag);
                    });
                    tag_list = newTags;
                } else if (result.message == "Collection has no tags") {
                    console.log("Do nothing, continue loading the page.");
                } else {
                    alert("No Matched Results!");
                    window.location.href = "/";
                }
            }
        });
    }

    function getBooks(callback) {
        const token = CookieService.get('access_token');
        $.ajax({
            async: false,
            url: API_URL + "/api/collections/view_collection",
            data: {
                auth: token,
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
                console.log("server error!");
                callback(null);
            },
        });
    }

    function getTags(callback) {
        $.ajax({
            async: false,
            url: API_URL + "/api/collections/get_tags",
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
                console.log("server error!");
                callback(null);
            },
        });
    }

    // Renames collection title on both front-end and back-end.
    function setCollectionTitle() {
        // Closes dialog box.
        handleClose();

        // Changes the collection title on the front-end display.
        setCollectionData((prevCollectionData) => {
        return {
            ...prevCollectionData,
            collectionTitle: newTitle,
        };
        });

        // Change the collection title in the back-end/database.
        $.ajax({
            async: false,
            url: API_URL + "/api/collections/rename",
            data: {
                auth: token,
                collection_id: collectionId,
                collection_name: newTitle,
            },
            method: "POST",
            success: function (data) {
                if (data != null) {
                    if (data.message === "Collection successfully renamed") {
                        setCollectionData((prevCollectionData) => {
                            return {
                                ...prevCollectionData,
                                editCollectionError: "Collection successfully renamed!",
                            };
                        });
                    } else if (data.message === "Collection with the same name already exists") {
                        setCollectionData((prevCollectionData) => {
                            return {
                                ...prevCollectionData,
                                editCollectionError:"Collection with the same name already exists!",
                            };
                        });
                    }
                }
            },
            error: function () {
                console.log("server error!");
            },
        });
    }

    // Adds collection tag on both front-end and back-end.
    function setCollectionTag(newTag, callback) {
        // Change the collection title in the back-end/database.
        $.ajax({
            async: false,
            url: API_URL + "/api/collections/add_tag",
            data: {
                collection_id: collectionId,
                tag_label: newTag,
            },
            method: "POST",
            success: function (data) {
                if (data != null) {
                console.log(data.message);
                callback(data);
                }
            },
            error: function () {
            console.log("server error!");
            },
        });
    }

    // Removes book from collection on both front-end and back-end.
    function removeTag(tag_label) {
        console.log("Remove tag from collection.");
        $.ajax({
            async: false,
            url: API_URL + "/api/collections/delete_tag",
            data: {
                collection_id: collectionId,
                tag_label: tag_label,
            },
            method: "POST",
            success: function (data) {
                if (data.message == "Tag successfully removed from collection") {
                    window.location.reload();
                } else if (data.message == "Tag not found") {
                    console.log(data.message);
                }
            },
            error: function () {
                console.log("server error!");
            },
        });
    }

    // Removes book from collection on both front-end and back-end.
    function removeBook(toRemove) {
        $.ajax({
            async: false,
            url: API_URL + "/api/collections/delete_title",
            data: {
                auth: token,
                collection_id: collectionId,
                id: toRemove,
            },
            method: "POST",
            success: function (data) {
                if (data.message == "Book removed from collection") {
                    console.log("Successfully removed book from collection!");
                    window.location.reload();
                }
            },
            error: function () {
                console.log("server error!");
            },
        });
    }


    let collectionId: any = '';
    collectionId = window.location.href.split("?")[1];
    if(collectionId == ''){
        alert('Sorry something is wrong!');
        window.location.href ='/user/profile';
    }else{
        collectionId = collectionId.split("=")[1];
    }
   
    const token = CookieService.get("access_token");
    request();
    requestTags();

    return (
        <React.Fragment>
            <CssBaseline />
            <main>
                <div className={classes.heroContent}>
                    <Container maxWidth="sm">
                        <Grid>
                            {/*User Feedback - Alerts For Different Errors*/}
                            <div>
                                {collectionData.editCollectionError === "Collection with the same name already exists!" ? 
                                (<Alert severity="error">{collectionData.editCollectionError}</Alert>) : null}
                                {collectionData.editCollectionError === "Collection successfully renamed!" ? 
                                (<Alert severity="success">{collectionData.editCollectionError}</Alert>) : null}
                            </div>

                            {/* Page Title and Main Action For Title */}
                            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                                {collection}
                                <Button variant="outlined" color="secondary" onClick={handleClickOpen} startIcon={<EditIcon />} className={classes.actionButton}>
                                    Rename
                                </Button>
                            </Typography>

                            {/*Dialog For Renaming Collection*/}
                            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                                <DialogTitle id="form-dialog-title">
                                    Rename Collection
                                </DialogTitle>
                                <DialogContent>
                                    <DialogContentText>Enter a new title for your collection.</DialogContentText>
                                    <TextField autoFocus margin="dense" id="name" label="Collection Title" type="text" fullWidth onChange={onTitleChange}/>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleClose} color="primary">Cancel</Button>
                                    <Button onClick={setCollectionTitle} color="primary" variant="contained">Save</Button>
                                </DialogActions>
                            </Dialog>
                        </Grid>

                        {/* Collection Tags Section */}
                        <Paper component="ul" className={classes.chipRoot}>
                            <Button onClick={handleTagOpen} type="submit" variant="outlined" color="default" startIcon={<AddIcon />} className={classes.chip}>
                                Tag
                            </Button>
                            {tag_list.map((data) => {
                                return (
                                    <li key={data.key}>
                                        <Chip label={data.tag_label} onDelete={handleDelete(data)} className={classes.chip}/>
                                    </li>
                                );
                            })}
                        </Paper>

                        {/* Dialog For Adding New Tags */}
                        <Dialog open={tagDialog} onClose={handleTagClose} aria-labelledby="form-dialog-title">
                            <DialogTitle id="form-dialog-title">Add New Tag</DialogTitle>
                            <DialogContent>
                                <DialogContentText>Enter a new tag for your collection.</DialogContentText>
                                <TextField autoFocus margin="dense" id="name" label="Collection Tag" type="text" fullWidth onChange={onTagChange}/>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={handleTagClose} color="primary">Cancel</Button>
                                <Button onClick={addTag} color="primary" variant="contained">Save</Button>
                            </DialogActions>
                        </Dialog>

                        {/* Actions For Editing Collection */}
                        <div className={classes.heroButtons}>
                            <Grid container spacing={2} justify="center">
                                <Grid item>
                                    <Button 
                                        component={Router.Link} to={"/user/addTitles?collectionid=" + collectionId} 
                                        type="submit" variant="outlined" color="primary" startIcon={<AddIcon />}
                                    >
                                        Books
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button 
                                        component={Router.Link} to={"/user/recent?collectionid=" + collectionId} 
                                        type="submit" variant="outlined" color="primary" startIcon={<HistoryIcon />}
                                    >
                                        Recently Added Books
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
                    </Container>
                </div>

                {/* Books Inside the Collection */}
                <Container className={classes.cardGrid} maxWidth="md">
                    <Grid container spacing={4}>
                        {book_list.map((book) => (
                            <Grid item key={book.id} xs={12} sm={6} md={4}>
                                <Card className={classes.card}>
                                    <CardMedia className={classes.cardMedia} image="https://source.unsplash.com/random?book" title="Image title"/>
                                    <CardContent className={classes.cardContent}>
                                        <Typography gutterBottom variant="h5" component="h2">{book.title}</Typography>
                                        <BookReadStatus bookId={book.id}></BookReadStatus>
                                      
                                    </CardContent>
                                    <CardActions>
                                        <Button component={Router.Link} to={"/bookdata/metadata?isbn=" + book.id} size="small" color="primary">
                                            View
                                        </Button>
                                        {/* TODO: Display an alert saying 'book removed from collection' */}
                                        <Button size="small" color="primary" onClick={() => removeBook(book.id)}>
                                            Remove
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </main>
        </React.Fragment>
    );
};

export default EditCollection;
