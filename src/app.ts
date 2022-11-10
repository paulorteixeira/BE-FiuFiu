import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import mongoose from 'mongoose'

import Controller from '@/utils/interfaces/controller.interface';

class App {
    public express: Application;
    public port: Number;
    public controllers: Controller[];

    constructor(controllers: Controller[], port: number) {
        this.express = express();
        this.port = port;
        this.controllers = controllers;
    }

    public start(): void {
        this.initialiseDatabaseConnection();
        this.initialiseMiddleware();
        this.initialiseControllers(this.controllers);
    }

    private initialiseMiddleware(): void {
        this.express.use(helmet());
        this.express.use(cors());
        this.express.use(morgan('dev'));
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
    }

    private initialiseControllers(controller: Controller[]): void {
        controller.forEach((controller: Controller) => {
            this.express.use('/api', controller.router);
        });
    }

    public listen(): void {
        this.express.listen(this.port, () => {
            console.log(`Listening on port ${this.port}`);
        });
    }

    private initialiseDatabaseConnection(): void {
        const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;
        mongoose.connect(
            `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`
        );
    }
    
}

export default App;
