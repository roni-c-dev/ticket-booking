import { HelperService } from "../src/pairtest/helpers/HelperService.js";
import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest.js";

describe("HelperService", () => {
    const HELPER = new HelperService();
    const adultReq = new TicketTypeRequest("ADULT",1);
    const childReq = new TicketTypeRequest("CHILD",2);
    const infReq = new TicketTypeRequest("INFANT",1)

    test("should exist", () => {
        expect(HelperService).toBeTruthy();
    })

    describe("isAccountIDValid", () => {
        test("should contain a method to test if adult present", () => {
            expect(HELPER.isAccountIDValid).toBeTruthy();
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
            expect(HELPER.isAdultPresent).toBeTruthy();
        })

        test("should return true if adult is present", () => {
            const result = HELPER.isAdultPresent([adultReq, childReq, infReq]);
            expect(result).toBe(true);
        }) 

        test("should return false if no adult is present", () => {
            const result = HELPER.isAdultPresent([childReq, infReq]);
            expect(result).toBe(false);
        }) 
    })
  
    describe("countTicketsInRequest", () => {
        test("should contain a method to count tickets in request", () => {
            expect(HELPER.countTicketsInRequest).toBeTruthy();
        })
        
        test("should count all types of ticket within ticket count", () => {
            const result = HELPER.countTicketsInRequest([adultReq, childReq,infReq]);
            expect(result).toEqual(4);
        })
    })

    describe("countSeatsInRequest", () => {
        test("should contain a method to count seats in request", () => {
            expect(HELPER.countSeatsInRequest).toBeTruthy();
        })
        
        test("should count only adult and child tickets in seat count", () => {
            const result = HELPER.countSeatsInRequest([adultReq, childReq,infReq]);
            expect(result).toEqual(3);
        })
    })
    
    describe("calculatePayment", () => {
        test("should contain a method to calculate payment for the request", () => {
            expect(HELPER.calculatePayment).toBeTruthy();
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