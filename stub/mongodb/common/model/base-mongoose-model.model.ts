import { Document, Model } from 'mongoose';
export interface BaseMongooseModel<T extends Document> extends Model<T> {
    softDelete(): Promise<T>;
}