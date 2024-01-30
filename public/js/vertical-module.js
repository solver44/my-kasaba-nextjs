const { wrapper } = require("docxtemplater/js/processor-wrapper");
const { BaseModule } = require("docxtemplater/js/modules/BaseModule");
const { XmlPart } = require("docxtemplater/js/documents/XmlPart");
const { XmlTemplaterXmlParser } = require("docxtemplater/js/xml-parsers/XmlTemplaterXmlParser");

class LoopVerticalModule extends BaseModule {
    constructor() {
        super("LoopVerticalModule");
        this.prefix = {
            start: ":vt#",
            end: "/"
        };
    }

    optionsTransformer(opts, docxtemplater) {
        this.docxtemplater = docxtemplater;
        return opts;
    }

    preparse(parsed, { contentType }) {
        // You can add preparse logic here if needed
    }

    matchers() {
        const module = this.name;
        return [
            [this.prefix.start, module, { expandTo: "end", location: "start" }],
            [this.prefix.end, module, { location: "end" }]
        ];
    }

    resolve(part, options) {
        // Resolve logic for the vertical table
        if (!options.scopeManager) {
            throw new Error("Scope manager is not provided.");
        }
        const scopeManager = options.scopeManager;
        const promisedValue = scopeManager.getValueAsync(part.value);
        return promisedValue;
    }

    render(part, options) {
        // Render logic for the vertical table
        const resolvedData = options.resolved;
        if (!Array.isArray(resolvedData)) {
            throw new Error("Resolved data should be an array.");
        }
        const xmlTemplaterXmlParser = new XmlTemplaterXmlParser();
        const xmlPart = new XmlPart("w:sdt");
        const tagContent = [];
        for (const item of resolvedData) {
            const itemXml = xmlTemplaterXmlParser.transform(item);
            tagContent.push(itemXml);
        }
        xmlPart.setContents(tagContent);
        return xmlPart;
    }
}

module.exports = () => {
    return wrapper(new LoopVerticalModule());
};
