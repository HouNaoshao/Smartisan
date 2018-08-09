const 			Koa = require('koa'),
	  		 router = require('koa-router')(),
	 		 static = require('koa-static'),
	 	 bodyParser = require('koa-bodyparser'),
	 		   view = require('koa-views'),
	  		 multer = require('koa-multer'),
	 			 DB = require('./database/db'),
	 	    DBtools = require('./database/tools'),
	  	adminRouter = require('./routes/admin'),
	  	 userRouter = require('./routes/user'),
	  productRouter = require('./routes/product');

const app = new Koa();

app.use(view('../resource/views'));
app.use(bodyParser());
app.use(static('../resource/static'));
app.use(router.routes())
   .use(router.allowedMethods());

router.use('/admin', adminRouter);
router.use('/user', userRouter);
router.use('/product', productRouter);

/********** koa-multer config **********/

const storage = multer.diskStorage({
	destination: '../resource/static/img/avatar',

	filename (ctx,file,cb) {
	    const filenameArr = file.originalname.split(".");

    	cb(null, Date.now() + "." + filenameArr[filenameArr.length - 1]);
	}
});
const upload = multer({ storage });

/************** 配置子路由 ****************/

/********** 404 **********/

app.use(async (ctx, next) => {
	await next();

	if (ctx.status === 404) {
		await ctx.render('/404');
	}
});


/***** GET *****/

router.get('/', async ctx => {
	await ctx.render('/index');
})
.get('/getHotProducts', async ctx => {
	const hotProducts = await DB.find('hotProduct');
	const hpColors = await DBtools.getColors(DB, hotProducts);
	const hpSmallImgs = await DBtools.getSmallImgs(DB, hotProducts);
	const hpImgs = await DBtools.getImgs(DB, hotProducts);
	const hpCapacitys = await DBtools.getCapacity(DB, hotProducts);

	const hpData = {
		hotProducts, hpColors, hpSmallImgs, hpImgs, hpCapacitys
	};

	const jsHpData = JSON.stringify(hpData);

	ctx.response.body = jsHpData;
})
.get('/getR1andParts', async ctx => {
	const R1andParts = await DB.find('R1andParts');
	const rpColors = await DBtools.getColors(DB, R1andParts);
	const rpSmallImgs = await DBtools.getSmallImgs(DB, R1andParts);
	const rpImgs = await DBtools.getImgs(DB, R1andParts);
	const rpCapacitys = await DBtools.getCapacity(DB, R1andParts);

	const rpData = {
		R1andParts, rpColors, rpSmallImgs, rpImgs, rpCapacitys
	};

	const jsRpData = JSON.stringify(rpData);

	ctx.response.body = jsRpData;
})
.get('/getChoice', async ctx => {
	const choice = await DB.find('choice');
	const cColors = await DBtools.getColors(DB, choice);
	const cSmallImgs = await DBtools.getSmallImgs(DB, choice);
	const cImgs = await DBtools.getImgs(DB, choice);
	const cCapacitys = await DBtools.getCapacity(DB, choice);

	const cData = {
		choice, cColors, cSmallImgs, cImgs, cCapacitys
	};

	const jsCData = JSON.stringify(cData);

	ctx.response.body = jsCData;
})
.get('/getCleaner', async ctx => {
	const cleaner = await DB.find('cleaner');
	const clColors = await DBtools.getColors(DB, cleaner);
	const clSmallImgs = await DBtools.getSmallImgs(DB, cleaner);
	const clImgs = await DBtools.getImgs(DB, cleaner);
	const clCapacitys = await DBtools.getCapacity(DB, cleaner);

	const clData = {
		cleaner, clColors, clSmallImgs, clImgs, clCapacitys
	};

	const jsClData = JSON.stringify(clData);

	ctx.response.body = jsClData;
});

/***** POST *****/

router.post('/addToCar1', async ctx => {
	const product = ctx.request.body.product;
	const smallImg = ctx.request.body.smallImg;
	const color = ctx.request.body.color;
	const carId = ctx.request.body.carId;
	const quantity = 1;
	const pid = product._id;
	const cid = color._id;
	const _id = Date.parse(new Date());
	let exist = false;
	let insertResult = undefined;

	const results = await DB.findOne('shortCar', { '_id': DB.getObjectId(carId) });
	const productArr = results.content;

	for (let v of productArr) {
		if (v.product._id === pid && v.color._id === cid) {
			insertResult = await DB.updateOne('shortCar', {
				'_id': DB.getObjectId(carId),
				'content.product._id': pid,
				'content.color._id': cid
			}, {
				$inc: { 'content.$.quantity': 1 }
			});

			exist = true;
			break;
		}
	}

	if (!exist) {
		insertResult = await DB.updateOne('shortCar', { '_id': DB.getObjectId(carId) }, {
			$push: { 'content': {
				_id, product, smallImg, color, quantity
			} }
		});
	}

	if (insertResult.result.n === 0) {
		ctx.status = 204;
	} else {
		ctx.status = 200;
	}
})
router.post('/addToCar2', async ctx => {
	const product = ctx.request.body.product;
	const smallImg = ctx.request.body.smallImg;
	const color = ctx.request.body.color;
	const carId = ctx.request.body.carId;
	const quantity = ctx.request.body.quantity;
	const capacity = ctx.request.body.capacity;
	const pid = product._id;
	const cid = color._id;
	const _id = Date.parse(new Date());

	let exist = false;
	let insertResult = undefined;

	const results = await DB.findOne('shortCar', { '_id': DB.getObjectId(carId) });
	const productArr = results.content;

	for (let v of productArr) {
		if (v.product._id === pid && v.color._id === cid) {
			insertResult = await DB.updateOne('shortCar', {
				'_id': DB.getObjectId(carId),
				'content.product._id': pid,
				'content.color._id': cid
			}, {
				$inc: { 'content.$.quantity': quantity }
			});

			exist = true;
			break;
		}
	}

	if (!exist) {
		if (capacity) {
			insertResult = await DB.updateOne('shortCar', { '_id': DB.getObjectId(carId) }, {
				$push: { 'content': {
					_id, product, smallImg, color, quantity, capacity
				} }
			});
		} else {
			insertResult = await DB.updateOne('shortCar', { '_id': DB.getObjectId(carId) }, {
				$push: { 'content': {
					_id, product, smallImg, color, quantity
				} }
			});
		}
	}

	if (insertResult.result.n === 0) {
		ctx.status = 204;
	} else {
		ctx.status = 200;
	}
})
.post('/delFromCar', async ctx => {
	const carId = ctx.request.body.carId;
	const itemId = ctx.request.body.itemId;

	const result = await DB.updateOne('shortCar', { '_id': DB.getObjectId(carId) }, { $pull: {
		'content': { '_id': itemId }
	}});

	if (result.result.n === 0) {
		ctx.status = 204;
	} else {
		ctx.status = 200;
	}
})
.post('/shortCar', async ctx => {
	const name = ctx.request.body.name;
	const user = await DB.findOne('user', { name });
	const car = await DB.findOne('shortCar', { '_id': DB.getObjectId(user.shortCar) });

	if (car) {
		ctx.response.body = car;
	} else {
		ctx.status = 204;
	}
})
.post('/down', async ctx => {
	const carId = ctx.request.body.carId;
	const itemId = ctx.request.body.itemId;

	const result = await DB.updateOne('shortCar', {
		'_id': DB.getObjectId(carId),
		'content._id': itemId,
	}, {
		$inc: { 'content.$.quantity': -1 }
	});

	if (result.result.n === 0) {
		ctx.status = 204;
	} else {
		ctx.status = 200;
	}
})
.post('/up', async ctx => {
	const carId = ctx.request.body.carId;
	const itemId = ctx.request.body.itemId;

	const result = await DB.updateOne('shortCar', {
		'_id': DB.getObjectId(carId),
		'content._id': itemId,
	}, {
		$inc: { 'content.$.quantity': 1 }
	});

	if (result.result.n === 0) {
		ctx.status = 204;
	} else {
		ctx.status = 200;
	}
});

var name = '';

router.post('/postName', async ctx => {
	name = ctx.request.body.name;

	ctx.status = 200;
}).post('/upload', upload.single('file'), async ctx => {
	const imgName = ctx.req.file.filename;
	const url = '/img/avatar/' + imgName;

	const result = await DB.updateOne('user', { name }, {
		$set: { 'avatar': url }
	});

	if (result.result.n === 0) {
		ctx.status = 204;
	} else {
		ctx.status = 200;
	}
});


/************** 监听 *****************/

app.listen(3000, () => {
    console.log('The server is running at localhost:3000.');
});