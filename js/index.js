var data=data;
// 图片翻转控制
function turn(ele){
    var _photo = g(".photo");
    //每次点击图片都停止播放歌曲
    for(var s = 0;s < _photo.length;s++){
        g("#music_"+s).pause();
    }
    var cls = ele.className;
    var a = ele.id.split("_")[1];
    var music = g("#music_"+a);
    var lyric = g("#lyric_"+a);
    //若点击的图片不是焦点图片，则重新排序
    if(!/photo_center/.test(cls)){
        return rsort(a);
    }
    //若点击的图片为焦点图片正面，则进行翻转，并开始播放歌曲，同步歌词
    if(/photo_front/.test(cls)){
        cls=cls.replace(/photo_front/,'photo_back');
        g('#nav_'+a).className +=' i_back';
        ele.className=cls;
        music.play();
        var time = handleLyricTime(data[a]);
        music.ontimeupdate = function(){
            for (var i = 0;i<time.length;i++){
                if(this.currentTime>parseInt(time[i])){
                    for(var j=0;j<i;j++){
                        lyric.children[j].className='';
                    }
                    lyric.style['top'] = -i*30+'px';
                    lyric.children[i].className='lyricaAtive';
                }
            }
        }
    }
    //若点击的图片为焦点图片反面，则进行翻转
    else{cls=cls.replace(/photo_back/,'photo_front');
        g('#nav_'+a).className=g('#nav_'+a).className.replace(/i_back/,'');
        ele.className=cls;
        }
}
// 通用函数
function g(selector){
    var method=selector.substr(0,1)=='#'?'getElementById':'getElementsByClassName';
        return document[method](selector.substr(1));
}
// 填补图片信息，生成20张图片及对应的控制按钮
function addPhotos(){
    var template=g('#wrap').innerHTML;
    var html=[];
    var nav=[];
    for(s in data){
        var _html=template.replace('{{index}}',s)
                          .replace('{{number1}}',s)
                          .replace('{{number2}}',s)
                          .replace('{{img}}',s+'.jpg')
                          .replace('{{artist}}',data[s].artist)
                          .replace('{{song}}',data[s].song)
                          .replace('{{src}}',data[s].src)
                          .replace('{{lyric}}',handleLyric(data[s]));
        html.push(_html);
        nav.push('<span id="nav_'+s+'" onclick="turn(g(\'#photo_'+s+'\'))" ' + 'class="i">&nbsp;</span>');
    }
    html.push('<div class="nav">'+nav.join('')+'<div>');
    g('#wrap').innerHTML=html.join('');
    rsort(rando(1,20));
}
addPhotos();
// 返回一个范围内的随机数
function rando(a,b){
    var max = Math.max(a,b);
    var min = Math.min(a,b);
    var length = max-min;
    var number=Math.floor(length*Math.random()+min);
        return number;
}
// 图片重排列
function rsort(n){
    var _photo = g(".photo");
    var _photos=[];
    // 图片初始化
    for(var s=0;s<_photo.length;s++){
        _photo[s].className=_photo[s].className.replace(/\s*photo_center\s*/,'');
        _photo[s].className = _photo[s].className.replace(/\s*photo_front\s*/,' ');
        _photo[s].className = _photo[s].className.replace(/\s*photo_back\s*/,' ');
        _photo[s].className +=' photo_front';
        _photo[s].style.left='';
        _photo[s].style.top='';
        _photo[s].style['transform'] = 'rotate(360deg) scale(1.3)';
        _photos.push(_photo[s]);
    }
    // 取出焦点图片
    var photo_center = g('#photo_'+n);
        photo_center.className+=' photo_center';
        photo_center = _photos.splice(n,1)[0];
    // 非焦掉图片随机排列
    for(var i in _photos){
        _photos[i].style.left=rando(0,parseInt(g('#wrap').clientWidth))+'px';
        _photos[i].style.top=rando(0,600)+'px';
        _photos[i].style['transform']='rotate('+rando(-150,150)+'deg) scale(1)';
    }
    // 控制按钮处理
    var navs=g(".i");
    for (var k=0;k<navs.length;k++){
        navs[k].className=navs[k].className.replace(/\s*i_current\s*/,'').replace(/\s*i_back\s*/,'');
    }
    g('#nav_'+n).className += ' i_current';
}
// 获取歌词
function handleLyric(data){
    var sentence = [];
    var gc = [];
    var content = data.lyric;
    for(i in content){
        sentence.push('<p>'+content[i].lineLyric+'</p>');
    }
        return sentence.join('');
}
// 获取每句歌词对应的时间
function handleLyricTime(data){
    var lyricTime = [];
    var content = data.lyric;
    for(i in content){
        lyricTime.push(content[i].time);
    }
        return lyricTime;
}
