// ViewCollection.tsx
// A page where users can edit a previously created collection.

import React, { useState } from "react";
import * as Router from "react-router-dom";
import * as $ from "jquery";

// Material UI
import CookieService from "../services/CookieService";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import Chip from "@material-ui/core/Chip";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import EditIcon from "@material-ui/icons/Edit";
import HistoryIcon from "@material-ui/icons/History";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import InputBase from "@material-ui/core/InputBase";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import Toolbar from "@material-ui/core/Toolbar";
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
}));

interface Props {}

function viewBook(data) {
  window.location.href = "/bookdata/metadata?id=" + data;
}

let tag_list: any[] = [];
let book_list: any = [];
let collection: any;
let owner: any;


const ViewCollection: React.FC<Props> = ({}) => {
  const classes = Style();

  let str = window.location.href.split("?")[1];

  if(str != null && str != ''){
    str = window.location.href.split("=")[1];
    console.log("To find collection: " + str);
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
                  alert("Error! Redirecting....");
                  //window.location.href = "/";
              }
          }
      });
  }


  function getTags(callback) {

        $.ajax({
            async: false,
            url: API_URL + "/api/collections/get_tags",
            data: {
                collection_id: str,
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

  // Retrieves collection data from the back-end/database.
  function request() {
    var data = onSearch(function (data) {
      if (data != null) {
        if (data.message == "Collection data delivered") {
          console.log(data);
          book_list = data.book_list;
          collection = data.collection_name;
          owner = data.owner;
        } else {
          alert("Error! Redirecting....");
          window.location.href = "/";
        }
      }
    });
  }

  function onSearch(callback) {

    const token = CookieService.get('access_token');
    $.ajax({
      async: false,
      url: API_URL + "/api/collections/view_collection",
      data: {
        auth: token,
        collection_id: str,
      },
      method: "GET",
      success: function (data) {
        if (data != null) {
          console.log("delivering data back to callback");
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

  
  if(window.location.href.split("=")[1]){
    request();
    requestTags();
  }  
  // }else{
  //   window.location.href = "/";
  // }
  

  return (
    <React.Fragment>
      <CssBaseline />
      <main>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            {/*TODO: Dynamically render the collection's title */}
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              {collection}
            </Typography>

            {/* Collection Tags Section */}
              <Paper component="ul" className={classes.chipRoot}>
                  <Typography 
                    className={classes.chip}
                    variant="h5"
                    align="center"
                    color="textPrimary"
                    gutterBottom
                  >
                    Tags: 
                  </Typography>
                  {tag_list.map((data) => {
                      return (
                          <li key={data.key}>
                              <Chip label={data.tag_label} className={classes.chip}/>
                          </li>
                      );
                  })}
                  
              </Paper>
              {/* Actions For Editing Collection */}
              <div className={classes.heroButtons}>
                  <Grid container spacing={2} justify="center">
                      <Grid item>
                          <Button 
                              component={Router.Link} to={"/user/recent?collectionid=" + str} 
                              type="submit" variant="outlined" color="primary" startIcon={<HistoryIcon />}
                          >
                              Recently Added Books
                          </Button>
                      </Grid>
                      
                  </Grid>
              </div>

            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                { owner
                  ? (<Button
                        component={Router.Link}
                        to={"/user/editcollection?collectionid=" + str}
                        type="submit"
                        variant="contained"
                        color="primary"
                        startIcon={<EditIcon />}
                      >
                        Edit Collection
                      </Button>)
                  : (null)
                }
                  
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>
        <Container className={classes.cardGrid} maxWidth="md">
          <Grid container spacing={4}>
            {book_list.map((card) => (
              <Grid item key={card.id} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <CardMedia
                    className={classes.cardMedia}
                    image="https://source.unsplash.com/random?book"
                    title="Image title"
                  />
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {card.title}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => viewBook(card.id)}
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
};

export default ViewCollection;
