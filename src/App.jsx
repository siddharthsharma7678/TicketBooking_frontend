import { useState } from "react";
import "./App.css";
import { Movies, Slot } from "./components/data";

function App() {
  const [movie, setMovie] = useState("");
  const [slot, setslot] = useState("");
  const [A1, setA1] = useState(0);
  const [A2, setA2] = useState(0);
  const [A3, setA3] = useState(0);
  const [A4, setA4] = useState(0);
  const [D1, setD1] = useState(0);
  const [D2, setD2] = useState(0);
  // const [selected, setselected] = useState(false);
  // function to selecte the movie
  const selectMovie = (value) => {
    setMovie(value);
  };

  // function to select the slot
  const selectSlot = (value) => {
    setslot(value);
  };

  // handle the form submission save all the data to object and send tolocalstorage
  const handleSubmit = () => {
    const values = {
      movie_name: movie,
      slot_name: slot,
      seats: {
        a1: A1,
        a2: A2,
        a3: A3,
        a4: A4,
        d1: D1,
        d2: D2,
      },
    };
  };

  return (
    <>
      <div className="app-div flex w-[90vw] m-4 gap-8">
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Book that show!!</h1>
          <div className="movie-row border rounded m-2">
            <h4 className="mx-4 my-2 font-bold">Select A movie</h4>
            <div className="movie-column flex flex-wrap gap-4 m-4">
              {Movies.map((value, index) => (
                <div
                  key={index}
                  onClick={() => selectMovie(value)}
                  className={`border rounded-sm px-4 py-2 font-bold cursor-pointer ${
                    movie === value ? "bg-red-500" : ""
                  } `}
                >
                  {value}
                </div>
              ))}
            </div>
          </div>

          <div className="slot-row border rounded m-2">
            <h4 className="mx-4 my-2 font-bold">Select A Slot</h4>
            <div className="slot-column flex gap-4 m-4">
              {Slot.map((value, index) => (
                <div
                  onClick={() => selectSlot(value)}
                  key={index}
                  className={`border rounded-sm px-4 py-2 font-bold cursor-pointer ${
                    slot === value ? "bg-red-500" : ""
                  }`}
                >
                  {value}
                </div>
              ))}
            </div>
          </div>
          <div className="seat-row border rounded m-2">
            <h4 className="mx-4 my-2 font-bold">Select the seats</h4>
            <div className="seat-column flex gap-2 m-4">
              <div className="border rounded-sm px-4 py-2 flex flex-col justify-center items-center">
                <h3 className="font-bold mb-2">Type A1</h3>
                <input
                  id="seat-A1"
                  className="border sm:w-8 font-bold"
                  min={0}
                  value={A1}
                  onChange={(e) => setA1(e.target.value)}
                  type="number"
                />
              </div>
              <div className="border rounded-sm px-4 py-2 flex flex-col justify-center items-center">
                <h3 className="font-bold mb-2">Type A2</h3>
                <input
                  id="seat-A2"
                  className="border sm:w-8 font-bold"
                  min={0}
                  value={A2}
                  onChange={(e) => setA2(e.target.value)}
                  type="number"
                />
              </div>
              <div className="border rounded-sm px-4 py-2 flex flex-col justify-center items-center">
                <h3 className="font-bold mb-2">Type A3</h3>
                <input
                  id="seat-A3"
                  className="border sm:w-8 font-bold"
                  min={0}
                  value={A3}
                  onChange={(e) => setA3(e.target.value)}
                  type="number"
                />
              </div>
              <div className="border rounded-sm px-4 py-2 flex flex-col justify-center items-center">
                <h3 className="font-bold mb-2">Type A4</h3>
                <input
                  id="seat-A4"
                  className="border sm:w-8 font-bold"
                  min={0}
                  value={A4}
                  onChange={(e) => setA4(e.target.value)}
                  type="number"
                />
              </div>
              <div className="border rounded-sm px-4 py-2 flex flex-col justify-center items-center">
                <h3 className="font-bold mb-2">Type D1</h3>
                <input
                  id="seat-D1"
                  className="border sm:w-8 font-bold"
                  min={0}
                  value={D1}
                  onChange={(e) => setD1(e.target.value)}
                  type="number"
                />
              </div>
              <div className="border rounded-sm px-4 py-2 flex flex-col justify-center items-center">
                <h3 className="font-bold mb-2">Type D2</h3>
                <input
                  id="seat-D2"
                  className="border sm:w-8 font-bold"
                  min={0}
                  value={D2}
                  onChange={(e) => setD2(e.target.value)}
                  type="number"
                />
              </div>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            type="submit"
            className="rounded border px-4 py-2 bg-gradient-to-r from-blue-500 to-pink-500"
          >
            Book Now
          </button>
        </div>
        <div className="last-booking w-56">
          <div className="box border rounded-sm p-2">
            <h1 className="font-extrabold text-lg">Last Booking Details:</h1>
            <div className="details flex flex-col">
              <h4 className="font-bold">Seats:</h4>
              <h4 className="font-bold">
                A1:<span className="text-gray-600">5</span>
              </h4>
              <h4 className="font-bold">
                A2:<span className="text-gray-600">5</span>
              </h4>
              <h4 className="font-bold">
                A3:<span className="text-gray-600">5</span>
              </h4>
              <h4 className="font-bold">
                A4:<span className="text-gray-600">5</span>
              </h4>
              <h4 className="font-bold">
                D1:<span className="text-gray-600">5</span>
              </h4>
              <h4 className="font-bold">
                D2:<span className="text-gray-600">5</span>
              </h4>
              <h4 className="font-bold">
                slot:<span className="text-gray-600">10:00 AM</span>
              </h4>
              <h4 className="font-bold">
                Movie:<span className="text-gray-600">Tenet</span>
              </h4>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
