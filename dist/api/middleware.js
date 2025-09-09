import { config } from "../config.js";
export function middlewareLogResponses(req, res, next) {
    res.on("finish", () => {
        if (!(res.statusCode >= 200 && res.statusCode < 300)) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`);
        }
    });
    next();
}
export function handleReadiness(req, res, next) {
    res.set({
        "Content-Type": "text/plain;charset=utf-8"
    });
    res.send("OK");
}
export function middlewareMetricInc(req, res, next) {
    config.fileServerHits += 1;
    console.log(config.fileServerHits);
    next();
}
export function displayFileServerHits(req, res) {
    res.set({
        "Content-Type": "text/html;charset=utf-8",
    });
    res.send(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.fileServerHits} times!</p>
  </body>
</html>`);
    console.log(config.fileServerHits);
}
export function resetFileServerHits(req, res) {
    config.fileServerHits = 0;
    console.log(config.fileServerHits);
    res.send("Did a hard reset on the counter! ");
}
export function handler(req, res, next) {
    let body = ""; // initialization 
    req.on("data", () => {
        try {
            const parsedBody = JSON.parse(body);
        }
        catch (err) {
            res.status(400).send("Invalid JSON");
        }
    });
}
export function validate_chirp(req, res) {
    let body = "";
    let parsedBody = null;
    req.on("data", (chunk) => {
        body += chunk;
    });
    req.on("end", () => {
        try {
            parsedBody = JSON.parse(body);
        }
        catch (err) {
            res.status(400).json({
                error: 'Something went wrong'
            });
            return;
        }
        if (!parsedBody || typeof parsedBody.body !== "string") {
            return res.status(400).json({ error: "Something went wrong" });
        }
        if (parsedBody.body.length > 140) {
            return res.status(400).json({ error: "Chirp is too long" });
        }
        res.status(200).json({
            valid: true
        });
    });
}
