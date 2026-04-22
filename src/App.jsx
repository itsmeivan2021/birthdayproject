import React from "react";
import { Analytics } from "@vercel/analytics/react";
import BirthdayGreetingWeb from "./birthday_greeting_web";

function App() {
  return (
    <>
      <BirthdayGreetingWeb />
      <Analytics />
    </>
  );
}

export default App;
