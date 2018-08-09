const mongodb = require('mongodb'),
	  config = require('./config');

const MongoClient = mongodb.MongoClient,
	  ObjectID = mongodb.ObjectID;

class Db {
	static getInstance () {
		if (!Db.instance) {
			Db.instance = new Db();
		}

		return Db.instance;
	}

	constructor () {
		this.db = undefined;
		this.connect();
	}

	getObjectId (id) {
		return new ObjectID(id);
	}

	connect () {
		const _this = this;

		return new Promise((resolve, reject) => {
			if (_this.db) {
				resolve(_this.db);
			} else {
				MongoClient.connect(config.url, (err, client) => {
				  	if (err) {
				  		reject(err);
				  	};
				  	
				  	console.log("Connected successfully to server.");
				  	_this.db = client.db(config.dbName);

				  	resolve(_this.db);
				});
			}
		});
	}

	find (collectionName, findArg) {
		return new Promise((resolve, reject) => {
			this.connect().then(db => {
				const collection = db.collection(collectionName);
				collection.find(findArg).toArray((err, docs) => {
					if (err) {
						reject(err);
					}

					resolve(docs);
				});
			})
			.catch(err => {
				console.error(err);
			});
		});
	}

	findOne (collectionName, findArg) {
		return new Promise((resolve, reject) => {
			this.connect().then(db => {
				const collection = db.collection(collectionName);
				collection.findOne(findArg, (err, docs) => {
					if (err) {
						reject(err);
					}

					resolve(docs);
				});
			})
			.catch(err => {
				console.error(err);
			});
		});
	}

	insertOne (collectionName, insertArg) {
		return new Promise((resolve, reject) => {
			this.connect().then(db => {
				const collection = db.collection(collectionName);
				collection.insertOne(insertArg, (err, result) => {
					if (err) {
						reject(err);
					}

					resolve(result);
				});
			})
			.catch(err => {
				console.error(err);
			});
		});
	}

	insertMany (collectionName, insertArg) {
		return new Promise((resolve, reject) => {
			this.connect().then(db => {
				const collection = db.collection(collectionName);
				collection.insertMany(insertArg, (err, result) => {
					if (err) {
						reject(err);
					}

					resolve(result);
				});
			})
			.catch(err => {
				console.error(err);
			});
		});
	}

	updateOne (collectionName, findArg, updateArg) {
		return new Promise((resolve, reject) => {
			this.connect().then(db => {
				const collection = db.collection(collectionName);
				collection.updateOne(findArg, updateArg, (err, result) => {
					if (err) {
						reject(err);
					}

					resolve(result);
				});
			})
			.catch(err => {
				console.error(err);
			});
		});
	}

	updateMany (collectionName, findArg, updateArg) {
		return new Promise((resolve, reject) => {
			this.connect().then(db => {
				const collection = db.collection(collectionName);
				collection.updateMany(findArg, updateArg, (err, result) => {
					if (err) {
						reject(err);
					}

					resolve(result);
				});
			})
			.catch(err => {
				console.error(err);
			});
		});
	}

	deleteOne (collectionName, findArg) {
		return new Promise((resolve, reject) => {
			this.connect().then(db => {
				const collection = db.collection(collectionName);
				collection.deleteOne(findArg, (err, result) => {
					if (err) {
						reject(err);
					}

					resolve(result);
				});
			})
			.catch(err => {
				console.error(err);
			});
		});
	}

	deleteMany (collectionName, findArg) {
		return new Promise((resolve, reject) => {
			this.connect().then(db => {
				const collection = db.collection(collectionName);
				collection.deleteMany(findArg, (err, result) => {
					if (err) {
						reject(err);
					}

					resolve(result);
				});
			})
			.catch(err => {
				console.error(err);
			});
		});
	}
}

module.exports = Db.getInstance();
