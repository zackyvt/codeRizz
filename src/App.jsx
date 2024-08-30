// src/App.jsx
import React, { useEffect, useState } from "react";
import Codebox from "./components/Codebox";
import ChatOutput from "./components/ChatOutput.jsx";
import useScript from "./useScript.js";

const levels = [
  {
    name: "Beginning steps",
    messages: [
      "Welcome to CODERIZZ!!",
      "Type pseudocode in the box and run it, you'll see your code come to life!",
      "Try build the thing on the right hand side",
      "Hint: syntax or precision doesn't need to be perfect, our AI will accomodate you :)",
    ],
    codestart: "display a blue rectangle",
    code: "s = ( sketch ) => {sketch.setup = () => {sketch.createCanvas(400, 400);};sketch.draw = () => {sketch.background(220);sketch.fill(255,0,0);sketch.ellipse(sketch.width/2, sketch.height/2, 200, 200);};}; new p5(s,'p5-container2');"
  },
  {
    name: "Variables and things",
    messages: ["You can name objects you make", "Call the round circle you built previously B", "Now we can just tell the code to move B", "This 'B' is called a variable, its a name which refers to a thing", "Now modify the code to reach the goal."],
    codestart: "A = a blue rectangle \nA grows and shrinks",
    code: "s = ( sketch ) => {sketch.setup = () => {sketch.createCanvas(400, 400);sketch.background(220);sketch.noStroke();sketch.fill(255, 0, 0);sketch.b = {x: sketch.width/2, y: sketch.height/2, diameter: 50, xSpeed: 5, ySpeed: 5};};sketch.draw = () => {sketch.background(220);sketch.b.x += sketch.b.xSpeed;sketch.b.y += sketch.b.ySpeed;if(sketch.b.x > sketch.width || sketch.b.x < 0){sketch.b.xSpeed *= -1;}if(sketch.b.y > sketch.height || sketch.b.y < 0){sketch.b.ySpeed *= -1;}sketch.ellipse(sketch.b.x, sketch.b.y, sketch.b.diameter, sketch.b.diameter);};}; new p5(s,'p5-container2');"
  },
  {
    name: "Operations on things",
    messages: ["We can do stuff to things in interesting ways", "We can have relationships between different things", "Here, we have a circle B follow my cursor M", "Now try build the goal!"],
    codestart: "M = my mouse cursor\nB = a red circle\nB follows M",
    code: "s = ( sketch ) => {sketch.setup = () => {sketch.createCanvas(400, 400);};sketch.draw = () => {sketch.background(220);let cX = sketch.random(0, sketch.width);let cY = sketch.random(0, sketch.height);let cSpeedX = sketch.random(-5, 5);let cSpeedY = sketch.random(-5, 5);sketch.fill('green');sketch.rect(cX, cY, 50, 50);cX += cSpeedX;cY += cSpeedY;if (cX < 0 || cX > sketch.width - 50) {cSpeedX *= -1;}if (cY < 0 || cY > sketch.height - 50) {cSpeedY *= -1;}let bX = cX + 25;let bY = cY + 25;let angle = sketch.atan2(bY - cY, bX - cX);sketch.translate(bX, bY);sketch.rotate(angle);sketch.fill('red');sketch.triangle(-15, 15, 15, 15, 0, -15);sketch.resetMatrix();};}; new p5(s,'p5-container2');"
  },
  {
    name: "Ifs and events",
    messages: ["We can attach conditions to things happening", "We can have things happen when certain events happen", "Here we have a square that grows bigger when clicked on", "Now try build the goal!"],
    codestart: "A = a big red circle\nM = the cursor\nA follows M\nif A touches any corner of the screen:\n     A turns green",
    code: "s = ( sketch ) => {sketch.setup = () => {sketch.createCanvas(400, 400);sketch.background(220);sketch.noStroke();sketch.fill(0);sketch.textSize(16);sketch.text('0', 370, 20);};sketch.draw = () => {sketch.background(220);sketch.fill(0);sketch.textSize(16);sketch.text(sketch.L, 370, 20);sketch.fill(255, 0, 0);sketch.ellipse(sketch.mouseX, sketch.mouseY, 20, 20);sketch.fill(0, 0, 255);sketch.square(sketch.B.x, sketch.B.y, 20);if(sketch.dist(sketch.mouseX, sketch.mouseY, sketch.B.x, sketch.B.y) < 20) {sketch.L += 1;};sketch.B.x += sketch.B.dx;sketch.B.y += sketch.B.dy;if(sketch.B.x > sketch.width || sketch.B.x < 0) {sketch.B.dx *= -1;};if(sketch.B.y > sketch.height || sketch.B.y < 0) {sketch.B.dy *= -1;};};sketch.L = 0;sketch.B = {x: sketch.width/2, y: sketch.height/2, dx: 2, dy: 2};}; new p5(s,'p5-container2');"
  },
  {
    name: "Loops",
    messages: ["Things can repeat, especially in a game.", "We can write loops to do that", "Here we have a loop to repeat making 10 small squares with numbers", "Now try build the goal!"],
    codestart: "count I from 1 to 10:\n   make a small square with the text I",
    code: "s = ( sketch ) => {sketch.setup = () => {sketch.createCanvas(400, 400);};sketch.draw = () => {for (let i = 0; i < 100; i++) {let q = {x: sketch.random(sketch.width), y: sketch.random(sketch.height), size: 20, color: sketch.color(sketch.random(255), sketch.random(255), sketch.random(255))};q.x += sketch.random(-5, 5);q.y += sketch.random(-5, 5);sketch.fill(q.color);sketch.rect(q.x, q.y, q.size, q.size);}};}; new p5(s,'p5-container2');"
  },
  {
    name: "Functions",
    messages: ["Level 5"],
    codestart: "display the text 'Level 5'",
    code: "s = ( sketch ) => {sketch.setup = () => {sketch.createCanvas(400, 400);};sketch.draw = () => {sketch.background(127);sketch.fill(255);sketch.textSize(32);sketch.textAlign(sketch.CENTER);sketch.text('Level 5', sketch.width/2, sketch.height/2);};}; new p5(s,'p5-container2');"
  },
];

function Level(props) {
  if (props.completed) {
    return (
      <div className="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center">
        <span className="text-white font-bold">{props.stage}</span>
      </div>
    );
  } else {
    return (
      <div className="w-8 h-8 rounded-full bg-indigo-300 flex items-center justify-center">
        <span className="text-white font-bold">{props.stage}</span>
      </div>
    );
  }
}

async function sendPrompt(model, pseudocode) {
  const prompt =
    "Generate working code from the pseudocode description below```" +
    pseudocode +
    "``` Generate p5.js code of the form ``` s = ( sketch ) => {sketch.setup = () => {sketch.createCanvas(400, 400);};sketch.draw = () => {//some code goes here};}; new p5(s,'p5-container');```" +
    "which roughly runs the pseudocode description given. ONLY OUTPUT CODE OF THE ABOVE FORM. No remarks or comments necessary. Just output code.";
  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  return text;
}

const initialCode =
  "s = ( sketch ) => {sketch.setup = () => {sketch.createCanvas(400, 400);};sketch.draw = () => {sketch.background(0);sketch.fill(255);sketch.rect(200,200,50,50);};};new p5(s,'p5-container');";

function App(props) {
  const [bwait, setBwait] = useState(false);
  const [code, setCode] = useState("display a big green circle");
  const [scriptCode, setScriptCode] = useState(initialCode);
  const [mlevel, setLevel] = useState(0);
  const [goalCode, setGoalCode] = useState("");

  useEffect(() => {
    // Create a new script element
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.text = scriptCode;

    // Append the script to the document
    document.body.appendChild(script);

    // Cleanup: remove the script when the component unmounts or code changes
    return () => {
      document.getElementById("p5-container").innerHTML = "";
      document.body.removeChild(script);
    };
  }, [scriptCode]); // Re-run the effect if scriptCode changes

  useEffect(() => {
    // Create a new script element
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.text = goalCode;

    // Append the script to the document
    document.body.appendChild(script);

    // Cleanup: remove the script when the component unmounts or code changes
    return () => {
      document.getElementById("p5-container2").innerHTML = "";
      document.body.removeChild(script);
    };
  }, [goalCode]); // Re-run the effect if scriptCode changes

  const dothing = () => {
    setBwait(true);
    sendPrompt(props.model, code).then((t) => {
      t = t.slice(3, t.length - 4);
      if (t.slice(0, 10) == "javascript") {
        t = t.slice(11, t.length);
      }
      if (t.slice(0, 2) == "js") {
        t = t.slice(2, t.length);
      }
      console.log(t);
      setScriptCode(t);
      setBwait(false);
    });
  };

  useEffect(() => {
    document.title = "skibidiCoders";
  }, []);

  useEffect(() => {
    setCode(levels[mlevel].codestart);
    setGoalCode(levels[mlevel].code);
  }, [mlevel]);

  return (
    <div className="flex container mx-auto p-4 flex-col ">
      <div className="flex">
        <select
          className="p-2 mb-4 bg-gray-800 text-white font-bold grow w-10 rounded-sm"
          value={mlevel}
          onChange={(e) => setLevel(e.target.value)}
        >
          {levels.map((t, i) => {
            return (
              <option value={i} className="font-bold text-white">
                Level {i}: {t.name}
              </option>
            );
          })}
        </select>
        <div className="grow"></div>
        <div className="flex">
          <div>
            <p className="font-bold">zackyvt</p>
            <p className="text-sm m-0 p-0 text-blue-600">sign out</p>
          </div>
        </div>
      </div>
      <div className="bg-gray-800 p-4 rounded-sm mb-4 flex justify-between">
        <div>
          <p className="text-lg text-white font-bold mb-2">Your Creation</p>
          <div id="p5-container"></div>
        </div>
        <div>
          <p className="text-lg text-white font-bold mb-2">Goal</p>
          <div id="p5-container2"></div>
        </div>
      </div>
      <div>
        <div className="flex space-x-5 h-full">
          <ChatOutput
            messages={levels[mlevel].messages}
            clickRun={dothing}
            bwait={bwait}
          />
          <Codebox code={code} setCode={setCode} />
        </div>
      </div>
    </div>
  );
}

export default App;
