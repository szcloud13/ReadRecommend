// SignUp.tsx
// Signup page

import React, {ChangeEvent, useState} from "react";
import * as Router from "react-router-dom";
import * as $ from "jquery";
import CookieService from "../services/CookieService";

// Material UI
import Alert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import { makeStyles } from "@material-ui/core/styles";

declare const API_URL: string;

const Style = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    root: {
        width: "100%",
        "& > * + *": {
            marginTop: theme.spacing(2),
        },
    },
}));

interface Props {

}

interface SignUpForm {
    signUpError: string;
    signUpFirstName: string;
    signUpLastName: string;
    signUpEmail: string;
    signUpPassword: string;
    signUpConfirmPassword: string;
}

const SignUp: React.FC<Props> = ({}) => {
    const [signUpForm, setSignUpForm] = useState<SignUpForm>({
        signUpError: '',
        signUpFirstName: '',
        signUpLastName: '',
        signUpEmail: '',
        signUpPassword: '',
        signUpConfirmPassword: '',
    });

    // Detects value typed into input and loads it on the screen
    const onTextboxChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSignUpForm(prevSignUpForm => {
          return {
            ...prevSignUpForm,
            [name]: value
          };
        });
    }

    function onSignUp(e) {
        e.preventDefault();
        const password = signUpForm.signUpPassword;
        const confirmPassword = signUpForm.signUpConfirmPassword;

        if (password !== confirmPassword) {
            setSignUpForm(prevSignUpForm => {
                return {
                    ...prevSignUpForm,
                    signUpError: 'Passwords do not match.'
                }
            });
        } else {
            $.ajax({
                url: API_URL + "/api/auth/signup",
                method: "POST",
                data: {
                    email: signUpForm.signUpEmail,
                    password: signUpForm.signUpPassword,
                    first_name: signUpForm.signUpFirstName,
                    last_name: signUpForm.signUpLastName
                },
                success: function (data) {
                    // Handle sign up success.
                    setSignUpForm(prevSignUpForm => {
                        return {
                            ...prevSignUpForm,
                            signUpError: 'Signed up.'
                        }
                    });
                    // The cookie will be available on all URLs.
                    const options = { path: "/" };
                    // Create a cookie with the token from response.
                    CookieService.set("access_token", data.token, options);
                    window.location.reload();
                },
                error: function (xhr, status, error) {
                    console.log(error);
                    if (error == "Conflict") {
                        setSignUpForm(prevSignUpForm => {
                            return {
                                ...prevSignUpForm,
                                signUpError: 'The username is already taken. Please try again.'
                            }
                        });
                    }
                }
            });
        }
    }

    const classes = Style();
    return(
        <div>
            <Container component="main" maxWidth="xs">
                <div className={classes.root}>
                {(signUpForm.signUpError !== "") ? ((signUpForm.signUpError === "Signed up.") ?
                (<Alert severity="success">Successfully signed up! Log in to your account here.</Alert>)
                : (<Alert severity="error">{signUpForm.signUpError}</Alert>)) : (null)}
                </div>
                {(signUpForm.signUpError === "Signed up.") ? (<Router.Redirect to="/"/>) : (null)}
                <CssBaseline />

                <div className={classes.paper}>
                <Typography component="h1" variant="h5">Sign Up</Typography>
                <form className={classes.form} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="signUpFirstName"
                                variant="outlined"
                                required
                                fullWidth
                                label="First Name"
                                value={signUpForm.signUpFirstName}
                                onChange={onTextboxChange}
                                autoFocus
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="signUpLastName"
                                variant="outlined"
                                required
                                fullWidth
                                label="Last Name"
                                value={signUpForm.signUpLastName}
                                onChange={onTextboxChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="signUpEmail"
                                variant="outlined"
                                required
                                fullWidth
                                label="Email"
                                value={signUpForm.signUpEmail}
                                onChange={onTextboxChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="signUpPassword"
                                variant="outlined"
                                required
                                fullWidth
                                type="password"
                                label="Password"
                                value={signUpForm.signUpPassword}
                                onChange={onTextboxChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="signUpConfirmPassword"
                                variant="outlined"
                                required
                                fullWidth
                                type="password"
                                label="Confirm Password"
                                value={signUpForm.signUpConfirmPassword}
                                onChange={onTextboxChange}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={onSignUp}
                    >
                        Sign Up
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link href="/signin" variant="body2">
                              Already have an account? Sign in.
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            </Container>
        </div>
    );
}

export default SignUp;
