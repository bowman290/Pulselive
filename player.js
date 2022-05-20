class Player extends HTMLElement {
    constructor() {
      super();
    }
  
    connectedCallback() {
      this.heading = this.getAttribute("heading");
      this.subheading = this.getAttribute("subheading");
  
      this.render();
     
      getPlayers();
    }
  
    render() {
      this.innerHTML = `

        <section id="player-container">
          <div id="drop-down">
            <select name="players" id="player-select" onchange="changePlayer(event, this)">
                <option id="select-empty" value="">Select a player...</option>
            </select>
          </div>

          <section id="player-profile">
            <div id="player-image">
              
            </div>
          </section>

          <section id="stat-section">
            <div id="club-badge"></div>

            <div id="stat_player_name"><h1 class="stat-value"></h1></div>
            <div id="stat_position"><h2 class="stat-value"></h2></div>
            
            <section id="stat-wrapper">
              <div id="stat_goals" class="stat-holder"><span class="stat-name">Goals</span><span class="stat-value">0</span></div>
              <div id="stat_appearances" class="stat-holder"><span class="stat-name">Appearances</span><span class="stat-value">0</span></div>
              <div id="stat_goal_assist" class="stat-holder"><span class="stat-name">Assists</span><span class="stat-value">0</span></div>
              <div id="stat_goals_permatch" class="stat-holder"><span class="stat-name">Goals per Match</span><span class="stat-value">0</span></div>
              <div id="stat_passes_permin" class="stat-holder"><span class="stat-name">Passes per Minute</span><span class="stat-value">0</span></div>
            </section>
          </section>
        <section>

        `;
    }

  }

  var PlayerList;

  function getPlayers(){
    let url = 'data/player-stats.json';
    fetch(url)
    .then(res => res.json())
    .then(output => {
      popData(output); getPlayerList(output);})
  }

  function getPlayerList(data) {
    var data = data.players;
    console.log(data);
    var mainContainer = document.getElementById("player-select");
    for (var i = 0; i < data.length; i++) {
      var option = document.createElement("option");
      option.setAttribute("value", i);
      var nameFirstLast = data[i].player.name.first + ' ' + data[i].player.name.last;
      option.setAttribute("name", nameFirstLast);
      
      option.innerHTML =  nameFirstLast;
      mainContainer.appendChild(option);
    }
  }
  
  function loadPlayerData(value){
    var data = PlayerList.players;
    
    var playerStats = data[value].stats;
    var clubStats = data[value].player.currentTeam;
    var playerName = data[value].player.name;
    var playerInfo = data[value].player.info;
    
    //var statsArray = [];

    //clear previous player
    var playerContainer = document.getElementById("player-container");
    playerContainer.removeAttribute("class");

    //get stats from api
    var getAppearences;
    var getGoals;
    var getAssists;
    var getFPasses
    var getBPasses;
    var getMinsPlayed;
    

    
    var statName = [];
    for (var i = 0; i < playerStats.length; i++) {
      statName[i] = playerStats[i].name;
    }
    if (statName.includes("goals")){
      getGoals = playerStats.find( ({ name }) => name === 'goals' );
      getGoals = getGoals.value;
    } else { getGoals = 0}
    if (statName.includes("appearances")){
      getAppearences = playerStats.find( ({ name }) => name === 'appearances' );
      getAppearences = getAppearences.value;
    } else { getAppearences = 0}
    if (statName.includes("goal_assist")){
      getAssists = playerStats.find( ({ name }) => name === 'goal_assist' );
      getAssists = getAssists.value;
    } else { getAssists = 0}
    if (statName.includes("fwd_pass")){
      getFPasses = playerStats.find( ({ name }) => name === 'fwd_pass' );
      getFPasses = getFPasses.value;
    } else { getFPasses = 0}
    if (statName.includes("backward_pass")){
      getBPasses = playerStats.find( ({ name }) => name === 'backward_pass' );
      getBPasses = getBPasses.value;
    } else { getBPasses = 0}
    if (statName.includes("mins_played")){
      getMinsPlayed = playerStats.find( ({ name }) => name === 'mins_played' );
      getMinsPlayed = getMinsPlayed.value;
    } else { getMinsPlayed = 0}
    var passes = 0;

    getVariousStats(getGoals, getAppearences, getAssists);

    //pass per min
    getPassesPerMins(getFPasses, getBPasses, getMinsPlayed);

    //position
    getPosition(playerInfo);

    //name
    getName(playerName);

    //get club
    getClub(clubStats);

    //goals per match
    getGoalsPerMatch(getGoals, getAppearences);
    
  }

  

  function getVariousStats(goals, appearances, assists){
    var goalDiv = "stat_goals";
    goals = parseFloat(goals);
    var appDiv = "stat_appearances";
    appearances = parseFloat(appearances);
    var astDiv = "stat_goal_assist";
    assists = parseFloat(assists);
    postPlayerData(goals, goalDiv);
    postPlayerData(appearances, appDiv);
    postPlayerData(assists, astDiv);

  }

  function getPassesPerMins (fpass, bpass, mins){
    fpass = parseFloat(fpass);
    bpass = parseFloat(bpass);
    passes = fpass + bpass;
    mins = parseFloat(mins);
    var passPerMin = passes / mins;
    passPerMin = passPerMin.toFixed(2);
    var minsDiv = "stat_passes_permin";
    postPlayerData(passPerMin, minsDiv);
    
  }

  function getPosition(playerInfo){
    var getPosition = playerInfo.position;
    var targetDiv = "stat_position";
    if(getPosition == "D"){
      getPosition = "Defender";
    }
    else if(getPosition == "M"){
      getPosition = "Midfielder";
    }
    else if(getPosition == "F"){
      getPosition = "Forward";
    }
    else if(getPosition == "GK"){
      getPosition = "Goal Keeper";
    }
    postPlayerData(getPosition, targetDiv);
  }

  function getName(playerName){
    var Name = playerName.first + " " + playerName.last;
    var targetDiv = "stat_player_name";
    postPlayerData(Name, targetDiv);

    Name = Name.replace(/\s+/g, '-').toLowerCase();
    var playerContainer = document.getElementById("player-image");
    playerContainer.removeAttribute("class");
    playerContainer.classList.add(Name);
    
  }

  function getClub(clubStats){
    var clubName = clubStats.name;
    clubName = clubName.replace(/\s+/g, '-').toLowerCase();
    var badgeContainer = document.getElementById("club-badge");
    badgeContainer.removeAttribute("class");
    badgeContainer.classList.add(clubName);
  }

  function getGoalsPerMatch(goals, apps){

    goals = parseFloat(goals);
    apps = parseFloat(apps);
    var goalspergame = goals / apps;
    goalspergame = goalspergame.toFixed(2);

    var targetDiv = "stat_goals_permatch";
    postPlayerData(goalspergame, targetDiv);
  }

  function postPlayerData(statVal, targetDiv){
    var container = document.querySelector("#"+ targetDiv +" .stat-value");
    container.innerText = "0";
    container.innerText = statVal;
  }

  function changePlayer(event){
    var selectElement = event.target;
    var value = selectElement.value;

    var optionHidden = false;
    if(value && optionHidden == false){
      var emptyOption = document.getElementById('select-empty');
      emptyOption.style.display = 'none';
      var optionHidden = true;
    }
    
    var container = document.querySelectorAll(".stat-value");
    container.forEach(element => {
      element.innerText = '0';
    });
    
    loadPlayerData(value);
  }

  function popData(playerdata){
    PlayerList = playerdata;
  }
  
  customElements.define("player-toggle", Player);