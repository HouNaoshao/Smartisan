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

const changePwdVue = new Vue({
	el: '#changePwd',
	data: {
		name: '',
		changeName: '',
		oldPwd: '',
		pwd: '',
		rePwd: '',
		dom: {
			domName: '',
			domNameError: '',
			domOldPwd: '',
			domOldPwdError: '',
			domPwd: '',
			domRePwd: '',
			domRePwdError: '',
			domSubmit: ''
		}
	},
	mounted () {
		const name = $.cookie('name');
		const foreverName = $.cookie('foreverName');

		function b64EncodeUnicode(str) {
		    return decodeURIComponent(atob(str).split('').map((c) => {
		        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
		    }).join(''));
		};

		if (name) {
			this.name = b64EncodeUnicode(name);
		} else if (foreverName) {
			this.name = b64EncodeUnicode(foreverName);
		}

		this.dom.domName = $('#name');
		this.dom.domNameError = this.dom.domName.siblings('.error-name');
		this.dom.domOldPwd = $('#oldPwd');
		this.dom.domOldPwdError = this.dom.domOldPwd.siblings('.error-pwd');
		this.dom.domPwd = $('#pwd');
		this.dom.domRePwd = $('#rePwd');
		this.dom.domRePwdError = this.dom.domRePwd.siblings('.error-rePwd');
		this.dom.domSubmit = $('#submit');

		this.dom.domPwd.focus(() => {
			this.dom.domSubmit.addClass('notAllowed');
		});
	},
	methods: {
		pwdMatch () {
			if (this.pwd !== '' &&
				this.rePwd !== '') {

				if (this.pwd === this.rePwd) {
					this.dom.domSubmit.removeClass('notAllowed');
					this.dom.domRePwdError.css({
						filter: 'opacity(0)'
					});
				} else {
					this.dom.domSubmit.addClass('notAllowed');

					this.dom.domRePwdError.css({
						filter: 'opacity(1)'
					});

					this.dom.domRePwd.focus(() => {
						this.dom.domRePwdError.css({
							filter: 'opacity(0)'
						});
					});

					this.dom.domPwd.focus(() => {
						this.dom.domRePwdError.css({
							filter: 'opacity(0)'
						});
					});
				}
			}
		},
		oldPwdMatch () {
			if (this.name !== '' && this.oldPwd !== '') {
				axios.post('/user/checkPwd', {
					name: this.name,
					pwd: this.oldPwd
				}).then(res => {
					if (res.status === 204) {
						this.dom.domOldPwdError.css({
							filter: 'opacity(1)'
						});

						this.dom.domSubmit.addClass('notAllowedAbsolutely');

						this.dom.domOldPwd.focus(() => {
							this.dom.domOldPwdError.css({
								filter: 'opacity(0)'
							});
						});
					} else {
						this.dom.domOldPwdError.css({
							filter: 'opacity(0)'
						});

						this.dom.domSubmit.removeClass('notAllowedAbsolutely');
					}
				}).catch(err => {
					console.error(err);
				});
			}
		},
		checkName () {
			if (this.changeName !== '') {
				axios.post('/user/checkName', {
					name: this.changeName
				}).then(res => {
					if (res.status === 200) {
						this.dom.domNameError.css({
							filter: 'opacity(1)'
						});

						this.dom.domSubmit.addClass('notAllowed');

						this.dom.domName.focus(() => {
							this.dom.domNameError.css({
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
		}
	}
});