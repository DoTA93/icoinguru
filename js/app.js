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
        

        var time = '<span style="width: 60px; display:inline-block">' + hours + ":" + minutes + ":" + seconds + "</span> " + suffix;
        var el = document.getElementById('time');
        el.innerHTML = time;
        $('.year').html(currentTime.getFullYear());

    }
    // getCurrentTime();
    setInterval(getCurrentTime, 100);


    $('.d-from').next().on('click', 'a', function(e){
        e.preventDefault();
        // $drop = $(this).next();
        $('.d-val1').html($(this).attr('data-code'));
        convertCurrency();
        // console.log($(this).html())
    });

    $('.d2-from').next().on('click', 'a', function (e) {
        e.preventDefault();
        // $drop = $(this).next();
        $('.d-val2').html($(this).attr('data-code'));
        convertCurrency();
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
    var subscription = ['5~CCCAGG~BTC~USD', '5~CCCAGG~ETH~USD', '5~CCCAGG~BCH~USD', '5~CCCAGG~EOS~USD', '5~CCCAGG~XRP~USD'];
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

    // var coinchart =function(){
        var ctx = document.getElementById('myChart').getContext('2d');
        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'line',

            // The data for our dataset
            data: {
                labels: [],
                datasets: [{
                    label: "$",
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: '#fc6e51',
                    data: [],
                    fill: false,
                }]
            },

            // Configuration options go here
            options: {
                legend: {
                    display: false,
                }
                // responsive: true,
            }
        });

    // }

    /*
        HISTORY CHART SECTION
    */ 
    var history = {};
    history.time = 7;
    history.coin = 'BTC';
    history.baseUrl = 'https://min-api.cryptocompare.com/data/histoday?fsym='

    // get coin type
    $('.js-coin').on('change', function() {
        $this = $(this);
        $this.attr('disabled', true)
        var coin = $this.val();

        var url = generateCoinUrl(coin);
        fetchHistoryChart(url);
    });

    // get time
    $('.page-item').on('click', '.page-link', function (e) {
        e.preventDefault();
        $('.page-item').removeClass('active');
        $(this).parent().addClass('active');
        history.time = $(this).attr('data-time');
        var url = generateTimeUrl(history.time);
        fetchHistoryChart(url);
    });

    var generateCoinUrl = function(coin) {
        history.coin = coin;
        return history.baseUrl + coin + "&tsym=USD&limit=" + history.time;
    }
    var generateTimeUrl = function(time) {
        history.time = time;
        return history.baseUrl + history.coin + "&tsym=USD&limit=" + time;
    }

    var initData = function() {
        var url = history.baseUrl + history.coin + "&tsym=USD&limit=" + history.time;
        fetchHistoryChart(url);
    }
    
    var fetchHistoryChart = function(url) {
        $.ajax({
            url: url,
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                // console.log(data);
                history.data = data.Data;
                $('.js-coin').removeAttr('disabled');
                updateChart();
            },
            error: function (err) {
                console.error('FETCH ETH ERR:', err);
                $('.js-coin').removeAttr('disabled');
            }
        });    
    };

    
    var updateChart = function() {        
        chart.data.datasets[0].data = [];
        chart.data.labels = [];
        history.data.forEach(function(element) {
            var date = new Date(element.time * 1000);
            chart.data.datasets[0].data.push(element.close);
            chart.data.labels.push(date.getDate() + '/' + (parseInt(date.getMonth())+1) + '/' + date.getFullYear());
            // chart.data.labels.push(new Date(element.time * 1000)());
        });
        chart.update();
    }
    
    initData();

    // fetch currency listv
    var currentcies = [];
    var fetchCurrencyList = function () {
        $.ajax({
            url: '/icoinguru/data/currencies.json',
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                Object.keys(data.results).map(function (key) {
                    currentcies.push(data.results[key]);
                    // console.log('key', data.results[key]);
                });
                // currentcies = currentcies[0];
                populateDropdown(currentcies);
            },
            error: function (err) {
                console.error('FETCH ETH ERR:', err);
            }
        });
    };

    var populateDropdown = function(data, $elem = null) {
        var html = '';
        var i = 0;

        // console.log('data', data);
        data.forEach(function(currency) {
            html += `
                <a class="dropdown-item ${i > 5 ? 'd-none' : ''}" href="#" data-code="${currency.id}">${currency.currencyName} <span class="text-muted">(${currency.id})</span></a>
            `;
            i++;
        });
        if (!$elem) {
            $('.js-currencies').find('a').remove();
            $('.js-currencies').append(html);
        }
        else {
            $elem.append(html).find('a').remove();
            $elem.append(html);
        }
    };

    fetchCurrencyList();

    $('.drop-search').on('keyup', function(e) {
        var search = $(this).val();
        var currencyArray = [];
        currentcies.filter(function (currency) {
            // console.log(currency.id.indexOf())
            var cur = '';
            if (currency.id.indexOf(search.toUpperCase()) > -1 || currency.currencyName.indexOf(search.toUpperCase()) > -1) {
                // console.log(currency);
                currencyArray.push(currency);
            }
        });
        
        populateDropdown(currencyArray, $(this).parent());

    });

    var crypto = [];
    var fetchAllCrypto = function() {
        $.ajax({
            url: '/icoinguru/data/crypto.json',
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                // var value = data[conversionIdentifier];
                console.log(data);
                var html = '';
                data.data.forEach(function(c) {
                    html += `<option value="${c.symbol}">${c.name}</option>`;
                });

                $('.js-coin').html(html);
            },
            error: function (err) {
                console.error('FETCH ETH ERR:', err);
            }
        });
    }
    fetchAllCrypto();
    var populateChartSelectBox = function() {
        currentcies.forEach(function (currency) {
            html += `
                <option value="ETH">${currency.currencyName}</option>
            `;
            html += `
                <a class="dropdown-item ${i > 5 ? 'd-none' : ''}" href="#" data-code="${currency.id}">${currency.currencyName} <span class="text-muted">(${currency.id})</span></a>
            `;
            i++;
        });
    }

    var input;
    // detect change of  drop1, drop2 and from
    $('.currency-input').on('keyup', function() {
        input = $(this).val();
        convertCurrency();
    });
    // $('.d-val1, .d-val2').on('change', function() {
    //     convertCurrency();
    // });

    var convertCurrency = function() {
        var from = $('.d-val1').html().toUpperCase();
        var to = $('.d-val2').html().toUpperCase();

        // console.log(input)
        var conversionIdentifier = from + '_' + to;

        if (!input) return;

        $.ajax({
            url: 'http://free.currencyconverterapi.com/api/v6/convert?q=' + conversionIdentifier + '&compact=y',
            dataType: 'json',
            contentType: 'application/json',
            success: function (data) {
                var value = data[conversionIdentifier];
                console.log(value);
                $('.currency-show').val(value.val * input);
            },
            error: function (err) {
                console.error('FETCH ETH ERR:', err);
            }
        });
    }


    // extended functions
    // var oldHtml = $.fn.html;
    // $.fn.html = function () {
    //     var ret = oldHtml.apply(this, arguments);
    //     this.trigger("change");
    //     return ret;
    // };
    
})(jQuery);