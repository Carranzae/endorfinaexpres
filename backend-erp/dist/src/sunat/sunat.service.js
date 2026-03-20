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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SunatService = void 0;
const common_1 = require("@nestjs/common");
const xmlbuilder2_1 = require("xmlbuilder2");
const forge = __importStar(require("node-forge"));
const xml_crypto_1 = require("xml-crypto");
const axios_1 = __importDefault(require("axios"));
const prisma_service_1 = require("../prisma/prisma.service");
let SunatService = class SunatService {
    prisma;
    sunatWsUrl = 'https://e-beta.sunat.gob.pe/ol-ti-itcpfegem-beta/billService';
    constructor(prisma) {
        this.prisma = prisma;
    }
    async buildUblXml(orderId, documentType) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { items: { include: { product: true } }, user: true }
        });
        if (!order)
            throw new Error('Pedido no encontrado');
        const doc = (0, xmlbuilder2_1.create)({ version: '1.0', encoding: 'ISO-8859-1' })
            .ele('Invoice', {
            'xmlns': 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2',
            'xmlns:cac': 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
            'xmlns:cbc': 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
            'xmlns:ext': 'urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2'
        })
            .ele('ext:UBLExtensions')
            .ele('ext:UBLExtension')
            .ele('ext:ExtensionContent').txt('').up()
            .up()
            .up()
            .ele('cbc:UBLVersionID').txt('2.1').up()
            .ele('cbc:CustomizationID').txt('2.0').up()
            .ele('cbc:ID').txt(documentType === '01' ? 'F001-1' : 'B001-1').up()
            .ele('cbc:IssueDate').txt(new Date().toISOString().split('T')[0]).up()
            .ele('cbc:InvoiceTypeCode', { listID: '0101' }).txt(documentType).up()
            .ele('cbc:DocumentCurrencyCode').txt('PEN').up()
            .end({ prettyPrint: true });
        return doc;
    }
    signXml(xmlString, pfxBuffer, password) {
        try {
            const p12Der = forge.util.decode64(pfxBuffer.toString('base64'));
            const p12Asn1 = forge.asn1.fromDer(p12Der);
            const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, password);
            let privateKeyObj = null;
            let certObj = null;
            const sig = new xml_crypto_1.SignedXml();
            sig.addReference({ xpath: "//*[local-name(.)='Invoice']" });
            sig.signatureAlgorithm = "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256";
            sig.computeSignature(xmlString, {
                location: { reference: "//*[local-name(.)='ExtensionContent']", action: "append" }
            });
            return sig.getSignedXml();
        }
        catch (e) {
            throw new common_1.InternalServerErrorException('Fallo al firmar el XML: ' + e.message);
        }
    }
    async sendToSunat(signedXml, fileName, username, password) {
        const base64Zip = "base64_zipped_content_mock";
        const soapEnvelope = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.sunat.gob.pe">
      <soapenv:Header>
         <wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
            <wsse:UsernameToken>
               <wsse:Username>${username}</wsse:Username>
               <wsse:Password>${password}</wsse:Password>
            </wsse:UsernameToken>
         </wsse:Security>
      </soapenv:Header>
      <soapenv:Body>
         <ser:sendBill>
            <fileName>${fileName}.zip</fileName>
            <contentFile>${base64Zip}</contentFile>
         </ser:sendBill>
      </soapenv:Body>
    </soapenv:Envelope>`;
        try {
            const response = await axios_1.default.post(this.sunatWsUrl, soapEnvelope, {
                headers: {
                    'Content-Type': 'text/xml;charset=UTF-8',
                    'SOAPAction': 'urn:sendBill'
                }
            });
            const cdrMatch = response.data.match(/<applicationResponse>(.*?)<\/applicationResponse>/);
            return cdrMatch ? cdrMatch[1] : null;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error enviando a SUNAT: ' + error.message);
        }
    }
};
exports.SunatService = SunatService;
exports.SunatService = SunatService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SunatService);
//# sourceMappingURL=sunat.service.js.map