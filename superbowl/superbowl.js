var fs = require('fs'); 
var Baby = require('babyparse'); 

var arr = [];
var bufferString;

// Hash to save the store display per branch
var displayBrand = {'Coke': 0, 'Pepsi': 0, 'Mtn Dew': 0, 'Bud Light': 0, 'Michelob Ultra': 0, 'Skittles': 0, 'Snickers': 0, 'Doritos': 0, 'Tostitos': 0};

// Hash of the index of every branch
var displayCol = {'Coke': [9, 12, 15, 18], 'Pepsi': [21, 24, 27, 30], 'Mtn Dew': [33, 36, 39, 42], 'Bud Light': [45, 48, 51, 54], 'Michelob Ultra': [57, 60, 63, 66], 'Skittles': [69, 71, 74, 77], 'Snickers': [80, 83, 86, 89], 'Doritos': [92, 95, 98, 101], 'Tostitos': [104, 107, 110, 113]};

var location = {}; // Same as displayBrand but it store all data automatically
var totalLocation = 0; // Used to calculate the %

// Read csv
fs.readFile('superbowl.csv', function(err, data){

	if(err){
		console.log(err);
	}

	// csv to string
	bufferString = data.toString();

	// Use babyparse to parse data into array
	arr = Baby.parse(bufferString).data;
	
	console.log("====================\nLOCATION % PER BRANCH\n====================\n");

	// Go through all branch YES and NO until it finds a YES and store it in the hash
	for(key in displayBrand){
		for(i=0; i<arr.length; i++){
			if(arr[i][displayCol[key][0]] === 'Yes' || arr[i][displayCol[key][1]] === 'Yes' || arr[i][displayCol[key][2]] === 'Yes' || arr[i][displayCol[key][3]] === 'Yes'){
				displayBrand[key]++;
			}
		}
	}

	// Display store % for each branch
	for(key in displayBrand){
		console.log(key + ": " + Math.round(displayBrand[key]/1199*100,2) + "%");
	}

	// Go through all locations row
	for(key in displayBrand){
		for(i=0; i<arr.length; i++){
			for(j=0; j<4; j++){
				if(arr[i][displayCol[key][j]] === 'Yes' && (arr[i][displayCol[key][j]+2].length > 1)){ // There's one empty cell, used this to omit it
					if(displayCol[key][j] === 69){ // There's one missing column for Skittles (display type), the location column is one index after
						if(location[arr[i][displayCol[key][j]+1]] === undefined){
							location[arr[i][displayCol[key][j]+1]] = 1;
						} else{
							location[arr[i][displayCol[key][j]+1]]++;
						}
					} else{
						if(location[arr[i][displayCol[key][j]+2]] === undefined){  
							location[arr[i][displayCol[key][j]+2]] = 1; // If location is not in hash, it store it
						} else{
							location[arr[i][displayCol[key][j]+2]]++; // else add one
						}
					}
					totalLocation++; // Get a total of location
				}
			}
		}
	}

	console.log("\n==============\n% PER LOCATION\n==============\n");

	// Display location %, not sure what exaclty point 2 wanted
	for(key in location){
		console.log(key + ": " + Math.round(location[key]/totalLocation*100) + "%");
	}

});