class tools {
	constructor () {}

	static async getColors (DB, products) {
		let colors = [],
			colorTmp = [];

		for (let v of products) {
			for (let x of v.colorId) {
				const color = await DB.find('color', { '_id': DB.getObjectId(x) });
				colorTmp = colorTmp.concat(color);
			}

			colors.push(colorTmp);
			colorTmp = [];
		}

		return colors;
	}

	static async getSmallImgs (DB, products) {
		let smallImgs = [],
			smallImgTmp = [];

		for (let v of products) {
			for (let x of v.smallImgId) {
				const smallImg = await DB.find('smallImg', { '_id': DB.getObjectId(x) });
				smallImgTmp = smallImgTmp.concat(smallImg);
			}

			smallImgs.push(smallImgTmp);
			smallImgTmp = [];
		}

		return smallImgs;
	}

	static async getImgs (DB, products) {
		let imgs = [],
			imgTmp = [];

		for (let v of products) {
			for (let x of v.imgId) {
				const img = await DB.find('img', { '_id': DB.getObjectId(x) });
				imgTmp = imgTmp.concat(img);
			}

			imgs.push(imgTmp);
			imgTmp = [];
		}

		return imgs;
	}

	static async getCapacity (DB, products) {
		let capacitys = [],
			capacityTmp = [];

		for (let v of products) {
			for (let x of v.capacity) {
				const capacity = await DB.find('capacity', { '_id': DB.getObjectId(x) });
				capacityTmp = capacityTmp.concat(capacity);
			}

			capacitys.push(capacityTmp);
			capacityTmp = [];
		}

		return capacitys;
	}
}

module.exports = tools;