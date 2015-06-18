#!/usr/bin/env python
# -*- coding:utf-8 -*-

import json
from bottle import *
from jinja2 import *

env = Environment(loader=PackageLoader('ajaxtest', 'layouts'))
template = env.get_template('default.html')

def init_user(username):

    user = {
        "username": username,
        "message": "Aloha, jerk!",
    }

    print user

    return json.dumps(user)

@route('/')
def app_main():

    return template.render()

@route('/<username>')
def send_user(username):

    return init_user(username)

@route('/layouts/<filename:path>')
def send_static(filename):

    return static_file(filename, root='./layouts/')

run(host='localhost', port=29, debug=True)