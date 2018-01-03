window.onload = function() {
	let doc = document,
		start = doc.getElementById('open-btn'),	// Кнопка начала
		pizza = doc.getElementById('pizza-box'),	// Коробка пиццы		
		pizzaField = doc.querySelector('.bm'),	// Дно коробки, куда положим пиццу в конце
		topImg = doc.getElementById('top-image'),	// Логотип пиццы на коробке
		panel = doc.getElementById('pnl'),	// Панель меню
		pizzaIcon = panel.querySelector('.pizza img'),	// Мини-иконка пиццы сбоку
		items = panel.querySelectorAll('.ingridienti li'),	// Список всех ингридиентов
		order = panel.querySelector('#order-btn'),	// Кнопка заказа
		selected = panel.querySelectorAll('.selected-items img'),	// Иконки выбранных эл-ов
		stopwatch = doc.getElementById('stopwatch'),	// Секундомер
		stopwatchTime = stopwatch.querySelector('p'),	// Секундомер - поле для времени
		priceField = panel.querySelector('.price span'),	// Поле цены
		price = 0,	// Начальная цена
		begin = function() {	// Открываем коробку и панель меню
			topImg.style.opacity = 0; 
			pizza.classList.add('opened');
			start.style.display = 'none';
			setTimeout(() => panel.style.display = 'block', 1000);			
		},
		drawElems = function( num ) {	// Рисуем иконку пиццы в зав-сти от кол-ва выбранных разделов
			pizzaIcon.className = ( !num ) ? 'zero' : (num === 1) ? 'unquarto' : (num === 2) ? 'meta' : (num === 3) ? 'quasi' : 'full';
			order.style.display = (num === 4) ? 'block' : 'none';	// Если все выбраны - рисуем кнопку 'заказать'
		},
		check = function() {	// Проверка кол-вы выбранных эл-ов каждого раздела
			let items  = panel.querySelectorAll('.selected'),
				types = [0,0,0,0],
				result;
			items.forEach(( item ) => {
				switch(item.parentNode.getAttribute('data-type')) {
					case 'base':
						types[0]++;
						break;
					case 'first':
						types[1]++;
						break;
					case 'second':
						types[2]++;
						break;
					case 'sauce':
						types[3]++;
						break;	
				};
			});			
			drawElems(types.filter(( a ) => a != 0).length);	// Передаем кол-во выбранных разделов
		},
		selection = function(el, i) {	// Выбор ел-ов
			let cost  = parseFloat(el.getAttribute('data-cost'));
			if( !el.classList.contains('selected') ) {	// Если не выбран то выбираем и суммируем
				el.classList.add('selected');
				selected[i].style.display = 'inline-block';
				price += cost;
			} else {	// Если уже выбран - убираем и отнимаем
				el.classList.remove('selected');
				selected[i].style.display = 'none';
				price -= cost;
			}
			priceField.innerHTML = price.toFixed(2);
			check()	// Запускаем проверку отмеченных полей	
		},
		typeOfPizza = function() {
		// Проверка типа выбранной пиццы. P.S. т.к. в заданнии всего этого небыло то сделал очень примитивную проверку, чтоб не захламлять лишним кодом
			let items = [],
				pizzaName;
			panel.querySelectorAll('.selected img').forEach(( item ) => items.push( item.getAttribute('alt') ));
			pizzaName = (items.indexOf('frutti di mare') != -1) ? 'mare' : (items.indexOf('salame') != -1) ? 'salame' : (items.indexOf('funghi') != -1) ? 'funghi' : 'default';
			pizzaField.innerHTML = `<img src="images/pizze/${pizzaName}.png" alt="pizza pronta">`;
		},
		drawSmoke = function() {
			let canvas = doc.getElementById('c'),
				ctx = canvas.getContext('2d'),
				smoke = smokemachine(ctx, [255, 255, 255, .9])	// цвет
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			canvas.style.zIndex = 1000;
			smoke.start();
			setInterval(function() {
				smoke.addsmoke(800,500,30)	// постоянно добавляем дымка
			}, 1000);
		},
		coocking = function() {	// Закрываем коробку, рисуем секундомер, убираем секундомер и открываем коробку
			pizza.classList.remove('opened');
			pizza.classList.add('final');
			panel.classList.add('panelOut')
			setTimeout(() => {
				stopwatch.style.display = 'block';
				stopwatchGo(0);	// Запускаем отсчет
			}, 1000);
			setTimeout(() => {
				pizza.classList.remove('final');
				pizza.classList.add('ready');
				typeOfPizza();	// Проверяем какой тип пиццы		
				stopwatch.style.display = 'none';
				drawSmoke();
			}, 8000);
		},
		stopwatchGo = function( i ) {	// Секундомер до 6 минут
			if( i === 6) {
				doc.querySelector('#stopwatch .min').classList.add('rotateEnd');
				stopwatchTime.innerHTML = i + 'мин';
				stopwatch.children[0].classList.add('readyAnim');
				return;
			}
			stopwatchTime.innerHTML = i + ' мин';
			setTimeout(() => stopwatchGo(++i), 1000);
		};	
	start.addEventListener('click', begin, {once: true});
	order.addEventListener('click', coocking, {once: true});
	items.forEach((item, i) => item.addEventListener('click', () => selection(item, i)));
};







