// get the submit button
let calculateButton = document.querySelector("#calculateButton");

// get the input from the values
let targT = document.querySelectorAll(".inputField")[0];
let targSv = document.querySelectorAll(".inputField")[1];
let targFNP = document.querySelectorAll(".inputField")[2];
let targINV = document.querySelectorAll(".inputField")[3];
let targReRoll = document.querySelectorAll(".inputField")[4];

let atkWS = document.querySelectorAll(".inputField")[5];
let atkS = document.querySelectorAll(".inputField")[6];
let atkAtks = document.querySelectorAll(".inputField")[7];
let atkAP = document.querySelectorAll(".inputField")[8];

let toHit1 = document.querySelectorAll(".inputField")[9];
let toHit2 = document.querySelectorAll(".inputField")[10];
let toHit3 = document.querySelectorAll(".inputField")[11];
let toHit4 = document.querySelectorAll(".inputField")[12];
let toHit5 = document.querySelectorAll(".inputField")[13];
let toHitAll = document.querySelectorAll(".inputField")[14];

let toWound1 = document.querySelectorAll(".inputField")[15];
let toWound2 = document.querySelectorAll(".inputField")[16];
let toWound3 = document.querySelectorAll(".inputField")[17];
let toWound4 = document.querySelectorAll(".inputField")[18];
let toWound5 = document.querySelectorAll(".inputField")[19];
let toWoundAll = document.querySelectorAll(".inputField")[20];

let hitsField = document.querySelectorAll(".results")[0];
let woundsField = document.querySelectorAll(".results")[1];
let unsavedWoundsField = document.querySelectorAll(".results")[2];

let rerolledHitsField = document.querySelectorAll(".results")[3];
let rerolledWoundsField = document.querySelectorAll(".results")[4];
let rerolledSavesField = document.querySelectorAll(".results")[5];

let autoHit = document.querySelectorAll(".inputField")[21];

let simType = document.querySelector(".simType");

let diceLocations = document.querySelectorAll(".diceLocation"); // should give us the three paragraph tags

calculateButton.onclick = (e) =>
{
	// clicking the submit button will run the correct function based on which option the user selected. It also clears the dice image field so it can be re-populated by the run

	// remove the dice images from the last run
	removeAllDice();
	
	if(simType.checked)
		calculateOneResult();
	else
		calculateAverage();
}

function calculateAverage()
{	
	// calculates an average generated from running the combat scenario function 5000 times and averaging out the results. does NOT generate dice images

	// create a 6 element array to hold the calculate result function's return
	let averageArray = [0,0,0,0,0,0];
	// create a total runs variable to count how many times the for loop runs so I can easily just change how many times it runs in the future
	let totalRuns = 0;
	
	for(let i = 1; i < 5000; i++)
	{
		// run calculate result and put it in my array
		let currentResultsArray = calculateResult(false); // passes in false so it does NOT generate dice images
		// incriment the amount of total runs
		totalRuns += 1;
		
		// add the current run to the average array
		averageArray = [Number(averageArray[0]) + Number(currentResultsArray[0]), averageArray[1] + currentResultsArray[1], averageArray[2] + currentResultsArray[2], averageArray[3] + currentResultsArray[3], averageArray[4] + currentResultsArray[4], averageArray[5] + currentResultsArray[5]];
	}
	
	// divide the sum of every run by the total amount of runs to get an average
	averageArray = [averageArray[0] / totalRuns,averageArray[1] / totalRuns,averageArray[2] / totalRuns,averageArray[3] / totalRuns,averageArray[4] / totalRuns,averageArray[5] / totalRuns];
	
	// round the average results
	averageArray[0] = Number(Math.round(averageArray[0]+'e1')+'e-1');
	averageArray[1] = Number(Math.round(averageArray[1]+'e1')+'e-1');
	averageArray[2] = Number(Math.round(averageArray[2]+'e1')+'e-1');
	averageArray[3] = Number(Math.round(averageArray[3]+'e1')+'e-1');
	averageArray[4] = Number(Math.round(averageArray[4]+'e1')+'e-1');
	averageArray[5] = Number(Math.round(averageArray[5]+'e1')+'e-1');
	
	// display the results
	hitsField.innerHTML = "Total Average Hits: " + averageArray[0];
	woundsField.innerHTML = "Total Average Wounds: " + averageArray[1];
	unsavedWoundsField.innerHTML = "Total  Average Unsaved Wounds: " + averageArray[2];
	
	
	if(averageArray[3] != 0)
	rerolledHitsField.innerHTML = averageArray[3] + " hits generated from rerolls";
	else
	rerolledHitsField.innerHTML = "";
	
	if(averageArray[4] != 0)
	rerolledWoundsField.innerHTML = averageArray[4] + " wounds generated from rerolls";
	else
	rerolledWoundsField.innerHTML = "";
	
	if(averageArray[5] != 0)
	rerolledSavesField.innerHTML = averageArray[5] + " wounds saved from rerolls";
	rerolledSavesField.innerHTML = "";
}

function calculateOneResult()
{	
	// calculates on single combat scenario and prints it out to the results HTML section along with images of the dice rolled during the simulation

	let resultsArray = calculateResult(true);

	// display results
	hitsField.innerHTML = "Total Hits: " + resultsArray[0];
	woundsField.innerHTML = "Total Wounds: " + resultsArray[1];
	unsavedWoundsField.innerHTML = "Total Unsaved Wounds: " + resultsArray[2];
	
	
	if(resultsArray[3] != 0)
	rerolledHitsField.innerHTML = resultsArray[3] + " hits generated from rerolls";
	else
	rerolledHitsField.innerHTML = "";
	
	if(resultsArray[4] != 0)
	rerolledWoundsField.innerHTML = resultsArray[4] + " wounds generated from rerolls";
	else
	rerolledWoundsField.innerHTML = "";
	
	if(resultsArray[5] != 0)
	rerolledSavesField.innerHTML = resultsArray[5] + " wounds saved from rerolls";
	else
	rerolledSavesField.innerHTML = "";
}

function calculateResult(img)
{
	// calculates an entire combat scenario in warhammer 40k based on the info the user entered in
	// the function takes a boolean named img to determine whether it should generate dice images for each roll
	// since we don't want to generate 5000+ images for the average function
	// this function is called by both the average and one time calculations, and was created to simplify the code and to avoid repeating the same code

	let totalHits = 0;
	let totalWounds = 0;
	let totalUnsavedWounds = 0;
	let reRolledHits = 0;
	let reRolledWounds = 0;
	let reRolledSaves = 0;

	
	let numAtks = 0;
	
	// change the number of attacks if the user entered d3 or d6
	if(atkAtks.value == "d3" || atkAtks.value == "D3")
	{
		numAtks = rolledValue = Math.floor(Math.random() * 3) + 1;
	}
	else if(atkAtks.value == "d6" || atkAtks.value == "D6")
	{
		numAtks = rollD6();
	}
	else
	{
		numAtks = atkAtks.value;
	}
	
	// if the weapon does NOT auto hit
	if(!autoHit.checked)
	{
		// Check to see if the attack hit for every attack
		for(let i = 0; i < numAtks; i++)
		{
			// does the attack hit?
			let currentRoll = rollD6();
			
			// add the dice rolled image to the html if we passed in true
			if(img)
				addDice(currentRoll, "hit");
			
			// the roll succeeds if it is equal or greater than the skill
			if(currentRoll >= atkWS.value)
			{
				totalHits += 1; // increase the number of hits
			}
			else // shot missed. Check to see if we need to re-roll the value
			{
				if(toHitAll.checked)
				{
					currentRoll = rollD6();
					if(currentRoll >= atkWS.value)
					{
						totalHits += 1;
						reRolledHits += 1; // there was a hit generated by re-rolling
					}
				}
				else if(currentRoll == 1 && toHit1.checked)
				{
					currentRoll = rollD6();
					if(currentRoll >= atkWS.value)
					{
						totalHits += 1;
						reRolledHits += 1; // there was a hit generated by re-rolling
					}
				}
				else if(currentRoll == 2 && toHit2.checked)
				{
					currentRoll = rollD6();
					if(currentRoll >= atkWS.value)
					{
						totalHits += 1;
						reRolledHits += 1; // there was a hit generated by re-rolling
					}
				}
				else if(currentRoll == 3 && toHit3.checked)
				{
					currentRoll = rollD6();
					if(currentRoll >= atkWS.value)
					{
						totalHits += 1;
						reRolledHits += 1; // there was a hit generated by re-rolling
					}
				}
				else if(currentRoll == 4 && toHit4.checked)
				{
					currentRoll = rollD6();
					if(currentRoll >= atkWS.value)
					{
						totalHits += 1;
						reRolledHits += 1; // there was a hit generated by re-rolling
					}
				}
				else if(currentRoll == 5 && toHit5.checked)
				{
					currentRoll = rollD6();
					if(currentRoll >= atkWS.value)
					{
						totalHits += 1;
						reRolledHits += 1; // there was a hit generated by re-rolling
					}
				}
			}
		}
	}
	else // otherwise the weapon DOES autohit
	{
		totalHits = numAtks;
	}
	
	if(totalHits == 0)
	{
		// If the attacker missed every shot, we are done
		let resultsArray = [totalHits, totalWounds, totalUnsavedWounds, reRolledHits, reRolledWounds, reRolledSaves];
		return resultsArray;
	}
	
	// if not then let's loop through each hit and see if it wounds
	for(let i = 0; i < totalHits; i++)
	{
		// does the attack wound?
		let currentRoll = rollD6();
		let numberToBeat = 0;
		
		
		// add the dice roll to the images of wounds if image is true
		if(img)
				addDice(currentRoll, "wound");
			
		
		if(targT.value == atkS.value) // if the strength and toughness are equal we wound on 4s
			numbertoBeat = 4;
		else if(targT.value > atkS.value) // Toughness is greater than strength
		{
			if(targT.value >= atkS.value*2) // if Toughness is twice as high as strength, wound on 6s
				numbertoBeat = 6;
			else
				numbertoBeat = 5; // if it isn't quite twice but is higher, wound on 5s
		}
		else if(targT.value < atkS.value)
		{
			if(targT.value*2 <= atkS.value) // if Strength is twice as high as toughness, wound on 2s
				numbertoBeat = 2;
			else
				numbertoBeat = 3; // if it isn't quite twice but is higher, wound on 3s
		}
		
		if(currentRoll >= numbertoBeat)
		{
			totalWounds += 1;
		}
		else // wound failed. Check to see if we need to re-roll the value
		{
			if(toWoundAll.checked)
			{
				currentRoll = rollD6();
				if(currentRoll >= numbertoBeat)
				{
					totalWounds += 1;
					reRolledWounds += 1; // there was a hit generated by re-rolling
				}
			}
			else if(currentRoll == 1 && toWound1.checked)
			{
				currentRoll = rollD6();
				if(currentRoll >= numbertoBeat)
				{
					totalWounds += 1;
					reRolledWounds += 1; // there was a hit generated by re-rolling
				}
			}
			else if(currentRoll == 2 && toWound2.checked)
            {
				currentRoll = rollD6();
				if(currentRoll >= numbertoBeat)
				{
					totalWounds += 1;
					reRolledWounds += 1; // there was a hit generated by re-rolling
				}
			}
			else if(currentRoll == 3 && toWound3.checked)
            {
				currentRoll = rollD6();
				if(currentRoll >= numbertoBeat)
				{
					totalWounds += 1;
					reRolledWounds += 1; // there was a hit generated by re-rolling
				}
			}
			else if(currentRoll == 4 && toWound4.checked)
            {
				currentRoll = rollD6();
				if(currentRoll >= numbertoBeat)
				{
					totalWounds += 1;
					reRolledWounds += 1; // there was a hit generated by re-rolling
				}
			}
			else if(currentRoll == 5 && toWound5.checked)
			{
				currentRoll = rollD6();
				if(currentRoll >= numbertoBeat)
				{
					totalWounds += 1;
					reRolledWounds += 1; // there was a hit generated by re-rolling
				}
			}
		}
	}
	
	if(totalWounds == 0)
	{
		// if the attacker failed to wound every single hit, we are done
		let resultsArray = [totalHits, totalWounds, totalUnsavedWounds, reRolledHits, reRolledWounds, reRolledSaves];
		return resultsArray;
	}
	
	// if not, then let's loop through each wound and see if it is saved by the defender's armor
	for(i=0; i < totalWounds; i++)
	{
		let armorSave = Number(targSv.value);
		let apValue = Number(atkAP.value);
		let invulnValue = Number(targINV.value);
		
		// calculate the defender's armor save
		armorSave += apValue; // add the AP to the target's save
		let currentRoll = rollD6();
		
		// add the current roll to the images of saves if img is true
		if(img)
				addDice(currentRoll, "save");
		
		if(armorSave > invulnValue.value && invulnValue.value != 0) // if the target's invuln is lower (better) than the armor save, use it instead
			armorSave = invulnValue;
		
		if(currentRoll < armorSave) // if the current roll is greater than or equal to the armor save modifier, the wound is saved. If it's less, the wound is unsaved
		{
			totalUnsavedWounds += 1;
			
			if(targReRoll.checked)
			{
				let currentRoll = rollD6();
				
				if(currentRoll >= armorSave) // if the rerolled value is equal to or greater than the armor save value, then the wound is now saved instead of being unsaved
				{
					totalUnsavedWounds -= 1;
					reRolledSaves += 1;
				}
			}
		}
	}
	
	// make an array with the final info
	let resultsArray = [totalHits, totalWounds, totalUnsavedWounds, reRolledHits, reRolledWounds, reRolledSaves];
	return resultsArray;
}

function rollD6()
{
	// just a simple method that returns a random number from 1 to 6. I could just do this in one line but this saves a lot of space
	
	let rolledValue = Math.floor(Math.random() * 6) + 1;
	return rolledValue;
}

function addDice(number, location)
{
	// adds a dice image to the correct location in the html based on whatever number
	// is passed in (which will be one of the actual numbers rolled from the program)
	
	let newDiceImage = document.createElement("img");
	newDiceImage.setAttribute("src", "images/d" + number + ".jpg"); // get's the dice image with the correct number
	newDiceImage.setAttribute("alt", number + " "); // in case something went wrong just add the number that was rolled in text (with a space for formatting)
	
	if(location == "hit")
	{
		diceLocations[0].appendChild(newDiceImage);
	}
	else if(location == "wound")
	{
		diceLocations[1].appendChild(newDiceImage);
	}
	else if(location == "save")
	{
		diceLocations[2].appendChild(newDiceImage);
	}
}

function removeAllDice()
{
	//resets the dice images in html
	
	for(let i = 0; i < 3; i++)
	{
		diceLocations[i].innerHTML = '';
	}
}