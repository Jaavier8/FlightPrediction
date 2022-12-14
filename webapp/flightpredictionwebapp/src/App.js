import React, { useState, useMemo } from "react";

import SearchIcon from "@mui/icons-material/Search";
import {
  Divider,
  Stack,
  Button,
  TextField,
  Typography,
  InputAdornment,
  ListSubheader,
  MenuItem
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { styled } from "@mui/material/styles";
import SelectInput from "@mui/material/Select/SelectInput";

import { originDest } from "./constants/originDest";
import { IATAAirports } from "./constants/IATAAirports";
import { airportsUsed } from "./constants/airportsUsed";

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

  const [destinationsAllowed, setDestinationsAllowed] = useState(originDest[origin]);

  const [searchOrigin, setSearchOrigin] = useState("");
  const [searchDest, setSearchDest] = useState("");

  const [prediction, setPrediction] = useState("");

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  const requestPrediction = async () => {
    setPrediction("Predicting...");
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



    setPrediction(setPredictionMessage(predictionInfo.prediction.Prediction));
    console.log("Prediction received!");
  }

  const setPredictionMessage = (prediction) => {
    switch (prediction) {
      case 0:
        return "Early (15+ Minutes Early)";
      case 1:
        return "Slightly Early (0-15 Minute Early)";
      case 2:
        return "Slightly Late (0-30 Minute Delay)";
      case 3:
        return "Your flight will be delayed.";
      default:
        return "Very Late (30+ Minutes Late)";
    }
  }

  const containsText = (text, searchOrigin) =>
    text.toLowerCase().indexOf(searchOrigin.toLowerCase()) > -1;

  const menuItemOrigin = useMemo(
    () =>
      Object.keys(IATAAirports)
        .filter((airport) => containsText(airport, searchOrigin))
        .map((airport, i) => {
          if (airportsUsed.includes(airport))
            return (
              <MenuItem key={i} value={airport}>
                {IATAAirports[airport]}
              </MenuItem>
            )
        }),
    [searchOrigin]
  );

  const menuItemDest = useMemo(
    () =>
      Object.keys(IATAAirports)
        .filter((airport) => containsText(airport, searchDest))
        .map((airport, i) => {
          if (airportsUsed.includes(airport) && destinationsAllowed.includes(airport))
            return (
              <MenuItem key={i} value={airport}>
                {IATAAirports[airport]}
              </MenuItem>
            )
        }),
    [searchDest, destinationsAllowed]
  );

  return (
    <RootStyle>
      {console.log(prediction)}
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
            select
            fullWidth
            label={"Origin"}
            value={origin}
            onChange={(event) => {
              setOrigin(event.target.value);
              setDestinationsAllowed(originDest[event.target.value]);
              setDestination(originDest[event.target.value][0]);
            }}
            onClose={() => setSearchOrigin("")}
            SelectProps={{
              MenuProps: {
                autoFocus: false,
              },
            }}
          >
            <ListSubheader>
              <TextField
                size="small"
                // Autofocus on textfield
                autoFocus
                placeholder={"Search..."}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                onChange={(e) => setSearchOrigin(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key !== "Escape") {
                    // Prevents autoselecting item while typing (default Select behaviour)
                    e.stopPropagation();
                  }
                }}
              />
            </ListSubheader>
            {menuItemOrigin}
          </TextField>
          <TextField
            select
            fullWidth
            label={"Destination"}
            value={destination}
            onChange={(event) => {
              setDestination(event.target.value);
            }}
            onClose={() => setSearchDest("")}
            SelectProps={{
              MenuProps: {
                autoFocus: false,
              },
            }}
          >
            <ListSubheader>
              <TextField
                size="small"
                // Autofocus on textfield
                autoFocus
                placeholder={"Search..."}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                onChange={(e) => setSearchDest(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key !== "Escape") {
                    // Prevents autoselecting item while typing (default Select behaviour)
                    e.stopPropagation();
                  }
                }}
              />
            </ListSubheader>
            {menuItemDest}
          </TextField>
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

      <Stack sx={{ my: 5 }} alignSelf="center">
        <Typography variant="h4">
          {prediction}
        </Typography>
      </Stack>

    </RootStyle>
  );
}

export default App;
