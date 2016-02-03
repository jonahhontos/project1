// $(document).ready(function() {

  //
  // GLOBALS
  //
var player;
var prelude = document.createElement('audio')
prelude.setAttribute('src','assets/prelude.mp3')
var battle = document.createElement('audio')
battle.setAttribute('src','assets/battle.mp3')
var win = document.createElement('audio')
win.setAttribute('src','assets/win.mp3')
// prelude.play()

  $('body').on("mouseover",".menu-item",function(){
    $(this).toggleClass("menu-item-hover")
    // console.log("mouseover on " + this)
  })

  $('body').on("mouseout",".menu-item",function(){
    $(this).toggleClass("menu-item-hover")
    // console.log("mouseout on " + this)
  })

  $('#win-message').hide()

  $('#start').click(function(){
    // prelude.pause()
    $(this).hide()
    // game.init()
    game.nextTurn()
    // battle.play()
  })

//
// PLAYER CONSTRUCTOR
//
  function Player() {
    // SET UP JQUERY OBJECTS AND IMAGES

    this.init = function(){
      this.initialHP = this.hp
      this.potions = 2
      this.$slotID = $("#" + this.side + "-slot-" + this.slot)
      this.$weaponSlot = $("#" + this.side + "-slot-" + this.slot + "-weapon")
      this.$weaponSlot.hide()
      this.$weaponSlot.css("background-image", "url('./assets/" + this.imagePrefix + "_weapon.png')")
      // console.log("url('../assets/" + this.imagePrefix + "_weapon.png')")
      this.$damage = $("#" + this.side + "-slot-" + this.slot + "-damage")
      this.setSprite()
      this.walkForwardDirection = this.side === "l" ? "+=20px" : "-=20px"
      this.walkBackwardDirection = this.side === "l" ? "-=20px" : "+=20px"
    }

    this.setOpponent = function(opponent) {
      this.opponent = opponent
    }

    this.setSprite = function(state) {
      if (state===undefined){state="default"}
      // console.log("sprite set to " + state)
      this.$slotID.css("background-image", "url('./assets/" + this.imagePrefix + "_" + state + ".png')")
      // console.log("url('./assets/" + this.imagePrefix + "_" + state + ".png')")
    }

    this.updateHP = function() {
      if (this.hp <= 0) {
        $('#hp-' + this.side).css("color", "#FF0000")
        $('#hp-' + this.side).text("K.O.")
        this.setSprite("ko")
        this.opponent.win()
      } else {
        if (this.hp < (this.initialHP / 3)) {
          this.setSprite("hurt")
          $('#hp-' + this.side).css("color", "#FFFF00")
        }
        $('#hp-' + this.side).text(this.hp+"hp")
      }
    }

    //
    // WALK ANIMATIONS
    //
    this.setWalk = function(){
      this.setSprite("walk")
    }

    this.walkForward = function() {
      // console.log(this + " walked forward")
      var speed = 50
      // this.$slotID.promise().done(function() {
        this.$slotID.animate({"left": this.walkForwardDirection},speed, this.setWalk.bind(this))
                    .animate({"left": this.walkForwardDirection},speed, this.setSprite.bind(this))
                    .animate({"left": this.walkForwardDirection},speed, this.setWalk.bind(this))
                    .animate({"left": this.walkForwardDirection},speed, this.setSprite.bind(this))
                    .animate({"left": this.walkForwardDirection},speed, this.setWalk.bind(this))
                    .animate({"left": this.walkForwardDirection},speed, this.setSprite.bind(this))
                // })
    }

    this.walkBackward = function() {
      // console.log(this + " walked forward")
      var speed = 50
      // this.$slotID.promise().done(function() {
        this.$slotID.animate({"left": this.walkBackwardDirection},speed, this.setWalk.bind(this))
                    .animate({"left": this.walkBackwardDirection},speed, this.setSprite.bind(this))
                    .animate({"left": this.walkBackwardDirection},speed, this.setWalk.bind(this))
                    .animate({"left": this.walkBackwardDirection},speed, this.setSprite.bind(this))
                    .animate({"left": this.walkBackwardDirection},speed, this.setWalk.bind(this))
                    .animate({"left": this.walkBackwardDirection},speed, this.setSprite.bind(this))
                  // })
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
      this.addUniqueAction()
      if (this.potions > 0)
      {
        $('.action-menu').append('<div class = "menu-item potion">POTION x' + this.potions + '</div>')
        $('.potion').click(this.potion.bind(this))
      }
    }

    this.takeTurn = function() {
      this.walkForward()
      this.getAction()
    }

    this.fight = function() {
      this.turnAction = this.attack
      this.endTurn()
    }

    this.potion = function() {
      this.turnAction = this.usePotion
      this.endTurn()
    }

    this.endTurn = function() {
      $('.action-menu').remove()
      this.walkBackward()
      this.$slotID.promise().done( function(){
        // this.updateHP()
        game.nextTurn()
      })
    }

    //
    // EXECUTE ACTIONS
    //
    this.attack = function(){
      // while (player !== undefined) {}
      var attackStrength = Math.floor((Math.random()*(this.str/2)) + this.str * 0.75)
      // console.log("attack called");
      var speed = 80
      player = this
      this.walkForward()
      this.$slotID.promise().done( function() {
        player.setSprite("attack")
        player.$weaponSlot.show()
        player.opponent.takeDamage(attackStrength)
        player.$weaponSlot.animate({"top": "+=16px","right":"+=16px"}, speed)
                          .animate({"top": "-=16px","right":"-=16px"}, speed/2)
                          .animate({"top": "+=16px","right":"+=16px"}, speed)
                          .animate({"top": "-=16px","right":"-=16px"}, speed/2,
                          function (){
                            player.$weaponSlot.hide()
                            player.setSprite()
                            player.walkBackward()
                            player.$slotID.promise().done(function(){
                              game.nextAction()
                              // console.log("animation done");
                            })
                          })
      })


      // target.takeDamage(attackStrength)
      // console.log(attackStrength)
      // player = undefined
    }

    this.usePotion = function(){
      player = this
      var adjust = this.side === 'l' ? "120px" : "-120px"
      this.potions -= 1
      this.walkForward()
      this.$slotID.promise().done(function(){
        player.setSprite("use")
        player.$damage.css("opacity", "1.0")
        player.$damage.css("color","#00FF00")
        player.$damage.css("left","+=" + adjust)
        player.$damage.text("100")
        player.hp += 100
        player.$damage.animate({"top": "-=48px"},350)
                    .animate({"opacity": "0"})
                    .animate({"top": "+=48px"}, 0, function(){
                      player.$damage.css("color","#FFFFFF")
                      player.$damage.css("left","-=" + adjust)
                      player.walkBackward()
                      player.$slotID.promise().done(function(){
                        game.nextAction()
                      })
                    })
      })
    }

    this.takeDamage = function(damageAmount) {
      var moveDirection1 = this.side === 'r' ? "+=36px" : "-=36px"
      var moveDirection2 = this.side === 'r' ? "-=36px" : "+=36px"
      this.hp -= damageAmount
      this.$damage.css("opacity", "1.0")
      this.$damage.text(damageAmount)
      this.$damage.animate({"top": "-=48px"},350)
                  .animate({"opacity": "0"})
                  .animate({"top": "+=48px"}, 0)
      this.setSprite("hurt")
      this.$slotID.animate({"left":moveDirection1},100)
                  .animate({"left":moveDirection2},100, this.setSprite.bind(this))
    }

    // A WINRAR IS YOU
    this.win = function(){
      // console.log(this.side + " win");
      var side = this.side === 'l' ? "Left" : "Right"
      $('#win-message').text(side + " Player Wins!")
      $('#win-message').show()
      player = this
      var frame = true
      window.setInterval(function(){
        player.setSprite(frame === false ? "default" : "use")
        frame = !frame
      }, 250)
      // win.play()


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
    this.addUniqueAction = function(){

    }
  }

  function Thief(side, slot) {
    this.side = side
    this.slot = slot
    this.imagePrefix = "thief"
    this.hp = 250
    this.str = 40

    this.addUniqueAction = function(){
      if (this.opponent.potions > 0) {
        $('.action-menu').append('<div class = "menu-item steal">STEAL</div>')
        $('.steal').click(this.steal.bind(this))
      }
    }

    this.steal = function(){
      this.turnAction = this.stealItem
      this.endTurn()
    }

    this.stealItem = function() {
      player = this
      var adjust = this.side === 'l' ? "120px" : "-120px"
      this.walkForward()
      this.$slotID.promise().done(function(){
        player.setSprite("use")
        player.$damage.text("STOLE POTION!")
        player.$damage.css("opacity", "1.0")
        player.$damage.css("color","#00FF00")
        player.$damage.css("left","+=" + adjust)
        player.potions += 1
        player.opponent.potions -= 1
        player.$damage.animate({"top": "-=48px"},350)
                    .animate({"opacity": "0"})
                    .animate({"top": "+=48px"}, 0, function(){
                      player.$damage.css("color","#FFFFFF")
                      player.$damage.css("left","-=" + adjust)
                      player.walkBackward()
                      player.$slotID.promise().done(function(){
                        game.nextAction()
                      })
                    })
    })
  }
}

  Fighter.prototype = new Player()
  Thief.prototype = new Player()

//
// GAME OBJECT DECLARATION
//
  var game = {
    turn: 0,
    players: [new Thief("l",1), new Thief("r",1)],
    updateHPs: function() {
      for (var i=0; i < game.players.length; i++) {
        game.players[i].updateHP()
      }
    },
    nextTurn: function() {
      game.updateHPs()
      // console.log("before: " + this.turn)
      if (this.turn === this.players.length) {
        this.turn = 0
        this.nextAction()
      } else {
        this.players[this.turn].takeTurn()
        this.turn++
      }
      // console.log("after: " + this.turn);
    },
    nextAction: function(){
      game.updateHPs()
      // console.log((game.players[0].hp > 0) && (game.players[1].hp > 0))
      if ((game.players[0].hp > 0) && (game.players[1].hp > 0)){
        if (this.turn === this.players.length) {
          this.turn = 0
          this.nextTurn()
        } else {
          this.players[this.turn].turnAction()
          this.turn++
        }
      }
    },
    init: function(){
      game.updateHPs()

      for (var i = 0; i < this.players.length; i++){
        this.players[i].init()
        if (this.players[i].side === 'l') {
          this.players[i].setOpponent(this.players[1])
        } else {
          this.players[i].setOpponent(this.players[0])
        }
      }
    }
  }
game.init()

// })
