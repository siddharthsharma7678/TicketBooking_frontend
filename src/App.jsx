import { useEffect, useState } from "react";
import "./App.css";
import { Movies, Slot } from "./components/data";
import { useFormik } from "formik";
import axios from "axios";

function App() {
  //get the resent booked ticket start
  const [movieData, setmovieData] = useState([]);
  //get the resent booked ticket end

  const [movie, setMovie] = useState("");
  const [slot, setslot] = useState("");
  const [A1, setA1] = useState(0);
  const [A2, setA2] = useState(0);
  const [A3, setA3] = useState(0);
  const [A4, setA4] = useState(0);
  const [D1, setD1] = useState(0);
  const [D2, setD2] = useState(0);

  // function to selecte the movie
  const selectMovie = (value) => {
    setMovie(value);
  };

  // function to select the slot
  const selectSlot = (value) => {
    setslot(value);
  };

  // handle the form submission save all the data to object and send tolocalstorage
  const formik = useFormik({
    initialValues: {
      A1: 0,
      A2: 0,
      A3: 0,
      A4: 0,
      D1: 0,
      D2: 0,
    },
    onSubmit: async (values, { resetForm }) => {
      if (!slot || !movie) {
        alert("Please Select the Movie and Slot ");
        return;
      }
      if (
        values.A1 == 0 &&
        values.A2 == 0 &&
        values.A3 == 0 &&
        values.A4 == 0 &&
        values.D1 == 0 &&
        values.D2 == 0
      ) {
        alert("Atleat One Ticket should be booked");
        return;
      }
      const payload = {
        A1: Number(values.A1) || 0,
        A2: Number(values.A2) || 0,
        A3: Number(values.A3) || 0,
        A4: Number(values.A4) || 0,
        D1: Number(values.D1) || 0,
        D2: Number(values.D2) || 0,
        MoviE: movie,
        SlOT: slot,
      };
      try {
        const data = await axios.post("/api/booking", payload);
        try {
          const data = localStorage.setItem(
            "Movie_details",
            JSON.stringify(payload),
          );
          setmovieData(JSON.parse(localStorage.getItem("Movie_details")));
          setMovie("");
          setslot("");
          resetForm();
        } catch (e) {
          console.error("Error is ", e.message);
        }
      } catch (e) {
        console.log("error occured", e);
      }
    },
  });
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
          <form onSubmit={formik.handleSubmit}>
            <div className="seat-row border rounded m-2">
              <h4 className="mx-4 my-2 font-bold">Select the seats</h4>
              <div className="seat-column flex gap-2 m-4">
                <div className="border rounded-sm px-4 py-2 flex flex-col justify-center items-center">
                  <h3 className="font-bold mb-2">Type A1</h3>
                  <input
                    id="A1"
                    className="border sm:w-8 font-bold"
                    min={0}
                    value={formik.values.A1}
                    onChange={formik.handleChange}
                    type="number"
                  />
                </div>
                <div className="border rounded-sm px-4 py-2 flex flex-col justify-center items-center">
                  <h3 className="font-bold mb-2">Type A2</h3>
                  <input
                    id="A2"
                    className="border sm:w-8 font-bold"
                    min={0}
                    value={formik.values.A2}
                    onChange={formik.handleChange}
                    type="number"
                  />
                </div>
                <div className="border rounded-sm px-4 py-2 flex flex-col justify-center items-center">
                  <h3 className="font-bold mb-2">Type A3</h3>
                  <input
                    id="A3"
                    className="border sm:w-8 font-bold"
                    min={0}
                    value={formik.values.A3}
                    onChange={formik.handleChange}
                    type="number"
                  />
                </div>
                <div className="border rounded-sm px-4 py-2 flex flex-col justify-center items-center">
                  <h3 className="font-bold mb-2">Type A4</h3>
                  <input
                    id="A4"
                    className="border sm:w-8 font-bold"
                    min={0}
                    value={formik.values.A4}
                    onChange={formik.handleChange}
                    type="number"
                  />
                </div>
                <div className="border rounded-sm px-4 py-2 flex flex-col justify-center items-center">
                  <h3 className="font-bold mb-2">Type D1</h3>
                  <input
                    id="D1"
                    className="border sm:w-8 font-bold"
                    min={0}
                    value={formik.values.D1}
                    onChange={formik.handleChange}
                    type="number"
                  />
                </div>
                <div className="border rounded-sm px-4 py-2 flex flex-col justify-center items-center">
                  <h3 className="font-bold mb-2">Type D2</h3>
                  <input
                    id="D2"
                    className="border sm:w-8 font-bold"
                    min={0}
                    value={formik.values.D2}
                    onChange={formik.handleChange}
                    type="number"
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="rounded border px-4 py-2 bg-linear-to-r from-blue-500 to-pink-500"
            >
              Book Now
            </button>
          </form>
        </div>
        <div className="last-booking w-56">
          <div className="box border rounded-sm p-2">
            <h1 className="font-extrabold text-lg">Last Booking Details:</h1>
            {movieData.length == 0 ? (
              <h1>No previous booking found</h1>
            ) : (
              <div className="details flex flex-col">
                <h4 className="font-bold">Seats:</h4>
                <h4 className="font-bold">
                  A1:<span className="text-gray-600">{movieData["A1"]}</span>
                </h4>
                <h4 className="font-bold">
                  A2:<span className="text-gray-600">{movieData["A2"]}</span>
                </h4>
                <h4 className="font-bold">
                  A3:<span className="text-gray-600">{movieData["A3"]}</span>
                </h4>
                <h4 className="font-bold">
                  A4:<span className="text-gray-600">{movieData["A4"]}</span>
                </h4>
                <h4 className="font-bold">
                  D1:<span className="text-gray-600">{movieData["D1"]}</span>
                </h4>
                <h4 className="font-bold">
                  D2:<span className="text-gray-600">{movieData["D2"]}</span>
                </h4>
                <h4 className="font-bold">
                  slot:
                  <span className="text-gray-600">{movieData["SlOT"]}</span>
                </h4>
                <h4 className="font-bold">
                  Movie:
                  <span className="text-gray-600">{movieData["MoviE"]}</span>
                </h4>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
