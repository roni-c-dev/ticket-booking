import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest.js";
import InvalidPurchaseException from "../src/pairtest/lib/InvalidPurchaseException.js";
import TicketService from "../src/pairtest/TicketService.js";
import SeatReservationService from "../src/thirdparty/seatbooking/SeatReservationService.js";
import TicketPaymentService from "../src/thirdparty/paymentgateway/TicketPaymentService.js";

// required import to enable full usage of jest mocks against ES6 modules
import { jest}  from "@jest/globals"

describe("TicketService", () => {
    const requestAdult = new TicketTypeRequest("ADULT", 1);
    const requestChild = new TicketTypeRequest("CHILD", 3);
    const requestInfant =  new TicketTypeRequest("INFANT",1);
    const requestTwenty = new TicketTypeRequest("ADULT", 20);
    const requestTooManyInfants = new TicketTypeRequest("INFANT",15);
    const goodAccountNum = 1200;
    const badAccountNum = "666";
    let myMockSRS, myMockTPS;

    const myTicketService =  new TicketService();

    beforeEach(() => {
        // reset any previous mock and mock the appropriate services anew
        jest.resetAllMocks();
        myMockTPS = jest.spyOn(TicketPaymentService.prototype, "makePayment");
        myMockSRS = jest.spyOn(SeatReservationService.prototype, "reserveSeat");
    })
    test("should take payment, book seat and return succesful if an adult request present", () => {
        const result = myTicketService.purchaseTickets(goodAccountNum,[requestChild, requestInfant, requestAdult]);  
        expect(myMockTPS).toHaveBeenCalled();
        expect(myMockSRS).toHaveBeenCalled();
        expect(result).toEqual("Booking successful");        
    })

    test("should take payment, book seat and return succesful for exactly twenty ticket requests", () => {
        const result = myTicketService.purchaseTickets(goodAccountNum,[requestTwenty]);
        expect(myMockTPS).toHaveBeenCalled();
        expect(myMockSRS).toHaveBeenCalled();
        expect(result).toEqual("Booking successful");
    })

    test("should throw error if no adult request present", () => {
        expect(() => {
            myTicketService.purchaseTickets(goodAccountNum, [requestChild]);
        }).toThrow(new InvalidPurchaseException("An adult must be present"))
        expect(myMockTPS).not.toHaveBeenCalled();
        expect(myMockSRS).not.toHaveBeenCalled();        
    })

    test("should throw error if insufficient adult requests present", () => {
        expect(() => {
            myTicketService.purchaseTickets(goodAccountNum, [requestAdult, requestTooManyInfants]);
        }).toThrow(new InvalidPurchaseException("All infants must sit on an adult lap"))
        expect(myMockTPS).not.toHaveBeenCalled();
        expect(myMockSRS).not.toHaveBeenCalled();        
    })

    test("should throw error if too many seats requested", () => {
        expect(() => {
            myTicketService.purchaseTickets(goodAccountNum, [requestTwenty, requestInfant]);
        }).toThrow(new InvalidPurchaseException("Ticket booking limit is 20"))
        expect(myMockTPS).not.toHaveBeenCalled();
        expect(myMockSRS).not.toHaveBeenCalled(); 
                
    })

    test("should throw error if account number is not an integer", () => {
        expect(() => {
            myTicketService.purchaseTickets(badAccountNum, [requestAdult]);
        }).toThrow(new InvalidPurchaseException("Invalid account ID provided"))
        expect(myMockTPS).not.toHaveBeenCalled();
        expect(myMockSRS).not.toHaveBeenCalled();        
    })

    test("should throw error if account number is zero", () => {
        expect(() => {
            myTicketService.purchaseTickets(0, [requestAdult]);
        }).toThrow(new InvalidPurchaseException("Invalid account ID provided"))
        expect(myMockTPS).not.toHaveBeenCalled();
        expect(myMockSRS).not.toHaveBeenCalled();         
    })

    test("should throw error if account number is below zero", () => {
        expect(() => {
            myTicketService.purchaseTickets(-1, [requestAdult]);
        }).toThrow(new InvalidPurchaseException("Invalid account ID provided"))
        expect(myMockTPS).not.toHaveBeenCalled();
        expect(myMockSRS).not.toHaveBeenCalled();          
    })

    test("with random failure in external seat reservation service it should handle and throw error", () => {

        myMockSRS.mockImplementation(() => {
            throw new Error("User not found");
          });

        expect(() => {
            myTicketService.purchaseTickets(goodAccountNum, [requestAdult]);
        }).toThrow(new InvalidPurchaseException("seat booking failure: Error: User not found"))
        expect(myMockTPS).toHaveBeenCalled();
        expect(myMockSRS).toHaveBeenCalled();   
    })

    test("with random failure in external ticket payment service it should handle and throw error and not reserve seats", () => {
        myMockTPS.mockImplementation(() => {
            throw new Error("User not found");
          });

          expect(() => {
            myTicketService.purchaseTickets(goodAccountNum, [requestAdult]);
        }).toThrow(new InvalidPurchaseException("payment failure: Error: User not found"))
        expect(myMockTPS).toHaveBeenCalled();
        expect(myMockSRS).not.toHaveBeenCalled(); 
    })

    test("with failure in internal service it should throw error", () => {
        const myFakeTicketService = jest.spyOn(TicketService.prototype, "purchaseTickets");
        myFakeTicketService.mockImplementation(() => {
            throw new Error("Fake internal error");
        });
        
        expect(() => {
            myTicketService.purchaseTickets(goodAccountNum, [requestAdult]);
        }).toThrow(new InvalidPurchaseException("Fake internal error"))
    })

    test("with invalid request it should not do stuff (TODO)", () => {
        myTicketService.isRequestValid = false
        const result = myTicketService.purchaseTickets(goodAccountNum,[requestAdult]);
        expect(result).toBe(undefined)
    })

    test("with invalid request it should do stuff (TODO)", () => {
        myTicketService.isRequestValid = true
        const result = myTicketService.purchaseTickets(goodAccountNum,[requestAdult]);
        expect(result).toBe(undefined)
    })
})
