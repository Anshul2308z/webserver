import { Request, Response, NextFunction } from "express";
import { config } from "../config.js";

export function middlewareLogResponses(req : Request, res : Response, next : NextFunction){
  res.on("finish",()=>{
    if (!(res.statusCode >= 200 && res.statusCode < 300)){
      console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`)
    }
  })
  next()  
}

export function handleReadiness(req: Request, res: Response, next: NextFunction) {
  res.set({
    "Content-Type": "text/plain;charset=utf-8"
  })
  res.send("OK")
}

export function middlewareMetricInc(req: Request, res: Response, next: NextFunction){
  config.fileServerHits += 1;
  console.log(config.fileServerHits);
  next()
}

export function displayFileServerHits(req: Request, res: Response){
  res.set({
    "Content-Type": "text/html;charset=utf-8", 
  })
  res.send(
  `<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.fileServerHits} times!</p>
  </body>
</html>`
  );
  console.log(config.fileServerHits)

}

export function resetFileServerHits(req: Request, res: Response){
  config.fileServerHits = 0 ;
  console.log(config.fileServerHits)
  res.send("Did a hard reset on the counter! ")
}

export function validate_chirp_manually(req: Request, res: Response){
  type expectedBody = {
    body : string
  }
  let body = "";
  let parsedBody: expectedBody | null = null;

  req.on("data",(chunk)=>{
    body += chunk
  } )

  req.on("end",()=>{
    try{
       parsedBody = JSON.parse(body);
      }catch(err){
        res.status(400).json({
          error : 'Something went wrong'
        })
        return ; 
      }
      if (!parsedBody || typeof parsedBody.body !== "string") {
  return res.status(400).json({ error: "Something went wrong" });
      }
      if(parsedBody.body.length > 140){
        return res.status(400).json({ error: "Chirp is too long" });
      }
      res.status(200).json({
        valid : true
      })
      
  })
}

export function validate_chirp(req: Request, res:Response, next:NextFunction){
  const text = req.body?.body ;
  if(typeof text !== "string"){
    res.status(400).json({
      error: "Invalid JSON"
    })
    return 
  }
  if(text.length > 140){
    
    // res.status(400).json({
    //   error : "Chirp is too long"
    // })
  // try{
  //   throw new Error("Chirp is too long")
  //   }catch(err){
  //     next(err)
  //   }   // only try/catch in async code 
    return next(new BadRequestError("Chirp is too long. Max length is 140"))
  }
  // res.status(200).json({
  //   valid: true
  // })

  const forbidden = new Set(["kerfuffle", "sharbert", "fornax"]); 

  let words = text.split(" ");
  let filter: string[] = []
  words.map((word)=>{

    if(forbidden.has(word.toLowerCase())){
      filter.push("****");  
    }
    else{
      filter.push(word)
    }

  })
  res.status(200).json({
    cleanedBody : filter.join(" ")
  })
}

class NotFoundError extends Error{
  constructor(message: string){
    super(message)
  }
}

class BadRequestError extends Error{
  constructor(message: string){
    super(message)
  }
}

class UnauthorizedError extends Error{
  constructor(message: string){
    super(message)
  }
}

class ForbiddenError extends Error{
  constructor(message: string){
    super(message)
  }
}


export function errorHandler(err:Error,
  req: Request, res: Response, next: NextFunction
){
  let statusCodeHere: number= 0 ;
  res.on("finish",()=>{
    statusCodeHere=res.statusCode 
  })
  if(err instanceof NotFoundError){
    res.status(400).json({
      error : err.message
    })
  }
  if(err instanceof UnauthorizedError){
    res.status(400).json({
      error : err.message
    })
  }
  if(err instanceof BadRequestError){
    res.status(400).json({
      error : err.message
    })
  }
  console.log(err.message);
  res.status(500).json({
    error : "Something went wrong on our end"
  })
}

