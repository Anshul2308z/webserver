import express from "express";
import { displayFileServerHits, handleReadiness, middlewareLogResponses, middlewareMetricInc, resetFileServerHits, validate_chirp } from "./api/middleware.js";

const app = express();
const PORT = 8080;


app.use(middlewareLogResponses)
app.use("/app",middlewareMetricInc, express.static("./src/app"));

app.get("/api/healthz", handleReadiness);

app.get("/admin/metrics", displayFileServerHits);

app.post("/admin/reset", resetFileServerHits);

// app.post("/api/validate_chirp",validate_chirp);

app.post("/api/validate_chirp",express.json(),(req: express.Request, res: express.Response)=>{
  const text = req.body?.body ;
  if(typeof text !== "string"){
    res.status(400).json({
      error: "Invalid JSON"
    })
    return 
  }
  if(text.length > 140){
    res.status(400).json({
      error : "Chirp is too long"
    })
    return 
  }
  res.status(200).json({
    valid: true
  })
})

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});