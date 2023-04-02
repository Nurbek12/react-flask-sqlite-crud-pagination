from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from uuid import uuid4
from os.path import join, dirname, realpath, exists
from werkzeug.utils import secure_filename
import sqlite3 as sql

app = Flask(__name__, static_url_path='/upload', static_folder='build')
CORS(app)

UPLOAD_PATH = join(dirname(realpath(__file__)), 'upload')

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and exists(app.static_folder+'/'+path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

@app.route('/files/<string:path>')
def send_html(path):
    return send_from_directory('upload', path)

@app.route('/all')
def index():
    users = []
    try:
        page = request.args.get('page')
        perpage = request.args.get('perpage')
        con = sql.connect('database.db')
        cur = con.cursor()
        cur1 = con.cursor()
        con.row_factory = sql.Row
        r_set=cur1.execute("SELECT count(*) as no from users")
        data_row=r_set.fetchone()
        count=data_row[0]

        if page is None or page == 0: page = 1
        else: page = int(page)
        if perpage is None: perpage = count
        else: perpage = int(perpage)

        cur.execute("select * from users order by id limit ?, ?",(perpage * (page-1), perpage))
        rows = cur.fetchall()
        for i in rows:
            user = {}
            user["id"] = i[0]
            user["userid"] = i[1]
            user["name"] = i[2]
            user["phone"] = i[3]
            user["address"] = i[4]
            user["email"] = i[5]
            user["image"] = i[6]
            user["status"] = i[7]
            user["description"] = i[8]
            users.append(user)
        return jsonify(users=users, count=count)
    except:
        users = []
        return jsonify(False)

@app.route('/search/<string:query>')
def search(query):
        users = []
    # try:
        page = request.args.get('page')
        perpage = request.args.get('perpage')
        con = sql.connect('database.db')
        cur = con.cursor()
        cur1 = con.cursor()
        con.row_factory = sql.Row
        r_set=cur1.execute("select count(*) as no from users where name like '%"+query+"%' or phone like '%"+query+"%' or email like '%"+query+"%' or address like '%"+query+"%'")
        data_row=r_set.fetchone()
        count=data_row[0]

        if page is None or page == 0: page = 1
        else: page = int(page)
        if perpage is None: perpage = count
        else: perpage = int(perpage)

        cur.execute("select * from users where name like '%"+query+"%' or phone like '%"+query+"%' or email like '%"+query+"%' or address like '%"+query+"%' limit ?, ?",(perpage * (page-1), perpage))
        rows = cur.fetchall()
        for i in rows:
            user = {}
            user["id"] = i[0]
            user["userid"] = i[1]
            user["name"] = i[2]
            user["phone"] = i[3]
            user["address"] = i[4]
            user["email"] = i[5]
            user["image"] = i[6]
            user["status"] = i[7]
            user["description"] = i[8]
            users.append(user)
        return jsonify(users=users, count=count)
    # except:
    #     users = []
    #     return jsonify(False)

@app.route('/get/<string:id>')
def get(id):
    try:
        con = sql.connect('database.db')
        cur = con.cursor()
        con.row_factory = sql.Row
        cur.execute("select * from users where id = ?", (id))
        rows = cur.fetchone()
        con.commit()
        return jsonify({
            "id": rows[0],
            "userid": rows[1],
            "name": rows[2],
            "phone": rows[3],
            "address": rows[4],
            "email": rows[5],
            "image": rows[6],
            "status": rows[7],
            "description": rows[8]
        })
    except:
        return jsonify(False)

@app.route('/create', methods=['POST','GET'])
def create():
    try:
        if request.method == 'POST':
            imagename = ''
            userid = str(uuid4())
            con = sql.connect('database.db')
            cur = con.cursor()
            if len(request.files) > 0 and request.files['image'].filename != '':
                image = request.files['image']
                rimn = f'{uuid4()}_{image.filename}'
                image.save(join(UPLOAD_PATH, secure_filename(rimn)))
                imagename = rimn
            else:
                imagename = "nophoto.jpg"
            cur.execute('insert into users(userid,name,phone,address,email,image,status,description) values (?,?,?,?,?,?,?,?)', 
            (userid,request.form['name'],
            request.form['phone'],request.form['address'],
            request.form['email'],imagename,
            request.form['status'],request.form['description']))
            con.commit()
            
            return jsonify({
                "id":cur.lastrowid,
                "userid":userid,
                "name":request.form['name'],
                "phone":request.form['phone'],
                "address":request.form['address'],
                "email":request.form['email'],
                "image":imagename,
                "status":request.form['status'],
                "description":request.form['description']
            })
    except:
        return jsonify(False)

@app.route('/edit/<string:id>', methods=['PUT', 'GET'])
def edit(id):
    try:
        if request.method == 'PUT': 
            con = sql.connect('database.db')
            cur = con.cursor()
            if len(request.files) > 0 and request.files['image'].filename != '':
                image = request.files['image']
                rimn = f'{uuid4()}_{image.filename}'
                image.save(join(UPLOAD_PATH, secure_filename(rimn)))
                imagename = rimn
            else:
                imagename = request.form['image']
            cur.execute('update users set userid = ?, name = ?, phone = ?, address = ?, email = ?, image = ?, status = ?, description = ? where id = ?', 
            (request.form['userid'],request.form['name'],
            request.form['phone'],request.form['address'],
            request.form['email'],imagename,
            request.form['status'],request.form['description'], id))
            con.commit()
            return jsonify({
                "id":request.form['id'],
                "userid":request.form['userid'],
                "name":request.form['name'],
                "phone":request.form['phone'],
                "address":request.form['address'],
                "email":request.form['email'],
                "image":imagename,
                "status":request.form['status'],
                "description":request.form['description']
            })
    except:
        return jsonify(False)

@app.route('/delete/<string:id>', methods=['DELETE', 'GET'])
def delete(id):
    try:
        if request.method == 'DELETE':
            con = sql.connect('database.db')
            cur = con.cursor()
            cur.execute('delete from users where id=?', (id))
            con.commit()
            return jsonify(True)
    except:
        return jsonify(False)

if __name__ == '__main__':
    app.secret_key = 'admin123'
    app.run()