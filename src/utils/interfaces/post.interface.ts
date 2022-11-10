import { Document } from 'mongoose';

interface Post extends Document{
    title: string;
    content: string;
}

export default Post;