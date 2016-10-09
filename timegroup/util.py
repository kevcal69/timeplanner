import random
from datetime import timedelta
from django.conf import settings


def createGroup(obj, data):
    number = data['num'] - 1
    baseGMT = data['gmt']
    default_timein = data['timein']
    default_timeout = data['timeout']

    wTimein = settings.D_WORKTIME_IN
    wTimeout = settings.D_WORKTIME_OUT

    group = [obj[i: i + number] for i in range(0, len(obj), number)]
    groupings = []
    for gr in group:
        offsetlb = getTimeDifference(baseGMT, gr[0]['timezone'])
        offsetub = getTimeDifference(baseGMT, gr[-1]['timezone'])

        meetup = getMeetUpTime(offsetlb, offsetub, wTimein, wTimeout,
                               default_timein, default_timeout)
        if len(meetup) > 0:
            for g in gr:
                    timeDiff = getTimeDifference(baseGMT, g['timezone']) * -1
                    ub = timeDiff + meetup[0]
                    ub = 24 - ub if ub > 23 else ub
                    lb = timeDiff + meetup[-1]
                    lb = 24 - lb if lb > 23 else lb
                    g['time'] = [ub, lb]
            groupings.append({
                'group': gr,
                'time': meetup
            })
    return groupings


def getTimeDifference(baseGMT, offsetGMT):
    deltaTime = timedelta(hours=offsetGMT) - timedelta(hours=baseGMT)
    return int(deltaTime.total_seconds()) / 3600


def getMeetUpTime(offsetlb, offsetub, wTimein, wTimeout,
                  timein, timeout):

    lb = createMatrix(offsetlb, wTimein, wTimeout)
    ub = createMatrix(offsetub, wTimein, wTimeout)
    workingTime = createMatrix(0, timein, timeout)
    meetup = list((lb & workingTime) & (ub & workingTime))
    meetup = [i - 24 if i > 23 else i for i in meetup]
    if len(meetup):
        randomInt = random.randrange(len(meetup)-1)
        return meetup[randomInt:randomInt+3]
    return meetup


def createMatrix(offset, startTime, endTime):
    return set([i+offset for i in xrange(startTime, endTime+1)])
