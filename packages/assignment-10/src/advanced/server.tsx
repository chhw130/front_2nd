// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from "react";
import express from "express";
import ReactDOMServer from "react-dom/server";
import { App } from "./App.tsx";
import NodeCache from "node-cache";

const app = express();
const port = 3333;

const cache = new NodeCache({ stdTTL: 60 });

app.get("*", (req, res) => {
  const url = req.url;

  if (cache.get(url)) {
    return res.send(cache.get(url));
  }

  const app = ReactDOMServer.renderToString(<App url={req.url} />);

  const MAIN_TEMPLATE = (template: string) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Simple SSR</title>
    </head>
    <body>
      <div id="root">${template}</div>
    </body>
    </html>
  `;
  };

  cache.set(url, MAIN_TEMPLATE(app));

  res.send(MAIN_TEMPLATE(app));
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
