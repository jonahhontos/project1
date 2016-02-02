// $(document).ready(function() {

  //
  // MOUSEOVER EFFECT FOR MENU ITEMS
  //        Puts cursor.png in bg of .menu-item with a class
  //
  $('body').on("mouseover",".menu-item",function(){
    $(this).toggleClass("menu-item-hover")
    // console.log("mouseover on " + this)
  })

  $('body').on("mouseout",".menu-item",function(){
    $(this).toggleClass("menu-item-hover")
    // console.log("mouseout on " + this)
  })

//
// PLAYER CONSTRUCTOR
//
  function Player(character, side, slot) {
    this.character = character
    this.$slotID = $("#" + side + "-slot-" + slot)

    this.setSprite = function(state) {
      if (state===undefined){state="default"}
      console.log("sprite set to " + state)
      this.$slotID.css("background-image", "url('./assets/" + this.character.imagePrefix + "_" + state + ".png')")
    }

    this.setSprite("default")

    //
    // WALK ANIMATIONS
    //
    this.setWalk = function(){
      this.setSprite("walk")
    }

    this.walkForwardDirection = side === "l" ? "+=20px" : "-=20px"
    this.walkBackwardDirection = side === "l" ? "-=20px" : "+=20px"

    this.walkForward = function() {
      console.log(this + " walked forward")
      var speed = 50
      this.$slotID.animate({"left": this.walkForwardDirection},speed, this.setWalk.bind(this))
                  .animate({"left": this.walkForwardDirection},speed, this.setSprite.bind(this))
                  .animate({"left": this.walkForwardDirection},speed, this.setWalk.bind(this))
                  .animate({"left": this.walkForwardDirection},speed, this.setSprite.bind(this))
                  .animate({"left": this.walkForwardDirection},speed, this.setWalk.bind(this))
                  .animate({"left": this.walkForwardDirection},speed, this.setSprite.bind(this))
    }

    this.walkBackward = function() {
      console.log(this + " walked forward")
      var speed = 50
      this.$slotID.animate({"left": this.walkBackwardDirection},speed, this.setWalk.bind(this))
                  .animate({"left": this.walkBackwardDirection},speed, this.setSprite.bind(this))
                  .animate({"left": this.walkBackwardDirection},speed, this.setWalk.bind(this))
                  .animate({"left": this.walkBackwardDirection},speed, this.setSprite.bind(this))
                  .animate({"left": this.walkBackwardDirection},speed, this.setWalk.bind(this))
                  .animate({"left": this.walkBackwardDirection},speed, this.setSprite.bind(this))
    }

    //
    // GETTING ACTIONS FOR A PLAYER TURN
    //
    this.getAction = function(){
      var menuPosition = side === 'l' ? "left" : "right"
      // console.log("getAction called");
      $('#menu-bar').append('<div class = "action-menu ' + menuPosition + '"></div>')
      $('.action-menu').append('<div class = "menu-item fight">FIGHT</div>')
      $('.fight').click(this.fight.bind(this))
    }

    this.takeTurn = function() {
      this.walkForward()
      this.getAction()
    }

    this.fight = function() {
      this.turnAction = this.character.attack
      this.endTurn()
    }

    this.endTurn = function() {
      $('.action-menu').remove()
      this.walkBackward()
      game.nextTurn()
    }
  } // PLAYER CONSTRUCTOR END


 //
 // CHARACTER CLASS CONSTRUCTORS
 //
  function Fighter() {
    this.imagePrefix = "fighter"
    this.hp = 300
    this.str = 50
  }

  //
  // CHARACTER CONSTRUCTOR
  //
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

//
// GAME OBJECT DECLARATION
//
  var game = {
    turn: 0,
    players: [new Player(new Fighter(),"l",1), new Player(new Fighter(),"r",1)],
    nextTurn: function() {
      console.log("before: " + this.turn)
      if (this.turn === this.players.length) {
        this.turn = 0
        this.doActions()
      } else {
        this.players[this.turn].takeTurn()
        this.turn++
      }
      console.log("after: " + this.turn);
    },
    doActions: function(){
      console.log("doActions")
    }
  }

// })
