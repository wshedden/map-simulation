# War Simulation Project - README

## Project Overview
This project simulates geopolitical interactions, focusing on war systems and their impact on relations and gameplay dynamics. The current focus is refining the war logic to ensure realistic mechanics, such as preventing diplomatic improvements between warring nations and redirecting efforts toward military actions. Factions are a future feature and not part of the immediate scope.

## Features Overview
- **War Declaration:** Countries can declare wars based on specific triggers and relations.
- **War Display:** Visual representation of ongoing wars and participants.
- **Turn-Based Actions:** During wartime, countries prioritize military actions over diplomatic ones.

## To-Do List

### Core Features
1. **War Logic Refinement**
   - [ ] Prevent countries at war from improving relations with each other.
   - [ ] Implement functionality where countries focus on increasing military strength during wartime.
   - [ ] Add conditions for ending wars (e.g., victory, peace treaties, or stalemates).
   - [ ] Ensure wars automatically end if one side is completely defeated.

2. **War Declaration System**
   - [ ] Fix bugs related to war declarations and participant tracking.
   - [ ] Add checks to ensure wars are not declared twice between the same countries.

3. **War Display**
   - [ ] Refine the visual display of ongoing wars to include:
     - Names of participants.
     - Current status (e.g., active, pending resolution).
     - Military strength of each side.

### Future Features
1. **Faction System**
   - [ ] Implement faction formation and mechanics once the war system is stable.
   - [ ] Add functionality for faction-based wars and alliances.

2. **Diplomacy and Alliances**
   - [ ] Develop a robust system for managing alliances and peace treaties.
   - [ ] Add diplomatic actions influenced by the war state (e.g., embargoes, trade deals).

### Stretch Goals
- **AI Logic Enhancements:** Improve decision-making for AI-controlled countries during wartime.
- **Resource Management:** Introduce economic or resource considerations to military strength and actions.

## How to Run
1. Clone this repository.
2. Install dependencies listed in `requirements.txt` (if applicable).
3. Run the main script to initiate the simulation.

## Contribution Guidelines
- Please make pull requests for new features or fixes.
- Follow the existing coding standards.
- Clearly document any new functionality added.

---

Feel free to suggest or expand on these todos if you have other ideas in mind!
