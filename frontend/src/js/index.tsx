// index.tsx
// Main entrypoint for app
// Handles routing for the different pages

import React from "react";
import ReactDOM from 'react-dom';
import * as Router from "react-router-dom";
import CookieService from "../services/CookieService";

// Page imports
import Header from "./Header";
import Footer from "./Footer";
import Main from "./main";
import SignUp from "./SignUp";
import SignIn from "./SignIn";
import UserLibrary from "./UserLibrary";
import UserProfile from "./UserProfile";
import BookDetails from "./BookDetails";
import ViewCollection from "./ViewCollection";
import EditCollection from "./EditCollection";
import RecentlyAddedBooks from "./RecentlyAddedBooks";
import AddTitles from "./AddTitles";
import OtherUserProfile from "./OtherUserProfile";
import FindUser from "./FindUser";
import Keyword from "./Keyword";
import Search from "./Search";
import ExtSearch from "./ExternalSearch";
import Recommendation from "./Recommendation";


let signedInStatus = true;

const Routing: React.FC = ({}) => {
    // Determine whether a user is signed in by checking for 'access_token' cookie.
    const token = CookieService.get('access_token')

    if (token) {
        signedInStatus = true;
    } else {
        signedInStatus = false;
    }

    return (
        <Router.BrowserRouter>
            <Header userSignedIn={signedInStatus}/>
            <div>
                {/* Matches URL to first in the list and places the result in the div*/}
                <Router.Switch>
                    <Router.Route path="/auth/signup">
                        <SignUp />
                    </Router.Route>
                    <Router.Route path="/auth/signin">
                        <SignIn />
                    </Router.Route>
                    <Router.Route path="/user/userlibrary">
                        <UserLibrary />
                    </Router.Route>
                    <Router.Route path="/user/profile">
                        <UserProfile />
                    </Router.Route>
                    <Router.Route path="/user/viewcollection">
                        <ViewCollection />
                    </Router.Route>
                    <Router.Route path="/user/editcollection">
                        <EditCollection />
                    </Router.Route>
                    <Router.Route path="/user/recent">
                        <RecentlyAddedBooks />
                    </Router.Route>
                    <Router.Route path="/user/addTitles">
                        <AddTitles userSignedIn={signedInStatus}/>
                    </Router.Route>
                    <Router.Route path="/user/findusers">
                        <FindUser />
                    </Router.Route>
                    <Router.Route path="/user/otherusers">
                        <OtherUserProfile />
                    </Router.Route>
                    <Router.Route path="/user/recommendations">
                        <Recommendation />
                    </Router.Route>
                    <Router.Route path="/keyword">
                        <Keyword />
                    </Router.Route>
                    <Router.Route path="/bookdata/metadata">
                        <BookDetails />
                    </Router.Route>
                    <Router.Route path="/search">
                        <Search userSignedIn={signedInStatus}/>
                    </Router.Route>
                    <Router.Route path="/extsearch">
                        <ExtSearch />
                    </Router.Route>
                    <Router.Route path="/">
                        <Main userSignedIn={signedInStatus}/>
                    </Router.Route>
                </Router.Switch>
            </div>
            <Footer />
        </Router.BrowserRouter>
    );
}

ReactDOM.render(<Routing />, document.getElementById("main"));
