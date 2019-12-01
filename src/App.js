import React, { useEffect, useState } from 'react';
import './App.css';
import data from './data.json'
import { Rating, rate_1vs1, expose } from 'ts-trueskill';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ReactPlayer from 'react-player'
import ResultsDialog from './ResultsDialog';
import { createMuiTheme, ThemeProvider} from '@material-ui/core';
import blue from '@material-ui/core/colors/blue';

const bands = new Set(data.reduce((acc, d) => {acc.push(d.band); return acc}, new Array()));
const randInt = (max) => {
  return Math.floor(Math.random()*max);
}
const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: blue
  }
});

const minimumVotes = 25


const randomChoice = () => {
  let a, b;
  do {
    const _bands = [...bands];
    a = _bands.splice(randInt(_bands.length), 1)[0];
    b = _bands.splice(randInt(_bands.length), 1)[0];
  } while (a === b);
  console.log('bands', a, b)

  const getRandomSong = (b) => {
    const availableSongs = [...data].filter(d => d.band === b);
    return availableSongs[randInt(availableSongs.length)];
  }

  const [songA, songB] = [getRandomSong(a), getRandomSong(b)];

  return [songA, songB];
}



function App() {
  const [votes, setVotes] = useState(
    [...bands].reduce((acc, d) => {acc[d] = new Rating(); return acc}, {}))
  const [numVotes, setNumVotes] = useState(0);

  // modal of results
  const [open, setOpen] = useState(false);

  // Two groups choosed to fight
  const [fighters, setFighters] = useState(null);
  
  const [videoWidth, setVideoWidth] = useState(675);

  const updateScore = (winner, looser) => {
    const winnerRate = votes[winner.band];
    const looserRate = votes[looser.band];

    const [newWinnerRate, newLooserRate] = rate_1vs1(winnerRate, looserRate);
    const newVotes = {}
    newVotes[winner.band] = newWinnerRate;
    newVotes[looser.band] = newLooserRate;


    setVotes({...votes, ...newVotes});
    setNumVotes(numVotes + 1);
    setFighters(randomChoice());
  }


  useEffect(() => {
    setFighters(randomChoice());
    const { innerWidth: windowWidth } = window;
    if (windowWidth < videoWidth)
      setVideoWidth(windowWidth - windowWidth*.05);
  }, [])


  let v = [...Object.keys(votes)]
  return (
    <ThemeProvider theme={theme}>
    {fighters && <Grid container className="App">
      <Grid item xs={12} md={12} lg={6} className='fighter'>
        <Button variant="outlined" color="primary" onClick={() => updateScore(fighters[0], fighters[1])}>{fighters[0].title}</Button>
        <ReactPlayer url={fighters[0].url} width={videoWidth + 'px'}/>
      </Grid>
      <Grid item xs={12} md={12} lg={6} className='fighter'>
        <Button variant="outlined" color="primary" onClick={() => updateScore(fighters[1], fighters[0])}>{fighters[1].title}</Button>
        <ReactPlayer url={fighters[1].url} width={videoWidth + 'px'}/>
      </Grid>
      <Button 
        variant='outlined' 
        color='primary' 
        style={{marginTop: 20}}
        onClick={() => setOpen(true)}
        disabled={!(numVotes >= minimumVotes)}
        >
          {numVotes >= minimumVotes ? 'Ver Resultados' : `Faltan ${minimumVotes - numVotes} votos`}
      </Button>
      <ResultsDialog open={open} handleOpen={setOpen} values={votes}/>
    </Grid>}
    </ThemeProvider>
    
  );
}

export default App;
