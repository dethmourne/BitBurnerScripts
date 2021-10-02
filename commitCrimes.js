// Commit crimes automatically. Cancel a crime in progress to break out of the loop.

const crimeList = [
	"shoplift",
	"rob store",
	"mug",
	"larceny",
	"deal drugs",
	"bond forgery",
	"traffick arms",
	"homicide",
	"grand theft auto",
	"kidnap",
	"assassinate",
	"heist"
]

export async function main(ns) {
	while (true) {
		var c = 0;
		var value = 0;
		for (let i = 0; i < crimeList.length; i++) {
			var chance = ns.getCrimeChance(crimeList[i]);
			var stats = ns.getCrimeStats(crimeList[i]);
			var newvalue = ((chance * stats.money) / stats.time);
			if (newvalue > value) {
				var value = newvalue;
				if (i > 0) {
					c++
				}
			}
		}
		var stats = ns.getCrimeStats(crimeList[c]);
		ns.commitCrime(crimeList[c]);
		await ns.sleep(stats.time * .75);
		if (!ns.isBusy()) {
			ns.scriptKill("commitCrimes.js", "home")
		}
		while (ns.isBusy()) {
			await ns.sleep(50)
		}
	}
}