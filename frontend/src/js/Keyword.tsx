import $ = require("jquery");
import React, { ChangeEvent, useState } from "react";
import * as Router from "react-router-dom";

import CookieService from "../services/CookieService";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import SentimentSatisfiedAltIcon from '@material-ui/icons/SentimentSatisfiedAlt';
import Paper from "@material-ui/core/Paper";
import SearchIcon from "@material-ui/icons/Search";
import Typography from "@material-ui/core/Typography";
import LanguageIcon from '@material-ui/icons/Language';
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
}));

interface Props {}

interface SearchForm {
  title: any;
}

const Search: React.FC<Props> = ({}) => {

  const classes = Style();
  const token = CookieService.get("access_token");

  const [SearchForm, setSearchForm] = useState<SearchForm>({
    title: "",
  });

  function newSearch(event) {
    event.preventDefault();
    let s = (`${encodeURIComponent(SearchForm.title)}`);
    window.location.href = "/keyword?string=" + s;
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
  

  function viewBook(data) {
      window.location.href = "/bookdata/metadata?id=" + data;
  }

  let str = '';
  let href = `${decodeURIComponent(window.location.href)}`;
  console.log(href);
  if(href.split("?")[1]){
      str = href.split("?")[1];
      str = str.split("=")[1]; //get keyword
  }

  let books: any;
  let flag = false;

  function keywordSearch() {
    console.log('search for: ' + str);
    $.ajax({
      async: false,
      url: API_URL + "/api/books/keyword",
      data: {
        auth: token,
        keyword: str,
      },
      method: "GET",
      success: function (data) {
        console.log(data);
        if (data.message == 'Found matches') {
          console.log(data);
          books = data.book_list;
          flag = true;
        }else{
          books = [];
        }
       
      },
      error: function () {
        console.log("server error!");
      },
    });
  }

  

  keywordSearch();
  

  return (
    <React.Fragment>
      <CssBaseline />

      <main>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              Keyword Search
            </Typography>
            <Typography
              component="h3"
              variant="h5"
              align="center"
              color="textSecondary"
              gutterBottom
            >
              Find a book with a keyword "{str}"
            </Typography>

            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <Paper component="form" className={classes.root}>
                    <TextField
                      className={classes.input}
                      value={SearchForm.title}
                      name="title"
                      label="Search ReadRecommend"
                      onChange={onTextboxChange}
                    />
                    <IconButton
                      type="submit"
                      className={classes.iconButton}
                      aria-label="search"
                      onClick={newSearch}
                    >
                      <SearchIcon />
                    </IconButton>
                    
                  </Paper>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>

        { flag

            ? ( 
                <Container className={classes.cardGrid} maxWidth="md">
                    <Grid container spacing={4}>
                    {books.map((book) => (
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
                              onClick={() => viewBook(book.book_id)}
                            >
                              View
                            </Button>

                           
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                    </Grid>
                </Container>    
              )

            : (<Typography 
                  align='center'
                  component="h5"
                  color="textSecondary"
                 > 
                 <SentimentSatisfiedAltIcon/>
                 {'      '}What books you feel like today? 
               </Typography>)
            

        }
        

        
      </main>
    </React.Fragment>
  );
};

export default Search;