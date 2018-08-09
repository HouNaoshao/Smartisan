const indexVue = new Vue({
	el: '#index',
	data: {
		name: '',
		user: '',
		carId: '',
		personUrl: '',
		carUrl: '',
		shortCarArr: '',
		quantity: 0,
		hpData: {
			products: '',
			colors: '',
			smallImgs: '',
			capacitys: ''
		},
		rpData: {
			products: '',
			colors: '',
			smallImgs: '',
			capacitys: ''
		},
		cData: {
			products: '',
			colors: '',
			smallImgs: '',
			capacitys: ''
		},
		clData: {
			products: '',
			colors: '',
			smallImgs: '',
			capacitys: ''
		},
	},
	mounted () {
		/********** user **********/

		let name = $.cookie('name');
		let foreverName = $.cookie('foreverName');

		function b64EncodeUnicode(str) {
		    return decodeURIComponent(atob(str).split('').map((c) => {
		        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
		    }).join(''));
		};

		if (name) {
			this.name = b64EncodeUnicode(name);
			this.personUrl = '/user';
			this.carUrl = '/user/shortCar';
		} else if (foreverName) {
			this.name = b64EncodeUnicode(foreverName);
			this.personUrl = '/user';
			this.carUrl = '/user/shortCar';
		} else {
			this.personUrl = '/user/login';
			this.carUrl = '/user/login';

			setTimeout(() => {
				const person = $('#p-info');
				const car = $('#p-shortcar');
				person.addClass('hideAbsolute');
				car.addClass('hideAbsolute');
			}, 200);
		}

		if (this.name !== '') {
			axios.post('/user/getUser', {
				name: this.name
			}).then(res => {
				if (res.status !== 204) {
					this.user = res.data;
				}
			}).catch(err => {
				console.error(err);
			});
		}

		/********** shortCar **********/
		if (this.name !== '') {
			axios.post('/shortCar', {
				name: this.name,
			}).then(res => {
				if (res.status !== 204) {
					this.carId = res.data._id;
					this.shortCarArr = res.data.content;

					this.updateQuantity();
				}
			}).catch(err => {
				console.error(err);
			});
		}

		/********** products **********/

		axios.get('/getHotProducts')
			.then(res => {
				const data = res.data;

				this.hpData.products = data.hotProducts;
				this.hpData.colors = data.hpColors;
				this.hpData.smallImgs = data.hpSmallImgs;
				this.hpData.capacitys = data.hpCapacitys;
			}).catch(err => {
				console.error(err);
			});

		axios.get('/getR1andParts')
			.then(res => {
				const data = res.data;

				this.rpData.products = data.R1andParts;
				this.rpData.colors = data.rpColors;
				this.rpData.smallImgs = data.rpSmallImgs;
				this.rpData.capacitys = data.rpCapacitys;
			}).catch(err => {
				console.error(err);
			});


		axios.get('/getChoice')
			.then(res => {
				const data = res.data;

				this.cData.products = data.choice;
				this.cData.colors = data.cColors;
				this.cData.smallImgs = data.cSmallImgs;
				this.cData.capacitys = data.cCapacitys;
			}).catch(err => {
				console.error(err);
			});

		axios.get('/getCleaner')
			.then(res => {
				const data = res.data;

				this.clData.products = data.cleaner;
				this.clData.colors = data.clColors;
				this.clData.smallImgs = data.clSmallImgs;
				this.clData.capacitys = data.clCapacitys;
			}).catch(err => {
				console.error(err);
			});
	},
	computed: {
		totalMoney () {
			let money = 0;
			for (let v of this.shortCarArr) {
				if (v.capacity) {
					money += v.capacity.price * v.quantity;
				} else {
					money += v.product.price * v.quantity;
				}
			}

			return money;
		}
	},
	methods: {
		showAddsuccess () {
			const addSuccess = $('#addSuccess');
			addSuccess.addClass('showAddSuccess');

			setTimeout(() => {
				addSuccess.removeClass('showAddSuccess');
			}, 2000);
		},
		exit () {
			$.removeCookie('name');
			$.removeCookie('foreverName');
		},
		dotEvent () {
			const target = $(event.target);
			const dotIndex = target.index();
			const liIndex = target.parents('li').index();
			const articleIndex = target.parents('article').index();
			const img = target.parent().siblings('figure').children('img');

			imgSrc = this.hpData.smallImgs[liIndex][dotIndex].product[0];
			img.attr('src', imgSrc);
		},
		dotEvent2 () {
			const target = $(event.target);
			const dotIndex = target.index();
			const liIndex = target.parents('li').index() - 1;
			const articleIndex = target.parents('article').index();
			const img = target.parent().siblings('figure').children('img');

			let imgSrc = undefined;
			switch (articleIndex) {
				case 2:
					imgSrc = this.rpData.smallImgs[liIndex][dotIndex].product[0];
					img.attr('src', imgSrc);
					break;

				case 3:
					imgSrc = this.cData.smallImgs[liIndex][dotIndex].product[0];
					img.attr('src', imgSrc);
					break;

				case 4:
					imgSrc = this.clData.smallImgs[liIndex][dotIndex].product[0];
					img.attr('src', imgSrc);
					break;
			}
		},
		getShortCarItems () {
			if (this.name !== '') {
				axios.post('/shortCar', {
					name: this.name
				}).then(res => {
					if (res.status !== 204) {
						this.carId = res.data._id;
						this.shortCarArr = res.data.content;

						this.updateQuantity();
					}
				}).catch(err => {
					console.error(err);
				});
			}
		},
		updateQuantity () {
			let counter = 0;
				for (let v of this.shortCarArr) {
				counter += v.quantity;
			}

			this.quantity = counter;
		},
		addToCart1 () {
			if (this.name !== '') {
				const target = $(event.target);
				const colorIndex = target.parent().siblings('ul').children('.outerDot').index();
				const liIndex = target.parents('li').index();


				product = this.hpData.products[liIndex];
				smallImg = this.hpData.smallImgs[liIndex][colorIndex];
				color = this.hpData.colors[liIndex][colorIndex];

				axios.post('/addToCar1', {
					product, smallImg, color,
					'carId': this.carId
				}).then(res => {
					if (res.status === 204) {
						alert('No!');
					} else {
						this.quantity ++;
						this.showAddsuccess();
					}
				}).catch(err => {
					console.error(err);
				});
			} else {
				alert('您还没登录');
			}
		},
		addToCart2 () {
			if (this.name !== '') {
				const target = $(event.target);
				const colorIndex = target.parent().siblings('ul').children('.outerDot').index();
				const liIndex = target.parents('li').index() - 1;
				const articleIndex = target.parents('article').index();

				let product = '', smallImg = '', color = '';
				switch (articleIndex) {
					case 2:
						product = this.rpData.products[liIndex];
						smallImg = this.rpData.smallImgs[liIndex][colorIndex];
						color = this.rpData.colors[liIndex][colorIndex];
						break;

					case 3:
						product = this.cData.products[liIndex];
						smallImg = this.cData.smallImgs[liIndex][colorIndex];
						color = this.cData.colors[liIndex][colorIndex];
						break;

					case 4:
						product = this.clData.products[liIndex];
						smallImg = this.clData.smallImgs[liIndex][colorIndex];
						color = this.clData.colors[liIndex][colorIndex];
						break;
				}

				axios.post('/addToCar1', {
					product, smallImg, color,
					'carId': this.carId
				}).then(res => {
					if (res.status === 204) {
						alert('No!');
					} else {
						this.quantity ++;
						this.showAddsuccess();
					}
				}).catch(err => {
					console.error(err);
				});
			} else {
				alert('您还没登录');
			}
		},
		delItemFromCar () {
			const index = $(event.target).parent().index();
			const itemId = this.shortCarArr[index]._id;

			axios.post('/delFromCar', {
				itemId,
				carId: this.carId
			}).then(res => {
				if (res.status === 200) {
					this.shortCarArr.splice(index, 1);
					this.updateQuantity();
				}
			}).catch(err => {
				console.error(err);
			});
		}
	}
});