import app from "./app";
import connectDB from "./config/db";
import { PORT } from "./config/envs";

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("No DB connection");
  });
