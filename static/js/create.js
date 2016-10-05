var ctr = 0;
var counter_template = $('.left');

$('.add').on('click', function() {
    var l = $(this).closest('.record').addClass('group')
    $(this).addClass('hidden')
    $(this).parent().find('.del').removeClass('hidden')
    ctr += 1
    counter_template.html(ctr)
})

$('.del').on('click', function() {
    var l = $(this).closest('.record').removeClass('group')
    $(this).addClass('hidden')
    $(this).parent().find('.add').removeClass('hidden')
    ctr -= 1
    counter_template.html(ctr)
})


$('.reset').on('click', function() {
    $('.del').addClass('hidden')
    $('.add').removeClass('hidden')
    ctr = 0;
    counter_template.html(ctr)
})


$('.save').on('click', function() {
    $('.results').removeClass('hidden')
    var base_gmt = 8;
    var lowerbound = 9;
    var upperbound = 18;
    var m = $('.record.group');
    var cities = {}
    $.each(m, function(data, obj) {
        var gmt = parseInt($(obj).find('.gmt').data('gmt'))
        var diff = (gmt+12) - (base_gmt+12);
        var time = []
        for(var i = 0; i < 24; i++) {
            var j = (i + diff) < 0? (24 + i + diff) : (i + diff) > 23? (i + diff - 23) : (i + diff);
            if (j >= lowerbound && j < upperbound) {
                time.push(1)
            } else {
                time.push(0)
            }
        }
        var city = $(obj).find('.city').text()
        cities[city] = time
    })
    $.each(cities, function(key, val) {
        $('.results .cities-header').append('<th>'+key+'</th>')
        $.each(val, function(i, obj) {
            var row = $('.results .column-'+i);
            var td = $('<td></td>')
            if (obj === 1) {
                td.addClass('working-hours');
            }
            row.append(td)
        });
    });
})
