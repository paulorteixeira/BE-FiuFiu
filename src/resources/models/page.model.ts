import { Schema, model } from 'mongoose';
import Page from '@/utils/interfaces/page.interface';


const PageSchema = new Schema(
    {
        nome: { type: String, require: true },
        owner: { type: String, require: true },
        followers: { type: [String], require: true },
        feeds:{type:[String], require: false},
        pageMode: {type: String, require:true}
    },
    {
        timestamps: true,
    }
);

export default model<Page>('Page', PageSchema);
