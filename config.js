module.exports = {
  username: process.env.JIRA_USERNAME,
  password: process.env.JIRA_PASSWORD,
  account: "statmilk",
  // State Transititons
  transitions: {
    toDo: "11",
    inProgress: "101",
    done: "31",
    closed: "111"
  },
  // User Story States
  us_states: {
    toDo: "To Do",
    done: "Done",
    closed: "Closed"
  }
};
