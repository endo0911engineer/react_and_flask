from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///my_database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(10), nullable=False)
    happiness = db.Column(db.String(300), nullable=False)
    goal = db.Column(db.String(300), nullable=False)
    task = db.Column(db.String(300), nullable=False)

    def __init__(self, date, happiness, goal, task):
        self.date = date
        self.happiness = happiness
        self.goal = goal
        self.task = task
    
    def __repr__(self):
        return f'{self.date}\n{self.happiness}\n{self.goal}\n{self.task}'

with app.app_context():
    db.create_all()

@app.route('/')
def hello():
    return "Hello from Flask!"

@app.route('/items',methods=['GET'])
def get_items():
    items = Item.query.all()
    return jsonify([str(item) for item in items])

@app.route('/items',methods=['POST'])
def add_item():
    date = request.json['date']
    happiness = request.json['happiness']
    goal = request.json['goal']
    task = request.json['task']

    item = Item(date=date, happiness=happiness, goal=goal, task=task)
    db.session.add(item)
    db.session.commit()
    return jsonify(str(item)), 201

@app.route('/items/<int:item_id>',methods=['DELETE'])
def delete_item(item_id):
    item = Item.query.get_or_404(item_id)
    db.session.delete(item)
    db.session.commit()
    return jsonify({'message': 'Item deleted'}), 200

if __name__ == '__main__':
    app.run(debug=True)