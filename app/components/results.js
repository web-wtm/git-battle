import React from 'react'
import PropTypes from 'prop-types'
import queryString from 'query-string'
import api from '../utils/api'
import {Link} from 'react-router-dom'
import PlayerPreview from './playerPreview'
import Loading from './loading'

function Profile (props) {
    var info = props.info;

    return (
        <PlayerPreview avatar={info.avatar_url} username={info.login}>
            <ul className='space-list-items'>
                {info.name && <li>{info.name}</li>}
                {info.location && <li>{info.location}</li>}
                {info.company && <li>{info.company}</li>}
                <li>Followers: {info.followers}</li>
                <li>Following: {info.following}</li>
                <li>Public Repos: {info.public_repos}</li>
                {info.blog && <li><a href={info.blog}>{info.blog}</a></li>}
            </ul>
        </PlayerPreview>
    )
}

Profile.propTypes = {
    info: PropTypes.object.isRequired
}

function Player(props) {
    return (
        <div>
            <h1 className="header">{props.label}</h1>
            <h3 style={{textAlign: 'center'}}>Score: {props.score}</h3>
            <Profile info={props.profile}/>
        </div>
    )
}

Player.propTypes = {
    label: PropTypes.string.isRequired,
    score: PropTypes.number.isRequired,
    profile: PropTypes.object.isRequired
}
export class Results extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            winner: null,
            loser: null,
            error: null,
            loading: true
        }
    }
    componentDidMount() {
        var players = queryString.parse(this.props.location.search);

        api.battle([
            players.playerOneName,
            players.playerTwoName
        ]).then((resp) => {
            if(resp === null) {
                return this.setState(() => {
                    return {
                        error: 'error!!',
                        loading: false
                    }
                })
            }
            this.setState(() => {
                return {
                    error: null,
                    winner: resp[0],
                    loser: resp[1],
                    loading: false
                }
            })
        })
    }
    render () {
        var winner = this.state.winner;
        var loser = this.state.loser;
        var error = this.state.error;
        var loading = this.state.loading;

        if(loading === true) {
            return <Loading />
        }

        if(error) {
            return (
                <div>
                    {error}
                    <Link to="/battle">Reset</Link>
                </div>
            )
        }

        return (
            <div>
                <Player
                    label="winner"
                    score={winner.score}
                    profile={winner.profile} 
                />
                <Player
                    label="loser"
                    score={loser.score}
                    profile={loser.profile} 
                />
            </div>
        )
    }
}
module.exports = Results;