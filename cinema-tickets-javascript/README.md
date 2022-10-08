### ticket-booking
A NodeJS module to handle ticket booking

// TODO - complete rules

Returns InvalidPurchaseException for:

 - request to book tickets without an adult
 - request to book more than 20 tickets in 1 transaction

Returns TypeError for:

 - incorrectly formed request
