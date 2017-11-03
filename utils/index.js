
		// gets the top 3 topping picks for the given toppings.
import Tracker from '../models/tracker.js';

const utils = {
	checkTracker: async (group, category) => {
		let tracker;
		try {
			tracker = await Tracker.findOneAsync({group, category})
		} catch (err) {
			console.log(err)
			return 'Error: Something broke!';
		}

		if (!tracker) {
			return 'Error: No Tracker Found';
		}

		let num = 0;
		const highestList = [];
		while (num < 3) {
			const highest = Object.keys(tracker.items).reduce((a, b) =>
				tracker.items[a] > tracker.items[b] ? a : b
			);

			delete tracker.items[highest]

			highestList.push(highest);

			num += 1;
		}

		return highestList;
	}
}

module.exports = utils;