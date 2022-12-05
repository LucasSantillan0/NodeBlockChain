import { Request, Response } from "express";

export type controller = (req: Request, res: Response) => Promise<void>