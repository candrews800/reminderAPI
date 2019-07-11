import React from "react";

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

import AppBar from "./AppBar";
import List from "./List";

function Test() {
    return (
        <div>
            Hey
        </div>
    );
}

function App() {

    return (
        <Router>
            <AppBar />
            <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
            >
                <Grid item xs={12} sm={8} md={6} lg={4} >
                    <Route exact path="/" component={List} />
                    <Route exact path="/test" component={Test} />
                </Grid>
            </Grid>
        </Router>
    );
}

export default App;