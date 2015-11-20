'use strict';
var Golf = React.createClass({
  getInitialState:function(){
    return{
      teams:[],
      title:'',
      cutScore3rd:0,
      cutScore4th:0
    };
  },
  componentDidMount:function(){
    var self = this;
    $.ajax({
      url:this.props.source,
      dataType:'json',
      cache:false
    }).done(function(data){
      if(self.isMounted()){
        self.setState({
          teams:data.teams,
          title:data.title,
          cutScore3rd:data.cutScore3rd,
          cutScore4th:data.cutScore4th
        });
      }
    });
  },
  onActive:function(teamName){
    var i, idx;
    teams = this.state.teams,
    len = teams.length;
    for(i = 0; i<len; i+=1){
      if(teams[i].teamName === teamName){
        teams[i].active = !teams[i].active;
      }else{
        teams[i].active = false;
      }
    }
    this.setState({
      teams:teams
    });
  },
  getScores:function(data){
    var i, j, k, total, player, playLen, playTotal, scoreLen,
    cutScore3rd = this.state.cutScore3rd,
    cutScore4th = this.state.cutScore4th,
    len = data.length;
    for(i = 0; i<len; i+=1){
      total = 0;
      playLen = data[i].players.length;
      for(j = 0; j<playLen; j+=1){
        player = data[i].players[j];
        playTotal = 0;
        for(k = 0; k<4; k+=1){
          if(player.score[k] === undefined){
            player.score[k] = '-';
          }
          if(player.cut){
            if(k === 2 && cutScore3rd !== null){
              player.score[2] = cutScore3rd;
            }
            if(k === 3 && cutScore4th !== null){
              player.score[3] = cutScore4th;
            }
          }
          if(!isNaN(parseInt(player.score[k], 10))){
            playTotal += parseInt(player.score[k], 10);
          }
        }
        player.total = playTotal;
        total += playTotal;
      }
      data[i].total = total;
    }
    data.sort(function(a, b){
      return a.total - b.total;
    });
    return data;
  },
  render:function(){
    var self = this,
    rows = [],
    data = this.getScores(this.state.teams);
    data.forEach(function(team, i){
      var player;
      rows.push(<Team key={i} data={team} onActive={self.onActive}/>)
      if(team.active){
        player = team.players.map(function(player, i){
          return(<Player key={i} data={player}/>);
        });
        rows.push(player);
      }
    });
    return(
      <div className='responsive-table'>
      <h1>{this.state.title}</h1>
      <p className="subtitle">Click a team to see the players</p>
      <table >
      <tbody>
      {rows}
      </tbody>
      </table>
      </div>
    );
  }
});

var Team = React.createClass({
  render:function(){
    return(
      <tr onClick={this.props.onActive.bind(null, this.props.data.teamName)}>
      <td className="name header">{this.props.teamName}<span className="total">{this.props.data.total}</span></td>
      <td className='header'>RD 1</td>
      <td className='header'>RD2</td>
      <td className='header'>RD3</td>
      <td className='header'>RD4</td>
      </tr>
    );
  }
});

var Player = React.createClass({
  render:function(){
    var cut;
    if(this.props.data.cut){
      cut = 'cut';
    }
    return(
      <tr className={cut}>
      <td className='name'>{this.props.data.playerName}</td>
      <ScoreCell score={this.props.data.score[0]}/>
      <ScoreCell score={this.props.data.score[1]}/>
      <ScoreCell score={this.props.data.score[2]}/>
      <ScoreCell score={this.props.data.score[3]}/>
      <ScoreVell score={this.props.data.total}/>
      </tr>
    );
  }
});

var ScoreCell = React.createCalss({
  render:function(){
    var under;
    if(this.props.score <0){
      under = 'under';
    }
    return(
      <td className={under}>{this.props.score}</td>
    );
  }
});
ReactDOM.render(<Golf source='data.json'/>, document.getElementById('result'));
