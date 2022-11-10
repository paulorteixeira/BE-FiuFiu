import userModel from '@/resources/models/user.model';
import Controller from '@/utils/interfaces/controller.interface';
import auth from '@/middleware/auth.middleware';
import generateToken from '@/utils/Auth/jwt.auth';

import { Router, Request, Response } from 'express';
import z, { string } from 'zod';

class UserController implements Controller {
    public path = '/user';
    public router: Router;

    constructor() {
        this.router = Router();
    }

    public initialiseRoutes(): void {
        this.router.post(`${this.path}`, this.createNewUser);
        this.router.post(`${this.path}/login`, this.logInUser);

        this.router.get(`${this.path}/me`, auth, this.userFromToken);
        this.router.get(`${this.path}`, auth, this.getAllUsers);
    }

    private async createNewUser(req: Request, res: Response): Promise<void> {
        try {
            const newUserBody = z.object({
                nome: z.string().min(1),
                email: z.string().email(),
                senha: z.string(), //.regex(new RegExp('/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#!;=+\-_,.])[0-9a-zA-Z$*&@#!;=+\-_,.]{8,}$/')),
            });

            const { nome, email, senha } = newUserBody.parse(req.body);

            const user = await userModel.findOne({ nome, email });

            if (!user) {
                const data = await userModel.create({ nome, email, senha });
                const token = generateToken({ id: data.id });
                res.status(201).json({ token, data });
            } else {
                res.status(400).json({ message: 'usuário já criado' });
            }
        } catch (error: any) {
            res.status(401).json(error);

            throw error;
        }
    }

    private async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const data = await userModel.find({});
            res.json(data);
        } catch (error) {
            res.status(401).json({ error });
        }
    }

    private async logInUser(req: Request, res: Response): Promise<void> {
        try {
            const loginUser = z.object({
                email: string().email(),
                senha: string(),
            });

            const { email, senha } = loginUser.parse(req.body);

            const user = await userModel.findOne({ email, senha });

            if (!user) {
                res.status(401).json({ message: 'Usuário não cadastrado' });
            } else {
                const token = generateToken({ id: user.id });
                res.status(200).json({ token, user });
            }
        } catch (error) {
            res.status(401).json(error);

            throw error;
        }
    }

    private async userFromToken(req: Request, res: Response): Promise<void> {
        try {
            const user = await userModel.findOne({ id: req.userId });
            if (!user) {
                res.status(404).json({ message: 'User could not be found' });
            } else {
                res.status(201).json(user);
            }
        } catch (error) {
            res.status(401).json(error);
            throw error;
        }
    }
}

export default UserController;
