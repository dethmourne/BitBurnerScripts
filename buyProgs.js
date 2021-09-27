// Simple script to buy TOR and all programs.

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
	if (ns.purchaseTor()) {
		ns.tprint("Purchased TOR")
	} else {
		ns.tprint("Did not purchase TOR")
	};
	for (let i = 0; i < programList.length; i++) {
		if (ns.purchaseProgram(programList[i])) {
			ns.tprint("Purchased " + programList[i])
		} else {
			ns.tprint("Did not purchase " + programList[i])
		};
	}
}