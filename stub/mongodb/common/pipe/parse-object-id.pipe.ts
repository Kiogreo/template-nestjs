import { PipeTransform } from '@nestjs/common';
import { InvalidValueException } from '../exception/invalid-value.exception';
import { Types } from 'mongoose';

export class ParseObjectIdPipe
    implements PipeTransform<string, Types.ObjectId> {
    transform(value: string): Types.ObjectId {
        try {
            const objectId = Types.ObjectId(value);
            return objectId;
        } catch (e) {
            throw new InvalidValueException('Invalid Object ID format');
        }
    }
}
