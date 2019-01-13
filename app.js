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
var totaldistance = 0;
var cur = 0;
var pre = 0;
app.get('/', (req, res) => {
    request('https://iot.martinintw.com/api/v1/data/12345617', (err, response, body) => {
        var a = JSON.parse(body);
        send_item = fs.readFileSync('Test.html', 'utf8');
        for (var i = a.length - 1; i >= 0; i--) {
            if (a[i].lat != "") {
                cur=i;
                pre = i;
                data = a[i];
                send_item = send_item.replace(/created_at/, a[i]['created_at']);
                send_item = send_item.replace(/lat/, a[i]['lat']);
                send_item = send_item.replace(/lng/, a[i]['lng']);


                //計算到各公車站距離
                lengthtoGate = Math.floor(getDistance(a[i]['lat'], a[i]['lng'], 24.796574, 120.996957));
                lengthtoFCourt = Math.floor(getDistance(a[i]['lat'], a[i]['lng'], 24.794238, 120.994060));
                lengthtoLife = Math.floor(getDistance(a[i]['lat'], a[i]['lng'], 24.789821, 120.9900190));
                lengthtoTSMC = Math.floor(getDistance(a[i]['lat'], a[i]['lng'], 24.786933, 120.9920581));
                send_item = send_item.replace(/lengthtoGate/, lengthtoGate);
                send_item = send_item.replace(/lengthtoFCourt/, lengthtoFCourt);
                send_item = send_item.replace(/lengthtoLife/, lengthtoLife);
                send_item = send_item.replace(/lengthtoTSMC/, lengthtoTSMC);

                //經緯度判斷校巴在校內校外
                if (a[i]['lat'] < 24.796296 && a[i]['lat'] > 24.786054 && a[i]['lng'] < 120.998404 && a[i]['lng'] > 120.987770) {
                    send_item = send_item.replace(/TextToShow/, "校巴在學校裡面!");
                    send_item = send_item.replace(/urlimg/, "https://vignette.wikia.nocookie.net/alexisplaying/images/2/29/MeatBoy.png/revision/latest/scale-to-width-down/2000?cb=20151108143132");
                }
                else {
                    send_item = send_item.replace(/TextToShow/, "<font size=\"5\" color=\"red\">校巴在學校外面!</font>");
                    send_item = send_item.replace(/urlimg/, "https://i.imgur.com/vcDNW72.png");
                }
                send_item = send_item.replace(/url_map/, 'https://maps.google.com.tw/maps?f=q&hl=zh-TW&geocode=&q=' + a[i]['lat'] + ',' + a[i]['lng'] + '&z=16&output=embed&t=');
                break;
            }
            
        }
        send_item = send_item.replace(/numberofdata/, a.length);
        for (var i = a.length - 1; i >= 0; i--) {
            if(i!=cur&&a[i].lat != ""){
                totaldistance += getDistance(a[i]['lat'], a[i]['lng'], a[pre]['lat'], a[pre]['lng']);
                pre = i;
            }
            if(i == 0){
                send_item = send_item.replace(/firstcreatetime/, a[i]['created_at']);
                send_item = send_item.replace(/firstcreatelat/, a[i]['lat']);
                send_item = send_item.replace(/firstcreatelng/, a[i]['lng']);
            }
        }
        send_item = send_item.replace(/totaldistance/, Math.floor(totaldistance)/1000);
        res.send(send_item);
        //process.exit(0);
    });
});

var port = 8080;
app.listen(port, () => {
    console.log('Start listen on ' + port);
});

function getDistance(lat1, lon1, lat2, lon2) {//算經緯度距離
    var R = 6378137;
    var φ1 = toRadians(lat1);
    var φ2 = toRadians(lat2);
    var Δφ = toRadians(lat2 - lat1);
    var Δλ = toRadians(lon2 - lon1);

    var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
    function toRadians(d) {
        return d * Math.PI / 180;
    }
}