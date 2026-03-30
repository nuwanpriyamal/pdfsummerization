"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScenarioModule = void 0;
const common_1 = require("@nestjs/common");
const scenario_controller_1 = require("./scenario.controller");
const pdf_module_1 = require("../pdf/pdf.module");
const openclaw_module_1 = require("../openclaw/openclaw.module");
const email_module_1 = require("../email/email.module");
let ScenarioModule = class ScenarioModule {
};
exports.ScenarioModule = ScenarioModule;
exports.ScenarioModule = ScenarioModule = __decorate([
    (0, common_1.Module)({
        imports: [pdf_module_1.PdfModule, openclaw_module_1.OpenclawModule, email_module_1.EmailModule],
        controllers: [scenario_controller_1.ScenarioController],
    })
], ScenarioModule);
//# sourceMappingURL=scenario.module.js.map