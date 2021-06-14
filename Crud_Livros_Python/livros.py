# -*- coding: utf-8 -*-
"""
Created on Thu Jun 10 21:31:24 2021

@author: marqu
"""

import pymysql
from server import app
from db_config import mysql
from flask import jsonify
from flask import flash, request

@app.route('/')
def root():
    return app.send_static_file('index.html')

@app.route('/js/<path:path>')
def send_js(path):
    return app.send_static_file('js/' + path)


@app.route("/livros/<idlivro>", methods = ['DELETE'])
def excluirLivro(idlivro):
    try:
            conn=mysql.connect()
            cur = conn.cursor(pymysql.cursors.DictCursor)
            
            if request.method == 'DELETE':
                sql = '''DELETE FROM livros WHERE idlivro= %s'''
                val = (idlivro)
                
                cur.execute(sql, val)
                conn.commit()

                resp = jsonify(idlivro)
                resp.status_code=200
                return resp
                
            else:
                return "método desconhecido: " + request.method
                
    except Exception as e:
        print(e)
    finally:
        cur.close()
        conn.close()
        
@app.route("/livros/<idlivro>", methods = ['GET', 'POST', 'PUT'])
def livros(idlivro):
    try:
            conn=mysql.connect()
            cur = conn.cursor(pymysql.cursors.DictCursor)
            
            if request.method == 'GET':
                
                if idlivro == '0':
                    cur.execute("SELECT * FROM livros")
                    rows = cur.fetchall()
                    resp = jsonify(rows)
                    resp.status_code=200
                    return resp
                else:
                    sql = '''SELECT * FROM livros WHERE idlivro = %s'''
                    val = (idlivro)
                    cur.execute(sql, val)
                    rows = cur.fetchall()
                    resp = jsonify(rows)
                    resp.status_code=200
                    return resp
                
            elif request.method == 'POST':
                
                obj = request.json
                titulo = obj["titulo"]
                autor = obj["autor"]
                editora = obj["editora"]
                ano = obj["ano"]
                numPaginas = obj["numPaginas"]
                
                sql = '''INSERT INTO livros (titulo, autor, editora, ano, numPaginas) VALUES (%s, %s, %s, %s, %s)'''
                val = (titulo, autor, editora, ano, numPaginas)
                
                cur.execute(sql, val)
                conn.commit()
  
                resp = jsonify(obj)
                resp.status_code=200
                return resp
            
            elif request.method == 'PUT':
                obj = request.json
                idlivro = obj["idlivro"]
                titulo = obj["titulo"]
                autor = obj["autor"]
                editora = obj["editora"]
                ano = obj["ano"]
                numPaginas = obj["numPaginas"]
                
                sql = '''UPDATE livros SET titulo=%s, autor=%s, editora=%s, ano=%s, numPaginas=%s  WHERE idlivro = %s'''
                val = (titulo, autor, editora, ano, numPaginas, idlivro)
                
                cur.execute(sql, val)
                conn.commit()

                resp = jsonify(obj)
                resp.status_code=200
                return resp
            else:
                return "método desconhecido: " + request.method
                
    except Exception as e:
        print(e)
    finally:
        cur.close()
        conn.close()
        
        
@app.errorhandler(404)
def not_found(error=None):
    message = {
            'status':404,
            'message':'Not Found ' + request.url,
            }
            
    resp = jsonify(message)
    resp.status_code = 404
    return resp


if __name__ == "__main__":
    app.run()    
    