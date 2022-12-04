import TicketTypeRequest from "../src/pairtest/lib/TicketTypeRequest.js";
import HelperService from "../src/pairtest/utils/helper/HelperService.js";

export const requestAdult =  new TicketTypeRequest("ADULT", 1);
export const emptyAdultRequest = new TicketTypeRequest("ADULT",0);
  

export const requestChild = new TicketTypeRequest("CHILD", 3);
export const requestInfant =  new TicketTypeRequest("INFANT",1);
export const requestTwenty = new TicketTypeRequest("ADULT", 20);
export const requestTooManyInfants = new TicketTypeRequest("INFANT",15);
export const weirdRequest = [ new TicketTypeRequest("ADULT", 1), (new TicketTypeRequest("CHILD", -1))];
export const weirdNegativeRequest = [ new TicketTypeRequest("ADULT", 1), (new TicketTypeRequest("CHILD", -2))];
export const weirdZeroRequest = [new TicketTypeRequest("ADULT", 0),(new TicketTypeRequest("CHILD", 0))];

export const goodAccountNum = 1200;
export const badAccountNum = "666";

export const HELPER = new HelperService();
