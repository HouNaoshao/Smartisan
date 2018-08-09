/********** jQuery **********/

$(() => {
	const input = $('main > section ul li > input');
	let li = undefined;

	input.focus(function () {
		li = $(this).parent();
		li.addClass('blueBorder');

		input.blur(function () {
			li.removeClass('blueBorder');
		});
	});
});

/********** vue **********/

const registerVue = new Vue({
	el: '#login',
	data: {
		name: '',
		nameExist: false,
		pwd: '',
		checkBox: false,
		dom: {
			domName: '',
			domNameError: '',
			domPwd: '',
			domPwdError: '',
			domSubmit: ''
		}
	},
	mounted () {
		this.dom.domName = $('#name');
		this.dom.domNameError = this.dom.domName.siblings('.error-name');
		this.dom.domPwd = $('#pwd');
		this.dom.domPwdError = this.dom.domPwd.siblings('.error-pwd');
		this.dom.domSubmit = $('#submit');
	},
	methods: {
		checkName () {
			if (this.name !== '') {
				axios.post('/user/checkName', {
					name: this.name
				}).then(res => {
					if (res.status === 204) {
						this.dom.domNameError.css({
							filter: 'opacity(1)'
						});

						this.dom.domSubmit.addClass('notAllowedAbsolutely');

						this.dom.domName.focus(() => {
							this.dom.domNameError.css({
								filter: 'opacity(0)'
							});
						});
					} else {
						this.dom.domSubmit.removeClass('notAllowedAbsolutely');
						this.nameExist = true;
					}
				}).catch(err => {
					console.error(err);
				});
			}
		},
		pwdMatch () {
			if (this.nameExist === true && this.pwd !== '') {
				axios.post('/user/checkPwd', {
					name: this.name,
					pwd: this.pwd
				}).then(res => {
					if (res.status === 204) {
						this.dom.domPwdError.css({
							filter: 'opacity(1)'
						});

						this.dom.domSubmit.addClass('notAllowed');

						this.dom.domPwd.focus(() => {
							this.dom.domPwdError.css({
								filter: 'opacity(0)'
							});
						});
					} else {
						this.dom.domSubmit.removeClass('notAllowed');
					}
				}).catch(err => {
					console.error(err);
				});
			}
		},
		foreverCookie () {
			if (this.checkBox === true) {
				axios.post('/user/foreverCookie', {
					name: this.name
				}).then(res => {

				}).catch(err => {
					console.error(err);
				});
			}
		}
	}
});