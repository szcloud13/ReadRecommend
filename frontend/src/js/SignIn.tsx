// SignIn.tsx
// Signin page

import React, { ChangeEvent, useState } from "react";
import * as Router from "react-router-dom";
import * as $ from "jquery";
import CookieService from "../services/CookieService";

// Material UI
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import "react-multi-carousel/lib/styles.css";
import { makeStyles } from "@material-ui/core/styles";

declare const API_URL: string;

const Style = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: theme.spacing(3, 0, 2),
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

interface Props {}

interface SignInForm {
  token: string;
  signInError: string;
  signInEmail: string;
  signInPassword: string;
}

const SignIn: React.FC<Props> = ({}) => {
  const [signInForm, setSignInForm] = useState<SignInForm>({
    token: "",
    signInError: "",
    signInEmail: "",
    signInPassword: "",
  });

  // Detects value typed into input and loads it on the screen
  const onTextboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignInForm((prevSignInForm) => {
      return {
        ...prevSignInForm,
        [name]: value,
      };
    });
  };

  let failFlag = false;

  function onSignIn() {
    $.ajax({
      url: API_URL + "/api/auth/signin",
      method: "POST",
      data: {
        email: signInForm.signInEmail,
        password: signInForm.signInPassword,
      },
      success: function (data) {
        if (data.status == "error") {
          console.log(data);
          failFlag = true;
          // <Router.Redirect to="/" />;
        } else if (data.status == "ok") {
          // Handle sign in success.

          // The cookie will be available on all URLs.
          const options = { path: "/" };
          // Create a cookie with the token from response.
          CookieService.set("access_token", data.token, options);
          console.log(data.user_id);
          window.location.href = "/";
        }
      },
      error: function () {
        console.log("sign in server error!");
        failFlag = true;
        window.location.href = "/auth/signin";
      },
    });
  }

  const classes = Style();
  return (
    <div>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            {" "}
            Sign In
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="signInEmail"
              type="email"
              label="Email"
              value={signInForm.signInEmail}
              onChange={onTextboxChange}
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="signInPassword"
              type="password"
              label="Password"
              value={signInForm.signInPassword}
              onChange={onTextboxChange}
            />
            <Button
              component={Router.Link}
              to="/"
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={onSignIn}
            >
              Sign In
            </Button>
            { failFlag
              ? (<Typography variant="body2">
                   Wrong login credentials
                 </Typography>)
              :(null)
            }
            
            <Grid container justify="flex-end">
              <Grid item>
                
                <Link href="/auth/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </div>
  );
};

export default SignIn;
