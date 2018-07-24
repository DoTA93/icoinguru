(function($) {

    var getCurrentTime = function() {
        var currentTime = new Date(),
            hours = currentTime.getHours(),
            minutes = currentTime.getMinutes();
            seconds = currentTime.getSeconds();
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }

        var suffix = "AM";
        if (hours >= 12) {
            suffix = "PM";
            hours = hours - 12;
        }
        if (hours == 0) {
            hours = 12;
        }
        

        var time = '<span style="width: 54px; display:inline-block">' + hours + ":" + minutes + ":" + seconds + "</span> " + suffix;
        var el = document.getElementById('time');
        el.innerHTML = time;
        $('.year').html(currentTime.getFullYear());

    }
    // getCurrentTime();
    setInterval(getCurrentTime, 100);


    $('.d-from').next().on('click', 'a', function(){
        // $drop = $(this).next();
        $('.d-val1').html($(this).html());
        // console.log($(this).html())
    });

    $('.d2-from').next().on('click', 'a', function () {
        // $drop = $(this).next();
        $('.d-val2').html($(this).html());
        // console.log($(this).html())
    });

    // $.ajax({
    //     url: 'https://free.currencyconverterapi.com/api/v6/currencies',
    //     dataType: 'json',
    //     contentType: 'application/json',
    //     success: function (data) {
    //         console.log(data);
    //     },
    //     error: function (err) {
    //         console.error('FETCH ETH ERR:', err);
    //     }
    // });    
    var currentPrice = {};
    var socket = io.connect('https://streamer.cryptocompare.com/');
    var subscription = ['5~CCCAGG~BTC~USD', '5~CCCAGG~ETH~USD', '5~CCCAGG~BCH~USD', '5~CCCAGG~LTE~USD', '5~CCCAGG~XRP~USD'];
    socket.emit('SubAdd', { subs: subscription });
    socket.on("m", function (message) {
        // console.log(message);
        // 5~CCCAGG~ETH~USD~2~469.14~1532424825~0.4283~201.116831~272129418~175318.07318342157~81163092.97298582~379813.12854167004~174590756.52248168~449.63~477.85~448.32~464.78~479.13~445.58~Bitfinex~7ffe9
        var messageType = message.substring(0, message.indexOf("~"));
        if (messageType == CCC.STATIC.TYPE.CURRENTAGG) {
            dataUnpack(message);
        }
        else if (messageType == CCC.STATIC.TYPE.FULLVOLUME) {
            // decorateWithFullVolume(message);
        }
    });

            // dataUnpack(message);
    var dataUnpack = function (message) {
        var data = CCC.CURRENT.unpack(message);

        var from = data['FROMSYMBOL'];
        var to = data['TOSYMBOL'];
        var fsym = CCC.STATIC.CURRENCY.getSymbol(from);
        var tsym = CCC.STATIC.CURRENCY.getSymbol(to);
        var pair = from + to;
        if (!currentPrice.hasOwnProperty(pair)) {
            currentPrice[pair] = {};
        }
        
        for (var key in data) {
            currentPrice[pair][key] = data[key];
        }

        if (currentPrice[pair]['LASTTRADEID']) {
            currentPrice[pair]['LASTTRADEID'] = parseInt(currentPrice[pair]['LASTTRADEID']).toFixed(0);
        }
        currentPrice[pair]['CHANGE24HOUR'] = CCC.convertValueToDisplay(tsym, (currentPrice[pair]['PRICE'] - currentPrice[pair]['OPEN24HOUR']));
        currentPrice[pair]['CHANGE24HOURPCT'] = ((currentPrice[pair]['PRICE'] - currentPrice[pair]['OPEN24HOUR']) / currentPrice[pair]['OPEN24HOUR'] * 100).toFixed(2) + "%";
        displayData(currentPrice[pair], from, tsym, fsym);
        updateView(currentPrice[pair], from);
    };


    var updateView = function(data, from) {
        if (data.PRICE)
            $('.' + from.toLowerCase()).html("$ " + data.PRICE);
    };

    var displayData = function (messageToDisplay, from, tsym, fsym) {
        // var priceDirection = messageToDisplay.FLAGS;
        // var fields = CCC.CURRENT.DISPLAY.FIELDS;

        // for (var key in fields) {
        //     if (messageToDisplay[key]) {
        //         if (fields[key].Show) {
        //             switch (fields[key].Filter) {
        //                 case 'String':
        //                     $('#' + key + '_' + from).text(messageToDisplay[key]);
        //                     break;
        //                 case 'Number':
        //                     var symbol = fields[key].Symbol == 'TOSYMBOL' ? tsym : fsym;
        //                     $('#' + key + '_' + from).text(CCC.convertValueToDisplay(symbol, messageToDisplay[key]))
        //                     break;
        //             }
        //         }
        //     }
        // }

        // $('#PRICE_' + from).removeClass();
        // if (priceDirection & 1) {
        //     $('#PRICE_' + from).addClass("up");
        // }
        // else if (priceDirection & 2) {
        //     $('#PRICE_' + from).addClass("down");
        // }

        // if (messageToDisplay['PRICE'] > messageToDisplay['OPEN24HOUR']) {
        //     $('#CHANGE24HOURPCT_' + from).removeClass();
        //     $('#CHANGE24HOURPCT_' + from).addClass("pct-up");
        // }
        // else if (messageToDisplay['PRICE'] < messageToDisplay['OPEN24HOUR']) {
        //     $('#CHANGE24HOURPCT_' + from).removeClass();
        //     $('#CHANGE24HOURPCT_' + from).addClass("pct-down");
        // }
    };
})(jQuery);