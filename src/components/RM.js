import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Dialog from '@material-ui/core/Dialog';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import SearchField from 'react-search-field';

import {preprocessText, makePrediction} from './TF'
import streamTwits from './StreamTweets';

class RM extends Component {
    constructor(props){
        super(props);
        this.state = {
            openDialog_1: false,
            prediction_1: '',
            openDialog_2: false,
            prediction_2: '',
            openDialog_3: false,
            searchText: '',
            prediction_3: false,
        }
    }

    onClick_1 = async (event) => {
        const input = ['breaking: #bart service stopped at civic center due to police activity https://t.co/y5e2sf9oda https://t.co/ysnaqanruv']
        const tensor = preprocessText(input);
        this.setState({openDialog_1: true})
        this.setState({prediction_1: 'Predicting Current Status...'})
        const prediction_1 = await makePrediction('text', input, tensor);
        this.setState({prediction_1: prediction_1})
    }

    onClick_2 = async (event) => {
        const input = ['bart from simpsons is my favorite character!']
        const tensor = preprocessText(input);
        this.setState({openDialog_2: true})
        this.setState({prediction_2: 'Predicting Current Status...'})
        const prediction_2 = await makePrediction('text', input, tensor);
        this.setState({prediction_2: prediction_2})
    }

    onSubmit = async (value, event) => {
        const input = [value]
        const tensor = preprocessText(input);
        this.setState({openDialog_3: true})
        this.setState({searchText: value})
        this.setState({prediction_3: 'Predicting Current Status...'})
        const prediction_3 = await makePrediction('text', input, tensor);
        this.setState({prediction_3: prediction_3})
    }

    handleClose_1 = (event) => {
        this.setState({openDialog_1: false})
    }

    handleClose_2 = (event) => {
        this.setState({openDialog_2: false})
    }

    handleClose_3 = (event) => {
        this.setState({openDialog_3: false})
    }

    render() {
        // streamTwits();
        const { classes } = this.props;
        const { prediction_1 } = this.state;
        const { prediction_2 } = this.state;
        const { prediction_3 } = this.state;

        return(
            <div className={classes.root}>
                <Grid container spacing={2} >
                    <Grid key={'CIVIC CENTER'} item xs={4} className={classes.grid}>
                        <Card className={classes.cardOutService}>
                            <ButtonBase onClick={this.onClick_1}>
                                <CardContent>
                                    <Typography variant='h4'>
                                        Civic Center
                                    </Typography>
                                </CardContent>
                            </ButtonBase>
                            <Dialog onClose={this.handleClose_1} open={this.state.openDialog_1}>
                                <Typography variant='h3' className={classes.textOfficial}>
                                    'breaking: #bart service stopped at civic center due to police activity https://t.co/y5e2sf9oda https://t.co/ysnaqanruv
                                </Typography>
                                <Typography variant='h4' className={classes.textTwit}>
                                    @SFBART milbrae train stuck at Civic Center without explanation
                                </Typography>
                                <Typography variant='h4' className={classes.textBARTML}>
                                    {prediction_1}
                                </Typography>
                            </Dialog>
                        </Card>
                    </Grid>
                    <Grid key={'BART'} item xs={4} className={classes.grid}>
                        <Card className={classes.cardBART}>
                            <Grid item>
                                <ButtonBase className={classes.image} onClick={this.onClick_2}>
                                    <img className={classes.img} alt="complex" src={require('../assets/bart.png')} />
                                </ButtonBase>
                            </Grid>
                            <Dialog onClose={this.handleClose_2} open={this.state.openDialog_2}>
                                <Typography variant='h3' className={classes.textOfficial}>
                                    bart from simpsons is my favorite character!
                                </Typography>
                                <Typography variant='h4' className={classes.textBARTML}>
                                    {prediction_2}
                                </Typography>
                            </Dialog>
                        </Card>
                    </Grid>
                    <Grid key={'SAMPLE'} item xs={4} className={classes.grid}>
                        <Card className={classes.cardInput}>
                            <Grid item>
                                <div className="SearchBar">
                                    <SearchField
                                        placeholder='enter a sentence'
                                        searchText={this.state.searchText}
                                        onEnter={(value, event)=>this.onSubmit(value, event)}
                                        onSearchClick={(value, event)=>this.onSubmit(value, event)}
                                    />
                                </div>
                            </Grid>
                            <Dialog onClose={this.handleClose_3} open={this.state.openDialog_3}>
                                <Typography variant='h3' className={classes.textOfficial}>
                                    You typed: '{this.state.searchText}'
                                </Typography>
                                <Typography variant='h4' className={classes.textBARTML}>
                                    {prediction_3}
                                </Typography>
                            </Dialog>
                        </Card>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

RM.propTypes = {
    classes: PropTypes.object.isRequired,
  };

const styles = theme => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing(2),
        background: 'linear-gradient(45deg, #aa6775 30%, #984355 90%)',
    },
    cardOutService: {
        padding: theme.spacing(0.5),
        maxWidth: 300,
        background: 'red',
    },
    cardBART: {
        padding: theme.spacing(0.5),
        maxWidth: 300,
        background: 'yellow',
    },
    cardInput: {
        padding: theme.spacing(0.5),
        maxWidth: 300,
    },
    image: {
        width: 128,
        height: 128,
      },
    img: {
        margin: 'auto',
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%',
    },
    cardCustom: {
        padding: theme.spacing(0.5),
        maxWidth: 200,
        background: 'blue',
    },
    textOfficial: {
        padding: theme.spacing(2),
    },
    textTwit: {
        padding: theme.spacing(2),
    },
    textBARTML: {
        padding: theme.spacing(2),
    },
});

export default withStyles(styles)(RM);
