import { MongooseModule, ModelDefinition } from '@nestjs/mongoose';
import { DynamicModule } from '@nestjs/common';
import { Schema } from 'mongoose';
import softDeletePlugin from './plugin/soft-delete.plugin';

export default MongooseModule.forRootAsync({
    useFactory: () => {
        let options = {
            uri: process.env.MONGODB_ENDPOINT,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        };

        // additional options needed to be included in production environment in order to connect to DB
        if (process.env.NODE_ENV === 'production') {
            options = Object.assign(options, {
                tls: process.env.USE_TLS,
                tlsCAFile: process.env.CA_FILE,
                tlsCertificateKeyFile: process.env.CERT_FILE,
            });
        }

        return options;
    },
});

const originalFeature = MongooseModule.forFeature;
MongooseModule.forFeature = function(
    models?: ModelDefinition[],
    connectionName?: string,
): DynamicModule {
    models.forEach((model: ModelDefinition) => {
        (model.schema as Schema).plugin(softDeletePlugin);
    });
    return originalFeature(models, connectionName);
};
