import React, { useEffect, useState } from 'react';
import './App.css';
import data from './data.json'
import { Rating, rate_1vs1, expose } from 'ts-trueskill';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ReactPlayer from 'react-player'
import ResultsDialog from './ResultsDialog';


const bands = new Set(data.reduce((acc, d) => {acc.push(d.band); return acc}, new Array()));
const randInt = (max) => {
  return Math.floor(Math.random()*max);
}

window.expose = expose;

const randomChoice = () => {
  let a, b;
  do {
    const songs = [...data];
    a = songs.splice(randInt(songs.length), 1)[0];
    b = songs.splice(randInt(songs.length), 1)[0];
  } while (a.band === b.band);
  return [a, b];
}



function App() {
  const [votes, setVotes] = useState(
    [...bands].reduce((acc, d) => {acc[d] = new Rating(); return acc}, {}))
  const [numVotes, setNumVotes] = useState(0);

  // modal of results
  const [open, setOpen] = useState(false);

  // Two groups choosed to fight
  const [fighters, setFighters] = useState(randomChoice());
  
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
    const { innerWidth: windowWidth } = window;
    if (windowWidth < videoWidth)
      setVideoWidth(windowWidth - windowWidth*.05);
  }, [])


  let v = [...Object.keys(votes)]
  console.log(v.sort((a, b) => expose(votes[b]) - expose(votes[a])))
  console.log(votes)
  return (
    <Grid container className="App">
      <Grid item xs={12} md={12} lg={6} className='fighter'>
        <Button variant="contained" color="primary" onClick={() => updateScore(fighters[0], fighters[1])}>{fighters[0].title}</Button>
        <ReactPlayer url={fighters[0].url} width={videoWidth + 'px'}/>
      </Grid>
      <Grid item xs={12} md={12} lg={6} className='fighter'>
        <Button variant="contained" color="primary" onClick={() => updateScore(fighters[1], fighters[0])}>{fighters[1].title}</Button>
        <ReactPlayer url={fighters[1].url} width={videoWidth + 'px'}/>
      </Grid>
      <Button 
        variant='contained' 
        color='primary' 
        style={{marginTop: 20}}
        onClick={() => setOpen(true)}
        disabled={!(numVotes >= 20)}
        >
          {numVotes >= 20 ? 'Ver Resultados' : `Faltan ${20 - numVotes} votos`}
      </Button>
      <ResultsDialog open={open} handleOpen={setOpen} values={votes}/>

      {/* <ol>
      {v.map(d => (<li key={d}>{d}: {expose(votes[d]).toFixed(0)}</li>))}

      </ol> */}
    </Grid>
  );
}

export default App;
