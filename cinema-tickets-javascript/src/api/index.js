import express from 'express';

const app = express();

import TicketService from '../pairtest/TicketService.js';
import * as testdata from '../../test/testdata.js';


const port = process.env.port || 8080;
app.get('/', function (req, res) { 
    const accountId = req.headers.accountid;
    const result =  new TicketService().purchaseTickets(parseInt(accountId),[testdata.requestAdult]);
    res.send(result)
})
  
app.listen(port, function () {
    console.log(`Example app listening on port ${port}!`)
})