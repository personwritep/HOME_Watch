// ==UserScript==
// @name        HOME Watch
// @namespace        http://tampermonkey.net/
// @version        0.8
// @description        HOME画面専用の日付曜日時計表示
// @author        Ameba Blog User
// @match        https://www.ameba.jp/home
// @match        https://blog.ameba.jp/ucs/entry/srventryupdateend*
// @match        https://blog.ameba.jp/ucs/entry/srventryinsertend*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=ameba.jp
// @noframes
// @grant        none
// @updateURL        https://github.com/personwritep/HOME_Watch/raw/main/HOME_Watch.user.js
// @downloadURL        https://github.com/personwritep/HOME_Watch/raw/main/HOME_Watch.user.js
// ==/UserScript==


let hw_type=0; // 表示タイプ
let hw_type_jne=0; // 表示タイプ 日本語・数字・英語

let HOME_w=get_cookie('HOME_w');
if(HOME_w==0 || HOME_w==1 || HOME_w==2){
    hw_type=HOME_w; }
else{ // Cookieの初期化
    hw_type=0; }
document.cookie='HOME_w='+hw_type+'; Max-Age=2592000';// Cookieの更新

let HOME_jne=get_cookie('HOME_jne');
if(HOME_jne==0 || HOME_jne==1 || HOME_jne==2){
    hw_type_jne=HOME_jne; }
else{ // Cookieの初期化
    hw_type_jne=0; }
document.cookie='HOME_jne='+hw_type_jne+'; Max-Age=2592000';// Cookieの更新



let retry=0;
let interval=setInterval(wait_target, 100);
function wait_target(){
    retry++;
    if(retry>100){ // リトライ制限 100回 10secまで
        clearInterval(interval); }
    let target=document.querySelector('.HomeUserProfile > a');
    if(target){
        clearInterval(interval);
        setTimeout(()=>{
            set_watch(target);
        }, 200); }}


function set_watch(target){
    let watch_=
        '<div id="h_watch" title="Click:サイズ　Ctrl+Click:英⇔日">'+
        '<span class="h_disp"></span>'+
        '<style>#h_watch { font: bold 16px/16px Meiryo; color: #888; height: 0; '+
        'text-align: right; position: relative; top: -90px; right: 0; cursor: pointer; } '+
        '#h_watch .h_disp { padding: 4px 4px 2px; display: inline-block; border-radius: 3px; } '+
        '#h_watch:hover .h_disp { outline: 1px solid #ccc; } '+
        '.h_disp .y, .h_disp .d { margin-right: 8px; } '+
        '.h_disp .m { margin-right: 2px; } '+
        '.h_disp .yEN, .h_disp .mEN { margin-right: 0; } '+
        '.h_disp .w { margin-right: 12px; } .h_disp .dd { margin: 0 2px; } '+
        '</style></div>';

    if(!document.querySelector('#h_watch')){
        target.insertAdjacentHTML('afterend', watch_ ); }


    set_type();

    disp_watch();

    let time_d=setInterval(disp_watch, 1000);

} // set_watch()



function set_type(){
    let h_watch=document.querySelector('#h_watch');
    if(h_watch){
        h_watch.onmouseup=function(event){
            event.preventDefault();
            event.stopImmediatePropagation();
            if(event.ctrlKey){
                if(hw_type_jne==0){
                    hw_type_jne=1; }
                else if(hw_type_jne==1){
                    hw_type_jne=2; }
                else if(hw_type_jne==2){
                    hw_type_jne=0; }}
            else{
                if(hw_type==0){
                    hw_type=1; }
                else if(hw_type==1){
                    hw_type=2; }
                else if(hw_type==2){
                    hw_type=0; }}

            setTimeout(()=>{
                if(0<=hw_type<3){
                    document.cookie='HOME_w='+hw_type+'; Max-Age=2592000'; }
                if(0<=hw_type_jne<3){
                    document.cookie='HOME_jne='+hw_type_jne+'; Max-Age=2592000'; }
                disp_watch();
            }, 200);
        }}

} // set_type()



function disp_watch(){
    let h_watch=document.querySelector('#h_watch');
    let now=new Date();

    if(h_watch && h_watch.querySelector('.h_disp')){
        h_watch.querySelector('.h_disp').remove();
        h_watch.insertAdjacentHTML('afterbegin', get_d(now)); }


    function getdouble(number){
        return ("0" + number).slice(-2); }

    function get_d(time){
        let Year=time.getFullYear();
        let Month=time.getMonth()+1;
        let Date=time.getDate();
        let Wday=time.getDay();
        let Hour=getdouble(time.getHours());
        let Min=getdouble(time.getMinutes());
        let Sec=getdouble(time.getSeconds());

        // Dateオブジェクトは曜日を0から6で保持しているため、変換
        let WeekJP=["<span style='color: red'>日曜</span>", "月曜", "火曜", "水曜",
                    "木曜", "金曜", "<span style='color: #2196F3'>土曜</span>"];

        let WeekEN=["<span style='color: red'>Sun</span>", "Mon", "Tue", "Wed",
                    "Thu", "Fri", "<span style='color: #2196F3'>Sat</span>"];

        let MonthEN=["Jan.", "Feb.", "Mar.", "Apr.", "May.", "Jun.", "Jul.", "Aug.", "Sep.",
                     "Oct.", "Nov.", "Dec."];


        let h_display;

        if(hw_type_jne==0){
            if(hw_type==0){
                h_display=
                    '<span class="h_disp">'+
                    '<span class="y">'+ Year +'年</span>'+
                    '<span class="m">'+ Month +'月</span>'+
                    '<span class="d">'+ Date +'日</span>'+
                    '<span class="w">'+ WeekJP[Wday] +'</span>'+
                    Hour +'<span class="dd">:</span>'+
                    Min +'<span class="dd">:</span>'+
                    Sec +'</span>'; }
            else if(hw_type==1){
                h_display=
                    '<span class="h_disp">'+
                    '<span class="m">'+ Month +'月</span>'+
                    '<span class="d">'+ Date +'日</span>'+
                    '<span class="w">'+ WeekJP[Wday] +'</span>'+
                    Hour +'<span class="dd">:</span>'+
                    Min +'<span class="dd">:</span>'+
                    Sec +'</span>'; }
            else if(hw_type==2){
                h_display=
                    '<span class="h_disp">'+
                    '<span class="m">'+ Month +'月</span>'+
                    '<span class="d">'+ Date +'日</span>'+
                    '<span class="w">'+ WeekJP[Wday] +'</span>'+
                    Hour +'<span class="dd">:</span>'+
                    Min +'</span>'; }}

        else if(hw_type_jne==1){
            if(hw_type==0){
                h_display=
                    '<span class="h_disp">'+
                    '<span class="yEN">'+ Year +'-</span>'+
                    '<span class="mEN">'+ Month +'-</span>'+
                    '<span class="d">'+ Date +'</span>'+
                    '<span class="w">'+ WeekEN[Wday] +'</span>'+
                    Hour +'<span class="dd">:</span>'+
                    Min +'<span class="dd">:</span>'+
                    Sec +'</span>'; }
            else if(hw_type==1){
                h_display=
                    '<span class="h_disp">'+
                    '<span class="mEN">'+ Month +'-</span>'+
                    '<span class="d">'+ Date +'</span>'+
                    '<span class="w">'+ WeekEN[Wday] +'</span>'+
                    Hour +'<span class="dd">:</span>'+
                    Min +'<span class="dd">:</span>'+
                    Sec +'</span>'; }
            else if(hw_type==2){
                h_display=
                    '<span class="h_disp">'+
                    '<span class="mEN">'+ Month +'-</span>'+
                    '<span class="d">'+ Date +'</span>'+
                    '<span class="w">'+ WeekEN[Wday] +'</span>'+
                    Hour +'<span class="dd">:</span>'+
                    Min +'</span>'; }}

        else if(hw_type_jne==2){
            if(hw_type==0){
                h_display=
                    '<span class="h_disp">'+
                    '<span class="yEN">'+ Year +' </span>'+
                    '<span class="mEN">'+ MonthEN[Month-1] +'</span>'+
                    '<span class="d">'+ Date +'</span>'+
                    '<span class="w">'+ WeekEN[Wday] +'</span>'+
                    Hour +'<span class="dd">:</span>'+
                    Min +'<span class="dd">:</span>'+
                    Sec +'</span>'; }
            else if(hw_type==1){
                h_display=
                    '<span class="h_disp">'+
                    '<span class="mEN">'+ MonthEN[Month-1] +'</span>'+
                    '<span class="d">'+ Date +'</span>'+
                    '<span class="w">'+ WeekEN[Wday] +'</span>'+
                    Hour +'<span class="dd">:</span>'+
                    Min +'<span class="dd">:</span>'+
                    Sec +'</span>'; }
            else if(hw_type==2){
                h_display=
                    '<span class="h_disp">'+
                    '<span class="mEN">'+ MonthEN[Month-1] +'</span>'+
                    '<span class="d">'+ Date +'</span>'+
                    '<span class="w">'+ WeekEN[Wday] +'</span>'+
                    Hour +'<span class="dd">:</span>'+
                    Min +'</span>'; }}

        return h_display;

    } // get_d()

} // disp_watch()



function get_cookie(name){
    let cookie_req=document.cookie.split(';')
    for(let k=0; k<cookie_req.length; k++){
        cookie_req[k]=cookie_req[k].trim(); } // 前後の空白を削除

    let cookie=cookie_req.find(row=>row.startsWith(name+'='));
    if(cookie){
        if(cookie.split('=')[1]==null){
            return 0; }
        else{
            return cookie.split('=')[1]; }}
    if(!cookie){
        return 0; }}


// ============== UpdateEnd Page ==========================


function set_watch2(target){
    let watch_=
        '<div id="h_watch2">'+
        '<span class="h_disp2"></span>'+
        '<style>#h_watch2 { font: bold 20px/16px Meiryo; color: #888; '+
        'text-align: right; position: absolute; top: 80px; left: 24px; } '+
        '#h_watch2 .h_disp2 { display: inline-block; } '+
        '.h_disp2 .w { margin-right: 6px; } '+
        '.entryComplete__text { padding-top: 24px; } '+
        '</style></div>';

    if(!document.querySelector('#h_watch2')){
        target.insertAdjacentHTML('afterend', watch_ ); }

    disp_watch2();

    let time_d=setInterval(disp_watch2, 1000);

} // set_watch2()



function disp_watch2(){
    let h_watch2=document.querySelector('#h_watch2');
    let now=new Date();

    if(h_watch2 && h_watch2.querySelector('.h_disp2')){
        h_watch2.querySelector('.h_disp2').remove();
        h_watch2.insertAdjacentHTML('afterbegin', get_d2(now)); }


    function getdouble(number){
        return ("0" + number).slice(-2); }

    function get_d2(time){
        let Year=time.getFullYear();
        let Month=getdouble(time.getMonth()+1);
        let Date=getdouble(time.getDate());
        let Wday=time.getDay();
        let Hour=getdouble(time.getHours());
        let Min=getdouble(time.getMinutes());

        // Dateオブジェクトは曜日を0から6で保持しているため、変換
        let WeekJP=["<span style='color: red'>日曜</span>", "月曜", "火曜", "水曜",
                    "木曜", "金曜", "<span style='color: #2196F3'>土曜</span>"];

        let h_display=
            '<span class="h_disp2">'+
            '<span class="w">'+ WeekJP[Wday] +'</span>'+
            '<span class="y">'+ Year +'年</span>'+
            '<span class="m">'+ Month +'月</span>'+
            '<span class="d">'+ Date +'日 </span>'+
            Hour +'<span class="dd">:</span>'+
            Min +'</span>';

        return h_display;

    } // get_d2()

} // disp_watch2()



let complete_date=document.querySelector('#subContentsArea .entryComplete__date');
if(complete_date){
    set_watch2(complete_date); }
