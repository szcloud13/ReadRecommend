import React, {ChangeEvent, useState} from "react";
import * as Router from "react-router-dom";

// Material UI

import IconButton from '@material-ui/core/IconButton';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Link from "@material-ui/core/Link";
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from "@material-ui/core/styles";
import AppBar from '@material-ui/core/AppBar';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import BookmarksIcon from '@material-ui/icons/Bookmarks';
import Toolbar from '@material-ui/core/Toolbar';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import ImportContactsIcon from '@material-ui/icons/ImportContacts';
import * as $ from "jquery";

declare const API_URL: string;

const useStyles = makeStyles((theme) => ({
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
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  container: {
      paddingTop: theme.spacing(4),
      paddingLeft: theme.spacing(16),
   
  },
  
}))

interface userForm {
    firstName: string;
    lastName: string;
}

export default function Profile() {
  const classes = useStyles();
  let cards: any;
  let lib: any;
  let str = window.location.href.split('?')[1];
  str = str.split('=')[1];
  console.log("To find user id : "+str);

  const [userForm, setUserForm] = useState<userForm>({
    firstName: '',
    lastName: '',
  });

  function request() {
    
    var data = onSearch(function(data){ 
        if(data.message == "Got user profile data") {
            cards = data.collection_list;
            userForm.firstName = data.first_name;
            userForm.lastName = data.last_name;
            lib = data.library_books;
        }else{
            alert("No Matched Results!");
            //window.location.href='/';
        }
        
    });
  }

    function onSearch(callback) {
        
        $.ajax({
            async: false,
            url: 'http://localhost:8000/api/user/get_profile',
            data: {
                user_id: str,
            },
            method: "GET",
            success: function (data) {
                if(data!= null) {
                    console.log(data);
                    callback(data);                
                }
                callback(null);
            },
            error: function () {
                console.log("server error!");
                callback(null);    
            } 
        });
    }

    function viewCollection(data){
       //console.log("col_id" + data);
       window.location.href="/user/viewcollection?collectionid="+data;
    }

    function viewBook(data) {
      //console.log("book_id" + data);
       window.location.href = "/bookdata/metadata?id=" + data;
    }

  request();

  return (
    <React.Fragment>
      <CssBaseline />
      
      <main>
        {/* Hero unit */}
        <div className={classes.heroContent} >
          <Container>
          <Grid container spacing={3} className={classes.container}>
           <Grid item xs={12} md={8} lg={9}>
              <Typography component="h1" variant="h2" align="left" color="textPrimary" >
                <IconButton>
                  <AccountCircleIcon display='block' style={{ fontSize: 100 }} color="inherit" />
                </IconButton>
                {userForm.firstName + " " + userForm.lastName}
              </Typography>
          </Grid>
             
          </Grid>
          </Container>

        </div>

        <Container className={classes.cardGrid} maxWidth="md">
            <Typography
              variant="h4"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              Collections<BookmarksIcon/>
            </Typography>
            { cards.length
              ? (null)
              : (<Typography 
                  align='center'
                  component="h5"
                  color="textSecondary"
                 > 
                 <SentimentVeryDissatisfiedIcon/>
                 {userForm.firstName + " " + userForm.lastName} have no collections yet
                 </Typography>)
            }
          <Grid container spacing={4}>
            {cards.map((collection) => (
              <Grid item key={collection} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image="https://source.unsplash.com/random"
                    title="Image title"
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {collection.collection_name}
                    </Typography>
                    
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary" onClick={() => viewCollection(collection.collection_id)}>
                      View
                    </Button>

                   
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        <Container className={classes.cardGrid} maxWidth="md">
          <Typography
              variant="h4"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              Books read <ImportContactsIcon/>
            </Typography>
            { lib.length
              ? (null)
              : (<Typography 
                  align='center'
                  component="h5"
                  color="textSecondary"
                 > 
                 <SentimentVeryDissatisfiedIcon/>
                 No books in {userForm.firstName + " " + userForm.lastName}'s library 
                 </Typography>)
            }
          <Grid container spacing={4}>

            {lib.map((book) => (
              <Grid item key={book} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image="https://source.unsplash.com/random?book"
                    title="Image title"
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {book.book_title}
                    </Typography>
                    <Typography>By Author: {book.book_author}</Typography>
                    <Typography>Published on: {book.book_pub_date}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => viewBook(book.id)}
                    >
                      View
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
}