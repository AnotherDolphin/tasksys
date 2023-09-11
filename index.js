import express from "express";
import app from "./app.js";
const port = process.env.TEST ? 12010 : process.env.PORT || 1200;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
