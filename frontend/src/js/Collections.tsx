import React, { useState } from 'react';
import * as Router from 'react-router-dom';
import * as $ from "jquery";

// Material UI
import Alert from "@material-ui/lab/Alert";
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import CookieService from "../services/CookieService";
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles({
    card: {
        display: 'flex',
    },
    cardContent: {
        flexGrow: 1,
    },
    cardDetails: {
        flex: 1,
    },
    cardMedia: {
        width: 160,
    },
});

function viewCollection(data){
    console.log(data);
    window.location.href="/user/viewcollection?collectionid=" + data;
}

function editCollection(data){
    window.location.href="/user/editcollection?collectionid="+data;
}

export default function Collections(props) {
    const classes = useStyles();
    let { collection } = props;

    const [collectionData, setCollectionData] = useState({
        collectionError: '',
    });

    function deleteCollection(collectionid, collection_name) {
        var data = deleteCollectionHelper(collectionid, collection_name, function(data){
            if (data != null) {
                if (data.message == "Collection successfully deleted") {
                    // Display user feedback to indicate that the collection has been deleted.
                    setCollectionData(prevCollectionData => {
                        return {
                            collectionError: 'Collection successfully deleted!',
                        }
                    });
                    window.location.reload();
                }
            }
        });
    }

    function deleteCollectionHelper(id, name, callback) {
        const token = CookieService.get('access_token');
        $.ajax({
            async: false,
            url: 'http://localhost:8000/api/collections/delete_collection',
            data: {
                auth: token,
                collection_id: id,
                collection_name: name,
            },
            method: "POST",
            success: function (data) {
                if (data!= null) {
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

    return (
        <Grid item xs={12} md={6}>
            <CardActionArea>
            <Card className={classes.card}>
                <div className={classes.cardDetails}>
                    <CardContent className={classes.cardContent}>
                        <Typography component="h2" variant="h5">
                            {collection.collection_name}
                        </Typography>
                        {/*}    only have name ...
                        <Typography variant="subtitle1" color="textSecondary">
                            {collection.date}
                        </Typography>
                        <Typography variant="subtitle1" paragraph>
                            {collection.description}
                        </Typography>
                        */}
                        {/* TODO: Dynamically change the router link to match the requested collection by collection id.*/}
                        <Button size="small" color="primary" component={Router.Link} to="/user/viewcollection" onClick={() => viewCollection(collection.collection_id)}>
                            <Typography variant="subtitle1" color="primary" >
                                View
                            </Typography>
                        </Button>
                        <Button size="small" color="primary" component={Router.Link} to="/user/editcollection" onClick={() => editCollection(collection.collection_id)}>
                            <Typography variant="subtitle1" color="primary" >
                                Edit
                            </Typography>
                        </Button>
                        <Button size="small" color="primary" onClick={() => deleteCollection(collection.collection_id, collection.collection_name)}>
                            <Typography variant="subtitle1" color="primary" >
                                Remove
                            </Typography>
                        </Button>
                    </CardContent>
                </div>
                <Hidden xsDown>
                    <CardMedia className={classes.cardMedia} image={'https://source.unsplash.com/random'} title={'Image Text'} />
                </Hidden>
            </Card>
            </CardActionArea>
        </Grid>
    );
}

Collections.propTypes = {
    collection: PropTypes.object,
};
