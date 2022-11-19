import { HelperService } from "../src/pairtest/helpers/HelperService.js";
import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest.js";

describe("HelperService", () => {
    const HELPER = new HelperService();
    const adultReq = new TicketTypeRequest("ADULT",1);
    const emptyAdultReq = new TicketTypeRequest("ADULT",0);
    const childReq = new TicketTypeRequest("CHILD",2);
    const infReq = new TicketTypeRequest("INFANT",1)
    const tooManyInfantsReq = new TicketTypeRequest("INFANT",15);

    test("should exist", () => {
        expect(HelperService).toBeDefined();
    })

    describe("isAccountIDValid", () => {
        test("should contain a method to test if adult present", () => {
            expect(HELPER.isAccountIDValid).toBeDefined();
        })

        test("should return true if accountId is a positive integer", () => {
            const result = HELPER.isAccountIDValid(123);
            expect(result).toBe(true);
        }) 

        test("should return false if accountId is zero", () => {
            const result = HELPER.isAccountIDValid(0);
            expect(result).toBe(false);
        })
        
        test("should return false if accountId is negative", () => {
            const result = HELPER.isAccountIDValid(-123);
            expect(result).toBe(false);
        })
    })

    describe("isAdultPresent", () => {
        test("should contain a method to test if adult present", () => {
            expect(HELPER.isAdultPresent).toBeDefined();
        })

        test("should return true if adult is present", () => {
            const result = HELPER.isAdultPresent([adultReq, childReq, infReq]);
            expect(result).toBe(true);
        }) 

        test("should return false if no adult is present", () => {
            const result = HELPER.isAdultPresent([childReq, infReq]);
            expect(result).toBe(false);
        }) 

        test("should return false if adult request is present but set to zero - adult only request", () => {
            const result = HELPER.isAdultPresent([emptyAdultReq]);
            expect(result).toBe(false);
        })

        test("should return false if adult request is present but set to zero - mixed request", () => {
            const result = HELPER.isAdultPresent([emptyAdultReq, childReq]);
            expect(result).toBe(false);
        })
    })

    describe("areEnoughAdultsPresent", () => {
        test("should contain a method to test if sufficient adults are present", () => {
            expect(HELPER.areEnoughAdultsPresent).toBeDefined();
        });

        test("should return true if enough adults are present", () => {
            const result = HELPER.areEnoughAdultsPresent([adultReq, childReq, infReq]);
            expect(result).toBe(true);
        });

        test("should return false if not enough adults are present", () => {
            const result = HELPER.areEnoughAdultsPresent([adultReq, childReq, tooManyInfantsReq]);
            expect(result).toBe(false);
        });  
   })
  
    describe("countTicketsInRequest", () => {
        test("should contain a method to count tickets in request", () => {
            expect(HELPER.countTicketsInRequest).toBeDefined();
        })
        
        test("should count all types of ticket within ticket count", () => {
            const result = HELPER.countTicketsInRequest([adultReq, childReq,infReq]);
            expect(result).toEqual(4);
        })
    })

    describe("countSeatsInRequest", () => {
        test("should contain a method to count seats in request", () => {
            expect(HELPER.countSeatsInRequest).toBeDefined();
        })
        
        test("should count only adult and child tickets in seat count", () => {
            const result = HELPER.countSeatsInRequest([adultReq, childReq,infReq]);
            expect(result).toEqual(3);
        })
    })
    
    describe("calculatePayment", () => {
        test("should contain a method to calculate payment for the request", () => {
            expect(HELPER.calculatePayment).toBeDefined();
        })

        test("should correctly calculate the cost of adult ticket request", () => {
            const result = HELPER.calculatePayment([adultReq]);
            expect(result).toEqual(20);
        })

        test("should correctly calculate the cost of child ticket request", () => {
            const result = HELPER.calculatePayment([childReq]);
            expect(result).toEqual(20); //2 children on this request
        })

        test("should correctly calculate the cost of infant ticket request", () => {
            const result = HELPER.calculatePayment([infReq]);
            expect(result).toEqual(0); //infant goes free
        })

        test("should correctly calculate the cost of a collection of ticket requests", () => {
            const result = HELPER.calculatePayment([adultReq, childReq, infReq]);
            expect(result).toEqual(40);
        })
    })
    
})