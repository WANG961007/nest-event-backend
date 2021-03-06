import {TypeOrmModuleOptions} from "@nestjs/typeorm";
import {registerAs} from "@nestjs/config";

export default registerAs('orm.config', (): TypeOrmModuleOptions => ({
    type: 'mysql',
    host: "mysql",
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ["dist/**/*.entity{.ts,.js}"],
    // entities: [Event,Attendee],

    synchronize: true,
    logging: true
}));