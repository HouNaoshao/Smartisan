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
	el: '#register',
	data: {
		name: '',
		pwd: '',
		rePwd: '',
		dom: {
			domName: '',
			domNameError: '',
			domPwd: '',
			domRePwd: '',
			domRePwdError: '',
			domSubmit: ''
		}
	},
	mounted () {
		this.dom.domName = $('#name');
		this.dom.domNameError = this.dom.domName.siblings('.error-name');
		this.dom.domPwd = $('#pwd');
		this.dom.domRePwd = $('#rePwd');
		this.dom.domRePwdError = this.dom.domRePwd.siblings('.error-rePwd');
		this.dom.domSubmit = $('#submit');

		this.dom.domPwd.focus(() => {
			this.dom.domSubmit.addClass('notAllowed');
		});
	},
	methods: {
		checkName () {
			if (this.name !== '') {
				axios.post('/user/checkName', {
					name: this.name
				}).then(res => {
					if (res.status === 200) {
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
					}
				}).catch(err => {
					console.error(err);
				});
			}
		},
		pwdMatch () {
			if (this.name !== '' &&
				this.pwd !== '' &&
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
		}
	}
});