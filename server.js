const app = require("./app");
const port = process.env.PORT || 5000;
app.set("view engine", "ejs");


app.get("/", async (req, res) => {
  res.render("index");
});

// app.get("/car/onecar", async (req, res) => {
//   res.render("car/onecar");
// });
app.use("/api/user", require("./routes/userRoute.js"));
app.use("/api/car", require("./routes/carRoute.js"));
app.use("/api/productionOrder", require("./routes/productionOrderRoute.js"));
app.use("/api/invoice", require("./routes/invoiceRoute.js"));
app.use("/api/offer", require("./routes/offerRoute.js"));


app.listen(port, () => {
  console.log("Server started on port " + port);
});
