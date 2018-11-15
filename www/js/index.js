
function onDeviceReady() {
//                $('#mainTitle').text('=====' + device.platform);
//                $('body').css('background-color', '#0000FF');
    //alert('test');
//                var vInfo = 'Device Name: ' + device.name + '\n' +
//                        'Device Cordova: ' + device.cordova + '\n' +
//                        'Device Platform: ' + device.platform + '\n' +
//                        'Device UUID: ' + device.uuid + '\n' +
//                        'Device Version: ' + device.version;
    StatusBar.backgroundColorByHexString("#333333");

}


function displayState(valorUVInfo, DOMelementUVTitle, ) {

    //Low	Low	[0-3)	
    //#558B2F
    //Moderate	Mod	[3-6)	
    //#F9A825
    //High	High	[6-8)	
    //#EF6C00
    //Very High	VHigh	[8-11)	
    //#B71C1C
    //Extreme	Extr	[11+...)	
    //#6A1B9A     

    $('#uvVivo').text(valorUVvivo);

    var colorBG = '#000';
    if (valorUVInfo < 3) {
        colorBG = '#558B2F';
        $('#' + DOMelementUVTitle).text('Bajo');
    }
    if (valorUVInfo >= 3) {
        colorBG = '#F9A825';
        $('#' + DOMelementUVTitle).text('Moderado');
    }
    if (valorUVInfo >= 6) {
        colorBG = '#EF6C00';
        $('#' + DOMelementUVTitle).text('Alto');
    }
    if (valorUVInfo >= 8) {
        colorBG = '#B71C1C';
        $('#' + DOMelementUVTitle).text('Muy Alto');
    }
    if (valorUVInfo >= 11) {
        colorBG = '#6A1B9A';
        $('#' + DOMelementUVTitle).text('Extremo');
    }
    if (valorUVInfo == 0) {
        colorBG = '#222';
        $('#' + DOMelementUVTitle).text('Sol Oculto');
    }

//                if (valorUVInfo < 3) {
//                    $('#uvMaxTitle').text('Bajo');
//                }
//                if (valorUVInfo >= 3) {
//                    $('#uvMaxTitle').text('Moderado');
//                }
//                if (valorUVInfo >= 6) {
//                    $('#uvMaxTitle').text('Alto');
//                }
//                if (valorUVInfo >= 8) {
//                    $('#uvMaxTitle').text('Muy Alto');
//                }
//                if (valorUVInfo >= 11) {
//                    $('#uvMaxTitle').text('Extremo');
//                }

    return colorBG;


}


function getDataAltitude(lati, longi, dateSend) {
//    alt = 2801;
//    alert('la altura es:' + alt);
//    getDataUV(lat, long, alt, dateSend);
    $.ajax({
        type: 'GET',
        async: false,
        dataType: 'jsonp',
        crossDomain: true,
        url: 'http://www.datasciencetoolkit.org/coordinates2statistics/' + lati + ',' + longi,
        success: function (response) {

            alt = response[0].statistics.elevation.value;
            console.log('test' + alt + lati);
            $('#altValue').val(alt);
            //useNextLoad();

            getDataUV(lat, long, alt, dateSend);
        }



    })
}

function getDataUV(lat, long, alt, dateSend) {

//                var GivenDate = '2018-02-22';
    var CurrentDate = new Date($.now()); //new Date();
    var dateTimeCurrent = CurrentDate.getFullYear()
            + '-' + (((CurrentDate.getMonth()) < 9) ? '0' + (CurrentDate.getMonth() + 1) : (CurrentDate.getMonth() + 1))
            + '-' + (((CurrentDate.getDate()) < 10) ? '0' + (CurrentDate.getDate()) : (CurrentDate.getDate()));

    var dateTempSend = dateSend.split('-');
//                console.log(dateTempSend[0] );

    valorUV = 0;

    //Check if is current date or future date
    if (dateTimeCurrent == dateSend) {

        $('#dateApp').text(dateTempSend[2] + " de " + meses[dateTempSend[1]] + " de " + dateTempSend[0]);

        dt = CurrentDate.toUTCString(); // dateTimeCurrent;
//        dt = '2018-11-09T12:14:49.935Z'; //$('#dt').val();
//        alert('Es hoy.' + dt);
        uvURL = 'https://api.openuv.io/api/v1/uv?lat=' + lat + '&lng=' + long + '&alt=' + alt + '&dt=' + dt;


        $.ajax({
            type: 'GET',
            dataType: 'json',
            beforeSend: function (request) {
                request.setRequestHeader('x-access-token', 'ce8a3940eed25efbf6f94766b469463e');
            },
            url: uvURL,
            success: function (response1) {

                numUVmax = response1.result.uv_max;
                //console.log(response1);
                uv_max = numUVmax.toFixed(1);
                timeMaxUV = response1.result.uv_max_time;
                valorUV = uv_max;


                //************ END Retrieve UV data ***************************//
                numUV = response1.result.uv;
                uv = numUV.toFixed(1);
                valorUVvivo = uv;//Math.floor(Math.random() * 18);

                //valorUV = 0;

                $('#uvMax').text(valorUV);

                formatTimeMaxUV = new Date(timeMaxUV);
                $('#timeMaxUV').text('a las ' + (formatTimeMaxUV.getUTCHours() + timeZone) + ":" + formatTimeMaxUV.getUTCMinutes());

                idDOM = 'uvMaxTitle';

                displayState(valorUV, idDOM);

                colorState = displayState(valorUVvivo, 'uvTitle');

                getDataWeather(lat, long);

                $('#uvVivo').css('color', colorState);
                $('body').css('background-color', colorState);


                $('#infoVivo').show();

                StatusBar.backgroundColorByHexString(colorState);


//                            console.log(uvURL);


            },
            error: function (response1) {
                $('#weather').text(JSON.stringify(response1));
                console.log(JSON.stringify(response1));
            }


        });

        loadingBox.close();


    } else { //Date Selected *********************

        dateSend = dateSend + 'T12:00:00.001Z';// set complet ISO date

        dt = dateSend;// + 'T00:00:00.001Z';  // + 'T00:00:00.001Z'; '2018-10-22T13:13:25.22Z';


        uvURL = 'https://api.openuv.io/api/v1/forecast?lat=' + lat + '&lng=' + long + '&alt=' + alt + '&dt=' + dt;

//                    console.log(uvURL);

        $.ajax({
            type: 'GET',
            dataType: 'json',
            beforeSend: function (request) {
                request.setRequestHeader('x-access-token', 'ce8a3940eed25efbf6f94766b469463e');
            },
            url: uvURL,
            success: function (response2) {
                console.log(response2);

                numUVmax = 0;
                timeMaxUV = '12:00:00';

                $.each(response2.result, function () {
//                                console.log(this.uv);
                    if (this.uv > numUVmax) {
                        numUVmax = this.uv;
                        timeMaxUV = this.uv_time;
                    }
                });

                uv_max = numUVmax.toFixed(1);
                valorUV = uv_max;


                //************ END Retrieve UV data ***************************//

                numUV = uv_max;
                uv = numUVmax.toFixed(1);
                valorUV = uv;

//                            console.log(timeMaxUV + '!!!!' + timeZone);

                formatTimeMaxUV = new Date(timeMaxUV);
                $('#timeMaxUV').text('a las ' + (formatTimeMaxUV.getUTCHours() + timeZone) + ":" + formatTimeMaxUV.getUTCMinutes());
                $('#dateApp').text(formatTimeMaxUV.getUTCDate() + " de " + meses[formatTimeMaxUV.getUTCMonth()] + " de " + formatTimeMaxUV.getUTCFullYear());

                $('#uvMax').text(valorUV);


                colorState = displayState(valorUV, 'uvMaxTitle');

                $('body').css('background-color', colorState);
                $('#infoVivo').hide();

                StatusBar.backgroundColorByHexString(colorState);

            },
            error: function (response1) {
                $('#weather').text(JSON.stringify(response1));
                console.log(JSON.stringify(response1));
            }


        });
        setTimeout(function () {
            loadingBox.close();
        }, 1200);
    }




}




function getDataWeather(lat, long) {

    var URLcity = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + long + '&appid=6709a6213a3ccc7962a25862300d458e&units=metric&lang=es';

    $.ajax({
        type: 'GET',
        dataType: 'jsonp',
        url: URLcity,
        success: function (response0) {
            //console.log((response0));
            weather = response0.weather[0].description;
            iconWeather = response0.weather[0].icon;
            temp = (response0.main.temp).toFixed(1);
            if (lat == 0 && long == 0) {
                lat = response0.coord.lat;
                long = response0.coord.log;
            }

            //$('#weather').text(weather);
            $('#iconWeather').attr('src', 'https://openweathermap.org/themes/openweathermap/assets/vendor/owm/img/widgets/' + iconWeather + '.png');
            $('#temp').text(temp);

        },
        error: function (response0) {

            console.log(JSON.stringify('Error::' + response0));
        }


    });

}

function getDataApp(lat, long, dateSend, cityName) {
//
//                console.log('llamado a todas las funciones');
//
//                console.log('latitude==' + lat + '\n'
//                        + 'longitude==' + long + '\n'
//                        + 'dateTime++==' + dateSend + '\n');

    //Get altitude of lat and long
//                lat = $('#latValue').val();
//                long = $('#longValue').val();
    getDataAltitude(lat, long, dateSend);
//                console.log('altitude==' + alt);

    //alt = 2800;//$('#altValue').val(); 

    //getDataUV(lat, long, alt, dt);

    //getDataWeather(lat, long);
}

//Initialize calendar
//$("#datepickerDiv").datepicker({minDate: -7});


$(function () {
    $("#datepickerDiv").datepicker({
        minDate: 0,
        maxDate: 7,
        dateFormat: 'yy-mm-dd',
        onSelect: function () {

            var dateTemp = $(this).val()
            console.log(dateTemp);
            $("#datepickerDiv").toggle();
            $("#datepickerDiv").datepicker("hide");


            //calls new UV Date with new Date
            //yearDate = dateTemp.split('*');
            loadingBox = new $.LoadingBox({
                opacity: 0.9,
                loadingImageWitdth: "120px",
                loadingImageHeigth: "120px",
                loadingImageSrc: "images/sunBlue02.gif"
            });

            getDataApp(lat, long, dateTemp, 'Quito')
        }
    });

});

$("#dateUV").click(function () {
    $("#Cities").hide();
    $("#Advices").hide();
    $("#Info").hide();
    $("#datepickerDiv").toggle();

});
$("#citySelect").click(function () {
    $("#datepickerDiv").hide();
    $("#Advices").hide();
    $("#Info").hide();
    $("#Cities").toggle();
});
$("#advicesButton").click(function () {
    $("#datepickerDiv").hide();
    $("#Cities").hide();
    $("#Info").hide();
    $("#Advices").toggle();
});
$("#infoButton").click(function () {
    $("#datepickerDiv").hide();
    $("#Cities").hide();
    $("#Advices").hide();
    $("#Info").toggle();
});

$("#Cities ul li").click(function () {
    localDate = new Date(dt);
    localDateFormat = localDate.getFullYear() + '-' + ("0" + (localDate.getMonth() + 1)).slice(-2) + '-' + ("0" + localDate.getDate()).slice(-2);
//                console.log($(this).attr('latit') + $(this).text() + '||| ' + localDateFormat + '*************----------');
    lat = $(this).attr('latit');
    long = $(this).attr('longit');
    city1 = $(this).text();
    $('#latValue').val(lat);
    $('#longValue').val(long);
    $("#Cities").toggle();
    $('#cityName').text(city1);

    loadingBox = new $.LoadingBox({
        opacity: 0.9,
        loadingImageWitdth: "120px",
        loadingImageHeigth: "120px",
        loadingImageSrc: "images/sunBlue02.gif"
    });

    getDataApp(lat, long, localDateFormat, city1);
});

/***********************************************************--------------------------------------------------------************************/

$.support.cors = true;
$.mobile.allowCrossDomainPages = true;

document.addEventListener("deviceready", onDeviceReady, false);

var loadingBox = new $.LoadingBox({
    opacity: 0.9,
    loadingImageWitdth: "120px",
    loadingImageHeigth: "120px",
    loadingImageSrc: "images/sunBlue01.gif"
});

var altura1 = 0;
var weather = '';
var iconWeather = '';
var temp = 0;
var cityName = '';
var myIP = null;
var lat = 0;
var long = 0;
var alt = -1;
var uvURL = '';
var dateStart;
var dt;
var dateUV;
var numUV;
var uv;
var valorUVvivo;
var timeMaxUV;
var meses = new Array("Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre");

var localDate = new Date();
var timeZone = localDate.getTimezoneOffset();
timeZone = ((timeZone * -1) / 60);

$(document).ready(function () {

    //console.log(cordova);
    //************ Retrieve IP & City data ***************************//

    $.ajax({
        type: 'GET',
        dataType: 'json',
        async: false,
        url: 'http://ip-api.com/json',
        success: function (response) {
            city1 = (response.city);


        }
    });

//                console.log('User\'s city ******* is ', city1);
    $('#cityName').text(city1);

    //************ Retrieve Geo data of device ***************************//

    var onSuccessGeo = function (position) {

        lat = position.coords.latitude; //-2.1961601;//
        long = position.coords.longitude; //-79.8862076//

        $('#latValue').val(lat);
        $('#longValue').val(long);

//                    dt = new Date();
        dateUV = new Date($.now()); //new Date();


        dt = dateUV.getFullYear()
                + '-' + (((dateUV.getMonth()) < 9) ? '0' + (dateUV.getMonth() + 1) : (dateUV.getMonth() + 1))
                + '-' + (((dateUV.getDate()) < 10) ? '0' + (dateUV.getDate()) : (dateUV.getDate()))
                + '-'
                + (((dateUV.getHours()) < 10) ? '0' + (dateUV.getHours()) : (dateUV.getHours())) + "-"
                + (((dateUV.getMinutes()) < 10) ? '0' + (dateUV.getMinutes()) : (dateUV.getMinutes())) + "-"
                + (((dateUV.getSeconds()) < 10) ? '0' + (dateUV.getSeconds()) : (dateUV.getSeconds())) + '-'
                + ((dateUV.getMilliseconds()));

        dateStart = dateUV.getFullYear() + '-' + (((dateUV.getMonth()) < 9) ? '0' + (dateUV.getMonth() + 1) : (dateUV.getMonth() + 1))
                + '-' + (((dateUV.getDate()) < 10) ? '0' + (dateUV.getDate()) : (dateUV.getDate()));

//                    console.log('latitude:' + lat + '\n'
//                            + 'longitude:' + long + '\n'
//                            + 'dateTime:' + dateStart + '\n');

//                    $('#dateApp').text(dateUV.getUTCDate() + " de " + meses[dateUV.getUTCMonth()] + " de " + dateUV.getUTCFullYear());

        getDataApp(lat, long, dateStart, 'Quito');

    };

    // onError Callback receives a PositionError object
    //
    function onErrorGeo(error) {
//                    alert('code: ' + error.code + '\n' +
//                            'message: Acceso ubicacion denegado por usuario' + error.message + '\n');
        alert('Acceso ubicacion denegado por usuario' + '\n');
    }

    navigator.geolocation.getCurrentPosition(onSuccessGeo, onErrorGeo);

});