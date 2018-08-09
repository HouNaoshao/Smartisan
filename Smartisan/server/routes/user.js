const router = require('koa-router')(),
	  crypto = require('crypto'),
	  	  fs = require('fs'),
	  	  DB = require('../database/db');

const config = {
  maxAge: 3600000,
  overwrite: true,
  httpOnly: false,
  signed: false,
  rolling: true,
  renew: false
},
foreverConfig = {
	maxAge: 31536000000,
	overwrite: true,
	httpOnly: false,
	signed: false,
	rolling: false,
	renew: true
},
deleteConfig = {
  maxAge: 0,
  overwrite: true,
  httpOnly: false,
  signed: false,
  rolling: false,
  renew: false
};

/********** GET **********/

router.get('/', async ctx => {
	let name = ctx.cookies.get('name');

	if (name === undefined) {
		const foreverName = ctx.cookies.get('foreverName');

		if (foreverName === undefined) {
			await ctx.redirect('/user/login');
			return;
		}
	}

	await ctx.render('/user/index');
})
.get('/register', async ctx => {
	await ctx.render('/user/register');
})
.get('/login', async ctx => {
	await ctx.render('/user/login');
})
.get('/shortCar', async ctx => {
	const name = ctx.cookies.get('name');

	if (name === undefined) {
		const foreverName = ctx.cookies.get('foreverName');

		if (foreverName === undefined) {
			await ctx.redirect('/user/login');
			return;
		}
	}

	await ctx.render('/user/shortCar');
})
.get('/settlement', async ctx => {
	await ctx.render('/user/settlement');
})
.get('/changeName', async ctx => {
	const name = ctx.cookies.get('name');

	if (name === undefined) {
		const foreverName = ctx.cookies.get('foreverName');

		if (foreverName === undefined) {
			await ctx.redirect('/user/login');
			return;
		}
	}

	await ctx.render('/user/changeName');
})
.get('/writeOrder', async ctx => {
	const name = ctx.cookies.get('name');

	if (name === undefined) {
		const foreverName = ctx.cookies.get('foreverName');

		if (foreverName === undefined) {
			await ctx.redirect('/user/login');
			return;
		}
	}

	await ctx.render('/user/writeOrder');
});

/********** POST **********/

router.post('/register', async ctx => {
	const name = ctx.request.body.name;
	let pwd = ctx.request.body.pwd;

	const car = await DB.insertOne('shortCar', { 'content': [] });
	const carId = car.ops[0]._id;
	
	pwd = crypto.createHash('md5').update(pwd, 'utf8').digest('hex');
	const result = await DB.insertOne('user', {
		name,pwd,
		'avatar': '/img/avatar/default.png',
		'orderId': [],
		'shortCar': carId,
		'addressId': []
	});

	if (result.result.n !== 0) {
		await ctx.render('/user/registerSuccessfully');
	} else {
		await ctx.render('/user/registerFailed');
	}
})
.post('/login', async ctx => {
	let name = ctx.request.body.name;
	let pwd = ctx.request.body.pwd;
	
	pwd = crypto.createHash('md5').update(pwd, 'utf8').digest('hex');
	const result = await DB.find('user', {
		name,pwd
	});
	
	if (result.length !== 0) {
		await ctx.redirect('/');

		name = new Buffer(name).toString('base64');
		ctx.cookies.set('name', name, config);
	} else {
		ctx.status = 204;
	}
})
.post('/settlement', async ctx => {
	const name = ctx.request.body.name;
	const addressId = ctx.request.body.addressId;
	const products = ctx.request.body.products;
	const carId = ctx.request.body.carId;
	const totalMoney = ctx.request.body.totalMoney;

	const date = new Date();
	const time = date.toLocaleString();
	const orderId = date.getTime();

	const insertOrder = await DB.insertOne('order', {
		orderId, name, addressId, products, time, totalMoney,
		'state': '已完成',
	});
	
	if (insertOrder.result.n !== 0) {
		const orderId = insertOrder.ops[0]._id;
		const updateUser = await DB.updateOne('user', { name }, {
			$push: { orderId }
		});

		if (updateUser.result.n !== 0) {
			const cleanCar = await DB.updateOne('shortCar', { '_id': DB.getObjectId(carId) }, {
				$set: { 'content': [] }
			});

			if (cleanCar.result.n !== 0) {
				ctx.status = 200;
			} else {
				ctx.status = 204;
			}
		} else {
			ctx.status = 204;
		}
	} else {
		ctx.status = 204;
	}
});

/********** tools **********/
/***** GET *****/

router.get('/changePwd', async ctx => {
	const name = ctx.cookies.get('name');

	if (name === undefined) {
		const foreverName = ctx.cookies.get('foreverName');

		if (foreverName === undefined) {
			await ctx.redirect('/user/login');
			return;
		}
	}

	await ctx.render('/user/changePwd');
})
.get('/getAddress', async ctx => {
	const address = await DB.find('area', {});

	if (address.length !== 0) {
		ctx.response.body = address;	
	} else {
		ctx.status = 204;
	}
	
});

/***** POST *****/

router.post('/checkName', async ctx => {
	const name = ctx.request.body.name;
	
	const result = await DB.find('user', { name });
	if (result.length === 0) {
		ctx.status = 204;
	} else {
		ctx.status = 200; //no content
	}
})
.post('/checkPwd', async ctx => {
	const name = ctx.request.body.name;
	let pwd = ctx.request.body.pwd;
	
	const result = await DB.find('user', { name });
	pwd = crypto.createHash('md5').update(pwd, 'utf8').digest('hex');
	if (result.length !== 0) {
		if (pwd === result[0].pwd) {
			ctx.status = 200;
		} else {
			ctx.status = 204; //no content
		}
	} else {
		ctx.status = 204;
	}
})
.post('/changePwd', async ctx => {
	const name = ctx.request.body.name;
	let pwd = ctx.request.body.pwd;

	pwd = crypto.createHash('md5').update(pwd, 'utf8').digest('hex');
	const result = await DB.updateOne('user', { name }, { $set: { pwd }});
	
	if (result.result.n !== 0) {
		ctx.cookies.set('name', '', deleteConfig);
		ctx.cookies.set('foreverName', '', deleteConfig);

		await ctx.render('/user/login');
	} else {
		await ctx.render('/user/changePwdFailed');
	}
})
.post('/foreverCookie', async ctx => {
	let name = ctx.request.body.name;
	name = new Buffer(name).toString('base64');

	ctx.cookies.set('foreverName', name, foreverConfig);
	ctx.status = 200;
})
.post('/getUser', async ctx => {
	const name = ctx.request.body.name;

	const user = await DB.findOne('user', { name });

	if (user) {
		ctx.response.body = user;
	} else {
		ctx.status = 204;
	}
})
.post('/changeName', async ctx => {
	const name = ctx.request.body.name;
	const newName = ctx.request.body.newName;

	const result =  await DB.updateOne('user', { name }, { $set: { 'name': newName } });

	if (result.result.n !== 0) {
		await ctx.render('/user/changeNameSuccess');

		ctx.cookies.set('name', '', deleteConfig);
		ctx.cookies.set('foreverName', '', deleteConfig);
	} else {
		await ctx.render('/user/changeNameFailed');
	}
})
.post('/addAddress', async ctx => {
	const name = ctx.request.body.name;
	const addressName = ctx.request.body.addressName;
	const number = ctx.request.body.number;
	const province = ctx.request.body.province;
	const city = ctx.request.body.city;
	const village = ctx.request.body.village;
	const other = ctx.request.body.other;

	const addResult = await DB.insertOne('address', {
		addressName, number, province, city, village, other
	});

	if (addResult.result.n !== 0) {
		const addressId = addResult.ops[0]._id;
		const addToUserR = await DB.updateOne('user', { name }, {
			$push: { 'addressId': addressId }
		});

		if (addToUserR.result.n !== 0) {
			ctx.status = 200;
		} else {
			ctx.status = 204;
		}
	} else {
		ctx.status = 204;
	}
})
.post('/getUserAddress', async ctx => {
	const name = ctx.request.body.name;

	const user = await DB.findOne('user', { name });
	const addresses = user.addressId;


	const addressArr = [];
	let address = undefined;
	if (addresses.length !== 0) {
		for (let v of addresses) {
			address = await DB.findOne('address', { '_id': DB.getObjectId(v) });
			addressArr.push(address);
		}
		ctx.response.body = addressArr;
	} else {
		ctx.status = 204;
	}
})
.post('/editAddress', async ctx => {
	const addressId = ctx.request.body.addressId;
	const name = ctx.request.body.name;
	const number = ctx.request.body.number;
	const province = ctx.request.body.province;
	const city = ctx.request.body.city;
	const village = ctx.request.body.village;
	const other = ctx.request.body.other;

	const addResult = await DB.updateOne('address', { '_id': DB.getObjectId(addressId) }, {
		$set: {
			name, number, province, city, village, other
		}
	});

	if (addResult.result.n !== 0) {
		ctx.status = 200;
	} else {
		ctx.status = 204;
	}
})
.post('/delAddress', async ctx => {
	const addressId = ctx.request.body.addressId;
	const name = ctx.request.body.name;

	const delResult = await DB.deleteOne('address', { '_id': DB.getObjectId(addressId) });

	if (delResult.result.n !== 0) {
		const updateUser = await DB.updateOne('user', { name }, {
			$pull: { 'addressId': DB.getObjectId(addressId) }
		});
		if (updateUser.result.n !== 0) {
			ctx.status = 200;
		} else {
			ctx.status = 204;
		}
	} else {
		ctx.status = 204;
	}
})
.post('/getOrder', async ctx => {
	const name = ctx.request.body.name;
	const orders = await DB.findOne('user', { name });
	const orderIds = orders.orderId;

	let orderArr = [];
	for (let v of orderIds) {
		const order = await DB.findOne('order', { '_id': DB.getObjectId(v) });

		if (order) {
			orderArr.push(order);
		}
	}

	ctx.response.body = orderArr;
});

module.exports = router.routes();