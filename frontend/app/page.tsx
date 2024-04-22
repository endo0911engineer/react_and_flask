'use client';

import { useEffect, useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  const [items, setItems] = useState<string[]>([]);
  const [date,setDate] = useState<string>('');
  const [happiness,setHappiness] = useState<string>('');
  const [goal,setGoal] = useState<string>('');
  const [task,setTask] = useState<string>('');

  useEffect(() => {
    fetchItems();
  },[]);

  const fetchItems = async () => {
    const res = await fetch('http://localhost:5000/items');
    const data = await res.json();
    setItems(data);
  };

  const addItem = async (e:any) => {
    e.preventDefault();

    if(!date || !happiness || !goal || !task) return;

    try{
      const res = await fetch('http://localhost:5000/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date: date, happiness: happiness, goal:goal, task:task }),
      });

      if(res.ok) {
        const data = await res.json();
        setItems([...items, data]);
        setDate('');
        setHappiness('');
        setGoal('');
        setTask('');
      }else {
        console.error('Failed to add item');
      }
    }catch (error){
      console.error('Error adding item',error);
    }
  };

  const deleteItem = async (index: number) => {
    try{
      const res = await fetch(`http://localhost:5000/items/${index}`,{
        method: 'DELETE',
      });

      if(res.ok) {
        //削除が成功した場合、アイテムリストを更新
        const updatedItems = [...items];
        updatedItems.splice(index, 1);
        setItems(updatedItems);
      } else {
        console.error('Failed to delete item');
      }
    }catch(error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div className={styles.mypage}>
      <div className={styles.diary}>
      <h1>自分用日記（Nex.js + Flask + SQLite）</h1>
      <form onSubmit={addItem}>
        <div className={styles.form_date}>
          <label>日付</label>
          <input name="date" type="text" 
          onChange={(e) => setDate(e.target.value)}
          value={date}/>
        </div>
        <div className={styles.form_happiness}>
          <label>今日の幸福</label>
          <textarea name="happiness" 
          onChange={(e) => setHappiness(e.target.value)}
          value={happiness}/>
        </div>
        <div className={styles.form_goal}>
          <label>目標</label>
          <textarea name="goal" 
          onChange={(e) => setGoal(e.target.value)}
          value={goal}/>
        </div>
        <div className={styles.form_task}>
          <label>明日やるべきこと</label>
          <textarea name="task" 
          onChange={(e) => setTask(e.target.value)}
          value={task}/>
        </div>
        <div className={styles.button_panel}>
          <button type="submit">書き込む</button>
        </div>
      </form>
      </div>

      <div className={styles.old_diary}>
            <h2>過去の日記</h2>
      <ul>
        {items.map((item, index):any => (
          <li key={index}>
            {item}
            <button onClick={() => deleteItem(index+1)}>Delete</button>
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
};
