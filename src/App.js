import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function App() {
  const [listRoom, setListRoom] = useState([]);
  const [error, setError] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [selectedRooms, setSelectedRooms] = useState([]);

  const submitHandler = (e) => {
    e.preventDefault();

    const c_id = e.target.elements.input_id.value;
    const c_room_type_name = e.target.elements.input_room_type_name.value;

    axios
      .get(
        "https://backend-server-tribe.herokuapp.com/new-get?id=" +
          c_id +
          "&room_type_name=" +
          c_room_type_name
      )
      .then((res) => {
        if (res.data.status === 200) {
          setError("");
          console.log(res);
          console.log("success?");
          setAllList();
        } else {
          setError(res.data.sqlMessage);
          console.log("error");
          console.log(res.data);
        }
      });
  };

  const removeHandler = () => {
    axios.delete("https://backend-server-tribe.herokuapp.com/").then((res) => {
      if (res.data.status === 200) {
        setError("");
        console.log(res);
        console.log("success?");
        setAllList();
      } else {
        setError(res.data.sqlMessage);
        console.log("error");
        console.log(res.data);
      }
    });
  };

  const getHotelHandler = (e) => {
    e.preventDefault();
    const dateString =
      startDate.getFullYear() +
      "-" +
      (startDate.getMonth() + 1) +
      "-" +
      startDate.getDate();
    const postData = {
      date: dateString,
      room_type_id: e.target.elements.selectId.value,
    };
    console.log(postData);
    axios
      .post(
        "http://34.87.142.215/aspire-project/public/booking-box/api-test",
        postData
      )
      .then((res) => {
        const newArray = res.data;
        console.log("test");
        console.log(newArray);
        setSelectedRooms([newArray]);
      });
  };

  const setAllList = () => {
    axios
      .get("https://backend-server-tribe.herokuapp.com/room-list")
      .then((res) => {
        const newArray = res.data;
        setListRoom(newArray);
      });
  };

  useEffect(() => {
    setAllList();
  }, []);

  return (
    <div className='App'>
      <div className='container'>
        Part 1
        <div className='input-container'>
          <form onSubmit={submitHandler}>
            <input type='text' name='input_id' placeholder='id' />
            <input
              type='text'
              name='input_room_type_name'
              placeholder='room type name'
            />

            <button>Submit</button>
          </form>
        </div>
        <div className='list-container'>
          {listRoom.map((room) => (
            <div key={room.id}>{room.room_type_name}</div>
          ))}
        </div>
        {error}
        <button onClick={removeHandler}>Remove all room type</button>
      </div>
      <div className='container'>
        Part 2
        <div className='input-container'>
          <form onSubmit={getHotelHandler}>
            <select name='selectId'>
              {listRoom.map((room) => (
                <option value={room.id} key={room.id}>
                  {room.room_type_name}
                </option>
              ))}
            </select>

            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
            />
            <button>Search</button>
          </form>
        </div>
        <div className='list-container'>
          {selectedRooms.map((room) => (
            <div key={room.id}>
              Room left:{room.room_left}, price:
              {room.price}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
