var myElement = document.getElementById('myElement');
var accordionElm = document.getElementById('accordion');
var accordion = $('#accordion');
var menuMc = new Hammer(accordionElm);
var lastHover;
var currentFolder;
var lastFolder;

var cursor = $('#cursor');
var cursorStartDis = 0;

menuMc.get('pinch').set({
    enable: true
});

var thirdStartDis = -1;
var currentTop = 0;
var timeoutId = 0;
menuMc.on('hammer.input', function(ev) {
    var len = ev.pointers.length;
    myElement.textContent = '';

    for(var i=0;i<len;i++) {
        var pt = ev.pointers[i];
        myElement.textContent += '(' + pt.clientX + ', ' + pt.clientY + ') ';
    }

    if(len > 2) {
        var currentY = ev.pointers[2].clientY;
        if(thirdStartDis == -1)
            thirdStartDis = currentY, currentTop = parseInt(currentFolder.children().first().css('top'), 10);
        else if(currentFolder.height() > 0) {
            var cfh = parseInt(currentFolder.css('height'), 10);
            var ele = currentFolder.children("ul").children("li");
            var len = ele.size();
            var sgn = ele.first() ? ele.first().height() : 0;
            var ful = sgn * len;
            currentFolder.children().css('top', Math.max(- ful + cfh * 0.5, Math.min(cfh * 0.5, currentTop - thirdStartDis + currentY)));
        }

        clearTimeout(timeoutId);
        timeoutId = setTimeout(function() {
            thirdStartDis = -1;
        }, 50);
    } else {
        thirdStartDis = -1;
    }
});

menuMc.on("pinch", function(ev) {
    ev.center.x = (ev.pointers[0].clientX + ev.pointers[1].clientX) * 0.5;
    ev.center.y = (ev.pointers[0].clientY + ev.pointers[1].clientY) * 0.5;

    //获取光标处的元素
    // var cursorElem = document.elementFromPoint(ev.center.x, ev.center.y);
    var cursorElem = $(document.elementFromPoint(ev.center.x, ev.center.y));


    //hover效果呈现
    if (lastHover && lastHover.hasClass('hover')) lastHover.removeClass('hover');
    if (!cursorElem.hasClass('hover')) {
        cursorElem.addClass('hover');
        lastHover = cursorElem;
    }

    //修改光标位置

    cursor.css('top', ev.center.y + 'px');

    //设置父菜单节点
    if (cursorElem.hasClass('folder')) //当前元素为folder
        currentFolder = cursorElem.next('.subDiv');
    else if (cursorElem.hasClass('subDiv'))
        currentFolder = cursorElem; //当前元素为subDiv
    else if (cursorElem.parents('.subDiv'))
        currentFolder = cursorElem.parents('.subDiv').first(); //当前元素所在的folder


    if(currentFolder !== lastFolder) {
        if(lastFolder) {
            lastFolder.css('height', 0);
        }
        lastFolder = currentFolder;
    }

    //根据pinch修改菜单的高度
    //var subD =  document.getElementById('subDiv');
    var folderHeight = ev.scale * 60;
    var heightInc = folderHeight - currentFolder.height();
    if (ev.scale > 2 && heightInc > 0) {
        currentFolder.css('height', folderHeight + 'px');
        //accordion.css('top',accordion.position().top-heightInc/2+'px') ;

    } else if (folderHeight < currentFolder.height() * 0.7) {
        currentFolder.css('height', 0 + 'px');
        //一级菜单回到一当前光标为中心的位置
        // accordion.css('top', accordion.offset().top + cursor.offset().top - currentFolder.offset().top + 'px');
    }

    if(currentFolder.height() > 0) {
        // var cfh = folderHeight;
        // var rat = (cursor.offset().top - currentFolder.parent().offset().top - 41) / cfh;
        // myElement.textContent = "ratio = " + rat;
        // if(rat === 0 || rat >= 1) myElement.textContent += "GoGoGO!";
    }

    //if(ev.scale>2)subD.style.height = ev.scale*30+'px';
    //else subD.style.height = 0;
    //如果菜单打开,则保持外层菜单与光标同步移动
    if (currentFolder.height() > 0) {
        // //accordion.css('top', accordion.offset().top + cursor.offset().top - currentFolder.height() / 2 - currentFolder.offset().top + 'px');
        // var cfh = folderHeight;
        // var ele = currentFolder.children("ul").children("li");
        // var len = ele.size();
        // var sgn = ele.first() ? ele.first().height() : 0;
        // var ful = sgn * len;
        // var val = ((ful - cfh) * Math.max(0, cursor.offset().top - currentFolder.parent().offset().top - 41) / cfh);
        // // myElement.textContent = cfh + " " + len + " " + sgn + " " + ful + " " + val;

        // currentFolder.children().css('top', -val);
    } else { //跟随光标移动
        //if(cursorStartDis!==cursor.offset().top-accordion.offset().top)
        //accordion.css('top',cursor.offset().top-cursorStartDis+'px');
    }
    //myElement.textContent = cursor.offset().top + ';' + accordion.offset().top + ";" + currentFolder.offset().top;


    //显示值
    //myElement.textContent =cursorElem.prop("tagName")+";"+currentFolder.text();


});
//pinch开始及结束时显示或隐藏cursor
menuMc.on("pinchstart", function(ev) {
    //var cursor = document.getElementById('cursor');
    cursor.css('top', ev.center.y + 'px');
    cursor.css('display', 'block');
    cursorStartDis = cursor.offset().top - accordion.offset().top;
});
menuMc.on("pinchend", function(ev) { //扩大菜单
    //var cursor = document.getElementById('cursor');
    cursor.css('display', 'none');
    if (lastHover && lastHover.hasClass('hover')) lastHover.removeClass('hover');
});



window.onpageshow = function(event) {
　　if (event.persisted) {
　　　　window.location.reload()
　　}
};
