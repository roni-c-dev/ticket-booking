import express from "express";

const app = express();

import TicketService from "../pairtest/TicketService.js";
import * as testdata from "../../test/testdata.js";


const port = process.env.port || 8080;
app.get("/", function (req, res) { 
    try {
      res.send({
        response: new TicketService().purchaseTickets(parseInt(req.headers.accountid),[testdata.requestAdult])
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