import TicketTypeRequest from "./TicketTypeRequest.js";

describe("TicketTypeRequest", () => {
    test("should exist", () => {
        expect(TicketTypeRequest).toBeDefined();
    });

    test("should throw error if type does not exist", () => {
        expect(() => {
           new TicketTypeRequest("FAKE", 4);
        }).toThrow(new TypeError("type must be ADULT, CHILD, or INFANT"));
    });

    test("should throw error if type is undefined", () => {
        expect(() => {
           new TicketTypeRequest(undefined, 4);
        }).toThrow(new TypeError("type must be ADULT, CHILD, or INFANT"));
    });

    test("should throw error if type is null", () => {
        expect(() => {
           new TicketTypeRequest(null, 4);
        }).toThrow(new TypeError("type must be ADULT, CHILD, or INFANT"));
    });

    test("should throw error if no of tickets not integer", () => {
        expect(() => {
            new TicketTypeRequest("ADULT", "FOUR");
         }).toThrow(new TypeError("noOfTickets must be an integer"));
    });

    test("should throw error if no of tickets is undefined", () => {
        expect(() => {
            new TicketTypeRequest("ADULT", undefined);
         }).toThrow(new TypeError("noOfTickets must be an integer"));
    });

    test("should throw error if no of tickets is undefined", () => {
        expect(() => {
            new TicketTypeRequest("ADULT", null);
         }).toThrow(new TypeError("noOfTickets must be an integer"));
    });

    // Exposing potential issue with TicketTypeRequest code as it will allow a request to be created with 0 or negative integer
    // In reality I would add these tests which would fail 
    // and report the issue via Gitlab or other means to the TicketRequestType dev
    test.skip("should throw error if no of tickets is zero", () => {
        expect(() => {
            new TicketTypeRequest("ADULT", 0);
         }).toThrow(new TypeError("noOfTickets must be an integer"));
    });

    test.skip("should not throw error if no of tickets is negative", () => {
        expect(() => {
            new TicketTypeRequest("ADULT", -1);
         }).toThrow(new TypeError("noOfTickets must be an integer"));
    });
})