import auth from '@/middleware/auth.middleware';
import pageModel from '@/resources/models/page.model';
import userModel from '@/resources/models/user.model';
import Controller from '@/utils/interfaces/controller.interface';
import { Router, Request, Response } from 'express';
import z, { string } from 'zod';

class PageController implements Controller {
    public path = '/page';
    public router: Router;

    constructor() {
        this.router = Router();
    }

    public initialiseRoutes(): void {
        this.router.post(`${this.path}`, auth, this.createPage);

        this.router.get(`${this.path}`,  auth, this.listPages);
        this.router.get(`${this.path}/mypages`, auth, this.listMyPages);
    }

    private async createPage(req: Request, res: Response): Promise<void> {
        try {
            const newPageBody = z.object({
                nome: string().min(1),
                pageMode: string(),
            });

            const { nome, pageMode } = newPageBody.parse(req.body);

            const page = await pageModel.findOne({ nome });

            if (!page) {
                const user = await userModel.findOne({ id: req.userId });
                if (user) {
                    const data = await pageModel.create({
                        nome: nome,
                        owner: user._id,
                        followers: [user._id],
                        feeds: [],
                        pageMode: pageMode,
                    });

                    res.status(201).json({ data });
                }
            }else{
                res.status(401).json({ message: `Page ${nome} already exists` });
            }
            
        } catch (error) {
            res.status(401).json({ message: error });
        }
    }

    private async listPages(req: Request, res: Response): Promise<void> {
        try {
            const pages = await pageModel.find(
                {},
                { feeds: false, followers: false }
            );
            res.status(201).json({ pages });
        } catch (error) {
            res.status(401).json({ error });
        }
    }

    private async listMyPages(req: Request, res: Response): Promise<void> {
        try {
            const pages = await pageModel.find({$or:[{ owner: req.userId },{ followers: req.userId }]});
            res.status(201).json({ pages });
        } catch (error) {
            res.status(401).json({ error });
        }
    }

    private async listPostFromPages(
        req: Request,
        res: Response
    ): Promise<void> {
        try {
            
        } catch (error) {
            res.status(401).json({error})
        }
    }
}

export default PageController;
