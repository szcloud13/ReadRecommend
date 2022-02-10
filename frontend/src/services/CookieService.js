"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const universal_cookie_1 = __importDefault(require("universal-cookie"));
const cookie = new universal_cookie_1.default();
class CookieService {
    get(key) {
        return cookie.get(key);
    }
    set(key, value, options) {
        cookie.set(key, value, options);
    }
    remove(key) {
        cookie.remove(key);
    }
}
exports.default = new CookieService();
//# sourceMappingURL=CookieService.js.map