/**  

  API Gateway integration tests, assumes the KEYHOLE-FABRIC-API-GATEWAY is up and 
  running on the specified HOST argument.  
  
  Thes API calls can be made to any Gateway server instance since they do not test 
  chaincode API calls. See chaincodetest.js for chaincode examples. 

  Usage Example:

     $ node chaincodeexample.js 


  Executes the Fabric Sample FabCare example chaincodes
*/

const axios = require('axios');
//
//  **** You can change these values to execute chaincode in your network
//
const host = "http://localhost:9090";
const channelid = "mychannel";


/**
 * 
 *   api/execute - Execute Create Car 
 * 
 */

axios
.post(host+'/api/execute', {
  channelid: channelid,
  chaincodeid: 'fabcar',
  fnc: 'createCar',
  args: ['CAR10', 'Chevy', 'Volt', 'Red', 'Nick']
})
.then(res => {
  console.log(`----- api/execute results -----`)
  console.log(`statusCode: ${res.status}`)
  console.log("Peers: "+res.data)
})
.catch(error => {
  console.error(error)
})





