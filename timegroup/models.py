from __future__ import unicode_literals

from django.db import models


class TimezoneRecords(models.Model):
    timezone = models.IntegerField(default=0)
    city = models.CharField(max_length=100)
    country_code = models.CharField(max_length=2)

    def __str__(self):
        return "%s %s" % (self.city, self.timezone)
