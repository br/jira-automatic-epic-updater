const Client = require("node-rest-client").Client;
const jsonfile = require("jsonfile");
const request = require("request");

const { username, password, account } = require("./config");

client = new Client();
// Provide user credentials, which will be used to log in to JIRA.
let loginArgs = {
  data: {
    username: username,
    password: password
  },
  headers: {
    "Content-Type": "application/json"
  }
};

module.exports = {
  search: jql_string => {
    return new Promise((resolve, reject) => {
      client.post(
        `https://${account}.atlassian.net/rest/auth/1/session`,
        loginArgs,
        (data, response) => {
          if (response.statusCode == 200) {
            console.log("succesfully logged in");
            let session = data.session;
            // Get the session information and store it in a cookie in the header
            let searchArgs = {
              headers: {
                // Set the cookie from the session information
                cookie: session.name + "=" + session.value,
                "Content-Type": "application/json"
              },
              data: {
                // Provide additional data for the JIRA search. You can modify the JQL to search for whatever you want.
                jql: jql_string
                // jql: "project = MIR AND type=Story"
              }
            };
            // Make the request return the search results, passing the header information including the cookie.
            client.post(
              `https://${account}.atlassian.net/rest/api/2/search`,
              searchArgs,
              (searchResult, response) => {
                let stories = searchResult.issues.map(issue => {
                  return {
                    key: issue.key, // user story key
                    epic: issue.fields.customfield_10008, // epic key e.g. MIR-100
                    status: issue.fields.status.name
                  };
                });
                console.log("The story" + stories);
                resolve(stories);
              }
            );
          } else {
            throw "Login failed :(";
          }
        }
      );
    });
  },
  updateEpic: (issueId, transition) => {
    let bodyData = `{
      "transition": {
        "id": ${transition}
      }
    }`;

    let options = {
      method: "POST",
      url: `https://${account}.atlassian.net/rest/api/2/issue/${issueId}/transitions`,
      auth: {
        username: username,
        password: password
      },
      headers: {
        "Content-Type": "application/json"
      },
      body: bodyData
    };

    request(options, (error, response, body) => {
      if (error) throw new Error(error);
      console.log(
        "Response: " + response.statusCode + " " + response.statusMessage
      );
      console.log(body);
    });
  }
};
