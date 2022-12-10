import express from "express";
import cors from "cors";

const app = express();

import TicketService from "../pairtest/TicketService.js";
import TicketTypeRequest from "../pairtest/lib/TicketTypeRequest.js";
import SeatReservationService from "../thirdparty/seatbooking/SeatReservationService.js";
import TicketPaymentService from "../thirdparty/paymentgateway/TicketPaymentService.js";
import HelperService from "../pairtest/utils/helper/HelperService.js";
// import * as testdata from "../../test/testdata.js";

// allow the app to use request body
app.use(express.json());

app.use(cors({
  // requests from our front end are ok (anywhere else seems sketchy)
  origin: "http://localhost:1234"
}));

const port = process.env.port || 8080;

// services to be injected when creating the new TicketService object
const SRS = new SeatReservationService();
const TPS = new TicketPaymentService();
const HELPER = new HelperService();

// Under construction - currently handling only one ticket request at a time for testing purposes
app.post("/", function (req, res) { 
    try {
      let newTicketReq = new TicketTypeRequest(req.body.tickettype, parseInt(req.body.ticketcount));
      res.send({
        response: new TicketService(SRS, TPS, HELPER).purchaseTickets(parseInt(req.body.accountid),[newTicketReq])
      })
    } catch (err) {
      res.status(500).send({
        error: err.message
      })
    }
    
})


  
app.listen(port, function () {
    console.log(`Example app listening on port ${port}!`)
})