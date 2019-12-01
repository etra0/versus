import React, { useEffect, useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import { Rating, rate_1vs1, expose } from 'ts-trueskill';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ResultsDialog(props) {
  const { open, values, handleOpen } = props;
  const rows = Object.keys(values).reduce((acc, d) => {
    acc.push({ name: d, score: expose(values[d]) });
    return acc;
  }, []).sort((a, b) => b.score - a.score);

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={() => handleOpen(false)}
      TransitionComponent={Transition}
    >
      <AppBar>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => handleOpen(false)}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6">Resultados</Typography>
        </Toolbar>
      </AppBar>
      <div className='results-table'>
      <Table style={{marginTop: '30px'}} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Banda</TableCell>
            <TableCell align="right">Puntos</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.score.toFixed(0)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
    </Dialog>
  );
}
