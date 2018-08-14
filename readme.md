# JIRA: Updating Epics Automatically When Linked Issues Are Updated

A small web service based on NodeJS, which listens to User Story changes in JIRA and automatically updates Epics via the JIRA REST API.

## Configuration

Replace the values in the configuration file with your Atlassian USERNAME, PASSWORD, ACCOUNT. You also have to edit the transition IDs and status names based on how you configured your JIRA workflow.

```javascript
module.exports = {
  username: "USERNAME", // Replace this, JIRA username
  password: "PASSWORD", // Replace this, JIRA password
  account: "ACCOUNT", // Replace this, Atlassian account name
  project: "ABC" // JIRA project name

  // State Transititons
  transitions: {
    toDo: "41",
    inProgress: "21",
    done: "11",
    wontdo: "31"
  },
  // User Story States
  us_states: {
    toDo: "To Do",
    inProgress: "In Progress",
    resolved: "In Review",
    merged: "Merged",
    deployed: "Deployed to Dev",
    staging: "Staging",
    approved: "Approved",
    done: "Done",
    wontdo: "Won't do",
    blocked: "Blocked"
  }
};
```

## Installation

Install the node modules.

```javascript
npm install
```

Rename "config.js.sample" to "config.js"

Run the app

```javascript
node index
```

## Documentation

Find the full description in my blog post: http://blog.aichriedler.de/index.php/2018/08/14/jira-updating-epics-automatically-when-linked-issues-are-updated/

## License

MIT License

Copyright (c) [2018][martin aichriedler]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
