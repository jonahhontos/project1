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