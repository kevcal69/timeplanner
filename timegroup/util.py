from django.conf import settings


def createGroup(obj, number):
    number -= 1
    baseGMT = settings.D_GMT
    default_timein = settings.D_TIME_IN
    default_timeout = settings.D_TIME_OUT

    workingTimeIn = settings.D_WORKTIME_IN
    workingTimeOut = settings.D_WORKTIME_OUT

    group = [obj[i: i + number] for i in range(0, len(obj), number)]
    groupings = []
    for gr in group:
        lbtimeDiff = getTimeDifference(baseGMT, gr[0]['timezone'])
        ubtimeDiff = getTimeDifference(baseGMT, gr[-1]['timezone'])
        lbtime = workingTimeIn + lbtimeDiff
        ubtime = workingTimeOut + ubtimeDiff
        meetup = getMeetUpTime(lbtime, ubtime, default_timein, default_timeout)
        groupings.append({
            'group': gr,
            'time': meetup
        })
    return groupings


def getTimeDifference(baseGMT, offsetGMT):
    if (baseGMT >= 0) ^ (offsetGMT < 0):
        diffTime = abs(baseGMT) - abs(offsetGMT)
        return diffTime * -1 if baseGMT >= 0 else diffTime
    else:
        diffTime = abs(baseGMT) + abs(offsetGMT)
        return diffTime * -1 if baseGMT >= 0 else diffTime


def getMeetUpTime(xti, xto, yti, yto):
    x = []
    for i in xrange(xti, xto):
        x.append(i if i <= 23 else i - 24)
    y = []
    for i in xrange(yti, yto):
        y.append(i if i <= 23 else i - 24)
    return list(set(x) & set(y))
