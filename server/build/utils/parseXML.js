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
exports.parseXML = void 0;
const xml2js_1 = require("xml2js");
const parseXML = (xml) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const result = yield (0, xml2js_1.parseStringPromise)(xml, {
        explicitArray: false,
    });
    return ((_b = (_a = result.rss) === null || _a === void 0 ? void 0 : _a.channel) === null || _b === void 0 ? void 0 : _b.item) || [];
});
exports.parseXML = parseXML;
