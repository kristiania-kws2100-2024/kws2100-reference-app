import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {MapApplication} from "./components/application/mapApplication";
import {BrowserRouter} from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<BrowserRouter><MapApplication/></BrowserRouter>);
