import React from 'react';
import HouseModelViewPage from "./components/HouseModelViewPage";
import ProjectPage from "./components/ProjectPage";
import MainPage from "./components/MainPage";
import './index.css'
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import PageNotFound from "./components/PageNotFound";
import Header from "./cmp/Header";
import CreateProjectPage from "./components/CreateProjectPage";
import CommentPage from "./components/Comments";

export default function App() {
  return (
      <Router>
          <Header/>
        <div className="App">
          <div className="container d-flex align-items-center flex-column ">
            <Switch>
              <Route path="/" exact={true}>
                <MainPage/>
              </Route>
                <Route path="/create" exact={true}>
                    <CreateProjectPage/>
                </Route>
                <Route path="/project/:pin" exact={true}>
                    <ProjectPage/>
                </Route>
                <Route path="/model" exact={true}>
                    <HouseModelViewPage/>
                </Route>
                <Route path="/model/comments/:modelId" exact>
                    <CommentPage/>
                </Route>
                <Route>
                    <PageNotFound/>
                </Route>

            </Switch>
          </div>
        </div>
      </Router>
  )
}
