// Simple script to buy TOR and all programs.
// New version will quietly loop in the background until it has purchased all programs.

const programList = [
	"brutessh.exe",
	"ftpcrack.exe",
	"relaysmtp.exe",
	"httpworm.exe",
	"sqlinject.exe",
	"deepscanv1.exe",
	"deepscanv2.exe",
	"autolink.exe",
	"serverprofiler.exe"
]

export async function main(ns) {
	ns.purchaseTor();
	var progCount = 0
	while (progCount < programList.length) {
		await ns.sleep(1000);
		var progCount = 0;
		for (let i = 0; i < programList.length; i++) {
			if (ns.purchaseProgram(programList[i])) {
				progCount++
			}
		}
	}
}