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
export function validate_chirp_manually(req, res) {
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
export function validate_chirp(req, res, next) {
    const text = req.body?.body;
    if (typeof text !== "string") {
        res.status(400).json({
            error: "Invalid JSON"
        });
        return;
    }
    if (text.length > 140) {
        // res.status(400).json({
        //   error : "Chirp is too long"
        // })
        try {
            throw new Error("Chirp is too long");
        }
        catch (err) {
            next(err);
        }
        return;
    }
    // res.status(200).json({
    //   valid: true
    // })
    const forbidden = new Set(["kerfuffle", "sharbert", "fornax"]);
    let words = text.split(" ");
    let filter = [];
    words.map((word) => {
        if (forbidden.has(word.toLowerCase())) {
            filter.push("****");
        }
        else {
            filter.push(word);
        }
    });
    res.status(200).json({
        cleanedBody: filter.join(" ")
    });
}
export function errorHandler(err, req, res, next) {
    console.log(err.message);
    res.status(500).json({
        error: "Something went wrong on our end"
    });
}
