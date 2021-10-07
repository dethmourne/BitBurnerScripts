// Commit crimes automatically. Cancel a crime in progress to break out of the loop.

export const crimeDefs = [
  { name: 'Shoplift',              time: 2,   money: 15e3,     xp: [0, 0, 0, 1, 1, 0] },
  { name: 'Rob store',             time: 60,  money: 400e3,    xp: [30, 0, 0, 45, 45, 0] },
  { name: 'Mug someone',           time: 4,   money: 36e3,     xp: [0, 3, 3, 3, 3, 0] },
  { name: 'Larceny',               time: 90,  money: 800e3,    xp: [45, 0, 0, 60, 60, 0] },
  { name: 'Deal Drugs',            time: 10,  money: 120e3,    xp: [0, 0, 0, 5, 5, 10] },
  { name: 'Bond Forgery',          time: 300, money: 4500e3,   xp: [100, 0, 0, 150, 0, 15] },
  { name: 'Traffick illegal Arms', time: 40,  money: 600e3,    xp: [0, 20, 20, 20, 20, 40] },
  { name: 'Homicide',              time: 3,   money: 45e3,     xp: [0, 2, 2, 2, 2, 0] },
  { name: 'Grand theft Auto',      time: 80,  money: 1600e3,   xp: [0, 20, 20, 20, 80, 40] },
  { name: 'Kidnap and Ransom',     time: 120, money: 3600e3,   xp: [0, 80, 80, 80, 80, 80] },
  { name: 'Assassinate',           time: 300, money: 12000e3,  xp: [0, 300, 300, 300, 300, 0] },
  { name: 'Heist',                 time: 600, money: 120000e3, xp: [450, 450, 450, 450, 450, 450] }
]

const xpValue = (crime, xp) => xp * (3 * crime.chance + 1) / (2 * crime.time)
const valueFns = {
  money: crime => crime.money / crime.time * crime.chance,
  hacking: crime => xpValue(crime, crime.xp[0]),
  strength: crime => xpValue(crime, crime.xp[1]),
  defense: crime => xpValue(crime, crime.xp[2]),
  dexterity: crime => xpValue(crime, crime.xp[3]),
  agility: crime => xpValue(crime, crime.xp[4]),
  charisma: crime => xpValue(crime, crime.xp[5]),
  combat: crime => xpValue(crime, crime.xp.slice(1, 5).reduce((p, c) => p + c)),
  xp: crime => xpValue(crime, crime.xp.reduce((p, c) => p + c))
}
export async function main(ns) {
	while (true) {
		var c = 0;
		var value = 0;
		for (let i = 0; i < crimeDefs.length; i++) {
			let crime = crimeDefs[i];
			let newvalue = eval(valueFns[ns.args[0]](crime));
			ns.tprint("newvalue evaluates to " + newvalue);
			if (newvalue > value) {
				var value = newvalue;
				if (i > 0) {
					c++
				}
			}
		}
		ns.commitCrime(crimeDefs[c].name);
		await ns.sleep(crimeDefs[c].time * 750);
		if (!ns.isBusy()) {
			ns.scriptKill("commitCrimes.js", "home")
		}
		while (ns.isBusy()) {
			await ns.sleep(50)
		}
	}
}