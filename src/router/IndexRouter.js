import React from 'react'
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom'
import Login from '../views/login/Login'
import Newssandbox from '../views/newssandbox/Newssandbox'

export default function IndexRouter() {
    return (
        <HashRouter>
            <Switch>
                <Route path="/login" component={Login} />
                {/* <Route path="/" component={Newssandbox} /> */}
                <Route path="/" render={() =>
                    localStorage.getItem("token") ? <Newssandbox></Newssandbox> :
                        <Redirect to="/login" />
                } />
            </Switch>
        </HashRouter>
    )
}
