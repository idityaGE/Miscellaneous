"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const redis_1 = require("redis");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const client = (0, redis_1.createClient)();
client.on('error', (err) => {
    console.log('Error: ' + err);
});
client.on('connect', () => {
    console.log('Connected to Redis');
});
client.on('reconnecting', () => {
    console.log('Reconnecting to Redis');
});
client.on('end', () => {
    console.log('Redis connection closed');
});
app.post('/set', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { problemId, code, lang, userId } = req.body;
    try {
        yield client.lPush('key', JSON.stringify({ problemId, code, lang, userId }));
        res.status(200).send('Code saved successfully');
    }
    catch (error) {
        console.error('Failed to save code:', error);
        res.status(500).send('Failed to save code');
    }
}));
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            app.listen(3000, () => {
                console.log('Server is running on port 3000');
            });
        }
        catch (error) {
            console.error('Failed to start server:', error);
        }
    });
}
startServer();
