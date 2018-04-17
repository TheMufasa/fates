/*** GLOBAL VARIABLES **/
var ROUTES = [];

/**CLASSES **/
/**Route class **/
function Route(name) {
  this.name = name;
  this.children = [];
  this.characters = {};
}

Route.prototype.populateTable = function() {
  var path = '#' + this.name + " table";
  $(path).append('<tr><th><h1>Child</h1></th><th><h1>Mother</h1></th><th><h1>Father</h1></th><th><h1>Stats</h1></th></tr>');
  let ref = this;
  this.children.forEach(function(name) {
    //load the children images into their respective spots
    let child = ref.characters[name];
    $(path).append("<tr data-value=childname><td><img class=img-circle src=images/childname.png data-value = childname><center>childname</center></td><td data-value=Mother></td><td data-value=Father></tr>".replace(/childname/g, child.info.Name))
    //loads the parent images into their respective spots
    let parent = ref.characters[child.info.Parent];
    let vParentGender = parent.info.Gender == "Mother" ? "Father" : "Mother"
    let parentPath = ' tr[data-value=childname] td[data-value=Gender]'.replace('childname', child.info.Name)
    $(path + parentPath.replace('Gender', parent.info.Gender)).append('<img class=img-circle src=images/name.png data-value=name><center>name</center>'.replace(/name/g, parent.info.Name));
    //variable parent loader
    $(path + parentPath.replace('Gender', vParentGender)).append("<img class='img-circle selectable' src='images/holder.png' data-value=holder.png><center>Select</center>");
    //child Stats
    $(path + " tr[data-value=childname]".replace('childname', child.info.Name)).append("<td data-value=stats><center class=stats>HP:hp(0) Str:str(0) Mag:mag(0) Skl:skl(0) Spd:spd(0) Lck:lck(0) Def:def(0) Res:res(0)</center></td>".replace('hp', child.info.HP)
      .replace('str', child.info.Str)
      .replace('mag', child.info.Mag)
      .replace('skl', child.info.Skl)
      .replace('spd', child.info.Spd)
      .replace('def', child.info.Def)
      .replace('res', child.info.Res))

    //
  })
}
/**Character class **/
function Character(info) {
  this.info = info
}
/**Child class **/
function Child(info) {
  this.info = info;
  this.result = info;
}
Child.prototype.updateGrowths = function(parent) {
  this.result.HP = (this.info.HP + parent.info.HP) / 2;
  this.result.Str = (this.info.Str + parent.info.Str) / 2;
  this.result.Mag = (this.info.Mag + parent.info.Mag) / 2;
  this.result.Skl = (this.info.Skl + parent.info.Skl) / 2;
  this.result.Spd = (this.info.Spd + parent.info.Spd) / 2;
  this.result.Lck = (this.info.Lck + parent.info.Lck) / 2;
  this.result.Def = (this.info.Def + parent.info.Def) / 2;
  this.result.Res = (this.info.Res + parent.info.Res) / 2;
};


$(document).ready(function() {
  init();
})

function changeView(route) {
  //re-list the now switched out game as an option again
  var previous = $('#game').attr('value');
  $('#myDropDown img[value =' + previous + ']').show();
  $('.dropbtn').val(route);
  $('.dropbtn').attr("src", 'images/' + route + '.png');
  $('.dropbtn').attr("value", route);
  //change the background image to the new selected game
  $('body').css("background-image", "url(images/" + route + "BG.jpg)");
  //hide the previous game table
  $('#' + previous).hide()
  //display new game table
  $('#' + route).fadeIn(3000);
  removeCurrent(); //removes the current game from the list of options
  //load current game
}

//update on new parent functions

function changeParent(game, child, newP) {
  child.updateGrowths(newP); //update the child's updateGrowths
  changeStatsView(game, child); //change the stats on the screen
  let pToParent = "tr[data-value=childname] <td [data-value= Gender]".replace('childname', child.info.name).replace('Gender', 'newP.info.Gender');

}

function changeStatsView(game, child) {
  var path = '#' + game + " table";
  $(path + " tr[data-value=childname] td[data-value=stats] center".replace('childname', child.info.Name))
    .replaceWith("<center class=stats>HP:hp(0) Str:str(0) Mag:mag(0) Skl:skl(0) Spd:spd(0) Lck:lck(0) Def:def(0) Res:res(0)</center></td>".replace('hp', child.info.HP)
      .replace('str', child.info.Str)
      .replace('mag', child.info.Mag)
      .replace('skl', child.info.Skl)
      .replace('spd', child.info.Spd)
      .replace('def', child.info.Def)
      .replace('res', child.info.Res))
}

//update new variable parent image
function changeParentView(child, game, newP) {
  var path = '#' + game + " table";
  pToParent = '#' + game + " table" +
  " tr[data-value=childname] td[data-value=Gender] img"
    .replace('childname', child.info.Name)
    .replace('Gender', newP.info.Gender);
 $(pToParent).attr("src", 'images/' + newP.info.Name + '.png');
 $(pToParent).attr("data-value",newP.info.Name);

}

function generateSelectables(){


}






//removes the current game from the list of options
function removeCurrent() {
  var current = $('.dropbtn').val();
  $('#myDropDown img[value =' + current + ']').hide();
}
//sets up a given route
function createROUTES() {
  var fs = require('fs');
  var children = JSON.parse(fs.readFileSync('model/children.json'));
  var parents = JSON.parse(fs.readFileSync('model/parents.json'));
  ['birthright', 'conquest'].forEach(function(route) {
    var r = new Route(route);
    ROUTES.push(r);
    if (route != 'revelations') {
      children['shared'].concat(children[route]).forEach(function(info) {
        r.children.push(info.Name);
        r.characters[info.Name] = new Child(info);
      })
      parents['shared'].concat(parents[route]).forEach(function(info) {
        r.characters[info.Name] = new Character(info);
      })
      r.populateTable();
    }
  })
}
//drop down menu prep
function prepareMenu() {
  //****DROPDOWN LIST
  ['birthright', 'conquest', 'revelations'].forEach(function(x) {
    $('#myDropDown img[value =' + x + ']').click(function() {
      changeView(x);
    })
  })
  window.onclick = function(event) {
    if (!event.target.matches('#myDropdown') &&
      $('#myDropdown').css('display') != 'none') {
      $('#myDropdown').toggle();
    } else if (event.target.matches('#game')) {
      $('#myDropdown').toggle();
    }
  }
}
//loading screen
function loadingScreen() {
  $('#main').show();
  $('#loader').hide();
}

//animations
function animate() {
  $('#main').hide().fadeIn(2000);
}
//fills in the children and potential parents for each ROUTES
function init() {
  prepareMenu();
  loadingScreen();
  animate();
  createROUTES();
}
