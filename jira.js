const Client = require("node-rest-client").Client;
const jsonfile = require("jsonfile");
const request = require("request");

const { username, password, account } = require("./config");

client = new Client({user: username, password: password});

module.exports = {
  search: jql_string => {
    return new Promise((resolve, reject) => {
      let searchArgs = {
        data: {
          jql: jql_string
        },
        headers: {
          "Content-Type": "application/json"
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
              epic: issue.fields.customfield_10008, // epic key e.g. ABC-100
              status: issue.fields.status.name
            };
          });
          resolve(stories);
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
