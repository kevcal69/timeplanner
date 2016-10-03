import json
import csv

from django.urls import reverse
from django.conf import settings
from django.core import serializers
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.views.generic import View, TemplateView

from timegroup.models import TimezoneRecords
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
            except:
                print 'Not a csv'
        return HttpResponseRedirect(reverse('index-admin'))


class AddClientWorkers(View):

    def post(self, request, *args, **kwargs):
        tz = request.POST.get('timezone')
        ti = request.POST.get('timein')
        to = request.POST.get('timeout')
        co = request.POST.get('country_code')

        return HttpResponse(200)
