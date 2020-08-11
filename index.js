const jsonfile = require("jsonfile");
const express = require("express"),
  bodyParser = require("body-parser"),
  app = express(),
  port = 80;

const jira = require("./jira");
const {
  username,
  password,
  transitions,
  us_states
} = require("./config");

app.use(bodyParser.json());

app.get("/up", (req, res) => {
  res.status(200).json({
    status: "ok"
  });
});

// webhook is triggered if user story is updated
app.post("/webhook", (req, res) => {
  let body = req.body;
  let epic = body.issue.fields.customfield_10008; // defined by JIRA

  console.log(`USER STORY:${body.issue.key}`);
  console.log(`NEW STATUS:${body.issue.fields.status.name}`);
  console.log(`LINKED EPIC:${epic}`);

  // search all user sttories thtat are linked to epic of the updated user story
  jira
    .search(`'Epic Link'='${epic}'`)
    .then(stories => {
      let equals_every_todo = issue => {
        return issue.status === us_states.toDo;
      };

      let equals_every_closed = issue => {
        return issue.status === us_states.closed;
      };

      let equals_every_done = issue => {
        return (
          issue.status === us_states.done ||
          issue.status === us_states.closed
        );
      };

      if (stories.every(equals_every_todo) === true) {
        // update epic to "To Do" if all user story is in "To Do"
        console.log(`Updating ${epic} via transition ${transitions.toDo}`);
        jira.updateEpic(epic, transitions.toDo);
      }  else if (stories.every(equals_every_closed) === true) {
        // update epic to "Closed" if all user story is in "Closed"
        console.log(`Updating ${epic} via transition ${transitions.closed}`);
        jira.updateEpic(epic, transitions.closed);
      } else if (stories.every(equals_every_done) === true) {
        // update epic to "Done" if all user stories are in "Done" or "Closed"
        // the comparison can't differentiate from all closed so should be checked
        // after the specific check for all closed
        console.log(`Updating ${epic} via transition ${transitions.done}`);
        jira.updateEpic(epic, transitions.done);
      } else {
        console.log(`Updating ${epic} via transition ${transitions.inProgress}`);
        jira.updateEpic(epic, transitions.inProgress);
      }
    });

  res.status(200);
});

// run the server
const server = app.listen(port, () => {
  const port = server.address().port;

  console.log(`Server is listening on port ${port}`);
});
