import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";

import { setContext } from "@apollo/client/link/context";

import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import Marks from "./pages/AddClasses";
import Classes from "./pages/Classes";
import Dashboard from "./pages/Dashboard";

const httpLink = createHttpLink({
  uri: "/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// Check first if user is logged in, 'if (loggedIn) { then do this }'
let loggedIn =
  localStorage.getItem("id_token") == null
    ? false
    : localStorage.getItem("id_token") == "undefined"
    ? false
    : true;

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Home} />
            {/* User can only access About route (page) IF they are logged in */}
            {loggedIn && <Route path="/add-classes" component={Marks} />}
            {loggedIn && <Route path="/your-classes" component={Classes} />}
            {loggedIn && <Route path="/dashboard" component={Dashboard} />}
            <Route render={() => <h1 className="display-2">Wrong page!</h1>} />
          </Switch>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;
