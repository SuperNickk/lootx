import express from "express";
import mlbbCheckrole from "./src/context/mlbbCheckrole.js";

const app = express();
const PORT = 5000;

app.use(express.json());

mlbbCheckrole(app);

app.listen(PORT, () => {
  console.log(`MLBB Checkrole API is running on port ${PORT}`);
});

export default app;