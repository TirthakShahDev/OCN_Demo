const Notary = require("@shareandcharge/ocn-notary").default

// const notary = new Notary()

// notary.sign({ 
//     headers:{
//         'x-correlation-id': '123',
//         'ocpi-from-country-code': 'DE',
//         'ocpi-from-party-id': 'CPO',
//         'ocpi-to-country-code': 'DE',
//         'ocpi-to-party-id': 'MSP' 
//     },
//     params: {},
//     body: { result: 'ACCEPTED' } 
// })
// .then(() => console.log(notary.serialize()))
// .catch(console.error)

console.log(Notary.deserialize("eyJmaWVsZHMiOlsiJFsnaGVhZGVycyddWyd4LWNvcnJlbGF0aW9uLWlkJ10iLCIkWydoZWFkZXJzJ11bJ29jcGktZnJvbS1jb3VudHJ5LWNvZGUnXSIsIiRbJ2hlYWRlcnMnXVsnb2NwaS1mcm9tLXBhcnR5LWlkJ10iLCIkWydoZWFkZXJzJ11bJ29jcGktdG8tY291bnRyeS1jb2RlJ10iLCIkWydoZWFkZXJzJ11bJ29jcGktdG8tcGFydHktaWQnXSIsIiRbJ2JvZHknXVsncmVzdWx0J10iXSwiaGFzaCI6IjB4OTZiYTQ1ZDg5OTk5ZGZlMWRlNDJhZmJiMzQxZjcwOTRlM2RhYzcwNDhlODViMmQ2N2M1Y2VmYTM0ZTc2OTU1ZSIsInJzdiI6IjB4ODliMTVlYjMwN2IwOGY5ZjNiOTRhMWVkODcwYzFiOGIzNzEwM2UxNGRjMjM2ZDZmZGEzNTk5Y2MzOGYxNzg5YTJkM2Y0YjkzMmNjYWMyMGE4YTQ0ZDcyZDczYWJjMWRiMTQ1MThiMTU3YzU0YWFiOThhZTI4YmQ2MjQwM2E2NGQxYiIsInNpZ25hdG9yeSI6IjB4YTAyODIzMjJERTUzNzc0ZjNkM0FiNjExODNhNjg3QTQ4RmNmMmI3NiIsInJld3JpdGVzIjpbXX0="))