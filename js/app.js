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

  $('#start').click(function(){
    game.nextTurn()
  })

//
// PLAYER CONSTRUCTOR
//
  function Player() {
    // SET UP JQUERY OBJECTS AND IMAGES
    this.init = function(){
      this.$slotID = $("#" + this.side + "-slot-" + this.slot)
      this.$weaponSlot = $("#" + this.side + "-slot-" + this.slot + "-weapon")
      this.$weaponSlot.hide()
      this.$weaponSlot.css("background-image", "url('./assets/" + this.imagePrefix + "_weapon.png')")
      console.log("url('../assets/" + this.imagePrefix + "_weapon.png')")
      this.setSprite()
      this.walkForwardDirection = this.side === "l" ? "+=20px" : "-=20px"
      this.walkBackwardDirection = this.side === "l" ? "-=20px" : "+=20px"
    }

    this.setSprite = function(state) {
      if (state===undefined){state="default"}
      console.log("sprite set to " + state)
      this.$slotID.css("background-image", "url('./assets/" + this.imagePrefix + "_" + state + ".png')")
      console.log("url('./assets/" + this.imagePrefix + "_" + state + ".png')")
    }

    this.sayImagePrefix = function() {
      return this.imagePrefix
    }

    // this.setSprite("default")

    this.updateHP = function() {
      $('#hp-' + this.side).text(this.hp+"hp")
    }

    //
    // WALK ANIMATIONS
    //
    this.setWalk = function(){
      this.setSprite("walk")
    }

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
      var menuPosition = this.side === 'l' ? "left" : "right"
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
      this.turnAction = this.attack
      this.endTurn()
    }

    this.endTurn = function() {
      $('.action-menu').remove()
      this.walkBackward()
      game.nextTurn()
    }

    //
    // EXECUTE ACTIONS
    //
    this.attack = function(target){
      var attackStrength = Math.floor((Math.random()*(this.str/2)) + this.str * 0.75)
      target.takeDamage(attackStrength)
      // console.log(attackStrength)
    }
    this.takeDamage = function(damageAmount) {
      this.hp -= damageAmount
    }
  } // PLAYER CONSTRUCTOR END


 //
 // CHARACTER CLASS CONSTRUCTORS
 //
  function Fighter(side, slot) {
    this.side = side
    this.slot = slot
    this.imagePrefix = "fighter"
    this.hp = 300
    this.str = 50
  }

  Fighter.prototype = new Player()

//
// GAME OBJECT DECLARATION
//
  var game = {
    turn: 0,
    players: [new Fighter("l",1), new Fighter("r",1)],
    updateHPs: function() {
      for (var i=0; i < game.players.length; i++) {
        game.players[i].updateHP()
      }
    },
    nextTurn: function() {
      game.updateHPs()
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
      for (var i = 0; i < this.players.length; i++){
        // players[i].doAction
      }
      game.updateHPs()
      },
    init: function(){
      game.updateHPs()
      for (var i = 0; i < this.players.length; i++){
        this.players[i].init()
      }
    }
  }
game.init()

// })
