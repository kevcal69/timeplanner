import json
import csv

from django.urls import reverse
from django.conf import settings
from django.core import serializers
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.views.generic import View, TemplateView
from django.db.models import F
from timegroup.models import TimezoneRecords
from timegroup import util
# Create your views here.


class IndexAdminView(TemplateView):
    template_name = 'index.html'

    def get_context_data(self, *args, **kwargs):
        context = super(IndexAdminView, self).\
            get_context_data(*args, **kwargs)
        context['records'] = TimezoneRecords.objects.all()
        return context

    def post(self, request, *args, **kwargs):
        if request.FILES['file_field']:
            csv_file = request.FILES['file_field']
            try:
                lines = csv.reader(csv_file)
                data = [
                    TimezoneRecords(
                        country_code=line[0],
                        city=line[1],
                        timezone=line[2]
                    )
                    for line in lines
                ]
                TimezoneRecords.objects.bulk_create(data)
            except Exception as e:
                print dir(e)
                print 'Not a csv'
        return HttpResponseRedirect(reverse('create-group'))


class CreateGroupView(TemplateView):
    template_name = 'creategroup.html'

    def get_context_data(self, *args, **kwargs):
        context = super(CreateGroupView, self).\
            get_context_data(*args, **kwargs)
        diff = settings.D_TIME_IN - settings.D_TIME_OUT
        context['records'] = TimezoneRecords.objects.all().order_by('timezone')

        return context


class GroupView(View):

    def get(self, request, *args, **kwargs):
        gmt = request.GET.get('gmt', '') or settings.D_GMT
        number = request.GET.get('num', '') or 4
        timein = request.GET.get('timein', '') or settings.D_TIME_IN
        timeout = request.GET.get('timeout', '') or settings.D_TIME_OUT
        data = {
            'gmt': int(gmt),
            'num': int(number),
            'timein': int(timein),
            'timeout': int(timeout)
        }

        # edit if timeout is lesser than timein
        maxTimeDiff = settings.D_WORKTIME_OUT - settings.D_WORKTIME_IN
        obj = []
        for tz in TimezoneRecords.objects.all().order_by('timezone'):
            if abs(util.getTimeDifference(
                    int(gmt), tz.timezone)) < maxTimeDiff:
                print tz.city, tz.timezone, abs(util.getTimeDifference(
                        int(gmt), tz.timezone))
                obj.append(tz)
        records = self.to_dict(obj)

        results = util.createGroup(records, data)
        return HttpResponse(json.dumps(results))

    def to_dict(self, obj):
        listObj = []
        for o in obj:
            listObj.append({
                'timezone': o.timezone,
                'pk': o.pk,
                'city': o.city,
                'country_code': o.country_code
            })
        return listObj
