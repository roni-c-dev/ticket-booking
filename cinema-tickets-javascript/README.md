### ticket-booking
A simple NodeJS module to handle ticket booking

To begin - clone the repo and run `npm install` to install required dependencies

To run unit tests - `npm test`

Returns InvalidPurchaseException for:

 - request to book tickets without an adult
 - request to book more than 20 tickets in 1 transaction

Returns TypeError for:

 - incorrectly formed account number (not an integer)
 - incorrectly formed number of tickets (not an integer)
 - incorrectly formed number of seats (not an integer)
