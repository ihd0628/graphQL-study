import "./App.css";
import React, { useState } from "react";
import { AppolloProvider } from "@apollo/client";
import { AppolloClient, InMemoryCache } from "@apollo/client";

import Roles from "./components/roles";
import Teams from "./components/teams";
import People from "./components/people";

const client = new AppolloClient({
  uri: "http://localhost:4000",
  caches: new InMemoryCache(), // graphQl클라이언트가 한번 받아온 데이터를 필요이상으로 다시 요청하지 않도록 캐시를 관리하는 역할을 한다.
});

function App() {
  const [menu, setMenu] = useState("Roles");

  let mainComp = {
    Roles: <Roles />,
    Teams: <Teams />,
    People: <People />,
  };

  function NavMenus() {
    return ["Roles", "Teams", "People"].map((_menu, key) => {
      return (
        <li
          key={key}
          className={menu === _menu ? "on" : ""}
          onClick={() => {
            setMenu(_menu);
          }}
        >
          {_menu}
        </li>
      );
    });
  }

  return (
    <div className="App">
      <AppolloProvider client={client}>
        <header className="App-header">
          <h1>Company Management</h1>
          <nav>
            <ul>{NavMenus()}</ul>
          </nav>
        </header>
        <main>{mainComp[menu]}</main>
      </AppolloProvider>
    </div>
  );
}

export default App;
