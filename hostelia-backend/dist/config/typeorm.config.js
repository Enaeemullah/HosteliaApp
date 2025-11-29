"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmConfig = void 0;
const user_entity_1 = require("../users/user.entity");
const hostel_entity_1 = require("../hostels/hostel.entity");
const room_entity_1 = require("../rooms/room.entity");
const student_entity_1 = require("../students/student.entity");
const fee_entity_1 = require("../fees/fee.entity");
const receipt_entity_1 = require("../receipts/receipt.entity");
const typeOrmConfig = () => ({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'hostelia',
    synchronize: true,
    entities: [user_entity_1.User, hostel_entity_1.Hostel, room_entity_1.Room, student_entity_1.Student, fee_entity_1.Fee, receipt_entity_1.Receipt],
    logging: process.env.NODE_ENV !== 'production',
});
exports.typeOrmConfig = typeOrmConfig;
//# sourceMappingURL=typeorm.config.js.map