const express = require('express');
const router = express.Router();

//AWS specific details
const getCredentials = require('../controllers/aws/Credentials/getCreds');
const getFunctions = require('../controllers/aws/Metrics/getLambdaFuncs');
const getMetricsAllFunc = require('../controllers/aws/Metrics/getMetricsAllFunc');
const getMetricsByFunc = require('../controllers/aws/Metrics/getMetricsByFunc');
const getLogs = require('../controllers/aws/Logs/getLogs');
const updateLogs = require('../controllers/aws/Logs/updateLogs');
const getAPIData = require('../controllers/aws/APIGateway/getAPI');
const getApiMetrics = require('../controllers/aws/APIGateway/getAPIMetrics');
const updateApiMetrics = require('../controllers/aws/APIGateway/updateAPIMetrics');


//AWS Assumed Role Credentials
router.route('/getCreds').post(getCredentials, (req, res) => {
  console.log('you hit get Creds');
  res.status(200).json(res.locals.credentials);
});

//Returing Lambda Functions List
router.route('/getLambdaFunctions').post(getFunctions, (req, res) => {
  console.log('Returning Lambda Functions:');
  console.log(req.body);
  res.status(200).json(res.locals.functions);
});

//Returing Lambda Functions Metric Totals (All functions): by metricName
router
  .route('/getMetricsAllfunc/:metricName')
  .post(getMetricsAllFunc, (req, res) => {
    console.log('Returning Lambda Functions Invocations:');
    console.log(req.body);
    res.status(200).json(res.locals.metricAllFuncData);
  });

//Returing Metrics by Function : by metricName
router
  .route('/getMetricsByFunc/:metricName')
  .post(getMetricsByFunc, (req, res) => {
    console.log('Returning Lambda Functions Invocations By Function:');
    res.status(200).json(res.locals.metricByFuncData);
  });


//Returing Lambda Functions Logs
router.route('/getLogs').post(getLogs, (req, res) => {
  console.log('Returning Lambda Functions Logs');

  res.status(200).json(res.locals.functionLogs);
});

//Updating Lambda Function Logs
router.route('/updateLogs').post(updateLogs, (req, res) => {
  console.log('Returning updated Lambda Function Logs');
  res.status(200).json(res.locals.updatedLogs);
});


// API Gateway data - list of APIs existing on user account
router.route('/apiGateway').post(getAPIData, (req, res) => {
  res.status(200).json(res.locals.apiData);
});

// handle getting an APIs metrics when requested
router.route('/getApiMetrics').post(getApiMetrics, (req, res) => {
  res.status(200).json(res.locals.apiMetrics);
});

// if time period is updated, fetches updated API metric data
router.route('/updateApiMetrics').post(updateApiMetrics, (req, res) => {
  res.status(200).json(res.locals.apiMetrics);
});

module.exports = router;
