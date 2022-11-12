import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest.js";

describe("TicketTypeRequest", () => {
    test("should exist", () => {
        expect(TicketTypeRequest).toBeTruthy();
    })

    test("should throw error if type does not exist", () => {
        // Here I use try-catch rather than expect error as it's the constructor I am testing
        try {
            const ticketReq = new TicketTypeRequest("FAKE", 4);
            expect(ticketReq).toBeFalsy();
        } catch (err) {
            const error  = err;
            expect(error).toEqual(new TypeError("type must be ADULT, CHILD, or INFANT"))
        }
    })

    test("should throw error if no of tickets not integer", () => {
        // Here I use try-catch rather than expect error as it's the constructor I am testing
        try {
            const ticketReq = new TicketTypeRequest("ADULT", "FOUR");
            expect(ticketReq).toBeFalsy(); 
        } catch (err) {
            const error = err;
            expect(error).toEqual(new TypeError("noOfTickets must be an integer"))
        }
    })
})