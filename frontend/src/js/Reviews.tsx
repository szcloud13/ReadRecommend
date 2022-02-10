
import React, { ChangeEvent, useState, useEffect } from "react";

import $ = require("jquery");
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from "@material-ui/core/Button";
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Rating from '@material-ui/lab/Rating';
import TextField from "@material-ui/core/TextField";
import Box from '@material-ui/core/Box';
import CookieService from "../services/CookieService";

declare const API_URL: string;

// Generate Order Data
function createData(id, date, name, country, comment, rating) {
  return { id, date, name, country, comment, rating };
}

const labels = {
  0:'Worst',
  1: 'Useless+',
  2: 'Poor+',
  3: 'Ok+',
  4: 'Good+',
  5: 'Excellent+',
};

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
  ratingStyle: {
    width: 560,
    display: 'flex',
    alignItems: 'center',
  },
}));

export default function Reviews(props) {
  let reviews: any = [];
  let {book} = props;
  let read = false;
  let currentUserID: any;
  let reviewFlag = -1;
  let currentRev : any;
  let currentRat : any;
  let api_call : any;


  const token = CookieService.get("access_token");
  const [openReview, setOpenReview] = useState(false);
  const [newReview, setReview] = useState("");
  const [newRating, setRating] = useState(2);
  const [hover, setHover] = React.useState(-1);

  const handleClickOpen = () => {
    readFlag();
    console.log("reviewFlag & read: " + reviewFlag + read);
    if(!reviewFlag && read){ // if the user not commented and has read book
      setOpenReview(true);
    }else if(reviewFlag && read){ // if review exists and book is read: edit review
      setReview(currentRev);
      setRating(currentRat);  
      setOpenReview(true);
    }else{
      alert("Please mark the book as read in your library before reviewing!");
    }
  }
  
  const handleClose = () => {
    setOpenReview(false);
  }

  // Detects new value typed into dialog box and loads it on the screen.
  const onTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setReview(value);
  };

  function getReviews() {
    console.log("getting reviews... book:" + book);
    
    var data = onReviews(function (data) {
      if (data != null && data.message == "Got matching reviews") {
        console.log(data);
        currentUserID = data.current_user;
        reviews = data.review_list;
       
        for (var i = 0; i < reviews.length; ++i) {
            console.log(reviews[i]);
            if(reviews[i].user_id == currentUserID){
                reviewFlag = 1; //just to prevent user from writing >1 review
                currentRev = reviews[i].review; // get current user's rating and review
                currentRat = reviews[i].rating;
            }
        }
        console.log("recorded: " + currentUserID+" "+reviewFlag);
      }else{
        console.log('did not return any reviews');
      }
    });
  }


  function readFlag(){
    var res = isRead(function (res) {
      if (res != null && res.message == "Success") {
        read = res.is_read;
      } 
    });
  }

  function onReviews(callback) {
    $.ajax({
      async: false,
      url: api_call,
      data: {
        auth: token,
        id: book.book_id,
      },
      method: "GET",
      success: function (data) {
        if (data != null) {
          console.log(data);
          callback(data);
        }
        callback(null);
      },
      error: function () {
        console.log("onReviews server error!");
        callback(null);
      },
    });
  }

  function isRead(callback) {
    $.ajax({
      async: false,
      url: API_URL + "/api/books/is_read",
      data: {
        auth: token,
        book_id: book.book_id,
      },
      method: "GET",
      success: function (data) {
        console.log(data);
        if (data != null) {
          callback(data);
        }
        callback(null);
      },
      error: function () {
        console.log("isRead server error!");
        callback(null);
      },
    });
  }

  function saveReview() {
    // Closes dialog box.
    handleClose();
    console.log("recorded review: " + newReview + " rating: " + newRating + " for bookID: " + book.book_id);
    if(reviewFlag){ // if review for this user exists, this func is called for editing, so we delete old review
      removeReview();
    }
    var data = addReview(function (data) {
      if (data != null) {
        if (data.message == "review successfully created") {
          window.location.href = "/bookdata/metadata?id=" + book.book_id;
        } else {
          alert("Review weird error!");
          window.location.href = "/bookdata/metadata?id=" + book.book_id;
        }
      }
    });
  }
  
  function addReview(callback) {
    $.ajax({
      async: false,
      url: API_URL + "/api/reviews/new_review",
      data: {
        auth: token,
        id: book.book_id,
        review: newReview,
        rating: newRating,
      },
      method: "POST",
      success: function (data) {
        if (data != null) {
          console.log("addReview: " + data.message);
          callback(data);
        }
      },
      error: function () {
        console.log("server error in addReview!");
      },
    });
  }

  function removeReview() {
    $.ajax({
      async: false,
      url: API_URL + "/api/reviews/remove_review",
      data: {
        auth: token,
        id: book.book_id,
      },
      method: "POST",
      success: function (data) {
        if (data != null && data.message == "review successfully deleted") {
          console.log("removeReview: " + data.message);
          window.location.reload();
        }
      },
      error: function () {
        console.log("server error in removeReview!");
      },
    });
  }

  const classes = useStyles();
  if(token){
    reviewFlag = 0;
    readFlag(); //check if user read the book in library
    api_call =  API_URL + "/api/reviews/get_reviews_auth";
    getReviews(); //check is user commented alrdy (get all reviews as well)
  }else{
    api_call = API_URL + "/api/reviews/get_reviews" //display reviews for non users
    getReviews();
  }
  
  
  console.log("checking reviewed; "+reviewFlag);
  return (
    <React.Fragment>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Reviews ({book.n_reviews})
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Reader</TableCell>
            <TableCell>Comments</TableCell>
            <TableCell align="right">Rating</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reviews.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.user_name}</TableCell>
              <TableCell>{row.review}</TableCell>
              <TableCell align="right">
                   
                  <Rating
                    name="half-rating-read"
                    value={row.rating}
                    precision={1}  
                    readOnly
                  />
                
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className={classes.seeMore}>
       
        { reviewFlag == 1 
          ?( <Button color="primary" onClick={handleClickOpen}>
              Edit your review
            </Button>)
          :(null)
        } 
        { reviewFlag == 0
          ?(<Button color="primary" onClick={handleClickOpen}>
              Write a review
            </Button>)
          :(null)
        }  

        <Dialog
          open={openReview}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Write your thoughts...</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Review"
              type="text"
              fullWidth
              value={newReview}
              onChange={onTextChange}
            />
            <div className={classes.ratingStyle}>
              <Rating
                name="hover-feedback"
                value={newRating}
                precision={1}
                onChange={(event, newRating) => {
                  if(newRating != null){
                    setRating(newRating);  
                  }
                }}
                onChangeActive={(event, newHover) => {
                  setHover(newHover);
                }}
              />
              {newRating !== null && <Box ml={2}>{labels[hover !== -1 ? hover : newRating]}</Box>}
            </div>
          </DialogContent>
          <DialogActions>
            
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button
              onClick={saveReview}
              color="primary"
              variant="contained"
            >
              Save
            </Button>
          {/*only display delete button when review exists*/}
            { reviewFlag
              ?  (<Button
                  onClick={removeReview}
                  color="primary"
                  variant="contained"
                >
                  Delete
                </Button>)
              : (null)
            }
          </DialogActions>
        </Dialog>

      </div>
    </React.Fragment>
  );
}

// {userSignedIn ? (
//             <Button
//               size="small"
//               color="primary"
//               endIcon={<AddIcon />}
//               onClick={() => addBook(card.book_id)}
//             >
//               {" "}
//               Add to Libary{" "}
//             </Button>
//           ) : null}