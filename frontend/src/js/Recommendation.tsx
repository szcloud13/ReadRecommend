import React, {ChangeEvent, useState} from "react";
import $ = require("jquery");
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Chip from "@material-ui/core/Chip";
import CookieService from "../services/CookieService";
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import RefreshIcon from '@material-ui/icons/Refresh';
import SentimentDissatisfiedIcon from '@material-ui/icons/SentimentDissatisfied';
import Card from "@material-ui/core/Card";
import WhatshotIcon from '@material-ui/icons/Whatshot';
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import * as Router from 'react-router-dom';
declare const API_URL: string;

const styles= makeStyles((theme) => ({
   
    cardGrid: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      alignContent: 'left',
      justifyContent: 'center',
      width: '1000px',
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
    App: { // the item's size
        margin: '0px 0px',
        width: '270px',
        justifyContent: 'center',   
    },
    carousel:{ //width doesnt affect
      justifyContent: 'center',

    },
    chip: {
        margin: theme.spacing(0.5),
    },
    padding: {
        paddingTop: '20%',
        paddingBottom: '20%',
    },
    
}));

interface Props{}

interface SearchForm {
    title: any;
}

function viewBook(id){
    window.location.href = "/bookdata/metadata?id=" + id;
}

function viewCollection(data){
    let s = (`?collectionid=${encodeURIComponent(data)}`);
    window.location.href="/user/viewcollection" + s;
}

function CardStyle(props){
    
    const {books} = props;
    const classes = styles();
  
    return(
        <Grid item className={classes.App}>
            <Card className={classes.card}>
              <CardMedia
                className={classes.cardMedia}
                image="https://source.unsplash.com/random?book"
                title="Image title"
              />
              <CardContent className={classes.cardContent}>
                <Typography gutterBottom variant="h5" component="h2">
                  {books.book_title}
                </Typography>
                <Typography>By Author: {books.book_author}</Typography>
                <Typography>Published on: {books.book_pub_date}</Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => viewBook(books.id)}
                >
                  View
                </Button>
              </CardActions>
            </Card>
          </Grid>

    );
}

function CollectionStyle(props){
          
    const {collection} = props;
    console.log(collection);
    const classes = styles();
    return(
        <Grid item className={classes.App}>
            <Card className={classes.card}>
              <CardMedia
                className={classes.cardMedia}
                image="https://source.unsplash.com/random?book"
                title="Image title"
              />
              <CardContent className={classes.cardContent}>
                <Typography gutterBottom variant="h5" component="h2">
                  {collection.collection_name}
                </Typography>
                  
                { collection.tag_list.map((tag)=>
                   <Chip label={tag} className={classes.chip}/>
                )}
                
                
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => viewCollection(collection.collection_id)}
                >
                  View
                </Button>
              </CardActions>
            </Card>
          </Grid>

    );
}

// export interface ContentProps extends WithStyles<typeof styles> {}
const FindUser: React.FC<Props> = ({}) => {
   
    let books: any = [];
    let genre: any = [];
    
    //for your fav genre suggestions
    let numSlides =0;

    //for readers who read the same genre suggestions
    let numRead =0;

    //for suggestions based on reading history
    let numHist =0;

    //for collections that share same tags as the user 
    let numTagCol =0;
    
    const classes = styles();
    
    //it checks what other readers read same book as you, then check 
    let histRec: any;
    function getHistory() {
      const token = CookieService.get('access_token');
        $.ajax({
            async: false,
            url: "http://localhost:8000/api/books/history",
            data: {
                auth: token,
            },
            method: "GET",
            success: function (data) {
                if (data != null && data.message == 'recommendations found') {
                    console.log(data);
                    histRec = data.book_list;
                    numHist = histRec.length;
                }else{
                  histRec = [];
                }
                
            },
            error: function () {
                console.log("history server error!");
            }
        });
    }

    

    let readerBooks: any;
    let basedOn : any;
    function getRead() {
      const token = CookieService.get('access_token');
        $.ajax({
            async: false,
            url: "http://localhost:8000/api/books/readers",
            data: {
                auth: token,
            },
            method: "GET",
            success: function (data) {
                console.log(data);
                if (data != null && data.message == "Books retrieved") {
                    console.log('storing readerBooks');
                    readerBooks = data.book_list;
                    basedOn = data.based_on;
                    numRead = readerBooks.length;
                }else{
                  readerBooks = [];
                }
                
            },
            error: function () {
                console.log("reader book server error!");
            }
        });
    }    


    function getPopularGenre() {
      const token = CookieService.get('access_token');
        $.ajax({
            async: false,
            url: "http://localhost:8000/api/books/recommendations",
            data: {
                auth: token,
            },
            method: "GET",
            success: function (data) {
                if (data != null && data.message == 'Genre found') {
                    console.log(data);
                    books = data.book_list;
                    genre = data.Most_genre
                    numSlides = books.length;
                }
                
            },
            error: function () {
                console.log("server error!");
            }
        });
    }

    let TagCollections: any = [];
    function getTagCol() {
      const token = CookieService.get('access_token');
        $.ajax({
            async: false,
            url: "http://localhost:8000/api/collections/get_similar_collections",
            data: {
                auth: token,
            },
            method: "GET",
            success: function (data) {

                if (data != null && data.message == 'Got collections') {
                    console.log('Storing TagCollections');
                    TagCollections = data.collection_list;
                    numTagCol = TagCollections.length;
                    console.log(TagCollections);
                }else{
                  TagCollections = [];
                }
                
            },
            error: function () {
                console.log("tag col server error!");
            }
        });
    } 


    
    
    getTagCol();
    getPopularGenre();
    getHistory();
    getRead();
    
    return (
    <React.Fragment>
          <CssBaseline />
            
            
            <Container className={classes.cardGrid} >
              <Grid container spacing={5} className={classes.carousel}>
                <Grid item>
                    <Typography gutterBottom variant="h4">
                       <WhatshotIcon /> Your favourite genre {genre} <WhatshotIcon />
                    </Typography>
                </Grid>
              </Grid>      
              { numSlides > 0
                ? (null)
                : (<Typography 
                      align='center'
                      component="h4"
                      color="textSecondary"
                     > 
                     <SentimentDissatisfiedIcon/>
                      {'    '} No books of your favourite genre!  
                     </Typography>)
              }
              

              { numSlides > 2
                  ? (<Grid container spacing={2} className={classes.cardGrid}>
                      { books.map((book) => (
                          <CardStyle books={book}/>
                      ))}  
                        
                     </Grid>

                     )
                  : (null)
              }
              
              {/*Most Read Genre*/}
              <Grid container spacing={5} className={classes.carousel}>
                <Grid item>
                    <Typography gutterBottom variant="h4">
                       <WhatshotIcon /> Reader who likes "{basedOn}" also read: <WhatshotIcon />
                    </Typography>
                </Grid>
              </Grid> 
              { numRead > 0
                ? (null)
                : (<Typography 
                      align='center'
                      component="h5"
                      color="textSecondary"
                     > 
                     <SentimentDissatisfiedIcon/>
                      {'    '} No one read "{basedOn}" 
                     </Typography>)
              }

              { numRead > 2
                  ? (<Grid container spacing={2} className={classes.cardGrid}>
                       {readerBooks.map((read) =>(
                           <CardStyle books={read}/>
                       ))}
                        
                     </Grid>

                     )
                  : (null)
              }

              {/*Shared tags Collection from other users*/}
              <Grid container spacing={5} className={classes.carousel}>
                <Grid item>
                    <Typography gutterBottom variant="h4">
                       <WhatshotIcon /> Collections that share the same tags as you: <WhatshotIcon />
                    </Typography>
                </Grid>
              </Grid> 
              { numTagCol > 0
                ? (null)
                : (<Typography 
                      align='center'
                      component="h5"
                      color="textSecondary"
                     > 
                     <SentimentDissatisfiedIcon/>
                      {'    '} No collections tagged like yours!  
                     </Typography>)
              }

              { numTagCol > 2
                  ? (<Grid container spacing={2} className={classes.cardGrid}>
                      {TagCollections.map((tagCol) =>(
                        <CollectionStyle collection={tagCol}/>
                      ))}
                        
                     </Grid>

                     )
                  : (null)
              }


              {/*recommendations based on reading history*/}
              <Grid container spacing={5} className={classes.carousel}>
                <Grid item>
                    <Typography gutterBottom variant="h4">
                       <WhatshotIcon /> Recommendations based on your history: <WhatshotIcon />
                    </Typography>
                </Grid>
              </Grid> 
              { numHist > 0
                ? (null)
                : (<Typography 
                      align='center'
                      component="h5"
                      color="textSecondary"
                     > 
                     <SentimentDissatisfiedIcon/>
                      {'    '} No books!  
                     </Typography>)
              }
           
              { numHist > 2
                  ? (<Grid container spacing={2} className={classes.cardGrid}>
                      { histRec.map((hist) => (
                        <CardStyle books={hist}/>
                      ))}  
                        
                        
                     </Grid>
                     )
                  : (null)
              }
              
             
            </Container>
            
    </React.Fragment>

    );
    
}

export default FindUser;

