// Main.tsx
// Main page

import $ = require("jquery");
import React, { ChangeEvent, useState } from "react";
import * as Router from "react-router-dom";
import CookieService from "../services/CookieService";

// Material UI
import AddIcon from "@material-ui/icons/Add";
import Alert from "@material-ui/lab/Alert";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Collapse from "@material-ui/core/Collapse";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FilterListIcon from '@material-ui/icons/FilterList';
import FormControl from '@material-ui/core/FormControl';
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";
import InputLabel from '@material-ui/core/InputLabel';
import LanguageIcon from '@material-ui/icons/Language';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from "@material-ui/core/Paper";
import SearchIcon from "@material-ui/icons/Search";
import Select from '@material-ui/core/Select';
import Slider from "@material-ui/core/Slider";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";

declare const API_URL: string;

// Marks for filter slider.
const marks = [
    {value: 0, label: '0'},
    {value: 1, label: '1'},
    {value: 2, label: '2'},
    {value: 3, label: '3'},
    {value: 4, label: '4'},
    {value: 5, label: '5'},
];

const Style = makeStyles((theme) => ({
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    },
    TableButton: {
        marginTop: theme.spacing(2),
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
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
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    root: {
        padding: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: 400,
    },
    table: {
        minWidth: 400,
    },
}));

interface SearchForm {
    title: string;
}
interface Props {
    userSignedIn: boolean;
}

let bookToAdd;

const Main: React.FC<Props> = ({ userSignedIn }: Props) => {
    let cards: any;
    let collections : any = [];

    const [SearchForm, setSearchForm] = useState<SearchForm>({
        title: "",
    });

    const [ addDialogIsOpen, setAddDialogIsOpen ] = useState(false);
    let [ userBookCollections, setUserBookCollections ] = useState([]);
    const [ addToCollectionId, setAddToCollectionId ] = useState("");
    const [ addToCollectionError, setAddToCollectionError ] = useState("");

    const handleClickOpen = (bookId) => {
        bookToAdd = bookId;
        setAddDialogIsOpen(true);
    }

    const handleAddDialogClose = () => {
        setAddDialogIsOpen(false);
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

    function addBookToCollection(bookId, collectionId) {
        handleAddDialogClose();
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
  

    function getCollections(){
        $.ajax({
            async: false,
            url: API_URL + "/api/user/my_profile",
            method: "GET",
            data: {
                auth: token,
            },
            success: function (data) {
                if (data != null) {
                    if (data.message == "Got current user profile data") {
                        collections = data.collection_list;
                    } else{
                        alert(data.message);
                    }
                }
            },
            error: function (error) {
                console.log("Server error!");
            },
        });
    }

    function addLib(id) {
        $.ajax({
            async: false,
            url: API_URL + "/api/collections/add_to_library",
            data: {
                auth: token,
                id: id,
            },
            method: "POST",
            success: function (data) {
                if (data != null) {
                    if (data.message == "Book added to library") {
                        alert("Book Successfully added to library");
                    } else {
                        alert(data.message);
                    }
                }
            },
            error: function () {
                console.log("server error!");
            },
        });
    }

    const onTextboxChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSearchForm((prevSearchForm) => {
            return {
                ...prevSearchForm,
                [name]: value,
            };
        });
    };

    function request() {
        var data = randomBooks(function (data) {
            if (data != null) {
                cards = data.book_list;
            } else {
                alert("Something Wrong!");
                window.location.href = "/";
            }
        });
    }

    function randomBooks(callback) {
        $.ajax({
            async: false,
            url: API_URL + "/api/books/random",
            data: {
                count: 12,
            },
            method: "GET",
            success: function (data) {
                if (data != null) {
                    if (data.message == "Got random books") {
                        callback(data);
                    } else {
                        callback(null);
                    }
                }
            },
            error: function () {
                console.log("server error!");
                callback(null);
            },
        });
    }

    //TODO cannot use my profile to get collections as book cannot exist in the collection alrdy
    function retrieveCollections(callback) {
        $.ajax({
            async: false,
            url: API_URL + "/api/user/my_profile",
            method: "GET",
            data: {
                auth: token,
            },
            success: function (data) {
                if (data != null) {
                    if (data.message == "Got current user profile data") {
                        callback(data);
                    } else {
                        callback(null);
                    }
                }
            },
            error: function (error) {
                callback(error);
                console.log("Server error!");
            },
        });
    }

    const classes = Style();
    const token = CookieService.get("access_token");

    // State for the expandable search menu.
    const [expanded, setExpanded] = useState(false);
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const [minimumRating, setMinimumRating] = React.useState<number | string | Array<number | string>>(0);

    const handleSliderChange = (event: any, newValue: number | number[]) => {
        setMinimumRating(newValue);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMinimumRating(event.target.value === '' ? '' : Number(event.target.value));
    };

    const handleBlur = () => {
        if (minimumRating < 0) {
            setMinimumRating(0);
        } else if (minimumRating > 5) {
            setMinimumRating(5);
        }
    };

    const [ filterState, setFilterState ] = useState({
        minimumTotalRatings: 0,
        minimumReadCount: 0,
        minimumCollectionCount: 0,
    });

    const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterState({...filterState, [event.target.name]: event.target.value});
    }

    function advSearchLocal(event) { 
        window.location.href = "/search?title=" + SearchForm.title + "?average_rating=" + minimumRating + 
            "?total_ratings=" + filterState.minimumTotalRatings + "?read_count=" + filterState.minimumReadCount + 
            "?collection_count=" + filterState.minimumCollectionCount;
    }

    function searchLocal(event) { 
        window.location.href = "/search?title=" + SearchForm.title;
    }

    function searchWeb(event) {
        window.location.href = "/extsearch?title=" + SearchForm.title + "?index=0";
    }

    request();
    if (userSignedIn) {
        requestUserCollections();
    }
    return (
        <React.Fragment>
            <CssBaseline />
            <main>
                {/* Page Title and Main Actions */}
                <div className={classes.heroContent}>
                    <Container maxWidth="sm">
                        <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                            ReadRecommend
                        </Typography>
                        <Typography variant="h5" align="center" color="textSecondary" paragraph>
                            A seamless platform for book lovers to explore personalized book
                            recommendations.
                        </Typography>

                        {/*Search and Filter Actions */}
                        <div className={classes.heroButtons}>
                            <Grid container spacing={2} justify="center">
                                {userSignedIn ? null : (
                                <Grid item>
                                    <Button component={Router.Link} to="/auth/signup" type="submit" variant="contained" color="primary">
                                        Sign up for free!
                                    </Button>
                                </Grid>
                                )}

                                {/*Search Bar and Buttons*/}
                                { userSignedIn
                                    ?(<Grid item>
                                        <Paper className={classes.root}>
                                            <TextField
                                                className={classes.input}
                                                placeholder="Find a Book"
                                                value={SearchForm.title}
                                                name="title"
                                                label="Search ReadRecommend"
                                                onChange={onTextboxChange}
                                            />
                                            {/* Internal Search */}
                                            <IconButton type="submit" onClick={searchLocal} className={classes.iconButton} aria-label="search">
                                                <SearchIcon />
                                            </IconButton>
                                            {/*External Search */}
                                            <IconButton type="submit" onClick={searchWeb} className={classes.iconButton} aria-label="search">
                                                <LanguageIcon />
                                            </IconButton>
                                            {/*Filter Advanced Search */}
                                            <IconButton
                                                className={clsx(classes.expand, {[classes.expandOpen]: expanded})}
                                                onClick={handleExpandClick}
                                                aria-expanded={expanded} aria-label="show more"
                                            >
                                                <FilterListIcon />
                                            </IconButton>
                                        </Paper>
                                    
                                        {/*Inside Collapsible Button -> Filters For Advanced Search */}
                                        <Paper>
                                            <Grid>
                                                <Collapse in={expanded} timeout="auto" unmountOnExit>
                                                    <Grid item>
                                                        <Box m={2}>
                                                            <Typography id="input-slider" gutterBottom>Filter By Minimum Rating</Typography>
                                                            <Slider 
                                                                value={typeof minimumRating === 'number' ? minimumRating : 0}
                                                                onChange={handleSliderChange}
                                                                aria-labelledby="input-slider"
                                                                min={0} max={5} step={1}
                                                                marks={marks}
                                                            />
                                                            <Input 
                                                                className={classes.input} 
                                                                value={minimumRating} 
                                                                margin="dense"
                                                                onChange={handleInputChange}
                                                                onBlur={handleBlur}
                                                                inputProps={{step: 1, min: 0, max: 5, type: 'number', 'aria-labelledby': 'input-slider'}}
                                                            />
                                                        </Box>
                                                        <Box m={2}>
                                                            <TextField 
                                                            id="minimumTotalRatings" name="minimumTotalRatings"
                                                            label="Minimum Total Ratings" type="number"
                                                            value={filterState.minimumTotalRatings}
                                                            onChange={handleFilterChange}
                                                            />
                                                        </Box>
                                                        <Box m={2}>
                                                            <TextField
                                                                id="minimumReadCount" name="minimumReadCount"
                                                                label="Minimum Read Count" type="number"
                                                                value={filterState.minimumReadCount}
                                                                onChange={handleFilterChange}
                                                            />
                                                        </Box>
                                                        <Box m={2}>
                                                            <TextField 
                                                            id="minimumCollectionCount" name="minimumCollectionCount"
                                                            label="Minimum Collection Count" type="number"
                                                            value={filterState.minimumCollectionCount}
                                                            onChange={handleFilterChange}
                                                            />
                                                        </Box>
                                                    </Grid>
                                                    <Grid item>
                                                        <Box m={2}>
                                                            <Button color="primary" onClick={advSearchLocal}>
                                                                Advanced Search
                                                            </Button>
                                                        </Box>
                                                    </Grid>
                                                </Collapse>
                                            </Grid>
                                    </Paper>
                                        </Grid>)
                                    : (null)
                                }    
                            </Grid>
                        </div>
                    </Container>
                </div>

                {/* Books in System For User Browsing */}
                <Container className={classes.cardGrid} maxWidth="md">
                    {/* User Feedback for Organising Books Into Collections */}
                    <div>
                        {addToCollectionError === "Successfully added title to collection!" ? 
                        (<Alert severity="success">{addToCollectionError}</Alert>) : null}
                        {addToCollectionError === "This book is already in the requested collection!" ?
                        (<Alert severity="warning">{addToCollectionError}</Alert>) : null}
                    </div>

                    <Grid container spacing={4}>
                        {cards?.map((book) => (
                            <Grid item key={book.book_id} xs={12} sm={6} md={4}>
                                <Card className={classes.card}>
                                    <CardMedia
                                        className={classes.cardMedia}
                                        image="https://source.unsplash.com/random?book"
                                        title="Image title"
                                    />
                                    <CardContent className={classes.cardContent}>
                                        <Typography gutterBottom variant="h5" component="h2">{book.book_title}</Typography>
                                        <Typography>By Author: {book.book_author}</Typography>
                                        <Typography>Published On: {book.book_pub_date}</Typography>
                                    </CardContent>

                                    <CardActions>
                                        <Button size="small" color="primary" component={Router.Link} to={"/bookdata/metadata?id=" + book.book_id}>
                                            View
                                        </Button>

                                        {/*User can only add book to library and collections if signed in.*/}
                                        {userSignedIn ? (
                                          <Button size="small" color="primary" startIcon={<AddIcon />} onClick={() => addLib(book.book_id)}>
                                              {" "}
                                              Libary{" "}
                                          </Button>
                                          ) : null}

                                        {userSignedIn ? (<Button
                                            name={book.book_id} size="small" type="submit"  color="primary"
                                            onClick={() => handleClickOpen(book.book_id)} startIcon={<LibraryAddIcon />}
                                        >
                                            Collection
                                        </Button>) : null}

                                        {/*Open Dialog For Adding to Book Collection*/}

                                        <Dialog open={addDialogIsOpen} onClose={handleAddDialogClose} aria-labelledby="form-dialog-title">
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
                                                        
                                                        {userBookCollections?.map((userBookCollection : any) => (
                                                            <MenuItem key={userBookCollection.collection_id} value={userBookCollection.collection_id}>
                                                                {userBookCollection.collection_name}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={handleAddDialogClose} color="primary">Cancel</Button>
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
};

export default Main;
