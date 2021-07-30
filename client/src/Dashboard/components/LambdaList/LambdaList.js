import React from 'react';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
// @material-ui/icons
import Edit from '@material-ui/icons/Edit';
import Close from '@material-ui/icons/Close';
import Check from '@material-ui/icons/Check';
// core components
import styles from '../../assets/jss/material-dashboard-react/components/tasksStyle.js';
import { trackPromise } from 'react-promise-tracker';
import { usePromiseTracker } from 'react-promise-tracker';
import { Spinner } from '../../variables/spinner';
import Loader from 'react-loader-spinner';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

const useStyles = makeStyles(styles);

export default function LambdaList(props) {
  const classes = useStyles();
  const [checked, setChecked] = useState([...props.logsShown]);
  const { promiseInProgress } = usePromiseTracker();

  const handleToggle = (funcName) => {
    console.log('funcName: ', funcName);
    const currentIndex = checked.indexOf(funcName);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(funcName);
      const reqParams = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          function: funcName,
          credentials: props.credentials,
          timePeriod: props.timePeriod,
        }),
      };
      trackPromise(fetch('/aws/getLogs', reqParams))
        .then((res) => res.json())
        .then((logs) => {
          console.log(logs);
          props.addFunctionLogs(logs);
        });
    } else {
      newChecked.splice(currentIndex, 1);
      props.removeFunctionLogs(funcName);
    }
    setChecked(newChecked);
  };
  const { rtlActive } = props;
  const tableCellClasses = classnames(classes.tableCell, {
    [classes.tableCellRTL]: rtlActive,
  });
  return (
    <div>
      {promiseInProgress || props.updatePromise ? (
        <center>
          <Loader
            type='TailSpin'
            color='#00BFFF'
            height={50}
            width={50}
            className={classes.loader}
          />
        </center>
      ) : null}
      <Table className={classes.table}>
        <TableBody>
          {props.functions.map((funcName, i) => (
            <TableRow key={i} className={classes.tableRow}>
              <TableCell className={tableCellClasses}>
                <Checkbox
                  checked={checked.indexOf(funcName) !== -1}
                  tabIndex={-1}
                  onClick={() => handleToggle(funcName)}
                  checkedIcon={<Check className={classes.checkedIcon} />}
                  icon={<Check className={classes.uncheckedIcon} />}
                  classes={{
                    checked: classes.checked,
                    root: classes.root,
                  }}
                />
              </TableCell>
              <TableCell className={tableCellClasses}>{funcName}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

LambdaList.propTypes = {
  // tasksIndexes: PropTypes.arrayOf(PropTypes.number),
  // tasks: PropTypes.arrayOf(PropTypes.node),
  rtlActive: PropTypes.bool,
};
