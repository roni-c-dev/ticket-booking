import SeatReservationService from "../src/thirdparty/seatbooking/SeatReservationService.js";
describe("SeatReservationService", () => {
    const sRS = new SeatReservationService();
    test("should exist", () => {
        expect(SeatReservationService).toBeTruthy();
    })

    test("should throw error if accountId not integer", () => {
        try {
            const result = sRS.reserveSeat("898",2)
            expect(result).toBeFalsy();
        } catch (err) {
            const error  = err;
            expect(error).toEqual(new TypeError("accountId must be an integer"))
        }
    })

    test("should throw error if no of seats not integer", () => {
        try {
            const result = sRS.reserveSeat(898, "FOUR");
            expect(result).toBeFalsy(); 
        } catch (err) {
            const error = err;
            expect(error).toEqual(new TypeError("totalSeatsToAllocate must be an integer"))
        }
    })
})