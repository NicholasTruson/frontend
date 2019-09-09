import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  paper: {
    marginTop: theme.spacing(3),
    width: '100%',
    overflowX: 'auto',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 650,
  },
}));

class Characteristics extends React.Component {
  state = {
    tempo: '',
    key: '',
    mode: '',
    time_signature: '',
    // popularity: '',
  };
  componentDidUpdate(prevProps) {
    if (this.props.features.id !== prevProps.features.id) {
      this.setState({
        tempo: this.props.features.tempo,
        key: this.props.features.key,
        mode: this.props.features.mode,
        time_signature: this.props.features.time_signature,
        // popularity: this.props.features.popularity,
      });
    }
  }

  render() {
    return (
      <div className={useStyles.root}>
        <Paper
          className={useStyles.paper}
          style={{
            backgroundColor: `rgba(${255}, ${255}, ${255}, ${0.7})`,
          }}>
          <Table className={useStyles.table} size='small'>
            <TableHead>
              <TableRow>
                <TableCell>Music Characteristics</TableCell>
                <TableCell align='right'>Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell component='th' scope='row'>
                  Tempo
                </TableCell>
                <TableCell align='right'>{this.state.tempo}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component='th' scope='row'>
                  Key
                </TableCell>
                <TableCell align='right'>{this.state.key}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component='th' scope='row'>
                  Mode
                </TableCell>
                <TableCell align='right'>{this.state.mode}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component='th' scope='row'>
                  Time Signature
                </TableCell>
                <TableCell align='right'>{this.state.time_signature}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      </div>
    );
  }
}

export default Characteristics;
