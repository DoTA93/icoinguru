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
        

        var time = hours + ":" + minutes + ":" + seconds + " " + suffix;
        var el = document.getElementById('time');
        el.innerHTML = time;
        

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

    $.ajax({
        url: 'https://free.currencyconverterapi.com/api/v6/currencies',
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            console.log(data);
        },
        error: function (err) {
            console.error('FETCH ETH ERR:', err);
        }
    });
 var loadData = function() {

    // fetch BTC
     $.ajax({
         url: 'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD',
         dataType: 'json',
         contentType: 'application/json',
         success: function (data) {
             $('.btc').html("$ " + data.USD);
         },
         error: function (err) {
             console.error('FETCH ETH ERR:', err);
         }
     });


     // fetch ETH
     $.ajax({
         url: 'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD',
         dataType: 'json',
         contentType: 'application/json',
         success: function (data) {
             $('.eth').html("$ " + data.USD);
         },
         error: function (err) {
             console.error('FETCH ETH ERR:', err);
         }
     });

     //fetch BCH
     $.ajax({
         url: 'https://min-api.cryptocompare.com/data/price?fsym=BCH&tsyms=USD',
         dataType: 'json',
         contentType: 'application/json',
         success: function (data) {
             $('.bch').html("$ " + data.USD);
         },
         error: function (err) {
             console.error('FETCH ETH ERR:', err);
         }
     });

     //fetch LTE
     $.ajax({
         url: 'https://min-api.cryptocompare.com/data/price?fsym=LTE&tsyms=USD',
         dataType: 'json',
         contentType: 'application/json',
         success: function (data) {
             $('.lte').html("$ " + data.USD);
         },
         error: function (err) {
             console.error('FETCH ETH ERR:', err);
         }
     });

     //fetch XRP
     $.ajax({
         url: 'https://min-api.cryptocompare.com/data/price?fsym=XRP&tsyms=USD',
         dataType: 'json',
         contentType: 'application/json',
         success: function (data) {
             $('.xrp').html("$ " + data.USD);
         },
         error: function (err) {
             console.error('FETCH ETH ERR:', err);
         }
     });
     
 };
    
 setInterval(loadData, 30000);
 
 var i = 0;
 

 
 var countDown = function(){
     i++;
     i = i % 300;
     
     $('.progress-bar').css('width', i/300 *100 + '%');
     
     setTimeout(countDown, 100);
    };
    countDown();
    loadData();
    
})(jQuery);