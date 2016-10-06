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
    $.get('group', function(data) {
        data = JSON.parse(data);
        var resultTable = $('.results');
        $.each(data, function(i, obj){
            resultTable.removeClass('hidden');
            if(obj.time.length > 0) {
                var time = obj.time;
                var city = obj.group.map(function(o){
                    return o.city
                });
                var t = $('.results-body');
                var tr = $('<tr></tr>');
                tr.append('<td>'+ city.join('<br/>') +'</td>');
                tr.append('<td>'+ time[0]+':00 - ' + time[time.length-1]+':00' +'</td>')
                t.append(tr);
            }
        });
    });
})

// $.each(cities, function(key, val) {
//     $('.results .cities-header').append('<th>'+key+'</th>')
//     console.log(key, val);
//     $.each(val, function(i, obj) {
//         var row = $('.results .column-'+i);
//         var td = $('<td></td>')
//         if (obj === 1) {
//             td.addClass('working-hours');
//         }
//         row.append(td)
//     });
// });
