/********** jQuery **********/

$(() => {
	const section = $('main > section');
	const section0 = section.eq('0');
	const top1 = section.eq('1').offset().top - 40;
	const windows = $(window);
	let scrollTop = 0;
	let top = 0;

	windows.scroll(function(){
		scrollTop = windows.scrollTop();

		if (scrollTop >= top1) {
			top = scrollTop - top1;
			section0.addClass('fixed');
		} else {
			section0.removeClass('fixed');
		}
	});
});

$(() => {
	const input = $('#add-address > div > ul li > input');
	let li = undefined;

	input.focus(function () {
		li = $(this).parent();
		li.addClass('blueBorder');

		input.blur(function () {
			li.removeClass('blueBorder');
		});
	});
});


/********** Vue ************/
/***** vue-component *****/

const myOrder = {
	props: [ 'orderArr' ],
	template: `
		<section>
            <header><p>我的订单</p></header>
            <template v-if="orderArr.length === 0">
                <figure id="no-order">
                    <img src="/img/icon/order-empty.png">
                    <figcaption><span>空空如也</span></figcaption>
                </figure>                
            </template>
            <template v-else>
                <section  id="myOrder">
                    <article v-for="(order, index) of orderArr">
                        <ul class="cols">
                            <li class="date">2018-07-31</li>
                            <li class="orderId">订单号：<a class="ID">{{ order.orderId }}</a></li>
                            <li class="price">单价</li>
                            <li class="quantity">数量</li>
                            <li class="total">总额</li>
                            <li class="detail">状态</li>
                        </ul>
                        <div>
	                        <ul class="products" v-for="product of order.products">
	                            <li class="p-img">
	                                <a :href="'/product/' + product.product._id">
	                                	<img :src="product.smallImg.product[0]">
	                                </a>
	                            </li>
	                            <template v-if="product.capacity">
	                            	<li class="p-name">{{ product.product.name }} 
	                            	( {{ product.color.name }}，{{ product.capacity.name }} ）</li>
	                            	<li class="p-price">¥ <span>{{ product.capacity.price }}</span></li>
	                            </template>
	                            <template v-else>
	                            	<li class="p-name">{{ product.product.name }}</li>
	                            	<li class="p-price">¥ <span>{{ product.product.price }}</span></li>
	                            </template>
	                            <li class="p-quantity">{{ product.quantity }}</li>
	                        </ul>
	                        <ul class="p-aside">
	                        	<li class="p-total">¥ <span class="p-price">{{ order.totalMoney }}</span></li>
	                            <li class="p-state">{{ order.state }}</li>
	                        </ul>
	                    </div>
                    </article>
                </section>
            </template>
        </section>
    `
};

const myInfo = {
	props: [ 'user', 'file' ],
	template: `
		<section>
            <header><p>账户资料</p></header>
                <section id="personInfo">
                    <ul>
                        <li>
                            <figure>
                                <img :src="user.avatar">
                                <figcaption>
                                    <p>修改头像</p>
                                    <label for="file">上传图片</label>
                                    <input type="file" name="file" id="file" @change="$emit('upload')" >
                                </figcaption>
                            </figure>
                        </li>
                        <li>
                            <div>
                                <p>
                                    <img src="/img/icon/right.png">
                                账户昵称</p>
                                <span>{{ user.name }}</span>
                            </div>
                            <a href="/user/changeName">修改</a>
                        </li>
                        <li>
                            <div>
                                <p>
                                    <img src="/img/icon/right.png">
                                登录密码</p>
                                <span>互联网账号存在被盗风险，建议您定期更改密码以保护账户安全。</span>
                            </div>
                            <a href="/user/changePwd">修改</a>
                        </li>
                    </ul>
                </section>
        </section>
	`
};

const myAddress = {
	props: [ 'userAddressArr' ],
	template: `
		<section>
            <header>
                <p>收货地址</p>
                <a @click="$emit('show', '/user/addAddress')">添加新地址</a>
            </header>
            <template v-if="userAddressArr.length !== 0">
                <section id="address">
                    <header>
                        <span>姓名</span>
                        <span>详细地址</span>
                        <span>手机号</span>
                        <span>操作</span>
                    </header>
                    <ul>
                        <li v-for="(address, index) of userAddressArr">
                            <span>{{ address.addressName }}</span>
                            <span>
                            	{{ address.province }} {{ address.city }} 
                            	{{ address.village }} {{ address.other }}
                            </span>
                            <span>{{ address.number }}</span>
                            <span>
                            	<a class="editAddress" @click="$emit('editaddress', index)"></a>
                				<a class="delAddress" @click="$emit('deladdress', index)"></a>
                            </span>
                        </li>
                    </ul>
                </section>
            </template>
        </section>
	`
};

/***** vue-instance *****/

const userIndexVue = new Vue({
	el: '#user-index',
	data: {
		name: '',
		user: '',
		userAddressArr: '',
		userAddressId: '',
		orderArr: '',
		addressName: '',
		addressOperator: '',
		personUrl: '',
		carUrl: '',
		carId: '',
		shortCarArr: '',
		quantity: 0,
		contain: '1',
		file: '',
		component: 'myOrder',
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
		addressArr: [],
		addressTmp: {
			provinceData: '',
			provinceIndex: 0,
			cityData: '',
			cityIndex: 0
		},
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

		/********** href **********/

		const href = window.location.href;
		const tmpArr = href.split('=');
		const len = tmpArr.length;

		if (len !== 1) {
			const component = tmpArr[len - 1];
			this.component = component;

			if (component === 'myOrder') {
				aside.children().eq(0).addClass('asideBg');
			}

			if (component === 'myInfo') {
				aside.children().eq(1).addClass('asideBg');
			}

			if (component === 'myAddress') {
				aside.children().eq(2).addClass('asideBg');
			}
		} else {
			aside.children().eq(0).addClass('asideBg');
		}

		/********** user **********/

		const name = $.cookie('name');
		const foreverName = $.cookie('foreverName');
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
			person.addClass('hideAbsolute');
			car.addClass('hideAbsolute');
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

		/***** getAddress *****/

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
			}
		}).catch(err => {
			console.error(err);
		});

		/***** get order *****/

		axios.post('/user/getOrder', {
			name: this.name
		}).then(res => {
			this.orderArr = res.data;
		}).catch(err => {
			console.error(err);
		})
	},
	components: {
		'myOrder': myOrder,
		'myInfo': myInfo,
		'myAddress': myAddress
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
		exit () {
			$.removeCookie('name');
			$.removeCookie('foreverName');
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
			const index = $(event.target).parent().index();
			const itemId = this.shortCarArr[index]._id;

			axios.post('/delFromCar', {
				itemId,
				'carId': this.carId
			}).then(res => {
				if (res.status === 200) {
					this.shortCarArr.splice(index, 1);
					this.updateQuantity();
				}
			}).catch(err => {
				console.error(err);
			});
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
		upload () {
			let imgData = $(this.$el).find('#file')[0].files;//取到上传的图片
			let formData = new FormData()
			const maxSize = 2 * 1024 * 1024;
			const config = {
                headers: { 'content-type': 'multipart/form-data' }
            }; 

			if (imgData[0].size > maxSize) {
				alert('图片不能大于2M');
			} else {
				formData.append('file', imgData[0]);

				axios.post('/postName', { 'name': this.name })
				.then(res => {

					axios.post('/upload', formData, config)
					.then(res => {
						if (res.status === 204) {
							alert('上传失败，请稍后重试');
						} else {

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
					}).catch(err => {
						console.error(err);
					});

				}).catch(err => {
					console.error(err);
				});
			}
		}
	}
});