import "./wdyr";
import { createRoot } from "react-dom/client";
import "./index.css";
import "antd/dist/antd.less";
import App from "./App";
import { loadServer, DevTools } from "jira-dev-tool";
// 务必在jira-dev-tool后面引入
import { AppProviders } from "./context";

const container = document.getElementById("root");
const root = createRoot(container!);
loadServer(() =>
  root.render(
    <AppProviders>
      <DevTools />
      <App />
    </AppProviders>
  )
);

// import reportWebVitals from './reportWebVitals';
// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
