/********* Vue **********/

const indexVue = new Vue({
	el: '#car',
	data: {
		name: '',
		user: '',
		carId: '',
		personUrl: '',
		shortCarArr: '',
		userAddressId: '',
		quantity: 0,
		userAddressArr: '',
		addressName: '',
		money: 0,
		nameRe: /[a-zA-Z\u4e00-\u9fa5]{2,16}$/,
		number: '',
		numberRe: /^1[3|4|5|8]\d{9}$/,
		otherRe: /[\w\u4e00-\u9fa5]+/,
		dom: {
			domName: '',
			domNameError: '',
			domNumber: '',
			domNumberError: '',
			domSubmit: '',
			domErrorAll: '',
			domAddress: ''
		},
		addressTmp: {
			provinceData: '',
			provinceIndex: 0,
			cityData: '',
			cityIndex: 0
		},
		addressArr: [],
		cityArr: [],
		villageArr: [],
		address: {
			province: '',
			city: '',
			village: '',
			other: ''
		}
	},
	mounted () {
		this.dom.domName = $('#name');
		this.dom.domNameError = this.dom.domName.siblings('.error-name');
		this.dom.domNumber = $('#number');
		this.dom.domNumberError = this.dom.domNumber.siblings('.error-number');
		this.dom.domSubmit = $('#submit');
		this.dom.domErrorAll = $('#error-all');
		this.dom.domAddress = $('#add-address');

		const aside = $('#aside');
		aside.click((event) => {
			const asideBg = aside.children('.asideBg');
			const target = $(event.target);

			if (target[0] !== asideBg[0]) {
				asideBg.removeClass('asideBg');
				target.addClass('asideBg');
			}
		});

		/********** user **********/

		const name = $.cookie('name');
		const foreverName = $.cookie('foreverName');
		const person = $('#p-info');

		function b64EncodeUnicode(str) {
		    return decodeURIComponent(atob(str).split('').map((c) => {
		        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
		    }).join(''));
		};

		if (name) {
			this.name = b64EncodeUnicode(name);
			this.personUrl = '/user';
		} else if (foreverName) {
			this.name = b64EncodeUnicode(foreverName);
			this.personUrl = '/user';
		} else {
			this.personUrl = '/user/login';
			person.addClass('hideAbsolute');
		}

		axios.post('/user/getUser', {
			name: this.name
		}).then(res => {
			if (res.status !== 204) {
				this.user = res.data;
			}
		}).catch(err => {
			console.error(err);
		});

		/********** shortCar **********/
		
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

		/********** getAddress **********/

		axios.get('/user/getAddress')
		.then(res => {
			if (res.status !== 204) {
				this.addressArr = res.data;
			}
		}).catch(err => {
			console.error(err);
		});

		/***** getUserAddress *****/

		axios.post('/user/getUserAddress', {
			name: this.name
		}).then(res => {
			if (res.status !== 204) {
				this.userAddressArr = res.data;
				this.userAddressId = this.userAddressArr[0]._id;
			}
		}).catch(err => {
			console.error(err);
		});

		/***** startEvent *****/

		this.addEvent();
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

			this.money = money;
			return money;
		}
	},
	methods: {
		exit () {
			$.removeCookie('name');
			$.removeCookie('foreverName');
		},
		updateQuantity () {
			let counter = 0;
				for (let v of this.shortCarArr) {
				counter += v.quantity;
			}

			this.quantity = counter;
		},
		getShortCarItems () {
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
		},
		delItemFromCar () {
			const index = $(event.target).parents('ul').index() - 2;
			const itemId = this.shortCarArr[index]._id;

			axios.post('/delFromCar', {
				itemId,
				'carId': this.carId
			}).then(res => {
				if (res.status === 200) {
					this.shortCarArr.splice(index, 1);
				}
			}).catch(err => {
				console.error(err);
			});
		},
		down () {
			const target = $(event.target);
			const index = target.parents('ul').index() - 2;
			const itemId = this.shortCarArr[index]._id;

			axios.post('/down', {
				itemId,
				'carId': this.carId
			}).then(res => {
				if (res.status === 204) {
					console.log('减1失败');
				} else {
					this.getShortCarItems();
				}
			}).catch(err => {
				console.error(err);
			});
		},
		up () {
			const target = $(event.target);
			const index = target.parents('ul').index() - 2;
			const itemId = this.shortCarArr[index]._id;

			axios.post('/up', {
				itemId,
				'carId': this.carId
			}).then(res => {
				if (res.status === 204) {
					console.log('加1失败');
				} else {
					this.getShortCarItems();
				}
			}).catch(err => {
				console.error(err);
			});
		},
		getCity () {
			if (this.addressTmp.provinceData !== '') {
				const provinceAndId = this.addressTmp.provinceData.split(';');
				this.address.province = provinceAndId[0];
				this.addressTmp.provinceIndex = provinceAndId[1];
				this.cityArr = this.addressArr[this.addressTmp.provinceIndex].city;
			} else {
				this.cityArr = [];
				this.villageArr = [];
			}

			this.address.city = '';
			this.address.village = '';

			this.checkEmpty();
		},
		getVillage () {
			if (this.addressTmp.cityData !== '') {
				const cityAndId = this.addressTmp.cityData.split(';');
				this.address.city = cityAndId[0];
				this.addressTmp.cityIndex = cityAndId[1];
				this.villageArr = this.cityArr[this.addressTmp.cityIndex].village;
			} else {
				this.villageArr = [];
			}

			this.address.village = '';

			this.checkEmpty();
		},
		checkEmpty () {
			if (this.addressName !== '' &&
				this.number !== '' &&
				this.address.province !== '' && 
				this.address.city !== '' &&
				this.address.village !== '' &&
				this.otherRe.test(this.address.other)) {

				this.dom.domSubmit.removeClass('notAllowedAbsolutely');
				this.dom.domErrorAll.removeClass('showErrorAll');
			}
		},
		show (url, addressId) {
			this.addressOperator = url;

			if (addressId) {
				this.userAddressId = addressId;
			}

			this.dom.domAddress.addClass('showAddress');
		},
		close () {
			this.dom.domAddress.removeClass('showAddress');
		},
		addAddress () {
			if (this.addressName !== '' &&
				this.number !== '' &&
				this.address.province !== '' && 
				this.address.city !== '' &&
				this.address.village !== '' &&
				this.otherRe.test(this.address.other)) {

				axios.post(this.addressOperator, {
					name: this.name,
					addressId: this.userAddressId,
					addressName: this.addressName,
					number: this.number,
					province: this.address.province,
					city: this.address.city,
					village: this.address.village,
					other: this.address.other
				}).then(res => {
					if (res.status === 204) {
						console.log('添加地址失败');
					} else {
						this.close();
						this.getAddress();
						this.addEvent();
					}
				}).catch(err => {
					console.error(err);
				})
			} else {
				this.dom.domSubmit.addClass('notAllowedAbsolutely');
				this.dom.domErrorAll.addClass('showErrorAll');
			}
		},
		getAddress () {
			axios.post('/user/getUserAddress', {
				name: this.name,
			}).then(res => {
				if (res.status !== 204) {
					this.userAddressArr = res.data;
				}
			}).catch(err => {
				console.error(err);
			});
		},
		checkName () {
			if (this.addressName !== '') {
				const result = this.nameRe.test(this.addressName);
				
				if (result === true) {
					this.dom.domNameError.css({
						filter: 'opacity(0)'
					});

					this.dom.domSubmit.removeClass('notAllowed');
				} else {
					this.dom.domNameError.css({
						filter: 'opacity(1)'
					});

					this.dom.domSubmit.addClass('notAllowed');
				}

				this.dom.domName.focus(() => {
					this.dom.domNameError.css({
						filter: 'opacity(0)'
					});
				});

				this.checkEmpty();
			}
		},
		checkNumber () {
			if (this.number !== '') {
				const result = this.numberRe.test(this.number);

				if (result === true) {
					this.dom.domNumberError.css({
						filter: 'opacity(0)'
					});

					this.dom.domSubmit.removeClass('notAllowed');
				} else {
					this.dom.domNumberError.css({
						filter: 'opacity(1)'
					});

					this.dom.domSubmit.addClass('notAllowed');
				}

				this.dom.domNumber.focus(() => {
					this.dom.domNumberError.css({
						filter: 'opacity(0)'
					});
				});

				this.checkEmpty();
			}
		},
		addEvent () {
			setTimeout(() => {
				const li = $('#address > ul > li');
				li.hover(function () {
					$(this).children('aside').css('bottom', '0');
				}, function () {
					$(this).children('aside').css('bottom', '-2em');
				});

				li.click(function () {
					$(this).siblings('.blueBorder').removeClass('blueBorder');
					$(this).addClass('blueBorder');
				});
			}, 200);
		},
		selected (index) {
			const selectedAddress = this.userAddressArr[index];
			this.userAddressId = selectedAddress._id;
		},
		editAddress (index) {
			const id = this.userAddressArr[index]._id;
			this.show('/user/editAddress', id);
		},
		delAddress (index) {
			const id = this.userAddressArr[index]._id;

			axios.post('/user/delAddress', {
				name: this.name,
				addressId: id,
			}).then(res => {
				if (res.status === 204) {
					console.log('删除地址失败');
				} else {
					if (this.userAddressArr.length - 1 === 0) {
						this.userAddressArr = [];
					} else {
						this.getAddress();
					}
				}
			}).catch(err => {
				console.error(err);
			});
		},
		settlement () {
			axios.post('/user/settlement', {
				name: this.name,
				addressId: this.userAddressId,
				carId: this.carId,
				products: this.shortCarArr,
				totalMoney: this.money
			}).then(res => {
				if (res.status === 200) {
					window.location.replace("/user/settlement");
				} else {
					console.log('结算失败');
				}
			}).catch(err => {
				console.error(err);
			});
		}
	}
});