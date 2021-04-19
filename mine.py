# -*- coding: utf-8 -*-
"""
Created on Mon Apr 19 11:58:25 2021

@author: Sunny
"""
from json import dumps

lisOdd = list(reversed([1 + 2 * ctr for ctr in range(20)][-8:]))
lisAlpha = list('LuxPMsoft')
lis = list(zip(lisOdd, lisAlpha[1:]))
lis.insert(0, ['L'])
resStr = ""
for ele in lis:
    if len(ele) == 2:
        resStr += (str(ele[0] % 10) + ele[1])
    else:
        resStr += ele[0]
res = {"Result" : resStr}
print(dumps(res))
