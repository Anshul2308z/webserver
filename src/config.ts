process.loadEnvFile()
type APIConfig = {
    fileServerHits : number ;
    dbURL : string 
};

function envOrThrow(key: string): string{
    const value = process.env[key]
    if(value === undefined || value === ""){
        throw new Error(`${key} is not defined `)
    }
    return value;
}



export let config: APIConfig= {
    fileServerHits: 0 ,
    dbURL: envOrThrow("DB_URL")
} 