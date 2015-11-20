'use strict';

var Golf = React.createClass({
  displayName:'Golf',

  getInitialState:function getInitialState(){
    return{
      teams:[],
      title:'',
      cutScore3rd:0,
      cutScore4th:0
    };
  },
  compontDidMount:function componentDidMount(){
    var self = this;
    $.ajax({
      url:this.props.source,
      dataType:'json',
      cache:false
    }).done(function(data){
      if(self.isMounted()){
        slef.setState({
          teams:data.teams,
          title:data.title,
          cutScore3rd:data.cutScore3rd,
          cutScore4th:data.cutScore4th
        });
      }
    });
  },
  onActive:function onActive(teamName){
    var i, idx;
    teams = this.state.teams, len = teams.length;
    for(i=0; i<len; i+=1){
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
  getScores:function getScores(data){
    var i, j, k, total, player, playLen, playTotal, scoreLen,
    cutScore3rd = this.state.cutScore3rd,
    cutScore4th = this.state.cutScore4th,
    len = data.length;
    for(i=0; i<len; i+= 1){
      total = 0;
      playLen = data[i].players.length;
      for(j = 0; j<playLen; j+=1){
        player = data[i].players[j];
        playTotal = 0;
        for(k=0; k<4; k+=1){
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
            playTotal += parseInt(player.score[k],10);
          }
        }
        player.total = playTotal;
        total += playTotal;
      }
      data[i].total = total;
    }
    data.sort(function(a,b){
      return a.total - b.total;
    });
    return data;
  },
  render:function render(){
    var self = this,
    rows = [],
    data = this.getScores(this.state.teams);
    data.forEach(function(team, i){
      var player;
      rows.push(React.createElement(Team, {key:i, data:team, onActive:self.onActive}));
      if(team.active){
        player = team.players.map(function(player, i){
          return React.createElement(Player,{key:i, data:player});
        });
        rows.push(player);
      }
    });
    return React.creatElement(
      'div',
      {className:'responseve-table'},
      React.createElement(
        'h1',
        null,
        this.state.title
      ),
      React.createElement(
        'p',
        {className:'subtitle'},
        'Click a team to see the players'
      ),
      React.createElement(
        'table',
        null,
        React.createElement(
          'tbody',
          null,
          rows
        )
      )
    );
  }
});

var Team = React.createClass({
  displayName:'Team',
  render:function render(){
    return React.createElement(
      'tr',
      {onClick:this.props.onactive.bind(null, this.props.data.teamName)},
      React.createElement(
        'td',
        {className:'name header'},
        this.props.data.teamName,
        ' ',
        React.createElement(
          'span',
          {className:'total'},
          this.props.data.total
        )
      ),
      React.createElement(
        'td',
        {className:'header'},
        'RD1'
      ),
      React.createElement(
        'td',
        {className:'header'},
        'RD2'
      ),
      React.createElement(
        'td',
        {className:'header'},
        'RD3'
      ),
      React.createElement(
        'td',
        {className:'header'},
        'RD4'
      ),
      React.createElement(
        'td',
        {className:'header'},
        'Total'
      )
    );
  }
});

var Player = React.createClass({
  displayName:'Player',
  render:function render(){
    var cut;
    if(this.props.data.cut){
      cut = 'cut';
    }
    return React.createElement(
      'tr',
      {className:cut},
      React.createElement(
        'td',
        {className:'name'},
        this.props.data.playerName
      ),
      React.createElement(ScoreCell, {score:this.props.data.score[0] }),
      React.createElement(ScoreCell, {score:this.props.data.score[1] }),
      React.createElement(ScoreCell, {score:this.props.data.score[2] }),
      React.createElement(ScoreCell, {score:this.props.data.score[3] }),
      React.createElement(ScoreCell, {score:this.props.data.total})
    );
  }
});

var ScoreVell = React.createClass({
  displayName:'ScoreCell',
  render: function(){
    var under;
    if(this.props.score < 0){
      under = 'under';
    }
    return React.createElemnt(
      'td',
      {className:under},
      this.props.score
    );
  }
});

ReactDOM.render(React.createElement(Golf, {source:'data.json'}), document.getElementById('result'));
