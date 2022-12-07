import React, { useState } from "react";
import { Kafka } from "kafkajs";

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
  const [date, setDate] = useState(null);

  const kafka = new Kafka({
    clientId: 'my-app',
    brokers: [`${host}:9092`],
  })
  const producer = kafka.producer();

  const sendMessage = async () => {
    await producer.connect()
    await producer.send({
      topic: 'test-topic',
      messages: [
        { value: 'Hello KafkaJS user!' },
      ],
    })
  }

  const startPrediction = async () => {
    //Coger valores

    //Añadir la distancia con una consulta a Mongo

    //Dividir la fecha en dia, mes y año

    //Añadir timestamp

    //Crear UUID y enviar el mensaje
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
            type="text"
            label="Origin"
          />
          <TextField
            fullWidth
            type="text"
            label="Destination"
          />
        </Stack>
        <Stack sx={{ my: 1 }} direction="row" spacing={1}>
          <TextField
            sx={{ width: "33%" }}
            fullWidth
            type="text"
            label="Departure Delay"
          />
          <TextField
            sx={{ width: "33%" }}
            fullWidth
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
        <Button variant="contained" onClick={startPrediction}>
          Predict
        </Button>
      </Stack>

      <Divider />

    </RootStyle>
  );
}

export default App;
