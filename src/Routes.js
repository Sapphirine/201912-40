import React from "react";
import { Switch } from "react-router-dom";
import Main from "./components/Main";
import AppliedRoute from "./components/AppliedRoutes";

export default ({childProps}) =>
    <Switch>
        <AppliedRoute path="/" exact component={Main} props={childProps} />
    </Switch>;
