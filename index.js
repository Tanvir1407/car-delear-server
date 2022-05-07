const express = require("express");
const cors = require("cors");

const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());

async function run() {
    try {
      app.get('/okk')
  }
    finally {
        
  }
}

run().catch(console.dir);

//check
app.get("/", (req, res) => {
  res.send("assignment check");
});

app.listen(port);
