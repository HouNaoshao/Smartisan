/********* header *********/

setTimeout(()=>{
	const pAvatar = $('#p-avatar');
	const pInfo = $('#p-info');

	pAvatar.hover(() => {
		pInfo.addClass('show');
	}, () => {
		pInfo.removeClass('show');
	});

	pInfo.hover(() => {
		pInfo.addClass('show');
	}, () => {
		pInfo.removeClass('show');
	});

	const shortcar = $('#shortcar');
	const pShortcar = $('#p-shortcar');
	const delProduct = $('#p-shortcar > div > ul > li > span');

	shortcar.hover(() => {
		pShortcar.addClass('show');
	}, () => {
		pShortcar.removeClass('show');
	});

	pShortcar.hover(function () {
		pShortcar.addClass('show');
	}, function () {
		pShortcar.removeClass('show');
	});
}, 700);