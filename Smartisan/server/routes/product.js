const router = require('koa-router')(),
	  	  DB = require('../database/db');

router.get('/:id', async ctx => {
	await ctx.render('/product');
});

router.post('/getProdcut', async ctx => {
	const productId = ctx.request.body.productId;
	let product = undefined;

	const hpResult = await DB.findOne('hotProduct', { '_id': DB.getObjectId(productId) });
	if (hpResult) {
		product = hpResult;
	} else {
		const rpResult = await DB.findOne('R1andParts', { '_id': DB.getObjectId(productId) });
		if (rpResult) {
			product = rpResult;
		} else {
			const cResult = await DB.findOne('choice', { '_id': DB.getObjectId(productId) });
			if (cResult) {
				product = cResult;
			} else {
				const clResult = await DB.findOne('cleaner', { '_id': DB.getObjectId(productId) });
				if (clResult) {
					product = clResult;
				} else {
					ctx.status = 204;
					return;
				}
			}
		}
	}

	const imgIds = product.imgId;
	const smallImgIds = product.smallImgId;
	const colorIds = product.colorId;
	const capacity = product.capacity;

	let imgArr = [], smallImgArr = [], colorArr = [], capacityArr = [];
	let data = '';

	for (let v of imgIds) {
		const r = await DB.findOne('img', { '_id': DB.getObjectId(v) });
		imgArr.push(r);
	}

	for (let v of smallImgIds) {
		const r = await DB.findOne('smallImg', { '_id': DB.getObjectId(v) });
		smallImgArr.push(r);
	}

	for (let v of colorIds) {
		const r = await DB.findOne('color', { '_id': DB.getObjectId(v) });
		colorArr.push(r);
	}

	if (capacity.length !== 0) {
		for (let v of capacity) {
			const r = await DB.findOne('capacity', { '_id': DB.getObjectId(v) });
			capacityArr.push(r);
		}

		data = {
			product, imgArr, smallImgArr, colorArr, capacityArr
		};
	} else {
		data = {
			product, imgArr, colorArr, smallImgArr
		};
	}

	ctx.response.body = data;
});

module.exports = router.routes();