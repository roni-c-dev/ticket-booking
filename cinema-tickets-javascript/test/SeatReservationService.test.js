import SeatReservationService from "../src/thirdparty/seatbooking/SeatReservationService.js";
describe("SeatReservationService", () => {
    const sRS = new SeatReservationService();
    test("should exist", () => {
        expect(SeatReservationService).toBeTruthy();
    })

    test("should throw error if accountId not integer", () => {
        expect(() => {
            sRS.reserveSeat("898", 2);
        }).toThrow(new TypeError("accountId must be an integer"))
    })

    test("should throw error if no of seats not integer", () => {
        expect(() => {
            sRS.reserveSeat(898, "FOUR");
        }).toThrow(new TypeError("totalSeatsToAllocate must be an integer"))
    })
})