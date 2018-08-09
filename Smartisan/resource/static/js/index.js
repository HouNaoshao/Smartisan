/********* carousel *********/
$(() => {
	const img = $('#banner img');
	const li = $('#banner ul li');
	const len = img.length;
	var index = 0;

	function changeIndex() {
		index++;

		if (index === len) {
			index = 0;
		}
	}

	function changeImg() {
		changeIndex();
		if (index === 0) {
			$(img[len-1]).removeClass('showFigure');
			$(li[len-1]).removeClass('changeButton');
		} else {
			$(img[index-1]).removeClass('showFigure');
			$(li[index-1]).removeClass('changeButton');
		}
		
		$(img[index]).addClass('showFigure');
		$(li[index]).addClass('changeButton');
	}

	let timer = setInterval(changeImg, 5000);

	
	li.click(function () {
		clearInterval(timer);

		let targetIndex = $(this).index();

		if (targetIndex !== index) {
			$(img[index]).removeClass('showFigure')
			$(li[index]).removeClass('changeButton');

			$(img[targetIndex]).addClass('showFigure');
			$(li[targetIndex]).addClass('changeButton');

			index = targetIndex;
		}

		timer = setInterval(changeImg, 5000);
	});
});

/********** banner **********/

$(() => {
	const banner = $('#banner');

	const box_left = banner.offset().left,
          box_top = banner.offset().top,
          box_Width = banner.outerWidth(),
          box_Height = banner.outerHeight();

    banner.mousemove((e) => {
        let X = e.pageX - box_left - box_Width / 2,
            Y = box_Height / 2 - e.pageY - box_top;

        banner.css({
            'transform': 'rotateX(' + Y / 50 + 'deg) rotateY(' + X / 50 + 'deg)'
        });

        banner.mouseout(() => {
            banner.css({
                'transform': 'rotateX(0deg) rotateY(0deg)'
        	});
    	});
   	});
});

/********** hot-cursor **********/

$(() =>{
	const ul = $('#hot-Products > ul');
	const left = $('#left');
	const right = $('#right');

	left.click(() => {
		left.addClass('disable');
		right.removeClass('disable');
		ul.removeClass('translateX');
	});

	right.click(() => {
		left.removeClass('disable');
		right.addClass('disable');
		ul.addClass('translateX');
	});
});

/********** dot show-operator **********/

setTimeout(() => {
	const li = $('main > article > ul > li');
	const dot = li.children('ul').children('li');

	li.hover(function () {
		$(this).children('aside').addClass('showOperator');
		$(this).children('p').addClass('hide');
	}, function () {
		$(this).children('aside').removeClass('showOperator');
		$(this).children('p').removeClass('hide');
	});

	dot.hover(function () {
		const index = $(this).index();

		$(this).siblings('.outerDot').removeClass('outerDot');
		$(this).addClass('outerDot');
	});
}, 800);