const express = require("express"); // Used to set up a server
const cors = require("cors"); // Used to prevent errors when working locally
const bodyParser = require("body-parser");
const app = express(); // Initialize express as an app variable
const userRoute = require("./routes/userRoute");
const productsRoute = require("./routes/productsRoute");
const orderRoute = require("./routes/ordersRoute");

app.set("port", process.env.PORT || 3001); // Set the port
app.use(express.json()); // Enable the server to handle JSON requests
app.use(cors()); // Dont let local development give errors
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("dist"));
//Serves all the request which includes /images in the url from Images folder

app.get("/", (req, res) => {
  res.sendFile("dist/index.html", { root: __dirname });
  res.json({ message: "Welcome to candy store" });
});

app.use("/users", userRoute);
app.use("/products", productsRoute);
app.use("/orders", orderRoute);

app.listen(app.get("port"), () => {
  console.log(`Listening for calls on port ${app.get("port")}`);
  console.log("Press Ctrl+C to exit server");
});
