var express = require('express')
var request = require('request')
var app = express();
var data;
var fs = require('fs');
//讀外部文件 我也不知道要放什麼
var send_item;// = fs.readFileSync('Test.txt', 'utf8');
var lengthtoGate = 0;
var lengthtoFCourt = 0;
var lengthtoTSMC = 0;
var lengthtoLife = 0;

app.get('/',(req,res)=>{
    
    request('https://iot.martinintw.com/api/v1/data/12345617',(err,response,body)=>{
        var a = JSON.parse(body);
        send_item = fs.readFileSync('Test.txt', 'utf8');
        for(var i = a.length-1;i>=0;i--){
            if(a[i].lat!=""){
                data = a[i];
                send_item +=  "Last updated at : "+a[i]['created_at']+"<br>";
                send_item +=  "經度 : "+a[i]['lat']+"<br>緯度 : "+a[i]['lng']+"<br>";
                lengthtoGate = Math.floor(getDistance(a[i]['lat'],a[i]['lng'],24.796574,120.996957));
                lengthtoFCourt = Math.floor(getDistance(a[i]['lat'],a[i]['lng'],24.794238,120.994060));
                lengthtoLife = Math.floor(getDistance(a[i]['lat'],a[i]['lng'],24.789821,120.9900190));
                lengthtoTSMC = Math.floor(getDistance(a[i]['lat'],a[i]['lng'],24.786933,120.9920581));
                
                //表格：到各公車站距離
                send_item += "<table style=\"border:3px #cccccc solid;\" cellpadding=\"10\" border='1'>\
                <tr><th>距離</th><th>校門口</th><th>蘇格貓底</th><th>生科館</th><th>台積館</th></tr>\
                <tr><td>(公尺)</td><td>"+lengthtoGate+"</td><td>"+lengthtoFCourt+"</td><td>"+lengthtoLife+"</td><td>"+lengthtoTSMC+"</td></tr>\
                </table>";

                //經緯度判斷校巴在校內校外
                if(a[i]['lat']<24.796296&&a[i]['lat']>24.786054&&a[i]['lng']<120.998404&&a[i]['lng']>120.987770)send_item += "校巴在學校裡面!"+"<br>";
                else send_item +=  "<font size=\"5\" color=\"red\">校巴在學校外面!</font>"+"<br>";
                //Google Map顯示
                send_item+="<iframe width='60%' height='60%' frameborder='0' scrolling='yes' marginheight='0' marginwidth='0'\
                    src='https://maps.google.com.tw/maps?f=q&hl=zh-TW&geocode=&q="
                    +a[i]['lat']+","+a[i]['lng']+"&z=16&output=embed&t='></iframe>"

                break;
                
                //process.exit(0);
            }
        }
        res.send(send_item);
    });
    
});

var port = 8080;
app.listen(port,()=>{
    console.log('Start listen on '+port);
});

function  getDistance(lat1, lon1, lat2, lon2) {//算經緯度距離
	var R = 6378137;
	var φ1 = toRadians(lat1);
	var φ2 = toRadians(lat2);
	var Δφ = toRadians(lat2-lat1);
	var Δλ = toRadians(lon2-lon1);

	var a = Math.sin(Δφ/2)*Math.sin(Δφ/2)+Math.cos(φ1)*Math.cos(φ2)*Math.sin(Δλ/2) * Math.sin(Δλ/2);
	var c = 2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	var d = R * c;
	return d;
	function toRadians(d) {
		return d * Math.PI / 180;
	}	
}