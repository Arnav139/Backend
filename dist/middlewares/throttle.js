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
exports.throttleRequests = void 0;
const apiQueue_1 = __importDefault(require("../queues/apiQueue"));
const redis_1 = __importDefault(require("../config/redis"));
const MAX_CONCURRENT_REQUESTS = 10;
const throttleRequests = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const currentRequestCount = parseInt((yield redis_1.default.get("globalRequestCount")) || "0", 10);
        if (currentRequestCount < MAX_CONCURRENT_REQUESTS) {
            yield redis_1.default.incr("globalRequestCount"); // Increment global request count
            console.log("processing request immediately");
            next(); // Process the request immediately
            res.on("finish", () => {
                redis_1.default.decr("globalRequestCount"); // Decrement after request is done
            });
        }
        else {
            console.log("Adding it to queue");
            // Queue the request if max concurrent requests are reached
            yield apiQueue_1.default.add({ req, res, handler: req.handler });
            res.status(202).json({ message: "Request is queued and will be processed shortly." });
        }
    }
    catch (err) {
        console.error("Error in throttling middleware:", err);
        res.status(500).json({ message: "Server error" });
    }
});
exports.throttleRequests = throttleRequests;
