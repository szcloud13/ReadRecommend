import React, {ChangeEvent, useState} from "react";
import $ = require("jquery");
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
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
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import * as Router from 'react-router-dom';

declare const API_URL: string;

const styles= makeStyles((theme) => ({
    container: {
      paddingTop: theme.spacing(4),
      paddingLeft: theme.spacing(16),
      paddingRight: theme.spacing(4),
   
    },
    paper: {
      align: 'center',
      width: '900px',
      margin: 'auto',
      overflow: 'hidden',
    },
    searchBar: {
      borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
     
    },
    searchInput: {
      fontSize: theme.typography.fontSize,

    },
    block: {
      display: 'block',
    },
    addUser: {
      marginRight: theme.spacing(1),
      marginBottom: theme.spacing(2),
    },
    contentWrapper: {
      margin: '40px 16px',
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
}));

interface Props{}

interface SearchForm {
    title: any;
}

// export interface ContentProps extends WithStyles<typeof styles> {}
const FindUser: React.FC<Props> = ({}) => {
   
    const classes = styles();

    const [SearchForm, setSearchForm] = useState<SearchForm>({
      title: '',
    });

    const onTextboxChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSearchForm(prevSearchForm => {
          return {
            ...prevSearchForm,
            [name]: value,
          };
        });
    }

    function preventDefault(event) {
        event.preventDefault
        window.location.href="/user/findusers?"+SearchForm.title;
    }

    let results = false;
    let txt = "";
    let users: any= [];
    function onSearch() {
      $.ajax({
        async: false,
        url: API_URL + "/api/user/find_users",
        data: {
          search: txt,
        },
        method: "GET",
        success: function (data) {
          console.log(data);
          if (data != null) {
              if(data.message != "No matches found"){
                 results = true;
                 console.log(data);
                 users = data.user_list;
              }
          }
        },
        error: function () {
          console.log("server error!");
         
        },
      });
    }

    let array = window.location.href.split("?");
    if(array.length > 1){
        console.log("looking for user: " + array[1]);
        let searchstr = array[1].split("%20");
        if(searchstr.length > 0){
            for(let i=0; i < searchstr.length; i++ ){
                txt = txt.concat(searchstr[i]);
                if(i != array.length-1){
                    txt = txt.concat(" ");
                }
            }
        }else{
            txt = array[1];
        }
        onSearch();
    }
    
    function viewUser(id){
        window.location.href = "/user/otherusers?userid=" + id;
    }

    return (
    <React.Fragment>
          <CssBaseline />
           
            <Grid container spacing={3} className={classes.container}>
                <Paper className={classes.paper}>
                  <AppBar className={classes.searchBar} position="static" color="default" elevation={0}>
                    <Toolbar>
                      <Grid container spacing={2} alignItems="center">
                        
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            InputProps={{
                                disableUnderline: true,
                                className: classes.searchInput,
                            }}
                            value={SearchForm.title}
                            name="title"
                            label="Search by email address or name...."
                            onChange={onTextboxChange}
                          />
                        </Grid>
                        <Grid item>
                          <Button variant="contained" color="primary" className={classes.addUser} onClick={preventDefault}>
                            Search
                          </Button>
                        </Grid>

                      </Grid>
                    </Toolbar>
                  </AppBar>       
                </Paper>
            </Grid>
            <Container className={classes.cardGrid} maxWidth="md">
              { results
                  ? (null)
                  : (<Typography 
                      align='center'
                      component="h5"
                      color="textSecondary"
                     > 
                     <SentimentVeryDissatisfiedIcon/>
                     No matches found 
                     </Typography>)

              }
              <Grid container spacing={4}>
                {users.map((card) => (
                  <Grid item key={card} xs={12} sm={6} md={4}>
                    <Card className={classes.card}>
                      <CardMedia
                        className={classes.cardMedia}
                        image="https://source.unsplash.com/random?book"
                        title="Image title"
                      />
                      <CardContent className={classes.cardContent}>
                        <Typography gutterBottom variant="h5" component="h2">
                          {card.first_name + " " + card.last_name}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button
                          size="small"
                          color="primary"
                          onClick={() => viewUser(card.user_id)}
                        >
                          View
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Container>
            
    </React.Fragment>

    );
    
}

export default FindUser;

