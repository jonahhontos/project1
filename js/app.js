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
  this.setSprite = function(state){
    console.log("sprite set to " + state)
    this.$slotID.css("background-image", "url('./assets/" + this.character.imagePrefix + "_" + state + ".png')")
  }
  this.setWalk = function(){
    this.setSprite("walk")
  }
  this.setSprite("default")
  this.walkForwardDirection = side === "l" ? "+=50px" : "-=50px"
  this.walkBackwardDirection = side === "l" ? "-=50px" : "+=50px"

  this.walkForward = function() {
    console.log(this + " walked forward")
    var speed = 200
    //this.setSprite("walk")
    this.$slotID.animate({"left": this.walkForwardDirection},speed)
    // window.setTimeout(, 1000)
    // this.$slotID.animate({"left": this.walkDirection},speed,this.setSprite("walk"))
    // this.$slotID.animate({"left": this.walkDirection},speed,this.setSprite("default"))
    // this.$slotID.animate({"left": this.walkDirection},speed)
  }

  this.walkBackward = function() {
    console.log(this + " walked forward")
    var speed = 200
    //this.setSprite("walk")
    this.$slotID.animate({"left": this.walkBackwardDirection},speed)
    // window.setTimeout(, 1000)
    // this.$slotID.animate({"left": this.walkDirection},speed,this.setSprite("walk"))
    // this.$slotID.animate({"left": this.walkDirection},speed,this.setSprite("default"))
    // this.$slotID.animate({"left": this.walkDirection},speed)
  }

  this.takeTurn = function() {
    this.walkForward()
  }

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
  players: [new Player(new Fighter(),"l",1), new Player(new Fighter(),"r",1)],
  takeInputs: function() {
    for (var i=0; i < this.players.length; i++){
      players[i].takeTurn()
    }
  }
}
