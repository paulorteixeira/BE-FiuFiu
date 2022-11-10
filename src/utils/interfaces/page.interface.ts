import { Document } from 'mongoose';
import Post from './post.interface';
import User from './user.interface';

interface Page extends Document {
    name: string;
    owner: User;
    followers: User[];
    feeds?:  Post[];
    pageMode: "public" | "restrict" | "private"; 
}

export default Page;
