const indexVue = new Vue({
	el: '#product',
	data: {
		name: '',
		user: '',
		carId: '',
		personUrl: '',
		carUrl: '',
		shortCarArr: '',
		quantity: 0,
		productId: '',
		item: '',
		price: '',
		details: '',
		imgArr: '',
		colorArr: '',
		capacityArr: '',
		product: '',
		imgIndex: 0,
		imgId: '',
		color: '',
		capacity: '',
		smallImg: '',
		smallImgArr: '',
		count: 1
	},
	mounted () {
		/********** user **********/

		let name = $.cookie('name');
		let foreverName = $.cookie('foreverName');
		const person = $('#p-info');
		const car = $('#p-shortcar');

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

		/********** get product **********/

		const href = window.location.href;
		const tmpArr = href.split('/');
		this.productId = tmpArr[tmpArr.length-1];

		axios.post('/product/getProdcut', {
			productId: this.productId
		}).then(res => {
			this.item = res.data;
			this.product = this.item.product;
			this.imgArr = this.item.imgArr;
			this.colorArr = this.item.colorArr;
			this.smallImgArr = this.item.smallImgArr;

			if (this.item.capacityArr) {
				this.capacityArr = this.item.capacityArr;
			} else {
				this.price = this.product.price;
			}

			/***** init *****/

			this.capacity = this.capacityArr[0];
			this.smallImg = this.smallImgArr[0];
			this.imgId = this.imgArr[0]._id;
			this.color = this.colorArr[0];

			for (let v of this.imgArr) {
				if (v.detail) {
					this.details = v.detail;
					return;
				}
			}
		}).catch(err =>{
			console.error(err);
		});

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
		},
		total () {
			if (this.capacity) {
				return this.capacity.price * this.count;	
			} else {
				return this.price * this.count;
			}
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
		addToCart2 () {
			if (this.name !== '') {
				if (this.capacityId !== '') {
					axios.post('/addToCar2', {
						'product': this.product,
						'smallImg': this.smallImg,
						'color': this.color,
						'carId': this.carId,
						'quantity': this.count,
						'capacity': this.capacity
					}).then(res => {
						if (res.status === 204) {
							alert('No!');
						} else {
							this.quantity ++;
							this.showAddsuccess();
							this.getShortCarItems();
						}
					}).catch(err => {
						console.error(err);
					});
				} else {
					axios.post('/addToCar2', {
						'product': this.product,
						'smallImg': this.smallImg,
						'color': this.color,
						'carId': this.carId,
						'quantity': this.count,
					}).then(res => {
						if (res.status === 204) {
							alert('No!');
						} else {
							this.quantity ++;
							alert('Yes!');
							this.getShortCarItems();
						}
					}).catch(err => {
						console.error(err);
					});
				}
			} else {
				alert('您还没有登录');
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
		},
		changeImg (index) {
			const target = $(event.target);
			target.siblings('.boldBorder').removeClass('boldBorder');
			target.addClass('boldBorder');

			const src = this.imgArr[this.imgIndex].product[index];
			const img = target.parent().siblings('figure').children('img');
			img.attr('src', src);
		},
		changeColor (index) {
			const target = $(event.target);
			
			if (target.prop("tagName") === 'IMG') {
				target.parent().siblings('.outerDot').removeClass('outerDot');
				target.parent().addClass('outerDot');
			} else {
				target.siblings('.outerDot').removeClass('outerDot');
				target.addClass('outerDot');
			}

			this.smallImg = this.smallImgArr[index];
			this.imgIndex = index;
			this.imgId = this.imgArr[index]._id;
			this.color = this.colorArr[index];
		},
		changeCapacity (index) {
			const target = $(event.target);

			target.siblings('.blueBorder').removeClass('blueBorder');
			target.addClass('blueBorder');

			this.capacity = this.capacityArr[index];
		}
	}
});