CLICS
=====

![screenshot](https://raw.githubusercontent.com/anqurvanillapy/clics/master/screenshot.png)

**CLICS** is the acronym of **C**ommand-**L**ine **I**nterface
**C**hat **S**hell, simply a gadget for practising `Python` web
framework `bottle`, template engine `Jinja2`, and async `JavaScript`.
It is featured by a superficially CLI-styled shell running on your web
browser. Just for fun!

Requirements
------------

- `bottle 0.12.8`
- `Jinja2 2.7.3`

Installation
------------

Simply clone this repository and run the cliche
```
$ git clone git@github.com:anqurvanillapy/clics.git
$ python setup.py install
```

Usage
-----

- In command line, type `clics` to run the server in `localhost:8080`
by default
- Open your browser, route your name like `localhost:8080/user` to say
hello!

### Options ###

```
-h, --hostname,
        Specify the hostname where the server runs
-p, --port,
        Set the port that the server will use
-d, --debug,
        Display exceptions and tracebacks in the web page
```

### Well...Some Truth ###

- **clics** runs using bottle built-in web server `WSGIRefServer()`,
and mostly it's recommanded to run the server using `uWSGI` and
`Nginx`, so you can set up a better environment and configure wisely
for running this app
- Due to my lack of experience, some important tests like server
resource usage were ignored during my development :(

How It Works
------------

_Comming soon!_ I will author a post in my personal blog. :)

Known Issues
------------

* [ ] There is an interval between the polling when clients sending
their messages will lead to failure
* [ ] Message loss occurs in low-network-speed environment 

Support
-------

**I need your help!** This is an exercise for practising `JavaScript`
and `Python` web framework, for I'm a freshman of building a web app,
and especially this is a chatting app without using realtime
communication technology, such as `WebSocket`, and the multi-threading
methods are weak inside it.

To say honestly, there is much space for bettering the working
efficiency and details about how it works. Please give your advice and
feel free to pull your requests! :D
