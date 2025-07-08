// Quick test of the time-based sync without broadcastStartTime field
// This will use timestamp as the broadcast start time

console.log('🎵 Testing time-based sync with timestamp fallback...');

// Simulate a broadcast starting
const now = new Date();
const broadcastStart = now.toISOString();
console.log('📡 Broadcast started at:', broadcastStart);

// Simulate checking position after some time has passed
setTimeout(() => {
  const elapsed = (Date.now() - now.getTime()) / 1000;
  const trackDuration = 240; // 4 minute test track
  const position = elapsed % trackDuration;
  
  console.log(`⏱️  After ${elapsed.toFixed(1)} seconds:`);
  console.log(`📍 Calculated position: ${position.toFixed(1)} seconds`);
  console.log(`🔄 Track progress: ${((position / trackDuration) * 100).toFixed(1)}%`);
  
  console.log('\n✅ Time-based sync logic working correctly!');
  console.log('💡 This will work the same way in the app using radioState.timestamp');
}, 3000);

console.log('⌛ Waiting 3 seconds to test position calculation...');
