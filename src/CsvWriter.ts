import { writeFileSync, existsSync, mkdirSync } from "fs";

type Primitive = number | string | boolean;

interface FlatWithPrimitives {
    [key: string]: Primitive;
}

export class CsvWriter {

    private readonly rootPath = "./out";

    constructor(private separator: string = ",", private escapeQuote: string = '"') {
    }

    public write<T extends FlatWithPrimitives>(fileName: string, items: T[]) {
        if (items.length < 1) {
            throw "pass at least one item";
        }

        const header = Object.keys(items[0]).join(this.separator);

        const csvContent = items
            .map(item => Object.values(item).map(value => this.mapCellValue(value)).join(this.separator))
            .reduce((rows, row) => `${rows}\n${row}`, header);

        if (!existsSync(this.rootPath)) {
            mkdirSync(this.rootPath);
        }

        writeFileSync(`${this.rootPath}/${fileName}`, csvContent)
    }

    private mapCellValue(value: Primitive) {
        if (typeof value != "string") {
            return value;
        }

        // escape quotes
        value = value.replace(/"/g, '""');

        // add surrounding quotes when needed
        const hasQuote = value.indexOf(this.escapeQuote) > -1;
        const hasSeparator = value.indexOf(this.separator) > -1;

        if (hasQuote || hasSeparator) {
            value = `${this.escapeQuote}${value}${this.escapeQuote}`;
        }

        return value;
    }
}
