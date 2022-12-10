### ticket-booking
A simple NodeJS module to handle ticket booking

To begin - clone the repo and run `npm install` to install required dependencies

NOTE - REQUIRES NODE VERSION ^16.15.1

To run unit tests - `npm test`

## API
A simple NodeJS/Express API has been included for testing purposes
To run API - `npm start` then either 
- view result in browser at http://localhost:8080

## TODO  - amend curls
- run the following command 
```curl --location --request POST 'http://localhost:8080' \
--header 'Content-Type: application/json' \
--data-raw '{
    "accountid": "456",
    "tickettype": "ADULT",
    "ticketcount": 1
}'``` to view success message
- run the following command ```curl --location --request POST 'http://localhost:8080' \
--header 'Content-Type: application/json' \
--data-raw '{
    "accountid": "frog",
    "tickettype": "ADULT",
    "ticketcount": 1
}'``` to view error

## CONTAINERISATION
A Dockerfile has been provided in order to run a containerised version of the application
To run, use the following commands:
- `docker build . -t <name>`
- `docker run -p 5020:8080 -d <name>`

And test using browser on port 5020, or amend the cURL requests given above to use port 5020


Throws InvalidPurchaseException for:
 - request to book tickets for an invalid account number (including zero and negative integers)
 - request to book tickets without an adult
 - request to book more than 20 tickets in 1 transaction
 - booking requests containing a number of infants more than available adult laps
 - Failure in calls to external payment or seat reservation services

Throws TypeError for:
 - incorrectly formed number of tickets (not an integer)
 - incorrectly formed number of seats (not an integer)
