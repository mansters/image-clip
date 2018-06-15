const _styleCropContainer = `position: relative;`,

    _styleMainBox = `border: 1px solid white;
    position: absolute;
    top: 0;
    left: 0;
    margin: 0;
    padding: 0;
    width: 150px;
    height: 150px;
    cursor: move;`,

    _styleCorpImgBg = `opacity: 0.5;
    position: absolute;
    top: 0;
    left: 0;`,

    _styleCorpImgClip = `position: absolute;
    top: 0;
    left: 0;
    clip: rect(0, 150px, 150px, 0);`,

    _styleMinBox = `position: absolute;
    height: 8px;
    width: 8px;
    background-color: white;`,

    _styleTl = `top: -4px;
    left: -4px;
    cursor: nw-resize;`,

    _styleTop = `left: 50%;
    margin-left: -4px;
    top: -4px;
    cursor: n-resize;`,

    _styleTr = `right: -4px;
    top: -4px;
    cursor: ne-resize;`,

    _styleLeft = `top: 50%;
    margin-top: -4px;
    left: -4px;
    cursor: w-resize;`,

    _styleRight = `top: 50%;
    margin-top: -4px;
    right: -4px;
    cursor: e-resize;`,

    _styleBl = `bottom: -4px;
    left: -4px;
    cursor: sw-resize;`,

    _styleBottom = `bottom: -4px;
    left: 50%;
    margin-left: -4px;
    cursor: s-resize;`,

    _styleBr = `bottom: -4px;
    right: -4px;
    cursor: se-resize;`;

let _img,
    _borderMinX,
    _borderMaxX,
    _borderDiffX,
    _borderMinY,
    _borderMaxY,
    _borderDiffY,
    _startX,
    _startY,

    __WIDTH,
    __HEIGHT,

    _minWidth = 10,
    _minHeight = 10,

    _ifKeyDown = false,
    _contact = '',

    _container,
    _cropContainer,
    _cropImgBg, // 半透明背景
    _cropImgClip, // 剪裁区高亮
    _mainBox, // 剪裁框
    _tl, _top, _tr,
    _left, _right, // 剪裁拖拽点
    _bl, _bottom, _br,
    _canvas, _ctx;


export default class ImageClip {
    constructor(container, img, width) {
        document.onselectstart = new Function('event.returnValue=false;');
        _container = container;
        _canvas = document.createElement('canvas');
        _ctx = _canvas.getContext('2d');
        if (!!img && !!width) {
            this.setSource(img, width);
        }
    }

    setSource(img, width) {
        _img = img;
        const width_height_ratio = img.width / img.height;
        __WIDTH = width || img.width;
        __HEIGHT = __WIDTH / width_height_ratio;
        createCropBox(_container);
        const position = getPosition(_cropImgBg);
        _borderMinX = position.left;
        _borderMaxX = position.left + _cropImgBg.clientWidth;
        _borderDiffX = _borderMaxX - _borderMinX;
        _borderMinY = position.top;
        _borderMaxY = position.top + _cropImgBg.clientHeight;
        _borderDiffY = _borderMaxY - _borderMinY;
        setMouseEvent();
    }

    save(w, h) {
        const ratio = _img.width / __WIDTH,
            x = parseInt(_mainBox.style.left) * ratio,
            y = parseInt(_mainBox.style.top) * ratio,

            width = parseInt(_mainBox.style.width) * ratio,
            height = parseInt(_mainBox.style.height) * ratio;

        _canvas.width = w;
        _canvas.height = h;

        _ctx.drawImage(_cropImgBg, x, y, width, height, 0, 0, w, h);

        return _canvas.toDataURL('image/png');
    }
}

function createCropBox(container) {
    // create element
    _cropContainer = document.createElement('div');
    _cropImgBg = _img.cloneNode();
    _cropImgClip = _img.cloneNode();
    _mainBox = document.createElement('div');
    _tl = document.createElement('div');
    _top = document.createElement('div');
    _tr = document.createElement('div');
    _left = document.createElement('div');
    _right = document.createElement('div');
    _bl = document.createElement('div');
    _bottom = document.createElement('div');
    _br = document.createElement('div');

    // set style
    _cropContainer.style.cssText = _styleCropContainer;
    _cropImgBg.style.cssText = _styleCorpImgBg;
    _cropImgClip.style.cssText = _styleCorpImgClip;
    _mainBox.style.cssText = _styleMainBox;
    _tl.style.cssText = `${_styleMinBox}${_styleTl}`;
    _top.style.cssText = `${_styleMinBox}${_styleTop}`;
    _tr.style.cssText = `${_styleMinBox}${_styleTr}`;
    _left.style.cssText = `${_styleMinBox}${_styleLeft}`;
    _right.style.cssText = `${_styleMinBox}${_styleRight}`;
    _bl.style.cssText = `${_styleMinBox}${_styleBl}`;
    _bottom.style.cssText = `${_styleMinBox}${_styleBottom}`;
    _br.style.cssText = `${_styleMinBox}${_styleBr}`;

    _cropContainer.style.width = _cropImgBg.style.width = _cropImgClip.style.width = `${__WIDTH}px`;
    _cropContainer.style.height = _cropImgBg.style.height = _cropImgClip.style.height = `${__HEIGHT}px`;

    _mainBox.appendChild(_tl);
    _mainBox.appendChild(_top);
    _mainBox.appendChild(_tr);
    _mainBox.appendChild(_left);
    _mainBox.appendChild(_right);
    _mainBox.appendChild(_bl);
    _mainBox.appendChild(_bottom);
    _mainBox.appendChild(_br);
    _cropContainer.appendChild(_cropImgBg);
    _cropContainer.appendChild(_cropImgClip);
    _cropContainer.appendChild(_mainBox);

    container.appendChild(_cropContainer);
    container.appendChild(_canvas);

}

function setMouseEvent() {
    _tl.onmousedown = onMouseDownEventGenerator('left-up');
    _top.onmousedown = onMouseDownEventGenerator('up');
    _tr.onmousedown = onMouseDownEventGenerator('right-up');
    _left.onmousedown = onMouseDownEventGenerator('left');
    _right.onmousedown = onMouseDownEventGenerator('right');
    _bl.onmousedown = onMouseDownEventGenerator('left-down');
    _bottom.onmousedown = onMouseDownEventGenerator('down');
    _br.onmousedown = onMouseDownEventGenerator('right-down');
    _mainBox.onmousedown = onMouseDownEventGenerator('move', function (e) {
        _startX = e.clientX;
        _startY = e.clientY;
    });

    window.addEventListener('mouseup', function () {
        _ifKeyDown = false;
        _contact = '';
    });

    window.addEventListener('mousemove', function (e) {
        e.stopPropagation();
        if (_ifKeyDown) {
            switch (_contact) {
                case 'right':
                    rightMove(e);
                    break;
                case 'up':
                    upMove(e);
                    break;
                case 'left':
                    leftMove(e);
                    break;
                case 'down':
                    downMove(e);
                    break;
                case 'left-up':
                    leftMove(e);
                    upMove(e);
                    break;
                case 'right-up':
                    rightMove(e);
                    upMove(e);
                    break;
                case 'left-down':
                    leftMove(e);
                    downMove(e);
                    break;
                case 'right-down':
                    rightMove(e);
                    downMove(e);
                    break;
                case 'move':
                    move(e);
                    break;
                default:
                    break;
            }
            setChoice();
        }
    })
}

// 移动选取框
function move(e) {
    const m_move_x = e.clientX;
    const m_move_y = e.clientY;


    if (_ifKeyDown) {

        const ndx = m_move_x - _startX + parseInt(_mainBox.style.left);
        const ndy = m_move_y - _startY + parseInt(_mainBox.style.top);

        const rightBound = _borderDiffX - parseInt(_mainBox.style.width);
        const bottomBound = _borderDiffY - parseInt(_mainBox.style.height);

        if (ndx >= 0 && ndx <= rightBound) {
            _mainBox.style.left = ndx + 'px';
        } else if (ndx < 0) {
            _mainBox.style.left = '0px';
        } else {
            _mainBox.style.left = rightBound + 'px';
        }

        if (ndy >= 0 && ndy <= bottomBound) {
            _mainBox.style.top = ndy + 'px';
        } else if (ndy < 0) {
            _mainBox.style.top = '0px';
        } else {
            _mainBox.style.top = bottomBound + 'px';
        }

        _startX = m_move_x;
        _startY = m_move_y;
    }
}

// 上边移动
function upMove(e) {
    let y = e.clientY;

    if (y < _borderMinY) {
        _mainBox.style.height = parseInt(_mainBox.style.top) + _mainBox.clientHeight + 'px';
        _mainBox.style.top = '0px';
        return;
    } else if (y > _borderMaxY) {
        _mainBox.style.top = parseInt(_mainBox.style.top) + _mainBox.clientHeight - _minHeight + 'px';
        _mainBox.style.height = _minHeight + 'px';
        return;
    }

    let mainY = getPosition(_mainBox).top; // 裁剪框相对于屏幕上边的距离
    let addHeight = mainY - y; // 增加的高度
    let heightBefore = _mainBox.offsetHeight - 2; // 裁剪框变化前的高度
    let height = heightBefore + addHeight;
    if (height < _minHeight) {
        return;
    }
    _mainBox.style.height = height + 'px'; // 裁剪框变化后，设置高度
    _mainBox.style.top = _mainBox.offsetTop - addHeight + 'px'; // 裁剪框相对于父控件的距离
}

// 左边移动
function leftMove(e) {
    let x = e.clientX;

    if (x < _borderMinX) {
        _mainBox.style.width = parseInt(_mainBox.style.left) + _mainBox.clientWidth + 'px';
        _mainBox.style.left = '0px';
        return;
    } else if (x > _borderMaxX) {
        _mainBox.style.left = parseInt(_mainBox.style.left) + _mainBox.clientWidth - _minWidth + 'px';
        _mainBox.style.width = _minWidth + 'px';
        return;
    }

    let mainX = getPosition(_mainBox).left;
    let widthBefore = _mainBox.offsetWidth - 2; // 裁剪框变化前的宽度
    let addWidth = mainX - x; // 鼠标移动后，裁剪框增加的宽度
    let width = widthBefore + addWidth;
    if (width < _minWidth) {
        return;
    }
    _mainBox.style.width = width + 'px'; // 裁剪框变化后，设置宽度
    _mainBox.style.left = _mainBox.offsetLeft - addWidth + 'px'; // 裁剪框变化后，设置到父元素左边的距离
}

// 下边移动
function downMove(e) {
    let y = e.clientY;

    if (y > _borderMaxY) {
        _mainBox.style.height = __HEIGHT - parseInt(_mainBox.style.top) + 'px';
        return;
    }

    let heightBefore = _mainBox.offsetHeight - 2; // 裁剪框变化前的高度
    let mainY = getPosition(_mainBox).top; // 裁剪框相对于屏幕上边的距离
    let addHeight = y - heightBefore - mainY; // 增加的高度
    let height = heightBefore + addHeight;
    if (height < _minHeight) {
        return;
    }
    _mainBox.style.height = height + 'px'; // 裁剪框变化后，设置高度
}

// 右边移动
function rightMove(e) {
    let x = e.clientX;// 鼠标x坐标

    if (x > _borderMaxX) {
        _mainBox.style.width = __WIDTH - parseInt(_mainBox.style.left) + 'px';
        return;
    }

    let posMainBox = getPosition(_mainBox);
    let widthBefore = _mainBox.offsetWidth - 2; // 裁剪框变化前的宽度
    let addWidth = x - posMainBox.left - widthBefore; // 鼠标移动后，裁剪框增加的宽度
    let width = widthBefore + addWidth;
    if (width < _minWidth) {
        return;
    }
    _mainBox.style.width = width + 'px'; // 裁剪框变化后，设置宽度
}

// 设置裁剪框的位置
function setChoice() {
    let top = _mainBox.offsetTop;
    let right = _mainBox.offsetLeft + _mainBox.offsetWidth;
    let bottom = _mainBox.offsetTop + _mainBox.offsetHeight;
    let left = _mainBox.offsetLeft;
    _cropImgClip.style.clip = 'rect(' + top + 'px, ' + right + 'px, ' + bottom + 'px, ' + left + 'px)';

}

// 获取元素相对于屏幕左边的距离 offsetLeft，offsetTop
function getPosition(node) {
    let left = node.offsetLeft;
    let top = node.offsetTop;
    let parent = node.offsetParent;
    while (parent != null) {
        left += parent.offsetLeft;
        top += parent.offsetTop;
        parent = parent.offsetParent;
    }
    return {'left': left, 'top': top, x: node.x, y: node.y};
}

function onMouseDownEventGenerator(type, cb) {
    return function (e) {
        e.stopPropagation();
        _ifKeyDown = true;
        _contact = type;
        cb && cb(e);
    }
}
