"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importStar(require("ws"));
const redis_1 = require("redis");
const redisClient = (0, redis_1.createClient)();
console.log('Connected to Redis');
const subscriber = redisClient.duplicate();
subscriber.on('error', (err) => {
    console.log('Error : ' + err);
});
const wss = new ws_1.WebSocketServer({ port: 8080 }); // ws://localhost:8080
// Map to store userId to WebSocket connection
const userConnections = new Map();
const getData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield subscriber.connect();
        yield subscriber.subscribe('problem_done', (message) => {
            // Assuming the message is a JSON string containing userId and other data
            const data = JSON.parse(message);
            console.log(data);
            const userId = data.userId;
            // Find the WebSocket connection for this userId
            const ws = userConnections.get(userId);
            if (ws && ws.readyState === ws_1.default.OPEN) {
                ws.send(message);
            }
        });
    }
    catch (error) {
        console.log(error);
    }
});
getData();
wss.on('connection', (ws) => {
    ws.on('error', console.error);
    // Handle messages from WebSocket clients
    ws.on('message', (message) => {
        // Assuming the client sends a JSON string containing userId
        //@ts-ignore
        const data = JSON.parse(message);
        // console.log(data)
        const userId = data.userId;
        // Store the WebSocket connection for this userId
        userConnections.set(userId, ws);
        console.log(`User connected: ${userId}`);
    });
    ws.on('close', () => {
        // Remove the WebSocket connection when it is closed
        userConnections.forEach((value, key) => {
            if (value === ws) {
                userConnections.delete(key);
                console.log(`User disconnected: ${key}`);
            }
        });
    });
    ws.send('Connected to WebSocket server');
});
