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
    const weirdReq = [ new TicketTypeRequest("ADULT", 1), (new TicketTypeRequest("CHILD", -1))];
    const weirdNegativeReq = [ new TicketTypeRequest("ADULT", 1), (new TicketTypeRequest("CHILD", -2))];
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
        }).toThrow(new InvalidPurchaseException("Error during booking: Error: An adult must be present"));
        expect(myMockTPS).not.toHaveBeenCalled();
        expect(myMockSRS).not.toHaveBeenCalled();        
    });

    test("should throw error if insufficient adult requests present", () => {
        expect(() => {
            myTicketService.purchaseTickets(goodAccountNum, [requestAdult, requestTooManyInfants]);
        }).toThrow(new InvalidPurchaseException("Error during booking: Error: All infants must sit on an adult lap"));
        expect(myMockTPS).not.toHaveBeenCalled();
        expect(myMockSRS).not.toHaveBeenCalled();        
    });

    test("should throw error if too many seats requested", () => {
        expect(() => {
            myTicketService.purchaseTickets(goodAccountNum, [requestTwenty, requestInfant]);
        }).toThrow(new InvalidPurchaseException("Error during booking: Error: Ticket booking limit is 20"));
        expect(myMockTPS).not.toHaveBeenCalled();
        expect(myMockSRS).not.toHaveBeenCalled(); 
                
    });

    // Taking advantage of faulty behaviour in TicketTypeRequest which allows negative values present
    test("should throw error if no seats requested", () => {
        expect(() => {
            myTicketService.purchaseTickets(goodAccountNum, weirdReq);
        }).toThrow(new InvalidPurchaseException("Error during booking: Error: Requests must be for at least one ticket"));
        expect(myMockTPS).not.toHaveBeenCalled();
        expect(myMockSRS).not.toHaveBeenCalled(); 
    });

    test("should throw error if negative seats requested", () => {
        expect(() => {
            myTicketService.purchaseTickets(goodAccountNum, weirdNegativeReq);
        }).toThrow(new InvalidPurchaseException("Error during booking: Error: Requests must be for at least one ticket"));
        expect(myMockTPS).not.toHaveBeenCalled();
        expect(myMockSRS).not.toHaveBeenCalled(); 
    });

    test("should throw error if account number is not an integer", () => {
        expect(() => {
            myTicketService.purchaseTickets(badAccountNum, [requestAdult]);
        }).toThrow(new InvalidPurchaseException("Error during booking: Error: Invalid account ID provided"));
        expect(myMockTPS).not.toHaveBeenCalled();
        expect(myMockSRS).not.toHaveBeenCalled();        
    });

    test("should throw error if account number is zero", () => {
        expect(() => {
            myTicketService.purchaseTickets(0, [requestAdult]);
        }).toThrow(new InvalidPurchaseException("Error during booking: Error: Invalid account ID provided"));
        expect(myMockTPS).not.toHaveBeenCalled();
        expect(myMockSRS).not.toHaveBeenCalled();         
    });

    test("should throw error if account number is below zero", () => {
        expect(() => {
            myTicketService.purchaseTickets(-1, [requestAdult]);
        }).toThrow(new InvalidPurchaseException("Error during booking: Error: Invalid account ID provided"));
        expect(myMockTPS).not.toHaveBeenCalled();
        expect(myMockSRS).not.toHaveBeenCalled();          
    });

    test("with random failure in external seat reservation service it should handle and propagate error", () => {

        myMockSRS.mockImplementation(() => {
            throw new Error("User not found");
        });

        expect(() => {
            myTicketService.purchaseTickets(goodAccountNum, [requestAdult]);
        }).toThrow(new InvalidPurchaseException("Error during booking: Error: seat booking failure: Error: User not found"));
        expect(myMockTPS).toHaveBeenCalled();
        expect(myMockSRS).toHaveBeenCalled();   
    });

    test("with random failure in external ticket payment service it should handle and propagate error and not reserve seats", () => {
        myMockTPS.mockImplementation(() => {
            throw new Error("User not found");
          });

        expect(() => {
            myTicketService.purchaseTickets(goodAccountNum, [requestAdult]);
        }).toThrow(new InvalidPurchaseException("Error during booking: Error: payment failure: Error: User not found"));
        expect(myMockTPS).toHaveBeenCalled();
        expect(myMockSRS).not.toHaveBeenCalled(); 
    });

    test("with failure in internal service it should throw error", () => {
        const myFakeTicketService = jest.spyOn(TicketService.prototype, "purchaseTickets");
        myFakeTicketService.mockImplementation(() => {
            throw new Error("Fake internal error");
        });
        
        expect(() => {
            myTicketService.purchaseTickets(goodAccountNum, [requestAdult]);
        }).toThrow(new InvalidPurchaseException("Fake internal error"));
    });
})
