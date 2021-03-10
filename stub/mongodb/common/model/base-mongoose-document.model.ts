import { Document } from 'mongoose';
import { Prop } from '@nestjs/mongoose';

export abstract class BaseMongooseDocument extends Document {
    @Prop()
    deleted?: boolean;

    @Prop()
    deletedAt?: Date;

    softDelete(): Promise<this> {
        this.deleted = true;
        this.deletedAt = new Date();
        return this.save();
    }

    restore(): Promise<this> {
        this.deleted = false;
        return this.save();
    }
}
