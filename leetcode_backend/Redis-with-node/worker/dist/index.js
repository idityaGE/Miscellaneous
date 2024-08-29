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
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const publisher = (0, redis_1.createClient)();
const processData = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { problemId, code, userId, lang } = JSON.parse(data);
    //TODO: create docker container to run the code and get the logs and data from the container
    console.log(`Processing submission for problemId ${problemId}...`);
    console.log(`Code: ${code}`);
    console.log(`Language: ${lang}`);
    // Here you would add your actual processing logic
    // Simulate processing delay
    yield new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`Finished processing submission for problemId ${problemId}.`);
    publisher.publish('problem_done', JSON.stringify({ problemId, userId, status: "TLE" }));
});
function startWorker() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield publisher.connect();
            console.log('connected to redis');
            while (true) {
                try {
                    const data = yield publisher.brPop('key', 0);
                    //@ts-ignore
                    yield processData(data.element);
                    console.log(`Data process done of problem`);
                }
                catch (error) {
                    console.log('Error in processing data', error);
                }
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
startWorker();
// we can create multiple worker by running this code on multiple terminal
