const jsonfile = require("jsonfile");
const express = require("express"),
  bodyParser = require("body-parser"),
  app = express(),
  port = 3000;

const jira = require("./jira");
const { username, password, transitions, us_states } = require("./config");

app.use(bodyParser.json());

// webhook is triggered if user story is updated
app.post("/webhook", (req, res) => {
  let body = req.body;
  let epic = body.issue.fields.customfield_10008; // defined by JIRA

  console.log(`USER STORY:${body.issue.key}`);
  console.log(`NEW STATUS:${body.issue.fields.status.name}`);
  console.log(`LINKED EPIC:${epic}`);

  // search all user sttories thtat are linked to epic of the updated user story
  jira.search(`project = MIR AND 'Epic Link'='${epic}'`).then(stories => {
    let equals_every_todo = issue => {
      return issue.status === us_states.toDo;
    };

    let equals_one_inprogress = issue => {
      return (
        issue.status === usStates.inProgress ||
        issue.status === usStates.resolved ||
        issue.status === usStates.merged ||
        issue.status === usStates.deployed
      );
    };

    let equals_every_done = issue => {
      return issue.status === us_states.done;
    };

    if (stories.every(equals_every_todo) === true) {
      // update epic to "To Do" if all user story is in "To Do"
      console.log(`Updating ${epic} via transition ${transitions.toDo}`);
      jira.updateEpic(epic, transitions.toDo);
    } else if (stories.some(equals_one_inprogress) === true) {
      // update epic to "In Progress" if at least one user story is in "In Progress"
      console.log(`Updating ${epic} via transition ${transitions.inProgress}`);
      jira.updateEpic(epic, transitions.inProgress);
    } else if (stories.every(equals_every_done) === true) {
      // update epic to "Done" if all user stories are in "Done"
      console.log(`Updating ${epic} via transition ${transitions.done}`);
      jira.updateEpic(epic, transitions.done);
    }
  });

  res.status(200);
});

// run the server
const server = app.listen(port, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log("Server is listening at http://%s:%s", host, port);
});
