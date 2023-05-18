const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const connectDB = require('./db/connect');
require('dotenv').config();
const bodyParser = require("body-parser");

//routes imports
const authRoutes = require("./routes/authRoutes");
const prasadRoutes=require("./routes/prasadRoutes");
const blogRoutes=require("./routes/blogRoutes");
const quoteRoutes=require("./routes/quoteAdminRoutes");
const templeRoutes=require("./routes/templeRoutes");
const pujaRoutes=require("./routes/pujaRoutes");
const panditRoutes=require("./routes/panditRoutes")
//middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json({ limit: "50mb" }));
app.use(
    cors({
        origin: '*'
    })
);

//route middlewares
app.use("/api/auth", authRoutes);
app.use("/api/prasad",prasadRoutes);
app.use("/api/blog",blogRoutes)
app.use("/api/quotes",quoteRoutes);
app.use("/api/temple",templeRoutes)
app.use("/api/puja",pujaRoutes);
app.use("/api/pandit",panditRoutes);
//server test route
app.get("/", (req, res) => {
    res.status(200).json({ message: "bharat-one server is running" })

})
//connection to database
connectDB(process.env.MONGO_URI);

//server listenng 
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

