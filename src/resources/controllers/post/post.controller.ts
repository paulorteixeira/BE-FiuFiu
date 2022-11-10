import Controller from "@/utils/interfaces/controller.interface";
import z from 'zod';
import { Router, Request, Response } from 'express';


class PostController implements Controller{
    public path= "/post";
    public router: Router;

    constructor(){
        this.router = Router();
    }

    
    
    public initialiseRoutes(): void {
        this.router.use(`${this.path}`,this.createPost)
    }

    public async createPost(req:Request, res: Response): Promise<void>{
        try {
            const postBody = z.object({
                title: z.string().min(1),
                content: z.string().min(1).max(120)
            })
        } catch (error: any) {
            res.status(401).json({"message":error})
        }
    }


}