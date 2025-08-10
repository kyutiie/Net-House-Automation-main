// Test script to demonstrate success rate update functionality
// This is for demonstration purposes only

const { firestore, admin } = require('./config/firebase');

async function testUpdateCropSuccessRate() {
  try {
    console.log('=== Testing Success Rate Update Functionality ===');
    
    // Simulate crop data
    const cropName = 'Tomato';
    const testSuccessRates = [85, 70, 45, 90, 30]; // Different success rates to test
    
    console.log(`Testing with crop: ${cropName}`);
    console.log(`Test success rates: ${testSuccessRates.join(', ')}`);
    
    for (let i = 0; i < testSuccessRates.length; i++) {
      const successRate = testSuccessRates[i];
      console.log(`\n--- Test ${i + 1}: Success Rate ${successRate}% ---`);
      
      // Simulate the update function
      await simulateUpdateCropSuccessRate(cropName, successRate);
    }
    
    console.log('\n=== Test Complete ===');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

async function simulateUpdateCropSuccessRate(cropName, newSuccessRate) {
  try {
    console.log(`Updating success rate for crop: ${cropName} with new rate: ${newSuccessRate}%`);
    
    // Find the crop document by name
    const cropSnapshot = await firestore.collection('crops')
      .where('name', '==', cropName)
      .limit(1)
      .get();

    if (cropSnapshot.empty) {
      console.log(`Crop '${cropName}' not found in crops collection - skipping success rate update`);
      return;
    }

    const cropDoc = cropSnapshot.docs[0];
    const cropData = cropDoc.data();
    
    // Get current values or initialize if they don't exist
    const currentNumberPlanted = cropData.numberPlanted || 0;
    const currentNumberFailed = cropData.numberFailed || 0;
    const currentSuccessRate = cropData.successRate || 0;
    const currentTotalSuccessRate = cropData.totalSuccessRate || 0;
    const currentPlantingCount = cropData.plantingCount || 0;

    // Calculate new values
    const newNumberPlanted = currentNumberPlanted + 1;
    const newPlantingCount = currentPlantingCount + 1;
    
    // Determine if this was a successful harvest (success rate >= 50% is considered successful)
    const isSuccessful = newSuccessRate >= 50;
    const newNumberFailed = isSuccessful ? currentNumberFailed : currentNumberFailed + 1;
    
    // Calculate new average success rate
    const newTotalSuccessRate = currentTotalSuccessRate + newSuccessRate;
    const newAverageSuccessRate = Math.round((newTotalSuccessRate / newPlantingCount) * 100) / 100;

    console.log('Current crop data:', {
      numberPlanted: currentNumberPlanted,
      numberFailed: currentNumberFailed,
      successRate: currentSuccessRate,
      totalSuccessRate: currentTotalSuccessRate,
      plantingCount: currentPlantingCount
    });

    console.log('New calculated values:', {
      newNumberPlanted: newNumberPlanted,
      newNumberFailed: newNumberFailed,
      newSuccessRate: newAverageSuccessRate,
      newPlantingCount: newPlantingCount,
      harvestSuccessRate: newSuccessRate,
      isSuccessful: isSuccessful
    });

    // Note: In a real scenario, we would update the document here
    // For testing, we'll just log what would be updated
    console.log('Would update crop document with:', {
      numberPlanted: newNumberPlanted,
      numberFailed: newNumberFailed,
      successRate: newAverageSuccessRate,
      totalSuccessRate: newTotalSuccessRate,
      plantingCount: newPlantingCount,
      lastPlanted: 'current timestamp'
    });

  } catch (error) {
    console.error(`Error updating success rate for crop '${cropName}':`, error);
    throw error;
  }
}

// Example usage and explanation
console.log(`
=== Success Rate Update Functionality ===

This function updates the success rate statistics in the 'crops' collection 
when a user harvests or cancels a crop.

How it works:
1. When a user harvests a crop, the harvestSuccessRate is passed to this function
2. When a user cancels/fails a crop, a 0% success rate is used
3. The function finds the crop in the 'crops' collection by name
4. It updates the following fields:
   - numberPlanted: Incremented by 1
   - numberFailed: Incremented by 1 if success rate < 50%, otherwise unchanged
   - successRate: New average of all success rates
   - totalSuccessRate: Sum of all success rates
   - plantingCount: Total number of times this crop was planted
   - lastPlanted: Current timestamp

Example calculation:
- Current: numberPlanted=5, numberFailed=2, successRate=75%, totalSuccessRate=375, plantingCount=5
- New harvest: successRate=80%
- New values: numberPlanted=6, numberFailed=2, successRate=75.83%, totalSuccessRate=455, plantingCount=6

The function handles both successful harvests (>=50% success rate) and failed/cancelled crops (0% success rate).
`);

// Uncomment the line below to run the test
// testUpdateCropSuccessRate(); 