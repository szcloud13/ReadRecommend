// UserProfile.tsx
// Displays the user's reading achievements and goals.
// Displays the user's book collections.

import React, { ChangeEvent, useState, useEffect } from "react";
import * as Router from "react-router-dom";
import * as $ from "jquery";
import CookieService from "../services/CookieService";
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';

// Page Imports
import Collections from "./Collections";

// Material UI
import AddIcon from "@material-ui/icons/Add";
import Alert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import { MuiPickersUtilsProvider, KeyboardDatePicker,} from '@material-ui/pickers';
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import {LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer, Tooltip, Legend} from "recharts";

import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme } from "@material-ui/core/styles";

declare const API_URL: string;

let userGoals : any[] = [];
let mostRecentGoal : any;

export default function UserProfile() {
    const [userProfileData, setUserProfileData] = useState({
        userBookCollections: [],
        collectionError: "",
    });

    // Dialog for creating a new book collection.
    const [open, setOpen] = useState(false);
    const [newTitle, setNewTitle] = useState("");

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // Detects new value typed into dialog box and loads it on the screen.
    const onTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewTitle(value);
    };

    // Adds collection title on both front-end and back-end.
    function addCollectionTitle(e) {
        // Prevents React from doing stupid things.
        e.preventDefault();
        // Closes dialog box.
        handleClose();

        var result = addCollection(function (result) {
            if (result.message == "Collection successfully added") {
                // Empties any previous error messages.
                setUserProfileData((prevUserProfileData) => {
                    return {
                        ...prevUserProfileData,
                        collectionError: "Collection successfully added!",
                    };
                });
            // Don't refresh the page, otherwise user feedback disappears.
            } else if (result.message == "Collection with the same name already exists") {
            // Changes the collection error message in the state which displays alert for user feedback.
                setUserProfileData((prevUserProfileData) => {
                    return {
                        ...prevUserProfileData,
                        collectionError: "Collection with the same name already exists!",
                    };
                });
            }
        });
    }

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

    function addCollection(callback) {
        $.ajax({
            async: false,
            url: API_URL + "/api/collections/create_collection",
            method: "POST",
            data: {
                auth: token,
                collection_name: newTitle,
            },
            success: function (data) {
                if (data != null) {
                    callback(data);
                } else {
                    callback(null);
                }
            },
            error: function (error) {
                console.log("Server error!");
                callback(error);
            },
        });
    }

    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    let Name: string = "";
    const token = CookieService.get("access_token");
    function request() {
        var result = retrieveCollections(function (result) {
            // Updates the user's collections with the results returned.
            if (result != null) {
                userProfileData.userBookCollections = result.collection_list;
                Name = result.first_name + " " + result.last_name;
            } else {
                alert("Something wrong!");
                window.location.href = "/";
            }
        });
    }

    request();

    return (
        <React.Fragment>
            <CssBaseline />
            <main>
                {/* Page Heading */}
                <div className={classes.heroContent}>
                    <Container maxWidth="sm">
                        <Typography component="h2" variant="h2" align="center" color="textPrimary">
                            Home Profile
                        </Typography>
                        <Typography component="h2" variant="h5" align="center" color="textSecondary">
                            Welcome {Name}!
                        </Typography>
                    </Container>
                </div>

                {/* User's Reading Chart and Reading Goals*/}
                <Container maxWidth="lg" className={classes.container}>
                    <Grid container spacing={3}>
                        {/* Goal */}
                        <Grid item xs={12} md={4} lg={3}>
                            <Paper className={fixedHeightPaper}>
                                <Goal />
                            </Paper>
                        </Grid>
                        {/* Chart */}
                        <Grid item xs={12} md={8} lg={9}>
                            <Paper className={fixedHeightPaper}>
                                <Chart />
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>

                {/* User's Book Collections */}
                <Container className={classes.cardGrid} maxWidth="lg">
                    <Typography component="h4" variant="h4" align="left" color="textPrimary" gutterBottom>
                        User Collections   {'    '}   
                        <Button 
                            type="submit" variant="outlined" color="primary" startIcon={<AddIcon />}
                            onClick={handleClickOpen}
                        >
                            Create
                        </Button>
                    </Typography>

                    {/* User Feedback For Creating Collections */}
                    <div>
                        {userProfileData.collectionError === "Collection with the same name already exists!" ? 
                            (<Alert severity="error">{userProfileData.collectionError}</Alert>) : null}
                        {userProfileData.collectionError === "Collection successfully added!" ? 
                            (<Alert severity="success">{userProfileData.collectionError}</Alert>) : null}
                        {userProfileData.collectionError === "Collection successfully deleted!" ? 
                            (<Alert severity="success">{userProfileData.collectionError}</Alert>) : null}
                    </div>

                    {/* Dialog For Creating Collection */}
                    <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">Create Collection</DialogTitle>
                        <DialogContent>
                            <DialogContentText>Enter a title for your new collection.</DialogContentText>
                            <TextField 
                                autoFocus margin="dense" id="name" label="Collection Title"
                                type="text" fullWidth onChange={onTitleChange}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={addCollectionTitle} color="primary" variant="contained">
                                Save
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Grid container direction={"row"} spacing={4} className={classes.container}>
                        {userProfileData.userBookCollections.map((collection: any) => (
                            <Collections
                                key={collection.collection_id}
                                collection={collection}
                            />
                        ))}
                    </Grid>
                </Container>
            </main>
        </React.Fragment>
    );
}

const useStyles = makeStyles((theme) => ({
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
        wrap: "nowrap",
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
    },
    paper: {
        padding: theme.spacing(2),
        display: "flex",
        overflow: "auto",
        flexDirection: "column",
    },
    fixedHeight: {
        height: 350,
    },
    depositContext: {
        flex: 1,
    },
    cardGrid: {
        paddingBottom: theme.spacing(8),
    },
    createButton: {
        paddingRight: theme.spacing(8),   
    },
}));

// Generate reading data for user goals graph.
function createData(goalDate, amountRead, goalToRead) {
    return { goalDate, amountRead, goalToRead };
}

function Chart() {
    const theme = useTheme();
    const [userGoalData, setUserGoalData] = useState<any[]>([]);
    
    // Dynamically create user goals data for graph rendering.
    userGoals.forEach(function (userGoal) {
        userGoalData.push(createData(userGoal.date_end, userGoal.books_read, userGoal.goal));
    });

    return (
        <React.Fragment>
            <ResponsiveContainer>
                <LineChart data={userGoalData} margin={{ top: 16, right: 16, bottom: 36, left: 24,}}>
                    <XAxis dataKey="goalDate" stroke={theme.palette.text.secondary}>
                        <Label position="bottom" style={{ textAnchor: "middle", fill: theme.palette.text.primary }}>
                            Goal Deadlines
                        </Label>
                    </XAxis>
                    <YAxis stroke={theme.palette.text.secondary}>
                        <Label angle={270} position="left" style={{ textAnchor: "middle", fill: theme.palette.text.primary }}>
                            Books
                        </Label>
                    </YAxis>
                    <Tooltip />

                    <Line name="Books To Read" type="monotone" dataKey="goalToRead" stroke="#82ca9d"/>
                    <Line name="Books Read" type="monotone" dataKey="amountRead" stroke={theme.palette.primary.main}/>

                    <Legend verticalAlign="top" align="right"></Legend>
                </LineChart>
            </ResponsiveContainer>
        </React.Fragment>
    );
}

function Goal() {
    const token = CookieService.get("access_token");
    const [goalError, setGoalError] = useState("");
    const [goalDateError, setGoalDateError] = useState("");

    // Dialog for setting a new reading goal.
    const [openGoal, setOpenGoal] = useState(false);
    const [openEditGoal, setOpenEditGoal] = useState(false);
    const [newAmount, setNewAmount] = useState("");

    const handleClickOpenGoal = () => {
        setOpenGoal(true);
    }
    
    const handleCloseGoal = () => {
        setOpenGoal(false);
    }
  
    const handleCreateGoal = () => {
        setOpenGoal(false);
        requestNewGoal();
    }

    const handleClickEditOpenGoal = () => {
        setOpenEditGoal(true);
    }

    const handleCloseEditGoal = () => {
        setOpenEditGoal(false);
    }

    const handleDeleteGoal = () => {
        setOpenEditGoal(false);
        // Update the most recent goal to be nothing.
        mostRecentGoal = undefined;
        deleteGoal();
    }

    // Detects new value typed into dialog box and loads it on the screen.
    const onAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewAmount(value);
    };

    const [selectedDate, setSelectedDate] = React.useState<Date | null>(
        new Date(),
    );

    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
    };

    function requestUserGoals() {
        var data = getUserGoals(function (data) {
            if (data != null) {
                if (data.message === "Goals retrieved") {
                    userGoals = data.goals_list;
                }
            }
        })
    }

    function getUserGoals(callback) {
        $.ajax({
            async: false,
            url: API_URL + "/api/user/get_goals",
            data: {
                auth: token,
            },
            method: "GET",
            success: function (data) {
                if (data != null) {
                    callback(data);
                } else {
                    callback(null);
                }
            },
            error: function () {
                console.log('server error!');
                callback(null);
            }
        })
    }

    function deleteGoal() {
        $.ajax({
            async: false,
            url: API_URL + "/api/user/delete_goal",
            data: {
                auth: token,
            },
            method: "POST",
            success: function (data) {
                if (data != null) {
                    alert(data.message);
                    window.location.reload();
                }
            },
            error: function () {
                console.log('delete server error!');
            }
        })
    }
    
    // Format the requested date into string for backend query.
    function formatDate() {
      
        let dateString = selectedDate?.toISOString().split('T')[0];
        let dateParts = dateString?.split("-");
        let formattedDateString = "";
        if (dateParts != null && dateParts.length == 3) {
            formattedDateString = (parseInt(dateParts[2])) + "-" + dateParts[1] + "-" + dateParts[0];
        }
        console.log('formatted date is: ');
        return formattedDateString;
    }
    
    function requestNewGoal() {
        
        let formattedDateString = formatDate();
        console.log(formattedDateString);
        var data = setNewGoal(formattedDateString, function (data) {
            if (data != null) {
                if (data.message === "Goal created") {
                    console.log(data);
                    setGoalError("Goal successfully created!");
                }
            }
        });
    }

    function setNewGoal(formattedDate, callback) {
        console.log(formattedDate);
        $.ajax({
            async: false,
            url: API_URL + "/api/user/set_goal",
            data: {
                auth: token,
                count_goal: parseInt(newAmount),
                date_start: formattedDate,
            },
            method: "POST",
            success: function (data) {

                if (data != null) {
                    console.log(data);
                    callback(data);
                } else {
                    callback(null);
                }
            },
            error: function () {
                console.log("server error!");
                callback(null);
            }
        })
    }
    
    function requestEditGoal() {
        var data = editGoal(function(data) {
            if (data != null) {
                if (data.message === "Goal changed") {
                    setGoalError("Goal successfully saved!");
                } else if (data.message === "count_goal not changed") {
                    setGoalError("Goal not changed.");
                } else if (data.message === "invalid count_goal") {
                    setGoalError("Goal must contain at least one book, please try again.");
                }
            }
        });
    }

    function requestEditGoalDate() {
        let formattedDateString = formatDate();
        var data = editGoalDate(formattedDateString, function(data) {
            if (data != null) {
                if (data.message === "Goal dates changed") {
                    setGoalDateError("Goal successfully saved!");
                } else if (data.message === "invalid date") {
                    setGoalDateError("Starting date of goal cannot be in the past, please try again!");
                } else if (data.message == "Cannot edit past goals") {
                    setGoalDateError("The starting date of a past goal cannot be modified, please try again!");
                }
            }
        });
    }

    function editGoal(callback) {
        $.ajax({
            async: false,
            url: API_URL + "/api/user/change_count_goal",
            data: {
                auth: token,
                count_goal: parseInt(newAmount)
            },
            method: "POST",
            success: function (data) {
                if (data != null) {
                    callback(data);
                } else {
                    callback(null);
                }
            },
            error: function () {
                console.log("Server error!");
                callback(null);
            }
        });
    }

    function editGoalDate(formattedDateString, callback) {
        $.ajax({
            async: false,
            url: API_URL + "/api/user/change_start_date",
            data: {
                auth: token,
                date_start: formattedDateString,
            },
            method: "POST",
            success: function (data) {
                if (data != null) {
                    callback(data);
                } else {
                    callback(null);
                }
            },
            error: function () {
                console.log("Server error!");
                callback(null);
            }           
        });
    }

    function handleEditGoal() {
        setGoalError("");
        setGoalDateError("");
        handleCloseEditGoal();
        requestEditGoal();
        requestEditGoalDate();
    }

    const classes = useStyles();
    requestUserGoals();

    if (userGoals.length >= 1) {
        mostRecentGoal = userGoals[userGoals.length - 1];
    }

    return (
        <React.Fragment>
            <Container className={classes.container}>
                <Typography component="h4" variant="h4" color="textPrimary">
                    Reading Goal
                </Typography>
                <Divider />
                {/*Display user's current reading goal if any.*/}
                {(typeof mostRecentGoal !== "undefined") ? 
                    (<div>
                        <Typography component="p"># Books To Read: {mostRecentGoal.goal}</Typography> 
                        <Typography component="p">Deadline: {mostRecentGoal.date_end}</Typography>
                    </div>) : 
                    (<Typography component="p">You currently don't have any reading goals.</Typography>)
                }
                
            </Container>
            <Container className={classes.container}>
                {/* Displays relevant user action depending on whether or not they have an active goal */}
                {(userGoals.length >= 1) ? (<Link onClick={handleClickEditOpenGoal}>Edit Goal</Link>) : (<Link onClick={handleClickOpenGoal}>Set Goal</Link>)}
                
                {/* User Feedback for Goals */}
                <div>
                    {(goalError === "Goal successfully created!") ? 
                        (<Alert severity="success">{goalError}</Alert>) : null}
                    {((goalError === "Goal successfully saved!") && (goalDateError === "Goal successfully saved!")
                        || (goalError === "Goal not changed.") && (goalDateError === "Goal successfully saved!")) ? 
                        (<Alert severity="success">{goalDateError}</Alert>) : null}
                        
                    {(goalError === "Goal must contain at least one book, please try again.") ? 
                        (<Alert severity="error">{goalError}</Alert>) : null}
                    {goalDateError === "Starting date of goal cannot be in the past, please try again!" ? 
                        (<Alert severity="error">{goalDateError}</Alert>) : null}
                    {goalDateError === "The starting date of a past goal cannot be modified, please try again!" ? 
                        (<Alert severity="error">{goalDateError}</Alert>) : null}
                </div>
                
                {/* Dialog For Goal Setting */}
                <Dialog open={openGoal} onClose={handleCloseGoal} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">📚 Set A New Reading Goal</DialogTitle>
                    <DialogContent>
                        <DialogContentText>How many books would you like to read?</DialogContentText>
                        <TextField autoFocus margin="dense" id="numBooks" label="# Books to Read" type="number" fullWidth onChange={onAmountChange}/>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                disableToolbar
                                variant="inline"
                                format="dd-MM-yyyy"
                                margin="normal"
                                id="date-picker-inline"
                                label="Goal Start Date"
                                value={selectedDate}
                                onChange={handleDateChange}
                                KeyboardButtonProps={{'aria-label': 'change date',}}
                            />
                        </MuiPickersUtilsProvider>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseGoal} color="primary">
                            Cancel
                        </Button>
                        <Button color="primary" onClick={handleCreateGoal} variant="contained">
                            Add Goal
                        </Button>
                    </DialogActions>
                </Dialog>

                {/*Dialog For Goal Editing*/}
                <Dialog open={openEditGoal} onClose={handleCloseEditGoal} aria-labelledby="form-dialog-title">
                    <DialogTitle>Edit Current Reading Goal</DialogTitle>
                    <DialogContent>
                        {(mostRecentGoal !== undefined) ? 
                            (<div>
                                <Typography component="p">Books to read this period: {mostRecentGoal.goal}</Typography>
                                <Typography component="p">Current Start Date: {mostRecentGoal.date_start}</Typography>
                                <Typography component="p">Current End Date: {mostRecentGoal.date_end}</Typography>
                                <div>
                                    <TextField id="new-goal" label="New Goal" type="number" fullWidth onChange={onAmountChange} InputLabelProps={{shrink: true}}/>
                                </div>
                                <div>
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDatePicker
                                            disableToolbar
                                            variant="inline"
                                            format="dd-MM-yyyy"
                                            margin="normal"
                                            id="date-picker-inline"
                                            label="Edit Start Date"
                                            value={selectedDate}
                                            onChange={handleDateChange}
                                            KeyboardButtonProps={{'aria-label': 'change date',}}
                                        />
                                    </MuiPickersUtilsProvider>
                                </div>
                            </div>) : (null)
                        }

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseEditGoal} color="primary">Cancel</Button>
                        <Button onClick={handleDeleteGoal} color="primary">Delete</Button>
                        <Button onClick={handleEditGoal} color="primary" variant="contained">Save Changes</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </React.Fragment>
    );
}