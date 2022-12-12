import React, { useState } from "react";

import {
  Divider,
  Stack,
  Button,
  TextField,
  Typography
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { styled } from "@mui/material/styles";
import SelectInput from "@mui/material/Select/SelectInput";

const PREDICTION_TOPIC = 'flight_delay_classification_request';
const host = process.env.KAFKA || "localhost";

const RootStyle = styled("div")({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  marginTop: 0,
  marginLeft: "2%",
  marginRight: "2%",
});

function App() {

  const [origin, setOrigin] = useState("ATL");
  const [destination, setDestination] = useState("SFO");
  const [depDelay, setDepDelay] = useState(5);
  const [carrier, setCarrier] = useState("AA");
  const [date, setDate] = useState(new Date());

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  const requestPrediction = async () => {
    const details = {
      "DepDelay": depDelay,
      "Carrier": carrier,
      "FlightDate": new Date(date.setHours(12, 0, 0, 0)).toISOString(),
      "Origin": origin,
      "Dest": destination
    };
    let formBody = [];
    for (var property in details) {
      const encodedKey = encodeURIComponent(property);
      const encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    const reqPrediction = await fetch(`/flights/delays/predict/classify_realtime`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: formBody,
    });
    if (reqPrediction.status === 200) {
      const reqPredictionData = await reqPrediction.json();
      if (reqPredictionData.status === "OK") {
        getPrediction(reqPredictionData.id);
      }
    }
  }

  const getPrediction = async (predictionID) => {
    let predictionInfo;
    do {
      console.log("Polling for prediction with ID: " + predictionID + "...");
      predictionInfo = await fetch(`/flights/delays/predict/classify_realtime/response/${predictionID}`);
      predictionInfo = await predictionInfo.json();
      await sleep(1000);
    } while (predictionInfo.status !== "OK");

    console.log("Prediction received!");
  }

  return (
    <RootStyle>
      <Stack sx={{ my: 5 }} alignSelf="flex-start">
        <Typography variant="h4" gutterBottom>
          Flight Prediction.
        </Typography>
        <Typography sx={{ color: "text.secondary" }}>
          Enter your travel details to get a flight delay prediction.
        </Typography>
      </Stack>

      <Divider />

      <Stack sx={{ my: 5 }} alignSelf="center">
        <Stack sx={{ my: 1 }} direction="row" spacing={5}>
          <TextField
            fullWidth
            value={origin}
            onChange={(event) => {
              setOrigin(event.target.value);
            }}
            type="text"
            label="Origin"
          />
          <TextField
            fullWidth
            value={destination}
            onChange={(event) => {
              setDestination(event.target.value);
            }}
            type="text"
            label="Destination"
          />
        </Stack>
        <Stack sx={{ my: 1 }} direction="row" spacing={1}>
          <TextField
            sx={{ width: "33%" }}
            fullWidth
            value={depDelay}
            onChange={(event) => {
              setDepDelay(event.target.value);
            }}
            type="text"
            label="Departure Delay"
          />
          <TextField
            sx={{ width: "33%" }}
            fullWidth
            value={carrier}
            onChange={(event) => {
              setCarrier(event.target.value);
            }}
            type="text"
            label="Carrier"
          />
          <LocalizationProvider sx={{ width: "33%" }} dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date"
              value={date}
              onChange={(newValue) => {
                setDate(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Stack>
        <Button variant="contained" onClick={requestPrediction}>
          Predict
        </Button>
      </Stack>

      <Divider />

    </RootStyle>
  );
}

export default App;
