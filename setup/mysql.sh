#!/bin/bash

npm install --save @nestjs/typeorm typeorm mysql
cp -R stub/mysql/* src/
rm -r stub
rm -r setup
npm i
