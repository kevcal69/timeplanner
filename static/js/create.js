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
        'meeting': parent.find('.meeting').val()
    }
    $.get('group', data,function(data) {
        data = JSON.parse(data);
        var resultTable = $('.results');
        resultTable.removeClass('hidden');
        var t = $('.results-body');
        t.empty();
        data = assignDays(data, (data.timein || 9), (data.timeout || 20), (data.meeting || 4));
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
                tr.append('<td>'+ obj.days +'</td>');
                t.append(tr);
            }
        });
    });
}

function assignDays(data, timeStart, timeDone, meetingPerDay) {
    data = data.sort(function(a, b) {
        if (a.time[0] < b.time[0]) return -1;
        if (a.time[0] > b.time[0]) return 1;
        return 0;
    });
    var dataWithDays = [];
    var meetingPerDay = 4;
    var day = 1;
    var ctr = 0;
    while (true) {
        var timeHour = timeStart;
        var meetings = 0;
        var index = []
        for(var i = 0; i < data.length; i++) {
            var mdat = data[i];
            if (typeof(mdat.days) === 'undefined' && timeHour <= mdat.time[0]) {
                timeHour = mdat.time[mdat.time.length-1];
                mdat.days = day;
                meetings++;
            }
            if (meetingPerDay === meetings) {
                break;
            }
        }

        day += 1;
        ctr++;
        var flag = data.filter(function(obj) {return typeof(obj.days) === 'undefined' })
        if (flag.length === 0 || ctr > 100) {
            break;
        }
    }
    data = data.sort(function(a, b) {
        if (a.days < b.days) return -1;
        if (a.days > b.days) return 1;
        return 0;
    })
    return data;
}
