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


$('.item.display').on('click', function() {
    $('.form-cont').removeClass('hidden')
    $('.config').addClass('hidden');
    $('.results').addClass('hidden')
});


$('.item.create').on('click', function() {
    $('.form-cont').addClass('hidden');
    $('.config').removeClass('hidden');
})

$('.generate').on('click', fetchGroup);

function fetchGroup(){
    var parent = $(this).parent();
    var data = {
        'gmt': parent.find('.gmt').val(),
        'num': parent.find('.num').val(),
        'timein': parent.find('.time_in').val(),
        'timeout': parent.find('.time_out').val(),
    }
    $.get('group', data,function(data) {
        data = JSON.parse(data);
        var resultTable = $('.results');
        resultTable.removeClass('hidden');
        var t = $('.results-body');
        t.empty();
        data = assignDays(data);
        $.each(data, function(i, obj){
            if(obj.time.length > 0) {
                var time = obj.time;
                var city = obj.group.map(function(o){
                    o.time = o.time || [0,0]
                    return o.city + '<span class="small-font"> ('+o.time[0]+':00-'+o.time[1]+':00 GMT '+o.timezone+')</span>';
                });
                var tr = $('<tr></tr>');

                tr.append('<td>'+ city.join('<br/>') +'</td>');
                tr.append('<td>'+ time[0]+':00 - ' + time[time.length-1]+':00' +'</td>')
                tr.append('<td>'+ 1 +'</td>');
                t.append(tr);
            }
        });
    });
}

function assignDays(data) {
    var data = data.sort(function(a, b) {
        if (a.time[0] < b.time[0]) return -1;
        if (a.time[0] > b.time[0]) return 1;
        return 0;
    })
    console.log(data.length);
    return data;
}
