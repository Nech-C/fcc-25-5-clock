function Container() {
    const [breakDuration, setBreakDuration] = React.useState(5);
    const [sessionDuration, setSessionDuration] = React.useState(25);
    const [currentTimer, setCurrentTimer] = React.useState("Session");
    const [timeLeft, setTimeLeft] = React.useState(sessionDuration * 60);
    const [isTimerRunning, setIsTimerRunning] = React.useState(false);
    const audioElement = React.useRef(null);
  
    const handleOnclick = (name, action) => {
      if (isTimerRunning) return;
      let newDuration;
      if (name === "break") {
        newDuration =
          action === "increment" ? breakDuration + 1 : breakDuration - 1;
        if (newDuration > 0 && newDuration <= 60) {
          setBreakDuration(newDuration);
        }
      } else if (name === "session") {
        newDuration =
          action === "increment" ? sessionDuration + 1 : sessionDuration - 1;
        if (newDuration > 0 && newDuration <= 60) {
          setSessionDuration(newDuration);
          setTimeLeft(newDuration * 60);
        }
      }
    };
  
    React.useEffect(() => {
      let timer;
      if (isTimerRunning && timeLeft > 0) {
        timer = setInterval(() => {
          setTimeLeft((prevTime) => prevTime - 1);
        }, 1000);
      } else if (isTimerRunning && timeLeft === 0) {
        setCurrentTimer(currentTimer === "Session" ? "Break" : "Session");
        setTimeLeft(
          (currentTimer === "Session" ? breakDuration : sessionDuration) * 60
        );
        audioElement.current.play();
      } else {
        clearInterval(timer);
      }
      return () => clearInterval(timer);
    }, [
      isTimerRunning,
      timeLeft,
      currentTimer,
      breakDuration,
      sessionDuration,
      audioElement,
    ]);
  
    const toggleTimer = () => {
      setIsTimerRunning(!isTimerRunning);
    };
  
    const resetTimer = () => {
      setIsTimerRunning(false);
      setBreakDuration(5);
      setSessionDuration(25);
      setCurrentTimer("Session");
      setTimeLeft(25 * 60);
      audioElement.current.pause();
      audioElement.current.currentTime = 0;
    };
  
    const formattedTimeLeft = `${Math.floor(timeLeft / 60)
      .toString()
      .padStart(2, "0")}:${(timeLeft % 60).toString().padStart(2, "0")}`;
  
    return React.createElement(
      "div",
      { id: "container" },
      [
        React.createElement("h1", { id: "title" }, "25 + 5 Clock"),
        React.createElement(Controls, {
          breakValue: breakDuration,
          sessionValue: sessionDuration,
          onClick: handleOnclick,
        }),
        React.createElement(
          "div",
          { id: "timer" },
          [
            React.createElement("h2", { id: "timer-label" }, currentTimer),
            React.createElement("span", { id: "time-left" }, formattedTimeLeft),
          ]
        ),
        React.createElement(
          "button",
          { id: "start_stop", onClick: toggleTimer },
          isTimerRunning ? "Pause" : "Start"
        ),
        React.createElement("button", { id: "reset", onClick: resetTimer }, "Reset"),
        React.createElement("audio", {
          id: "beep",
          ref: audioElement,
          src: "https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav",
        }),
      ]
    );
  }
  
  function Controls(props) {
    return React.createElement(
      "div",
      { id: "controls-wrapper" },
      [
        React.createElement(Control, {
          name: "break",
          value: props.breakValue,
          onClick: props.onClick,
        }),
        React.createElement(Control, {
          name: "session",
          value: props.sessionValue,
          onClick: props.onClick,
        }),
      ]
    );
  }
  
  function Control(props) {
    return React.createElement(
      "div",
      { id: props.name + "-wrapper" },
      [
        React.createElement("h2", { id: props.name + "-label" }, props.name + " Length"),
        React.createElement(
          "div",
          { id: props.name + "-controls" },
          [
            React.createElement(
              "button",
              {
                id: props.name + "-decrement",
                onClick: () => props.onClick(props.name, "decrement"),
              },
              "-"
            ),
            React.createElement("span", { id: props.name + "-length" }, props.value),
            React.createElement(
              "button",
              {
                id: props.name + "-increment",
                onClick: () => props.onClick(props.name, "increment"),
              },
              "+"
            ),
          ]
        ),
      ]
    );
  }
  
  ReactDOM.render(React.createElement(Container, null), document.getElementById("app"));
  