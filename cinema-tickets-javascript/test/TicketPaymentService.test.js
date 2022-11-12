import TicketPaymentService from "../src/thirdparty/paymentgateway/TicketPaymentService.js";
describe("TicketPaymentService", () => {
    const tPS = new TicketPaymentService();

    test("should exist", () => {
        expect(TicketPaymentService).toBeTruthy();
    })

    test("should throw error if accountId not integer", () => {
        expect(() => {
            tPS.makePayment("898", 40)
        }).toThrow(new TypeError("accountId must be an integer"))
    })

    test("should throw error if amount to pay not integer", () => {
        expect(() => {
            tPS.makePayment(898, "FORTY QUID")
        }).toThrow(new TypeError("totalAmountToPay must be an integer"))
    })
})