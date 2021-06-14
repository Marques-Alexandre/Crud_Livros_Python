# -*- coding: utf-8 -*-
"""
Created on Thu Jun 10 21:55:06 2021

@author: marqu
"""

from server import app
from flaskext.mysql import  MySQL
mysql = MySQL()

# Configurações MySQL

app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = '123456'
app.config['MYSQL_DATABASE_DB'] = 'libertas2021'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'
mysql.init_app(app)