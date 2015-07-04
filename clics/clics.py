#!/usr/bin/env python
# -*- coding:utf-8 -*-

import argparse
import random
import json
import time
import thread
from bottle import *
from jinja2 import *

# Consts or configs
STATIC_ROOT = './layouts'
INTERVAL = 4.0 # secs

# Server global variables init
msg_cache = []
timeout = 0.0

# Template init
env = Environment(loader=PackageLoader('clics', 'layouts'))
template = env.get_template('default.html')

def parse_arguments():

    parser = argparse.ArgumentParser(
        description='clics: command-line interface chat shell',
        add_help=False
        )

    parser.add_argument(
        '-h', '--hostname',
        dest='hostname',
        action='store',
        default='localhost'
        )

    parser.add_argument(
        '-p', '--port',
        dest='port',
        action='store',
        type=int,
        default=8080
        )

    parser.add_argument(
        '-d', '--debug',
        dest='debug',
        action='store_true',
        default=False
        )

    return parser.parse_args()

class ClicsServer(object):

    def __init__(self, args):

        self.args = args

        try:
            thread.start_new_thread(self.runServer, (self.args,))
            thread.start_new_thread(self.pollServer, ())

            while True:
                pass
        except Exception, e:
            raise e

    def runServer(self, args):
        '''Server running thread'''

        run(host=args.hostname, port=args.port, debug=args.debug)

    def pollServer(self):
        '''Server polling thread'''

        while True:

            # Assign the next refresh time
            timeout = time.time() + INTERVAL
            # Clean the message cache
            msg_cache[:] = []

            time.sleep(INTERVAL)

def init_user(username):

    if username:
        return
    else:
        c = lambda: random.randint(0, 255)
        usercolor = '#%02X%02X%02X' % (c(), c(), c())

        user = {
            # This dict is a template
            # More user attributes can be initialized here
            "usercolor": usercolor
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
        version='0.1'
        )

@route('/<username>/init')
def send_user(username):

    user = init_user(username)
    
    if not request.get_cookie('usercolor'):
        response.set_cookie('usercolor', user['usercolor'])

    return json.dumps(user)

@post('/send_msg')
def store_msg():

    msg_cache.append(request.json)
    print timeout

@route('/layouts/<filename:path>')
def send_static(filename):

    return static_file(filename, root=STATIC_ROOT)

if __name__ == '__main__':

    args = parse_arguments()
    server = ClicsServer(args)