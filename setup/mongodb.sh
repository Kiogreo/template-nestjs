#!/bin/bash

npm install --save @nestjs/mongoose mongoose
cp -R stub/mongodb/* src/
rm -r stub
rm -r setup
npm i
