

exports.handler = async function(event) {
  console.log('request:', JSON.stringify(event, undefined, 2));

  var params = {
    StackName: 'STRING_VALUE', /* required */
    LogicalResourceIds: [
      'STRING_VALUE',
      /* more items */
    ]
  };

  cloudformation.detectStackDrift(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });
  

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/plain' },
    body: `Hello, CDK! You've hit ${event.path}\n`
  };
};
