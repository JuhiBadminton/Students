const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
// const nunjucks = require("nunjucks");
//use Routes
const userRoutes = require("./routes/userRoute");
const playerRoutes = require("./routes/addPlayer");
// const profileRoutes = require("./routes/profile");
// const classListRoutes = require("./routes/classList");
// const courseRoutes = require("./routes/course");
// const assignmentRoutes = require("./routes/assignment");
const print = require("./generate-endpoints");
const app = express();
const cors = require("cors");
const keys = require("./config/keys");



//Body parser middlware
// app.use(bodyParser.urlencoded({ urlencoded: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.json()); 
// app.use(express.urlencoded({extended: true}));

//DB config
const db = require("./config/keys").mongoURI;
// nunjucks.configure("views", { express: app });

//connect to MongoDb
mongoose
  .connect(db)
  .then(() => console.log("Success"))
  .catch((err) => console.log(err));

//Passport middleware
app.use(passport.initialize());

//Passport config
require("./config/passport")(passport);

// api dump
app.use("/api", userRoutes);
app.use("/api", playerRoutes);
// app.use("/api", profileRoutes);
// app.use("/api", classListRoutes);
// app.use("/api/user", courseRoutes);
// app.use("/api", assignmentRoutes);

// Generating Endpoints
// app._router.stack.forEach(print.bind(null, []));

const port = process.env.PORT || 5000;

app.listen(port, keys.ipAddress, () =>
  console.log(`Server is running on ${port}`)
);

// Production Code
// if (process.env.NODE_ENV === "production") {
  // const path = require("path");
//   app.use(express.static(path.join(__dirname, "./client/build")));
//   app.get("*", (req, res) => {
//       res.sendFile(path.join(__dirname, "./client/build/index.html"),function (err) {
//           if(err) {
//               res.status(500).send(err)
//           }
//       });
//   })
// // }

