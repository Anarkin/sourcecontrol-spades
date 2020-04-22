import { CsvWriter } from "./CsvWriter";
import fs from "fs";

describe("CsvWriter", () => {

    const deps = {
        fsWriteFileSyncSpy: {} as jasmine.Spy<typeof fs.writeFileSync>,
        fsExistsSyncSpy: {} as jasmine.Spy<typeof fs.existsSync>
    }
    const fileName = "noop.txt";

    beforeEach(() => {
        deps.fsWriteFileSyncSpy = spyOn(fs, "writeFileSync").and.callFake(() => { });
        deps.fsExistsSyncSpy = spyOn(fs, "existsSync").and.returnValue(true);
    });

    it('should serialize', () => {
        new CsvWriter().write(fileName, [
            { a: "aval", b: "bval" },
            { a: "aval2", b: "bval2" }
        ]);
        expect(deps.fsWriteFileSyncSpy).toHaveBeenCalledWith(jasmine.any(String), "a,b\naval,bval\naval2,bval2");
    });

    it("should use the first object's keys as the csv header", () => {
        new CsvWriter().write(fileName, [
            { a: "aval", b: "bval" },
            { a_something: "aval2", bbb: "bval2" }
        ]);
        expect(deps.fsWriteFileSyncSpy).toHaveBeenCalledWith(jasmine.any(String), "a,b\naval,bval\naval2,bval2");
    });

    it("should use the given separator character", () => {
        new CsvWriter(";").write(fileName, [
            { a: "aval", b: "bval" },
            { aa: "aval2", bb: "bval2" }
        ]);
        expect(deps.fsWriteFileSyncSpy).toHaveBeenCalledWith(jasmine.any(String), "a;b\naval;bval\naval2;bval2");
    });

    describe("when the value contains `separator`s", () => {

        it('should use `escapeQuote`s around the value', () => {
            new CsvWriter().write(fileName, [
                { a: "val1", b: "val2," },
            ]);
            expect(deps.fsWriteFileSyncSpy).toHaveBeenCalledWith(jasmine.any(String), 'a,b\nval1,"val2,"');
        });
    });

    describe("when the value contains `escapeQuote`s", () => {

        it('should use `escapeQuote` around the value and escape all other quotes', () => {
            new CsvWriter().write(fileName, [
                { a: "val1", b: 'val"2' },
            ]);
            expect(deps.fsWriteFileSyncSpy).toHaveBeenCalledWith(jasmine.any(String), 'a,b\nval1,"val""2"');
        });

        describe("and when the value contains `separator`s", () => {

            it('should use `escapeQuote` around values', () => {

                new CsvWriter(",", '"').write(fileName, [
                    { a: "val3", b: '"val4,"' },
                ]);
                expect(deps.fsWriteFileSyncSpy).toHaveBeenCalledWith(jasmine.any(String), 'a,b\nval3,"""val4,"""');
            });
        });
    });

});
