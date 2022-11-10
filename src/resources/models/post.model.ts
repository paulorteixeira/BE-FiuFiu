import { Schema, model } from 'mongoose';
import Post from '@/utils/interfaces/user.interface';

const PostSchema = new Schema(
    {
        title: { type: String, require: true },
        content: { type: String, require: true },
    },
    {
        timestamps: true,
    }
);

export default model<Post>('Post', PostSchema);
