const rss=require('../modules/data/rss.js');

module.exports = (req, res) => {
	rss('championsLeagueResult', raw => {
		console.log(raw);
		const result = raw.map(data => {
			const match = {};
			match.containders = data.title.split(' v ');
			const description = data.description.replace(/<br\/>.+/, '');
			const rawCouples = description.split(' - ');
			const couples = rawCouples.map((couple) => {
				return {
					team: couple.match(/[a-zA-Z]+/)[0],
					points: parseInt(couple.match(/[0-9]+/))
				}
			});
			couples.sort((a, b) => {
				if (a.points > b.points) return -1;
				if (a.points < b.points) return 1;
				return 0;
			});
			match.winner = couples[0].points !== couples[1].points ? couples[0].team : undefined ;
			match.score = description.match(/[0-9]+ - [0-9]+/)[0];
			match.date = data.created;
			return match;
		});
		res.send(result);
	});
}