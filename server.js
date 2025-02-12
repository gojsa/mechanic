const app = require("./app");
const port = process.env.PORT || 5000;
app.set("view engine", "ejs");


app.get("/", async (req, res) => {
  res.render("index");
});

app.use("/api/user", require("./routes/userRoute.js"));


app.listen(port, () => {
  console.log("Server started on port " + port);
});
