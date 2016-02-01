$('body').on("mouseover",".menu-item",function(){
  $(this).toggleClass("menu-item-hover")
  // console.log("mouseover on " + this)
})

$('body').on("mouseout",".menu-item",function(){
  $(this).toggleClass("menu-item-hover")
  // console.log("mouseout on " + this)
})

function Player(character) {
  this.character = character
}

function Fighter() {
  this.imagePrefix = "fighter"
  this.hp = 300
  this.str = 50
}

function Character() {
  this.attack = function(){
    var attackStrength = Math.floor((Math.random()*(this.str/2)) + this.str * 0.75) 
    console.log(attackStrength)
  }
}

Fighter.prototype = new Character()

var game = {
  players: [new Player(new Fighter()), new Player(new Fighter())]
}
