export function formatDateTime(inputTime,type) {   
    var date  = parseInt(inputTime.substring(6,inputTime.length-2))
    date = new Date(date);
    var y = date.getFullYear();    
    var m = date.getMonth() + 1;    
    m = m < 10 ? ('0' + m) : m;    
    var d = date.getDate();    
    d = d < 10 ? ('0' + d) : d;    
    var h = date.getHours();  
    h = h < 10 ? ('0' + h) : h;  
    var minute = date.getMinutes();  
    var second = date.getSeconds();  
    minute = minute < 10 ? ('0' + minute) : minute;    
    second = second < 10 ? ('0' + second) : second;   
    if(type=="yyyy-mm-dd"){
        return y + '-' + m + '-' + d;
    }
    else{
        return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second
    }
      
};
export function formatDate(inputTime) {
    var d = new Date(inputTime);  
    var a = [d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds()];
    for(var i = 0, len = a.length; i < len; i ++) {
        if(a[i] < 10) {
            a[i] = '0' + a[i];
        }
    }
    let str = a[0] + '-' + a[1] + '-' + a[2] + ' ' + a[3] + ':' + a[4] + ':' + a[5];
    return str;
}

export function IDcard(){
    
}


