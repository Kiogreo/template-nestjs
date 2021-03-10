import { Document, Schema } from 'mongoose';
​
export default function(schema: Schema): void {
    schema.add({
        deleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    });
​
    schema.methods.softDelete = function(): Promise<Document<unknown>> {
        this['deleted'] = true;
        this['deletedAt'] = new Date();
        return this.save();
    };
​
    schema.methods.restore = function(): Promise<Document<unknown>> {
        this['deleted'] = false;
        this['deletedAt'] = null;
        return this.save();
    };
​
    const findFunc = schema.methods.find;
​
    schema.query.isDeleted = function(
        cond: boolean,
    ): ReturnType<typeof findFunc> {
        if (typeof cond === 'undefined') {
            cond = true;
        }
​
        return this.find({
            deleted: cond,
        });
    };
}