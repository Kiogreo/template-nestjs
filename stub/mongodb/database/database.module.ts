import { Module } from '@nestjs/common';
import mongoose from './adapter/mongoose';

@Module({
    imports: [mongoose],
})
export class DatabaseModule {}
