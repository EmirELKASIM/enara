import { NextFunction, Request, Response } from "express";
interface ExtendRequest extends Request {
    user?: any;
}
declare const validateJWT: (req: ExtendRequest, res: Response, next: NextFunction) => void;
export default validateJWT;
//# sourceMappingURL=validateJWT.d.ts.map