import 'dotenv/config';
import 'module-alias/register';
import App from './app';
import UserController from '@/resources/controllers/user/user.controller';
import PageController from '@/resources/controllers/page/page.controller';

const userController = new UserController();
const pageController = new PageController();

userController.initialiseRoutes();
pageController.initialiseRoutes();

const app = new App([userController,pageController], Number(process.env.PORT));

app.start();

app.listen();

