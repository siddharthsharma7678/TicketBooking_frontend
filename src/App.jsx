import { useEffect, useRef, useState } from "react";
import "./App.css";
import { Movies, Seats, Slot } from "./components/data";
import { useFormik } from "formik";

const seatKeys = ["A1", "A2", "A3", "A4", "D1", "D2"];

const createEmptySeats = () => ({
  A1: 0,
  A2: 0,
  A3: 0,
  A4: 0,
  D1: 0,
  D2: 0,
});

const normalizeSeatValue = (value) => {
  const seatCount = Number(value);

  if (!Number.isFinite(seatCount) || seatCount < 0) {
    return 0;
  }

  return Math.trunc(seatCount);
};

const readStoredSeats = () => {
  try {
    const storedSeats = JSON.parse(localStorage.getItem("seats")) || {};

    return seatKeys.reduce((seats, seatKey) => {
      seats[seatKey] = normalizeSeatValue(storedSeats[seatKey]);
      return seats;
    }, createEmptySeats());
  } catch {
    return createEmptySeats();
  }
};

const buildApiPayload = (movie, slot, seats) => ({
  movie,
  slot,
  seats: seatKeys.reduce((seatMap, seatKey) => {
    seatMap[seatKey] = normalizeSeatValue(seats[seatKey]);
    return seatMap;
  }, {}),
});

const mapBookingToUiShape = (booking) => {
  if (!booking || typeof booking !== "object" || booking.message) {
    return null;
  }

  const seatsSource =
    booking.seats && typeof booking.seats === "object" ? booking.seats : booking;

  return {
    _id: booking._id,
    MoviE: booking.movie || booking.MoviE || "",
    SlOT: booking.slot || booking.SlOT || "",
    A1: normalizeSeatValue(seatsSource.A1),
    A2: normalizeSeatValue(seatsSource.A2),
    A3: normalizeSeatValue(seatsSource.A3),
    A4: normalizeSeatValue(seatsSource.A4),
    D1: normalizeSeatValue(seatsSource.D1),
    D2: normalizeSeatValue(seatsSource.D2),
  };
};

const hasBooking = (booking) =>
  booking && !Array.isArray(booking) && Object.keys(booking).length > 0;

function App() {
  const latestBookingLoaded = useRef(false);
  const [movieData, setmovieData] = useState(null);
  const [movieArray, setmovieArray] = useState(null);
  const [open, setopen] = useState(false);
  const [movie, setMovie] = useState(() => localStorage.getItem("movie") || "");
  const [slot, setslot] = useState(() => localStorage.getItem("slot") || "");
  const [showBookings, setShowBookings] = useState(false);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");

  const formik = useFormik({
    initialValues: readStoredSeats(),
    onSubmit: async (values, { resetForm }) => {
      const normalizedSeats = seatKeys.reduce((seats, seatKey) => {
        seats[seatKey] = normalizeSeatValue(values[seatKey]);
        return seats;
      }, {});

      if (!slot || !movie) {
        alert("Please Select the Movie and Slot ");
        return;
      }

      if (!seatKeys.some((seatKey) => normalizedSeats[seatKey] > 0)) {
        alert("Atleat One Ticket should be booked");
        return;
      }

      const payload = buildApiPayload(movie, slot, normalizedSeats);
      setBookingMessage("");

      try {
        const response = await fetch("/api/booking", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        const result = await response.json();

        if (!response.ok) {
          setBookingMessage(result.message || "Unable to save booking.");
          return;
        }

        const latestBooking = mapBookingToUiShape(result);
        setmovieData(latestBooking);
        if (showBookings) {
          setmovieArray(latestBooking);
        }

        localStorage.removeItem("movie");
        localStorage.removeItem("slot");
        localStorage.removeItem("seats");
        setMovie("");
        setslot("");
        resetForm({ values: createEmptySeats() });
        setopen(true);
      } catch (error) {
        setBookingMessage("Unable to save booking.");
        console.log("error occured", error);
      }
    },
  });

  useEffect(() => {
    if (latestBookingLoaded.current) {
      return;
    }

    latestBookingLoaded.current = true;

    const loadLatestBooking = async () => {
      setIsLoadingBookings(true);

      try {
        const response = await fetch("/api/booking");
        const result = await response.json();

        if (response.ok && !result.message) {
          const latestBooking = mapBookingToUiShape(result);
          setmovieData(latestBooking);
          setBookingMessage("");
        } else if (result.message === "no previous booking found") {
          setmovieData(null);
          setBookingMessage("");
        } else {
          setmovieData(null);
          setBookingMessage(result.message || "Unable to load bookings right now.");
        }
      } catch {
        setmovieData(null);
        setBookingMessage("Unable to load bookings right now.");
      } finally {
        setIsLoadingBookings(false);
      }
    };

    loadLatestBooking();
  }, []);

  const selectMovie = (value) => {
    setMovie(value);
    localStorage.setItem("movie", value);
  };

  const selectSlot = (value) => {
    setslot(value);
    localStorage.setItem("slot", value);
  };

  const handleClick = () => {
    setopen(false);
  };

  const buildSeatSummary = (booking) => {
    if (!booking) {
      return "No seats booked";
    }

    return Seats.map((seatLabel) => seatLabel.replace("Type ", ""))
      .map((seat) => `${seat}: ${booking[seat] || 0}`)
      .join(", ");
  };

  const handleSeeBookings = () => {
    setShowBookings(true);
    setmovieArray(movieData);
    setTimeout(() => {
      document
        .getElementById("latest-booking")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  };

  const handleSeatChange = (event) => {
    const { name, value } = event.target;
    const normalizedValue = normalizeSeatValue(value);
    const nextSeatValues = {
      ...formik.values,
      [name]: normalizedValue,
    };

    formik.setFieldValue(name, normalizedValue);
    localStorage.setItem("seats", JSON.stringify(nextSeatValues));
  };

  const bookingToShow = hasBooking(movieArray)
    ? movieArray
    : hasBooking(movieData)
      ? movieData
      : null;

  return (
    <>
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-[90%] max-w-md text-center animate-scaleIn">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 p-4 rounded-full">
                <svg
                  className="w-10 h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>

            <h1 className="text-2xl font-semibold text-gray-800 mb-2">
              Booking Confirmed
            </h1>
            <p className="text-gray-600 mb-6">
              Your ticket has been successfully booked.
            </p>

            <button
              onClick={() => handleClick()}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
            >
              Book Another
            </button>
          </div>
        </div>
      )}

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
                    movie === value ? "bg-red-500 selected" : ""
                  } `}
                >
                  {value}
                </div>
              ))}
            </div>
          </div>

          <div className="slot-row border rounded m-2">
            <h4 className="mx-4 my-2 font-bold">Select A Slot</h4>
            <div className="slot-column flex flex-wrap gap-4 m-4">
              {Slot.map((value, index) => (
                <div
                  onClick={() => selectSlot(value)}
                  key={index}
                  className={`border rounded-sm px-4 py-2 font-bold cursor-pointer ${
                    slot === value ? "bg-red-500 selected" : ""
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
                <div
                  className={`border rounded-sm px-4 py-2 flex flex-col justify-center items-center ${
                    normalizeSeatValue(formik.values.A1) > 0 ? "selected" : ""
                  }`}
                >
                  <h3 className="font-bold mb-2">Type A1</h3>
                  <input
                    id="seat-A1"
                    name="A1"
                    className="border sm:w-8 font-bold"
                    min={0}
                    value={formik.values.A1}
                    onChange={handleSeatChange}
                    type="number"
                  />
                </div>
                <div
                  className={`border rounded-sm px-4 py-2 flex flex-col justify-center items-center ${
                    normalizeSeatValue(formik.values.A2) > 0 ? "selected" : ""
                  }`}
                >
                  <h3 className="font-bold mb-2">Type A2</h3>
                  <input
                    id="seat-A2"
                    name="A2"
                    className="border sm:w-8 font-bold"
                    min={0}
                    value={formik.values.A2}
                    onChange={handleSeatChange}
                    type="number"
                  />
                </div>
                <div
                  className={`border rounded-sm px-4 py-2 flex flex-col justify-center items-center ${
                    normalizeSeatValue(formik.values.A3) > 0 ? "selected" : ""
                  }`}
                >
                  <h3 className="font-bold mb-2">Type A3</h3>
                  <input
                    id="seat-A3"
                    name="A3"
                    className="border sm:w-8 font-bold"
                    min={0}
                    value={formik.values.A3}
                    onChange={handleSeatChange}
                    type="number"
                  />
                </div>
                <div
                  className={`border rounded-sm px-4 py-2 flex flex-col justify-center items-center ${
                    normalizeSeatValue(formik.values.A4) > 0 ? "selected" : ""
                  }`}
                >
                  <h3 className="font-bold mb-2">Type A4</h3>
                  <input
                    id="seat-A4"
                    name="A4"
                    className="border sm:w-8 font-bold"
                    min={0}
                    value={formik.values.A4}
                    onChange={handleSeatChange}
                    type="number"
                  />
                </div>
                <div
                  className={`border rounded-sm px-4 py-2 flex flex-col justify-center items-center ${
                    normalizeSeatValue(formik.values.D1) > 0 ? "selected" : ""
                  }`}
                >
                  <h3 className="font-bold mb-2">Type D1</h3>
                  <input
                    id="seat-D1"
                    name="D1"
                    className="border sm:w-8 font-bold"
                    min={0}
                    value={formik.values.D1}
                    onChange={handleSeatChange}
                    type="number"
                  />
                </div>
                <div
                  className={`border rounded-sm px-4 py-2 flex flex-col justify-center items-center ${
                    normalizeSeatValue(formik.values.D2) > 0 ? "selected" : ""
                  }`}
                >
                  <h3 className="font-bold mb-2">Type D2</h3>
                  <input
                    id="seat-D2"
                    name="D2"
                    className="border sm:w-8 font-bold"
                    min={0}
                    value={formik.values.D2}
                    onChange={handleSeatChange}
                    type="number"
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="rounded border mr-4 px-4 py-2 bg-linear-to-r from-blue-500 to-pink-500"
            >
              Book Now
            </button>
            <button
              type="button"
              onClick={handleSeeBookings}
              className="rounded border px-4 py-2 bg-linear-to-r from-pink-500 to-blue-500"
            >
              See Bookings
            </button>
          </form>
          {showBookings && (
            <div
              id="latest-booking"
              className="mt-6 rounded-lg border border-gray-200 bg-white"
            >
              <div className="border-b border-gray-200 px-4 py-3">
                <h2 className="text-lg font-bold text-gray-800">Booking Details</h2>
              </div>
              {bookingMessage && (
                <div className="border-b border-gray-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                  {bookingMessage}
                </div>
              )}
              <table className="w-full border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left px-4 py-2 text-sm font-semibold text-gray-600">
                      Booking ID
                    </th>
                    <th className="text-left px-4 py-2 text-sm font-semibold text-gray-600">
                      Movie
                    </th>
                    <th className="text-left px-4 py-2 text-sm font-semibold text-gray-600">
                      Slot
                    </th>
                    <th className="text-left px-4 py-2 text-sm font-semibold text-gray-600">
                      Seats
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {isLoadingBookings ? (
                    <tr className="border-t">
                      <td className="px-4 py-3 text-sm text-gray-500" colSpan="4">
                        Loading booking details...
                      </td>
                    </tr>
                  ) : bookingToShow ? (
                    <tr className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2">
                        {bookingToShow._id || "Latest booking"}
                      </td>
                      <td className="px-4 py-2">{bookingToShow.MoviE}</td>
                      <td className="px-4 py-2">{bookingToShow.SlOT}</td>
                      <td className="px-4 py-2 whitespace-normal break-words">
                        {buildSeatSummary(bookingToShow)}
                      </td>
                    </tr>
                  ) : (
                    <tr className="border-t">
                      <td className="px-4 py-3 text-sm text-gray-500" colSpan="4">
                        No previous booking found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="last-booking w-56">
          <div className="box border rounded-sm p-2">
            <h1 className="font-extrabold text-lg">Last Booking Details:</h1>
            {!hasBooking(movieData) ? (
              <h1>No previous booking found</h1>
            ) : (
              <div className="details flex flex-col">
                <h4 className="font-bold">Seats:</h4>
                <h4 className="font-bold">
                  A1:<span className="text-gray-600">{movieData.A1}</span>
                </h4>
                <h4 className="font-bold">
                  A2:<span className="text-gray-600">{movieData.A2}</span>
                </h4>
                <h4 className="font-bold">
                  A3:<span className="text-gray-600">{movieData.A3}</span>
                </h4>
                <h4 className="font-bold">
                  A4:<span className="text-gray-600">{movieData.A4}</span>
                </h4>
                <h4 className="font-bold">
                  D1:<span className="text-gray-600">{movieData.D1}</span>
                </h4>
                <h4 className="font-bold">
                  D2:<span className="text-gray-600">{movieData.D2}</span>
                </h4>
                <h4 className="font-bold">
                  slot:
                  <span className="text-gray-600">{movieData.SlOT}</span>
                </h4>
                <h4 className="font-bold">
                  Movie:
                  <span className="text-gray-600">{movieData.MoviE}</span>
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
