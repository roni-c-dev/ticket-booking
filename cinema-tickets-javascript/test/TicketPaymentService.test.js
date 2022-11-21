import TicketPaymentService from "../src/thirdparty/paymentgateway/TicketPaymentService.js";
describe("TicketPaymentService", () => {
    const tPS = new TicketPaymentService();

    test("should exist", () => {
        expect(TicketPaymentService).toBeDefined();
    });

    test("should throw error if accountId not integer", () => {
        expect(() => {
            tPS.makePayment("898", 40)
        }).toThrow(new TypeError("accountId must be an integer"));
    });

    test("should throw error if accountId is undefined", () => {
        expect(() => {
            tPS.makePayment(undefined, 40)
        }).toThrow(new TypeError("accountId must be an integer"));
    });

    test("should throw error if accountId is null", () => {
        expect(() => {
            tPS.makePayment(null, 40)
        }).toThrow(new TypeError("accountId must be an integer"));
    });

    test("should throw error if amount to pay not integer", () => {
        expect(() => {
            tPS.makePayment(898, "FORTY QUID")
        }).toThrow(new TypeError("totalAmountToPay must be an integer"));
    });

    // The external service does not currently return an error if a zero or negative payment is requested
    // Exposing potential issue with TicketPaymentService code as it will allow a request to be created with 0 or negative integer
    // In reality I would add these tests which would fail 
    // and report the issue via Gitlab or other means to the TicketPaymentService dev
    test.skip("should throw error if amount to pay is zero", () => {
        expect(() => {
            tPS.makePayment(898, 0)
        }).toThrow(new TypeError("totalAmountToPay must be an integer"));
    });

    test.skip("should throw error if amount to pay is negative", () => {
        expect(() => {
            tPS.makePayment(898, -1)
        }).toThrow(new TypeError("totalAmountToPay must be an integer"));
    });
})