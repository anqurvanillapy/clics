#!/usr/bin/env python
# -*- coding:utf-8 -*-

from bottle import *
from jinja2 import *

env = Environment(loader=PackageLoader('clics', 'layouts'))
template = env.get_template('default.html')


@route('/')
@route('/<username>')
def greet(username='ranger'):

    help_msg = True
    if username != 'ranger':
        help_msg = False
    return template.render(username=username, help_msg=help_msg)

@route('/layouts/<filename:path>')
def send_static(filename):
    
    return static_file(filename, root='./layouts', download=True)

run(host='localhost', port=29, debug=True)