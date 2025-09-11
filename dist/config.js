process.loadEnvFile();
function envOrThrow(key) {
    const value = process.env[key];
    if (value === undefined || value === "") {
        throw new Error(`${key} is not defined `);
    }
    return value;
}
export let config = {
    fileServerHits: 0,
    dbURL: envOrThrow("DB_URL")
};
