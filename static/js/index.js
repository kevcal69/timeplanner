$('.table-action .ui.dropdown').dropdown();

$('.create-group').on('click', function() {
    var recs = $('.record');
    var data = []
    recs.each(function(i){
        var obj = $(recs[i]);
        var value = obj.find('.table-action .text').text();
        if (value && value !== 'Add time') {
            data.push({
                'id': obj.find('.id').text(),
                'gmt': obj.find('.gmt').text(),
                'value': value
            });
        }
    });
    console.log(data);
});
