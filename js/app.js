$('body').on("mouseover",".menu-item",function(){
  $(this).toggleClass("menu-item-hover")
  // console.log("mouseover on " + this)
})

$('body').on("mouseout",".menu-item",function(){
  $(this).toggleClass("menu-item-hover")
  // console.log("mouseout on " + this)
})

function Player(character, side, slot) {
  this.character = character
  this.$slotID = $("#" + side + "-slot-" + slot)
  this.$slotID.css("background-image", "url('./assets/" + this.character.imagePrefix + "_default.png')")
}

function Fighter() {
  this.imagePrefix = "fighter"
  this.hp = 300
  this.str = 50
}

function Character() {
  this.attack = function(target){
    var attackStrength = Math.floor((Math.random()*(this.str/2)) + this.str * 0.75)
    target.takeDamage(attackStrength)
    // console.log(attackStrength)
  }
  this.takeDamage = function(damageAmount) {
    this.hp -= damageAmount
  }
}

Fighter.prototype = new Character()

var game = {
  players: [new Player(new Fighter(),"l",1), new Player(new Fighter(),"r",1)]
}
