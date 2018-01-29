from django.shortcuts import render
from django.http import HttpResponse

import time
import hashlib
import random
import urllib.parse
import os
# Create your views here.
def md5(string):
	m2 = hashlib.md5()   
	m2.update(string) 
	return m2.hexdigest()


def getSourceDir():
	BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
	return os.path.join(BASE_DIR, 'source')

def getResultDir():
	BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
	return os.path.join(BASE_DIR, 'result')
	
def save(request):
	result_dir = getResultDir()
	
	data = urllib.parse.unquote(request.body.decode()).encode().decode('unicode_escape')
	file_name = '%s_%s_%s.%s' % (request.GET.get('mail','empty') , str(int(time.time())) , md5(str(random.random()).encode()) , 'html')
	f = open('%s/%s' % (result_dir,file_name),'w')
	f.write(data)
	f.close()
	response = HttpResponse('zimbra report ok')
	response['Content-Type'] = 'text/javascript'
	response['Access-Control-Allow-Origin'] = '*'
	return response

def script(request):
	source_dir = getSourceDir()
	f = open('%s/zimbra.js' % (source_dir),'rb')
	code = f.read()
	response = HttpResponse(code)
	response['Content-Type'] = 'text/javascript'
	response['Access-Control-Allow-Origin'] = '*'

	return response