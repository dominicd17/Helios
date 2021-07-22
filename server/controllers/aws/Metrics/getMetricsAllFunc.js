const { REGION } = require('../Credentials/libs/stsClient.js');
const AWSUtilFunc = require('./utils/AWSUtilFunc.js');
const {
  CloudWatchClient,
  GetMetricDataCommand,
} = require('@aws-sdk/client-cloudwatch');

//Extract the CloudWatch Metrics for the Lambda Functions
//***********************Begin************************ */

const getMetricsAllFunc = async (req, res, next) => {
  const cwClient = new CloudWatchClient({
    region: REGION,
    credentials: req.body.credentials,
  });

//initialize the variables for creating the inputs for AWS request
  let graphPeriod, graphUnits, graphMetricName, graphMetricStat;

  graphMetricName = req.params.metricName



  if (req.body.timePeriod === '30min') {
    [graphPeriod, graphUnits] = [30, 'minutes'];
  } else if (req.body.timePeriod === '1hr') {
    [graphPeriod, graphUnits] = [60, 'minutes'];
  } else if (req.body.timePeriod === '24hr') {
    [graphPeriod, graphUnits] = [24, 'hours'];
  } else if (req.body.timePeriod === '7d') {
    [graphPeriod, graphUnits] = [7, 'days'];
  }

  if (!req.body.metricStat) graphMetricStat = 'Sum'
  else graphMetricStat = req.body.metricStat

  //Metrics for All Functions (combined)

  const metricAllFuncInputParams = AWSUtilFunc.prepCwMetricQueryLambdaAllFunc(
    graphPeriod,
    graphUnits,
    graphMetricName,
    graphMetricStat
  );
  console.log('the input params: ', metricAllFuncInputParams);
  console.log(typeof metricAllFuncInputParams.StartTime);
  try {
    const metricAllFuncResult = await cwClient.send(
      new GetMetricDataCommand(metricAllFuncInputParams)
    );
    console.log(
      'Invocations All Lambda Functions:  ',
      JSON.stringify(metricAllFuncResult, null, 2)
    );

    //Format of the MetricDataResults
    //******************************* */
    // "MetricDataResults": [
    //   {
    //     "Id": "m0",
    //     "Label": "Lambda Invocations CryptoRefreshProfits",
    //     "Timestamps": [
    //       "2021-07-17T02:54:00.000Z",
    //       "2021-07-17T01:54:00.000Z"
    //     ],
    //     "Values": [
    //       1400,
    //       34
    //     ],
    //     "StatusCode": "Complete",
    //     "Messages": []
    //   },
    // ]
    //******************************* */

    const metricAllFuncData =
      metricAllFuncResult.MetricDataResults[0].Timestamps.map(
        (timeStamp, index) => {
          return {
            x: timeStamp,
            y: metricAllFuncResult.MetricDataResults[0].Values[index],
          };
        }
      );
    const metricMaxValue = Math.max(
      ...metricAllFuncResult.MetricDataResults[0].Values,
      0
    );

    res.locals.metricAllFuncData = {
      title: metricAllFuncResult.MetricDataResults[0].Label,
      data: metricAllFuncData.reverse(),
      options: {
        startTime: metricAllFuncInputParams.StartTime,
        endTime: metricAllFuncInputParams.EndTime,
        graphPeriod,
        graphUnits,
        metricMaxValue,
      },
    };
    console.log(res.locals.metricAllFuncData);
    return next();
  } catch (err) {
    console.log('Error in CW getMetricsData All Functions', err);
  }
};

module.exports = getMetricsAllFunc;
