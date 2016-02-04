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
prelude.play()

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
    $(this).hide()
    game.characterSelect()
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
      var mod = this.str
      if (Math.floor(Math.random() * 100) < this.critPercent) {
        mod *= 2
        this.opponent.$damage.css("color", "#FF0000")
      }
      var attackStrength = Math.floor((Math.random()*(mod/2)) + mod * 0.75)
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
                              player.opponent.$damage.css("color", "#FFFFFF")
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
      this.$damage.text(damageAmount > 0 ? damageAmount : "")
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
      $('#bg-image').append('<div id="win-message" class="window">' + side + ' Player Wins!</div>')
      // $('#win-message').text(side + " Player Wins!")
      player = this
      var frame = true
      window.setInterval(function(){
        player.setSprite(frame === false ? "default" : "use")
        frame = !frame
      }, 250)
      battle.pause()
      win.play()


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
    this.critPercent = 4

    this.addUniqueAction = function(){

    }
  }

  function Thief(side, slot) {
    this.side = side
    this.slot = slot
    this.imagePrefix = "thief"
    this.hp = 250
    this.str = 40
    this.critPercent = 40

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
        player.opponent.takeDamage(0)
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

function BlackBelt(side, slot) {
  this.side = side
  this.slot = slot
  this.imagePrefix = "black_belt"
  this.hp = 400
  this.str = 40
  this.critPercent = 15

  this.addUniqueAction = function(){

  }
}

function BlackMage(side, slot) {
  this.side = side
  this.slot = slot
  this.imagePrefix = "black_mage"
  this.hp = 200
  this.str = 25
  this.mag = 150
  this.mp = 2
  this.critPercent = 8

  this.addUniqueAction = function(){
    if (this.mp > 0) {
      $('.action-menu').append('<div class = "menu-item fire">FIRE x' + this.mp + '</div>')
      $('.fire').click(this.fire.bind(this))
    }
  }

  this.fire = function(){
    this.turnAction = this.castFire
    this.endTurn()
  }

  this.castFire = function() {
    player = this
    var attackStrength = Math.floor((Math.random()*(this.mag/2)) + this.mag * 0.75)
    this.$weaponSlot.css("background-image", "url('./assets/fireball.png')")
    this.walkForward()
    this.$slotID.promise().done(function(){
      player.mp--
      player.setSprite("use")
      player.$weaponSlot.show()
      player.$weaponSlot.animate({"left":"-=720px"}, 300, "linear", function(){
        player.$weaponSlot.hide()
        player.$weaponSlot.css("background-image", "url('./assets/"+player.imagePrefix+"_weapon.png')")
        player.$weaponSlot.css("left", "+=680px")
        player.opponent.takeDamage(attackStrength)
        player.walkBackward()
        player.$slotID.promise().done(function(){
          game.nextAction()
        })
      })
    })
  }
}

function WhiteMage(side, slot) {
  this.side = side
  this.slot = slot
  this.imagePrefix = "white_mage"
  this.hp = 200
  this.str = 35
  this.mag = 150
  this.mp = 3
  this.critPercent = 8

  this.addUniqueAction = function(){
    if (this.mp > 0) {
      $('.action-menu').append('<div class = "menu-item heal">HEAL x' + this.mp + '</div>')
      $('.heal').click(this.heal.bind(this))
    }
  }

  this.heal = function(){
    this.turnAction = this.castHeal
    this.endTurn()
  }

  this.castHeal = function(){
    player = this
    var healStrength = Math.floor((Math.random()*(this.mag/2)) + this.mag * 0.75)
    var adjust = this.side === 'l' ? "120px" : "-120px"
    this.mp--
    this.walkForward()
    this.$slotID.promise().done(function(){
      player.setSprite("use")
      player.$damage.css("opacity", "1.0")
      player.$damage.css("color","#00FF00")
      player.$damage.css("left","+=" + adjust)
      player.$damage.text(healStrength)
      player.hp += healStrength
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

function RedMage(side, slot) {
  this.side = side
  this.slot = slot
  this.imagePrefix = "red_mage"
  this.hp = 200
  this.str = 40
  this.mag = 100
  this.mp = 2
  this.critPercent = 5

  this.addUniqueAction = function(){
    if (this.mp > 0) {
      $('.action-menu').append('<div class = "menu-item fire">FIRE x' + this.mp + '</div>')
      $('.fire').click(this.fire.bind(this))
      $('.action-menu').append('<div class = "menu-item heal">HEAL x' + this.mp + '</div>')
      $('.heal').click(this.heal.bind(this))
    }
  }

  this.fire = function(){
    this.turnAction = this.castFire
    this.endTurn()
  }

  this.castFire = function() {
    player = this
    var attackStrength = Math.floor((Math.random()*(this.mag/2)) + this.mag * 0.75)
    this.$weaponSlot.css("background-image", "url('./assets/fireball.png')")
    this.walkForward()
    this.$slotID.promise().done(function(){
      player.mp--
      player.setSprite("use")
      player.$weaponSlot.show()
      player.$weaponSlot.animate({"left":"-=720px"}, 300, "linear", function(){
        player.$weaponSlot.hide()
        player.$weaponSlot.css("background-image", "url('./assets/"+player.imagePrefix+"_weapon.png')")
        player.$weaponSlot.css("left", "+=680px")
        player.opponent.takeDamage(attackStrength)
        player.walkBackward()
        player.$slotID.promise().done(function(){
          game.nextAction()
        })
      })
    })
  }

  this.heal = function(){
    this.turnAction = this.castHeal
    this.endTurn()
  }

  this.castHeal = function(){
    player = this
    var healStrength = Math.floor((Math.random()*(this.mag/2)) + this.mag * 0.75)
    var adjust = this.side === 'l' ? "120px" : "-120px"
    this.mp--
    this.walkForward()
    this.$slotID.promise().done(function(){
      player.setSprite("use")
      player.$damage.css("opacity", "1.0")
      player.$damage.css("color","#00FF00")
      player.$damage.css("left","+=" + adjust)
      player.$damage.text(healStrength)
      player.hp += healStrength
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
  BlackBelt.prototype = new Player()
  BlackMage.prototype = new Player()
  WhiteMage.prototype = new Player()
  RedMage.prototype = new Player()

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
      for (var i = 0; i < game.players.length; i++){
        game.players[i].init()
        if (game.players[i].side === 'l') {
          game.players[i].setOpponent(game.players[1])
        } else {
          game.players[i].setOpponent(game.players[0])
        }
      }
      prelude.pause()
      battle.play()
      game.nextTurn()
    },
    characterSelect: function(){
      $('#bg-image').append('<div class="window" id="character-select">Player ' + (game.turn+1) + ' - Select a Class<br><img src="assets/fighter_default.png" class="menu-item fighter"><img src="assets/thief_default.png" class="menu-item thief"><img src="assets/black_belt_default.png" class="menu-item black-belt"><br><img src="assets/black_mage_default.png" class="menu-item black-mage"><img src="assets/white_mage_default.png" class="menu-item white-mage"><img src="assets/red_mage_default.png" class="menu-item red-mage"></div>')
      $('.fighter').click(game.pickFighter)
      $('.thief').click(game.pickThief)
      $('.black-belt').click(game.pickBlackBelt)
      $('.black-mage').click(game.pickBlackMage)
      $('.white-mage').click(game.pickWhiteMage)
      $('.red-mage').click(game.pickRedMage)
    },
    pickFighter: function(){
      $('#character-select').remove()
      var side = game.turn === 0 ? 'l' : 'r'
      game.players[game.turn] = new Fighter(side,1)
      if (game.turn===0) {
        game.turn++
        game.characterSelect()
      } else {
        game.turn = 0
        game.init()
      }
    },
    pickThief: function(){
      $('#character-select').remove()
      var side = game.turn === 0 ? 'l' : 'r'
      game.players[game.turn] = new Thief(side,1)
      if (game.turn===0) {
        game.turn++
        game.characterSelect()
      } else {
        game.turn = 0
        game.init()
      }
    },
    pickBlackBelt: function(){
      $('#character-select').remove()
      var side = game.turn === 0 ? 'l' : 'r'
      game.players[game.turn] = new BlackBelt(side,1)
      if (game.turn===0) {
        game.turn++
        game.characterSelect()
      } else {
        game.turn = 0
        game.init()
      }
    },
    pickBlackMage: function(){
      $('#character-select').remove()
      var side = game.turn === 0 ? 'l' : 'r'
      game.players[game.turn] = new BlackMage(side,1)
      if (game.turn===0) {
        game.turn++
        game.characterSelect()
      } else {
        game.turn = 0
        game.init()
      }
    },
    pickWhiteMage: function(){
      $('#character-select').remove()
      var side = game.turn === 0 ? 'l' : 'r'
      game.players[game.turn] = new WhiteMage(side,1)
      if (game.turn===0) {
        game.turn++
        game.characterSelect()
      } else {
        game.turn = 0
        game.init()
      }
    },
    pickRedMage: function(){
      $('#character-select').remove()
      var side = game.turn === 0 ? 'l' : 'r'
      game.players[game.turn] = new RedMage(side,1)
      if (game.turn===0) {
        game.turn++
        game.characterSelect()
      } else {
        game.turn = 0
        game.init()
      }
    }
  }
// game.init()

// })
