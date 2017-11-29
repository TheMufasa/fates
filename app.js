/*** GLOBAL VARIABLES **/
var ROUTES = [];
var GENDER = 'male';

/**CLASSES **/
/**Route class **/
function Route(name){
  this.name = name;
  this.children = [];
  this.characters = {};
}

Route.prototype.populateTable = function(){
  var path = '#' + this.name +" table";
  $(path).append('<tr><th><h1>Child</h1></th><th><h1>Mother</h1></th><th><h1>Father</h1></th><th><h1>Stats</h1></th></tr>');
  this.children.forEach(function(child){
    $(path).append("<tr 'data-value=childname'><td><img src=images/childname.png value = childname></td><td value=Mother></td><td value=Father</tr>".replace(/childname/g,child.info.Name))
    let parent = child.info.Parent;
    console.log(parent)
    $(path + ' tr[value=childname] td[value=Gender]'.replace('childname',child.info.Name).replace('Gender',parent.Gender)).append('<img src=images/name.png'.replace('name',parent.name))

  })
}

/**Child class **/
function Child(info){
  this.info = info;
  this.result = info;
}
Child.prototype.getGrowths = function(parent) {
  this.result.HP = (this.info.HP + parent.HP)/2;
  this.result.Str = (this.info.Str + parent.Str)/2;
  this.result.Mag = (this.info.Mag + parent.Mag)/2;
  this.result.Skl = (this.info.Skl + parent.Skl)/2;
  this.result.Spd = (this.info.Spd + parent.Spd)/2;
  this.result.Lck = (this.info.Lck + parent.Lck)/2;
  this.result.Def = (this.info.Def + parent.Def)/2;
  this.result.Res = (this.info.Res + parent.Res)/2;
};


$(document).ready(function(){
  init();
})
function changeView(route){
    //re-list the now switched out game as an option again
    var previous = $('#game').attr('value');
    $('#myDropDown img[value =' + previous + ']').show();
    $('.dropbtn').val(route);
    $('.dropbtn').attr("src",'images/' + route + '.png');
    $('.dropbtn').attr("value",route);
    //change the background image to the new selected game
    $('body').css("background-image","url(images/" + route + "BG.jpg)");
    //hide the previous game table
    $('#' + previous).hide()
    //display new game table
    $('#' + route).fadeIn(3000);
    removeCurrent(); //removes the current game from the list of options
    //load current game
}
//removes the current game from the list of options
function removeCurrent(){
  var current = $('.dropbtn').val();
  $('#myDropDown img[value =' + current + ']').hide();
}
function createROUTES(){
  var fs=require('fs');
  var child_data=fs.readFileSync('model/children.json');
  var parent_data=fs.readFileSync('model/parents.json');
  var children = JSON.parse(child_data);
  var parents = JSON.parse(parent_data);
  ['birthright','conquest','revelations'].forEach(function(route){
    var r = new Route(route);
    ROUTES.push(r);
    if(route != 'revelations'){
      children['shared'].concat(children[route]).forEach(function(info){
        r.children.push(new Child(info));
      })
    }else{
      r.children = ROUTES[0].children.concat(route[1].children);
      ROUTES.forEach(function(route){
          route.populateTable();
      })
    }
  })
}
//drop down menu prep
function prepareMenu(){
  //****DROPDOWN LIST
  ['birthright','conquest','revelations'].forEach(function(x){
    $('#myDropDown img[value =' + x + ']').click(function(){
      changeView(x);
    })
  })
  window.onclick = function(event) {
    if(!event.target.matches('#myDropdown') &&
       $('#myDropdown').css('display') !='none'){
        $('#myDropdown').toggle();
    }
    else if (event.target.matches('#game')){
      $('#myDropdown').toggle();
    }
  }
}
//loading screen
function  loadingScreen(){
  $('#main').show();
  $('#loader').hide();
}

//animations
function animate(){
  $('#main').hide().fadeIn(2000);
}
//fills in the children and potential parents for each ROUTES
function init(){
  prepareMenu();
  loadingScreen();
  animate();
  createROUTES();
}
