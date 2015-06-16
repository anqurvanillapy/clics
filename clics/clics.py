#!/usr/bin/env python
# -*- coding:utf-8 -*-

import os, sys, argparse, webbrowser, random, json
from bottle import *
from jinja2 import *

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
        '-u', '--username',
        dest='username',
        action='store',
        default='',
        )

    parser.add_argument(
        '-d', '--debug',
        dest='debug',
        action='store_true',
        default=False,
        )

    return parser.parse_args()

def init_browser(hostname, port, username):

    url = "http://%s:%d/u/%s" % (hostname, port, username)
    webbrowser.open(url)

def init_user(username):

    if username == '':
        return
    else:
        c = lambda: random.randint(0, 255)
        usercolor = '#%02X%02X%02X' % (c(),c(),c())

        user = {
            "username": username,
            "usercolor": usercolor,
        }

        return user

@route('/')
@route('/u/<username>')
def app_main(username=''):

    run_main = True

    if username == '':
        username = 'ranger'
        run_main = False

    return template.render(
        username=username,
        run_main=run_main,
        )

@route('/u/<username>/init')
def send_user(username):

    return json.dumps(init_user(username))

@route('/u/layouts/<filename:path>')
def send_static(filename):

    return static_file(filename, root='./layouts')

if __name__ == '__main__':
    init_path()
    args = parse_arguments()
    init_browser(args.hostname, args.port, args.username)
    run(host=args.hostname, port=args.port, debug=args.debug)