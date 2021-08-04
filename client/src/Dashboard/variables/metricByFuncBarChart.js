// ##############################
// Function :
//   Fetch AWS Lambda Metrics By Function
//   Update the AWS Reducers by Function
// 
// #############################

const metricByFuncBarChart = (props, timePeriod, region) => {

  const reqParams = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      credentials: props.credentials,
      timePeriod: timePeriod,
      funcNames: props.aws.functions,
      region: region,

    }),
  };

  //Invocations
  //********************************************************* */
  fetch('/aws/getMetricsByFunc/Invocations', reqParams)
    .then((res) => res.json())
    .then((invocationData) => {
      props.addInvocationsByFuncData(invocationData);
    })
    .catch((err) => console.error(err));

  //Errors
  //********************************************************* */
  fetch('/aws/getMetricsByFunc/Errors', reqParams)
    .then((res) => res.json())
    .then((errorData) => {
      props.addErrorsByFuncData(errorData);
    })
    .catch((err) => console.error(err));

  // //Throttles
  // //********************************************************* */

  fetch('/aws/getMetricsByFunc/Throttles', reqParams)
    .then((res) => res.json())
    .then((throttleData) => {
      props.addThrottlesByFuncData(throttleData);
    })
    .catch((err) => console.error(err));
};

export default metricByFuncBarChart;
