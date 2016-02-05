# How to Play

http://jonahhontos.github.io/project1/ - Play it here

- Use the mouse to select menu items
- This game is for 2 players (each player controlling 2 characters) or 4 players
- The game is ended when both characters on a side reach 0hp
- All character classes have two default actions available:
  - FIGHT - Do a physical attack based on the character's STR stat
    - Has a chance to crit (do extra damage) based on the character's Crit %
  - POTION - Heals the character for 100hp (2 uses)
- Some classes have unique actions

### Character Classes

 ![fighter_default](/assets/fighter_default.png)

##### Fighter

- Starting HP: 300
- STR: 50
- Crit rate: 4%

 ![thief_default](/assets/thief_default.png)

##### Thief

- Starting HP: 250
- STR: 40
- Crit rate: 40%
- Unique Action: STEAL
  - Steal one of an opponent's potions

 ![black_belt_default](/assets/black_belt_default.png)

##### Black Belt

- Starting HP: 400
- STR: 40
- Crit rate: 15%

 ![black_mage_default](/assets/black_mage_default.png)

##### Black Mage

- Starting HP: 200
- STR: 25
- MAG: 150
- Crit rate: 8%
- Unique action: FIRE (2 uses)
  - Does a special attack based on MAG

 ![white_mage_default](/assets/white_mage_default.png)

##### White Mage

- Starting HP: 200
- STR: 35
- MAG: 150
- Crit rate: 8%
- Unique action: HEAL (2 uses)
  - Heals a team member based on MAG

 ![red_mage_default](/assets/red_mage_default.png)

##### Red Mage

- Starting HP: 200
- STR: 40
- MAG: 100
- Crit rate: 5%
- Unique actions: FIRE (1 use) & HEAL (1 use)







# Wireframe

# ![wireframe](/assets/wireframe.png)

# User Stories

##### MVP:

As a player, I want to be able to select actions.

As a player, I want to be able to see the character I'm playing as.

As a player, I want to be able to see the status of my character and my opponent's character so that I can see how close I am to winning/losing.

##### Beyond MVP:

As a player, I want to be able to select a character class so that I can have control over my play style.

As a player, I want to be able to use my character class's special abilities.

## Organizing

- Character sprite naming
  - [class]_[state].png
    - [states]
      - default
      - walk
      - attack
      - use
      - hurt
      - ko

## *- From DD -*

***Objective***

Create a clone of the battle system from Final Fantasy I for NES adapted for two players.

***Tasks***

``` 
•	Display:
	⁃	Playing field
	⁃	Player characters
	⁃	HP/MP
	⁃	Basic menu
	⁃	Item/Magic menus
	⁃	Attack/Magic animations
•	Create objects
	⁃	Player{}
	⁃	Character{}
		⁃	HP
		⁃	MP
		⁃	STR
		⁃	AGI
		⁃	Items[]
		⁃	Spells[]
		⁃	Menu{}
			⁃	Attack()
			⁃	Item()
			⁃	(Magic())
			⁃	(Steal())
		⁃	(Class)
			⁃	Fighter
			⁃	(Black Mage)
			⁃	(White Mage)
			⁃	(Red Mage)
			⁃	(Thief)
            ⁃	(Bl. Belt)
  ⁃	(CharacterSelect{})
•	Add winner evaluation
•	Play sounds/music
```