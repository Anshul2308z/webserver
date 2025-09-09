import express from "express";
const app = express();
const PORT = 8080;
app.use("/app", express.static("./src/app"));
function handleReadiness(_req, res) {
    res.send("OK");
    res.set({
        "Content-Type": "text/plain", "charset": "utf-8"
    });
}
app.get("/healthz", handleReadiness);
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
