import { clientDataRows, sampleSchema, colProps } from "../src/reference/FakeSampleData";


test('clientDataRows returns 20 sample client rows', () => {
    expect(clientDataRows().length).toBe(20);
});


test('sampleSchema returns 4 sample schemas', () => {
    expect(Object.keys(sampleSchema()).length).toBe(4);
});

test("colPop lookups", () => {

    colProps.forEach(element => {
        if (element.lookup) {
            const result = element.lookup()
            expect(result.length).toBeGreaterThan(0);
        }
    });

});
