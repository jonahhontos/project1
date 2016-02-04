// $(document).ready(function() {
// $('body').on("mouseover", function(){console.log(event.target);})
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
var select = document.createElement('audio')
select.setAttribute('src','assets/select.wav')
var slash = document.createElement('audio')
slash.setAttribute('src','assets/slash.wav')
var fire = document.createElement('audio')
fire.setAttribute('src','assets/fire.wav')
var heal = document.createElement('audio')
heal.setAttribute('src','assets/heal.wav')
var potion = document.createElement('audio')
potion.setAttribute('src','assets/potion.wav')
var steal = document.createElement('audio')
steal.setAttribute('src','assets/steal.wav')


prelude.play()

  $('body').on("mouseover",".menu-item",function(){
    $(this).toggleClass("menu-item-hover")
    // console.log("mouseover on " + this)
  })
  $('body').on("mouseout",".menu-item",function(){
    $(this).toggleClass("menu-item-hover")
    // console.log("mouseout on " + this)
  })
  $('body').on("mousedown",".menu-item",function(){
    select.load()
    select.play()
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
      this.$hp = $('#hp-' + this.side + "-" + this.slot)
      this.$slotID.css("background-image", "url('./assets/" + this.imagePrefix + "_sheet.png')")
      this.setSprite()
      this.$slotID.append('<img src="assets/cursor.png" class="cursor">')
      this.$cursor = this.$slotID.children('.cursor')
      this.$cursor.hide()
      this.walkForwardDirection = this.side === "l" ? "+=20px" : "-=20px"
      this.walkBackwardDirection = this.side === "l" ? "-=20px" : "+=20px"
    }

    this.setOpponent = function(opponent) {
      console.log(opponent);
      this.opponent = opponent
    }

    this.setSprite = function(state) {
      if (state===undefined){state="default"}
      switch (state) {
        case "default":
          this.$slotID.css("background-position","0 0")
          break
        case "walk":
          this.$slotID.css("background-position","-72px 0")
          break
        case "attack":
          this.$slotID.css("background-position","-144px 0")
          break
        case "use":
          this.$slotID.css("background-position","-216px 0")
          break
        case "hurt":
          this.$slotID.css("background-position","-288px 0")
          break
        case "ko":
          this.$slotID.css("background-image", "url('./assets/" + this.imagePrefix + "_ko.png')")
          this.$slotID.css("width", "104px")
        default:
          this.$slotID.css("background-position","0 0")
          break
      }
      // console.log("sprite set to " + state)
      // this.$slotID.css("background-image", "url('./assets/" + this.imagePrefix + "_" + state + ".png')")
      // console.log("url('./assets/" + this.imagePrefix + "_" + state + ".png')")
    }

    this.updateHP = function() {
      if (this.hp <= 0) {
        this.$hp.css("color", "#FF0000")
        this.$hp.text("K.O.")
        this.setSprite("ko")
        this.opponent.win()
      } else {
        if (this.hp < (this.initialHP / 3)) {
          this.setSprite("hurt")
          this.$hp.css("color", "#FFFF00")
        } else {
          this.$hp.css("color", "#FFFFFF")
        }
        this.$hp.text(this.hp+"hp")
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

    this.getOpponent = function(){
      player = this
      var side = this.side
      if (this.turnAction === this.castHeal){
        if (this.side === 'l') {
          side = 'r'
        } else {
          side = 'l'
        }
      }

      if (side === 'l'){
        var $targets = $('#r-slot-1,#r-slot-2')
      } else {
        var $targets = $('#l-slot-1,#l-slot-2')
      }
      $targets.css("z-index", 15)
      $targets.on("mouseover", function(){
        $(this).children('.cursor').show()
      })
      $targets.on("mouseout", function(){
        $(this).children('.cursor').hide()
      })
      $targets.on("click", function(){
        select.play()
        $targets.css("z-index", 5)
        $(this).children('.cursor').hide()
        $targets.off("mouseover")
        $targets.off("mouseout")
        $targets.off("click")
        switch(event.target.id){
          case "l-slot-1":
            player.setOpponent(game.players[0])
            break
          case "r-slot-1":
            player.setOpponent(game.players[1])
            break
          case "l-slot-2":
            player.setOpponent(game.players[2])
            break
          case "r-slot-2":
            player.setOpponent(game.players[3])
            break
        }
        player.endTurn()
      })
    }

    this.takeTurn = function() {
      this.walkForward()
      this.getAction()
    }

    this.fight = function() {
      $('.action-menu').remove()
      this.turnAction = this.attack
      this.getOpponent()
      // this.endTurn()
    }

    this.potion = function() {
      $('.action-menu').remove()
      this.turnAction = this.usePotion
      this.endTurn()
    }

    this.endTurn = function() {
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
        slash.play()
        player.$weaponSlot.animate({"top": "+=16px","right":"+=16px"}, speed)
                          .animate({"top": "-=16px","right":"-=16px"}, speed/2,function(){
                            slash.load()
                            slash.play()
                          })
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
        potion.play()
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
      battle.load()
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
      var potsToSteal = false
      if (this.side === 'l') {
        potsToSteal = (game.players[1].potions > 0) || (game.players[3].potions > 0)
      } else {
        potsToSteal = (game.players[0].potions > 0) || (game.players[2].potions > 0)
      }
      if (potsToSteal) {
        $('.action-menu').append('<div class = "menu-item steal">STEAL</div>')
        $('.steal').click(this.steal.bind(this))
      }
    }

    this.steal = function(){
      $('.action-menu').remove()
      this.turnAction = this.stealItem
      this.getOpponent()
    }

    this.stealItem = function() {
      player = this
      var adjust = this.side === 'l' ? "120px" : "-120px"
      this.walkForward()
      this.$slotID.promise().done(function(){
        player.setSprite("use")
        player.opponent.takeDamage(0)
        player.$damage.css("width", "350px")
        if (player.opponent.potions > 0){
          player.$damage.text("STOLE POTION!")
          player.potions += 1
          player.opponent.potions -= 1
        } else {
          player.$damage.text("COULDN'T STEAL!")
        }
        player.$damage.css("opacity", "1.0")
        player.$damage.css("color","#00FF00")
        player.$damage.css("left","+=" + adjust)
        steal.play()
        player.$damage.animate({"top": "-=48px"},350)
                    .animate({"opacity": "0"})
                    .animate({"top": "+=48px"}, 0, function(){
                      player.$damage.css("color","#FFFFFF")
                      player.$damage.css("left","-=" + adjust)
                      player.$damage.text("")
                      player.$damage.css("width", "64px")
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

  this.fire = pickFire

  this.castFire = castFire
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

  this.heal = pickHeal

  this.castHeal = castHeal
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

  this.fire = pickFire

  this.castFire = castFire

  this.heal = pickHeal

  this.castHeal = castHeal
}

function pickFire(){
  $('.action-menu').remove()
  this.turnAction = this.castFire
  this.getOpponent()
}

function castFire(){
  player = this
  var attackStrength = Math.floor((Math.random()*(this.mag/2)) + this.mag * 0.75)
  this.$weaponSlot.css("background-image", "url('./assets/fireball.png')")
  this.walkForward()
  this.$slotID.promise().done(function(){
    player.mp--
    player.setSprite("use")
    player.$weaponSlot.show()
    fire.play()
    player.$weaponSlot.animate({"left":"-=720px"}, 300, "linear", function(){
      player.$weaponSlot.hide()
      player.$weaponSlot.css("background-image", "url('./assets/"+player.imagePrefix+"_weapon.png')")
      player.$weaponSlot.css("left", "")
      // player.$weaponSlot.css("right", "42px")
      player.opponent.takeDamage(attackStrength)
      player.walkBackward()
      player.$slotID.promise().done(function(){
        game.nextAction()
      })
    })
  })
}

function pickHeal(){
  $('.action-menu').remove()
  this.turnAction = this.castHeal
  this.getOpponent()
}

function castHeal(){
  player = this
  var healStrength = Math.floor((Math.random()*(this.mag/2)) + this.mag * 0.75)
  var adjust = this.side === 'l' ? "120px" : "-120px"
  this.mp--
  this.walkForward()
  this.$slotID.promise().done(function(){
    heal.play()
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
    players: [],
    updateHPs: function() {
      for (var i=0; i < game.players.length; i++) {
        game.players[i].updateHP()
      }
    },
    nextTurn: function() {
      game.updateHPs()
      // console.log("turn" + game.turn);
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
      if (((game.players[0].hp > 0) && (game.players[2].hp > 0)) && (game.players[1].hp > 0) && (game.players[3].hp > 0)){
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
      for (var i = 0; i < game.players.length; i++){
        game.players[i].init()
        // if (game.players[i].side === 'l') {
        //   game.players[i].setOpponent(game.players[1])
        // } else {
        //   game.players[i].setOpponent(game.players[0])
        // }
      }
      prelude.load()
      battle.play()
      game.nextTurn()
    },
    characterSelect: function(){
      console.log("turn " + game.turn);
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
      game.players[game.turn] = new Fighter(game.getSide(),game.getSlot())
      game.nextCharacter()
    },
    pickThief: function(){
      $('#character-select').remove()
      game.players[game.turn] = new Thief(game.getSide(),game.getSlot())
      game.nextCharacter()
    },
    pickBlackBelt: function(){
      $('#character-select').remove()
      game.players[game.turn] = new BlackBelt(game.getSide(),game.getSlot())
      game.nextCharacter()
    },
    pickBlackMage: function(){
      $('#character-select').remove()
      game.players[game.turn] = new BlackMage(game.getSide(),game.getSlot())
      game.nextCharacter()
    },
    pickWhiteMage: function(){
      $('#character-select').remove()
      game.players[game.turn] = new WhiteMage(game.getSide(),game.getSlot())
      game.nextCharacter()
    },
    pickRedMage: function(){
      $('#character-select').remove()
      game.players[game.turn] = new RedMage(game.getSide(),game.getSlot())
      game.nextCharacter()
    },
    getSide: function(){
      return (game.turn === 0 || game.turn === 2) ? 'l' : 'r'
    },
    getSlot: function(){
      return (game.turn === 0 || game.turn === 1) ? 1 : 2
    },
    nextCharacter: function(){
      // console.log(game.players[game.turn]);
      if (game.turn < 3) {
        game.turn++
        game.characterSelect()
      } else {
        game.turn = 0
        game.init()
      }
    }
  }
