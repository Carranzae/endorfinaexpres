import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { create } from 'xmlbuilder2';
import * as forge from 'node-forge';
import { SignedXml } from 'xml-crypto';
import { DOMParser } from '@xmldom/xmldom';
import axios from 'axios';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SunatService {
    private readonly sunatWsUrl = 'https://e-beta.sunat.gob.pe/ol-ti-itcpfegem-beta/billService'; // Beta URL by default

    constructor(private prisma: PrismaService) { }

    /**
     * Generates the UBL 2.1 standard XML for a Boleta or Factura.
     */
    async buildUblXml(orderId: string, documentType: '01' | '03') {
        // Note: 01 = Factura, 03 = Boleta
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: { items: { include: { product: true } }, user: true }
        });

        if (!order) throw new Error('Pedido no encontrado');

        // Build the bare-bones structure of UBL 2.1 Invoice
        const doc = create({ version: '1.0', encoding: 'ISO-8859-1' })
            .ele('Invoice', {
                'xmlns': 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2',
                'xmlns:cac': 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2',
                'xmlns:cbc': 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2',
                'xmlns:ext': 'urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2'
            })
            .ele('ext:UBLExtensions')
            .ele('ext:UBLExtension')
            .ele('ext:ExtensionContent').txt('').up() // Signature placeholder
            .up()
            .up()
            .ele('cbc:UBLVersionID').txt('2.1').up()
            .ele('cbc:CustomizationID').txt('2.0').up()
            .ele('cbc:ID').txt(documentType === '01' ? 'F001-1' : 'B001-1').up() // Replace with dynamic numeration
            .ele('cbc:IssueDate').txt(new Date().toISOString().split('T')[0]).up()
            .ele('cbc:InvoiceTypeCode', { listID: '0101' }).txt(documentType).up()
            .ele('cbc:DocumentCurrencyCode').txt('PEN').up()

            // ... Add Company Info (Supplier)
            // ... Add Customer Info
            // ... Add Totals and IGV details
            // ... Loop over order.items and add InvoiceLine elements

            .end({ prettyPrint: true });

        return doc;
    }

    /**
     * Signs the generated XML using the company's Digital Certificate (.pfx)
     */
    signXml(xmlString: string, pfxBuffer: Buffer, password: string): string {
        try {
            // 1. Convert PFX to standard format
            const p12Der = forge.util.decode64(pfxBuffer.toString('base64'));
            const p12Asn1 = forge.asn1.fromDer(p12Der);
            const p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, password);

            // 2. Extract specific Key and Certificate Data
            let privateKeyObj = null;
            let certObj = null;

            // Logic to extract keys/certs goes here...
            // (Simplified for illustration. In a real app, you iterate over p12 safeBags)

            // 3. Use xml-crypto to sign
            const sig = new SignedXml();
            // sig.signingKey = privateKeyPem;

            // Node Types may only accept an object interface
            sig.addReference({ xpath: "//*[local-name(.)='Invoice']" });

            sig.signatureAlgorithm = "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256";
            sig.computeSignature(xmlString, {
                location: { reference: "//*[local-name(.)='ExtensionContent']", action: "append" }
            });

            return sig.getSignedXml();
        } catch (e) {
            throw new InternalServerErrorException('Fallo al firmar el XML: ' + e.message);
        }
    }

    /**
     * Packs the XML into a ZIP and sends to SUNAT SOAP endpoint. Returns CDR.
     */
    async sendToSunat(signedXml: string, fileName: string, username: string, password: string) {
        // 1. Zip the XML (requires a library like jszip or archiver)
        const base64Zip = "base64_zipped_content_mock"; // Mocked base64 zip

        // 2. Construct SOAP Envelope
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

        // 3. Axios Request
        try {
            const response = await axios.post(this.sunatWsUrl, soapEnvelope, {
                headers: {
                    'Content-Type': 'text/xml;charset=UTF-8',
                    'SOAPAction': 'urn:sendBill'
                }
            });

            // Parse response to get the CDR zip 
            // <applicationResponse>base64_cdr_zip</applicationResponse>
            const cdrMatch = response.data.match(/<applicationResponse>(.*?)<\/applicationResponse>/);
            return cdrMatch ? cdrMatch[1] : null;

        } catch (error) {
            throw new InternalServerErrorException('Error enviando a SUNAT: ' + error.message);
        }
    }
}
