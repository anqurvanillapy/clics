#!/usr/bin/env python
# -*- coding:utf-8 -*-

import os, sys, argparse, webbrowser, random, json
from bottle import *
from jinja2 import *

__version__ = '0.0.1'
STATIC_ROOT = './layouts'

env = Environment(loader=PackageLoader('clics', 'layouts'))
template = env.get_template('default.html')

def init_path():

    path = os.getcwd()
    if path not in sys.path:
        sys.path.append(path)

def parse_arguments():

    parser = argparse.ArgumentParser(
        description='clics: command-line interface chat shell',
        add_help=False,
        )

    parser.add_argument(
        '-h', '--hostname',
        dest='hostname',
        action='store',
        default='localhost',
        )

    parser.add_argument(
        '-p', '--port',
        dest='port',
        action='store',
        type=int,
        default=8080,
        )

    parser.add_argument(
        '-d', '--debug',
        dest='debug',
        action='store_true',
        default=False,
        )

    return parser.parse_args()

def init_user(username):

    if username == '':
        return
    else:
        c = lambda: random.randint(0, 255)
        usercolor = '#%02X%02X%02X' % (c(),c(),c())

        user = {
            "usercolor": usercolor,
        }

        return user

@route('/')
@route('/<username>')
def app_main(username=''):

    run_main = True

    if username == '':
        username = 'ranger'
        run_main = False

    return template.render(
        username=username,
        run_main=run_main,
        version=__version__,
        )

@route('/<username>/init')
def send_user(username):

    user = init_user(username)
    
    if not request.get_cookie('usercolor'):
        response.set_cookie('usercolor', user['usercolor'])

    return json.dumps(user)

@route('/layouts/<filename:path>')
def send_static(filename):

    return static_file(filename, root=STATIC_ROOT)

@route('/msg', method='post')
def send_msg():

    req = request.json
    username = req['username']
    usercolor = req['usercolor']
    message = req['message']

    print username, usercolor, message

if __name__ == '__main__':
    init_path()
    args = parse_arguments()
    run(host=args.hostname, port=args.port, debug=args.debug)