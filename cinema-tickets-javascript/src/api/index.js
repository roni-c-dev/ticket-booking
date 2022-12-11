import express from "express";
import cors from "cors";

const app = express();

import TicketService from "../pairtest/TicketService.js";
import TicketTypeRequest from "../pairtest/lib/TicketTypeRequest.js";
import * as services from "../../test/services.js";

// allow the app to use request body
app.use(express.json());

app.use(cors({
  // requests from our front end are ok (anywhere else seems sketchy)
  origin: "http://localhost:1234"
}));

const port = process.env.port || 8080;

app.post("/", function (req, res) { 

  // services to be injected when creating the new TicketService object
    const SRS = services.SRS;
    const TPS = services.TPS;
    const HELPER = services.HELPER;
    const ticketRequests = [];

    try {
      for(let tickreq of req.body.ticketRequests){
        let newTicketReq = new TicketTypeRequest(tickreq.ticketType, parseInt(tickreq.noOfTickets));
        ticketRequests.push(newTicketReq);
      }
      res.send({
        response: new TicketService(SRS, TPS, HELPER).purchaseTickets(parseInt(req.body.accountid),ticketRequests)
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