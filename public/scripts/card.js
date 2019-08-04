
const cards = [
  {
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRORccZWdtma5BG3TTJdS7-fKllC1xcSOXOtu1o0ZM_Myxr32QQ',
    name: 'ลิซ่า',
    age: '20',
    location: 'BKK'
  },
  {
    img: 'https://icatcare.org/sites/default/files/kcfinder/images/figaro.gif',
    name: 'ลิซ่า 2',
    age: '20',
    location: 'BKK'
  },
  {
    img: 'https://cdn1.iconfinder.com/data/icons/halloween-2072/500/halloween-cartoon-horror-cute_4-512.png',
    name: 'ลิซ่า 3',
    age: '20',
    location: 'BKK'
  },
  {
    img: 'https://i.kisscc0.com/20180813/iqw/kisscc0-whiskers-line-art-cat-cartoon-cartoon-cat-5b71c901e2cd67.783279991534183681929.png',
    name: 'ลิซ่า 4',
    age: '20',
    location: 'BKK'
  },
  {
    img: 'https://carwad.net/sites/default/files/cute-cat-cartoon-125159-7401014.png',
    name: 'ลิซ่า 5',
    age: '20',
    location: 'BKK'
  },
  {
    img: 'https://i.pinimg.com/originals/7a/06/ee/7a06ee13eb72bddd8c7f4f8fdd52dae0.png',
    name: 'ลิซ่า 6',
    age: '20',
    location: 'BKK'
  },
  {
    img: 'http://offtheleashdogcartoons.com/wp-content/uploads/2015/03/6.Odie_Garfield_Wikipedia.png',
    name: 'ลิซ่า',
    age: '20',
    location: 'BKK'
  },
  {
    img: 'https://i.pinimg.com/originals/bd/a4/45/bda445a353cff250815f7ccedae8ab1d.png',
    name: 'ลิซ่า',
    age: '20',
    location: 'BKK'
  },
  {
    img: 'http://www.oocities.org/televisioncity/stage/8595/bear.gif',
    name: 'ลิซ่า',
    age: '20',
    location: 'BKK'
  },
  {
    img: 'https://www.english-grammar.at/online_exercises/tenses/images/rex-dog.gif',
    name: 'ลิซ่า',
    age: '20',
    location: 'BKK'
  },
];

let state = {
  coordinates: {
    mouseCoordinates: {
      x: null,
      y: null
  },
    blockCoordinates: null
  },
  element: null,
  cards: cards
}

let app = document.querySelector('.app');
let cardsBlock = document.querySelector('.app--cards');

// document.querySelector('.app--accept').addEventListener('click', () => hideObject(0));
// document.querySelector('.app--cancel').addEventListener('click', () => hideObject(1));

document.querySelector('.app--accept').addEventListener('click', onButtonClick);
document.querySelector('.app--cancel').addEventListener('click', onButtonClick);

document.querySelector('.app--restart').addEventListener('click', () => alert('Sorry! This button doesnt work right now. \nPlease reload the page'));

cardsBlock.innerHTML = getCardsMarkup();
setCardStyle();

function getCardsMarkup() {
  let markUp = '';
  state.cards.map((item, index) => {
    markUp += '<div class="app--element"><img src="' + item.img +'"></div><p class="pic-name">สวัสดี คุณ'+ item.name + '</p><p class="pic-detail">อายุ '+ item.age + ' ปี ● ' + item.location + '</p>';
  })
  
  return markUp;
}

function setCardStyle(from = 0) {
  const elements = document.querySelectorAll('.app--element:not(.removed)');
  const length = state.cards.length;
  
  if (!elements.length) {
    onElementsEnd()
  }
  
  for (let i = from; i < elements.length; i++) {
    elements[i].style.zIndex = elements.length - i;
    elements[i].style.transform = 'scale(' + (length - ((i - from) * 0.5))/length + ') translateY(-' + (i - from) * 20 + 'px)';
    elements[i].style.opacity = (length - ((i - from)*0.8))/length;
    if (!i) {
      elements[i].addEventListener('touchstart', moveElement);
      elements[i].addEventListener('mousedown', moveElement);
    }
  }
}

function moveElement(e) {
    console.log('im moving');
	e.preventDefault();
  
	state.coordinates = {
		mouseCoordinates: {
			x: getElementPosition(e).x,
			y: getElementPosition(e).y
		},
		blockCoordinates: cardsBlock.getBoundingClientRect()
	}
  
  state.element = e.currentTarget;

	app.addEventListener('mouseup', onEndBlockMove);
	app.addEventListener('touchend', onEndBlockMove);

	app.addEventListener('mousemove', onBlockMove);
	app.addEventListener('touchmove', onBlockMove);
}

function onBlockMove(e) {
	const block = state.element;
  block.setAttribute('isMovable', 'true');
	let mousePosition = {
		x: getElementPosition(e).x,
		y: getElementPosition(e).y
	}
	const deltaX = state.coordinates.mouseCoordinates.x - mousePosition.x;
	const deltaY = state.coordinates.mouseCoordinates.y - mousePosition.y;
  
  block.style.transition = '';
	block.style.left = - deltaX + 'px';
	block.style.top = - deltaY + 'px';
	block.style.transform = 'rotate(' + deltaX * 0.1 + 'deg) translateX(0%)';
  setCardStyle(1)
}

function onEndBlockMove(e) {
    console.log('end');
  const endPosition = state.element.getBoundingClientRect();
  const deltaX = state.coordinates.blockCoordinates.left -  endPosition.left;
  
  if (deltaX > state.element.offsetWidth/2 || deltaX < -state.element.offsetWidth/2) {
    hideObject(+ (deltaX < 0))

  } 
  else {
    returnBlockBack();
  }

  app.removeEventListener('mouseup', onEndBlockMove)
  app.removeEventListener('touchend', onEndBlockMove)

  app.removeEventListener('mousemove', onBlockMove)
  app.removeEventListener('touchmove', onBlockMove)
}

function moveBlockOutside(delta) {
  let block;
  if ( state.element ) {
    block = state.element;
  } else {
    block = document.querySelector('.app--element:not(.removed)')
  }
  
  block.style.transition = 'transform .25s, opacity .25s';

  if (delta) {
    // className = 'moveRight';
    block.style.transform = block.style.transform + ' translateX(250%)';
  } else {
    block.style.transform = block.style.transform + ' translateX(-250%)';
  }
  block.classList.add('removed');
}

function returnBlockBack() {
  state.element.style.transition = 'left .25s, top .25s';
  state.element.style.left = '0px';
  state.element.style.top = '0px'
  state.element.style.transform = 'rotate(0deg)';
  state.element.setAttribute('isMovable', 'false');
  setCardStyle();
  
  state.element = null;
};

function getElementPosition(e) {
	let obj;
	if (e.touches) {
		obj = {
			x: e.touches[0].clientX,
			y: e.touches[0].clientY
		}
	} else {
		obj = {
			x: e.clientX,
			y: e.clientY 
		}
	}

	return obj;
}

function getScreenSize() {
  return {width: screen.width, height: screen.height}
}

function hideObject(delta) {
    moveBlockOutside(delta);
    setCardStyle();
}

function onButtonClick(e) {
  var buttonClass = e.currentTarget.className;
  state.element = cardsBlock.querySelector('.app--element:not(.removed)');
  state.element.style.opacity = '0';
  if (/accept/ig.test(buttonClass)) {
    // console.log('it is accept')
    hideObject(0)
  } else {
    // console.log('it is cancel')
    hideObject(1)
  }
}

function onElementsEnd() {
  document.querySelector('.app--buttons').classList.add('hidden');
  document.querySelector('.app--title').classList.add('hidden');
  document.querySelector('.app--restart').classList.remove('hidden');
  document.querySelector('.app--restart').classList.remove('hidden');
}








