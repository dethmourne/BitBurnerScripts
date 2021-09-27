// Commit crimes automatically. Cancel a crime in progress to kill the script.

export async function main(ns) {
	if (ns.args[0]) { // checks for existence of argument, defaults to shoplifting
		var crime = ns.args[0]
	} else {
		var crime = "shoplift"
	}
	var crimeStats = ns.getCrimeStats(crime); // gets data on crime - notably, time to perform
	var crimeTime = crimeStats.time * .8; // sets our time to check if we're still criminals at 80% of crime duration
	var i = 0; // set a flag for breaking out of our loop

	while (i < 1) { // do crimes unless we've broken out of the loop
		while (ns.isBusy()) { // make sure we aren't busy when we attempt to do crimes
			await ns.sleep(100)
		}
		ns.commitCrime(crime);
		await ns.sleep(crimeTime);
		if (!ns.isBusy()) {
			i++
		}
	}
}