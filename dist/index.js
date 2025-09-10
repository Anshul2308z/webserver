import express from "express";
import { displayFileServerHits, errorHandler, handleReadiness, middlewareLogResponses, middlewareMetricInc, resetFileServerHits, validate_chirp } from "./api/middleware.js";
const app = express();
const PORT = 8080;
app.use(middlewareLogResponses);
app.use("/app", middlewareMetricInc, express.static("./src/app"));
app.get("/api/healthz", handleReadiness);
app.get("/admin/metrics", displayFileServerHits);
app.post("/admin/reset", resetFileServerHits);
// app.post("/api/validate_chirp",validate_chirp_manually); // this doesn't use express.json()
app.post("/api/validate_chirp", express.json(), validate_chirp);
app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
