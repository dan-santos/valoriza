// overwrites Request type from express package
declare namespace Express {
  export interface Request {
    // some requests need to know the id of authenticated user
    user_id: string;
  }
}